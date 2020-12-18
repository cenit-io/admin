import React, { useEffect, useReducer } from 'react'
import StringControl from './StringControl';
import { LinearProgress, makeStyles } from '@material-ui/core';
import EmbedsOneControl from "./EmbedsOneControl";
import EmbedsManyControl from "./EmbedsManyControl";
import BooleanControl from "./BooleanControl";
import RefOneControl from "./RefOneControl";
import RefManyControl from "./RefManyControl";
import ErrorMessages from "./ErrorMessages";
import zzip from "../util/zzip";
import NumericControl from "./NumericControl";
import IntegerControl from "./IntegerControl";
import StringCodeControl from "./StringCodeControl";
import JsonControl from "./JsonControl";
import spreadReducer from "../common/spreadReducer";
import EnumControl from "./EnumControl";

function controlComponentFor(property) {
    if (property.propertySchema.enum) {
        return EnumControl;
    }

    switch (property.type) {

        case 'embedsOne': {
            return EmbedsOneControl;
        }

        case 'embedsMany': {
            return EmbedsManyControl;
        }

        case 'boolean': {
            return BooleanControl;
        }

        case 'refOne': {
            return RefOneControl;
        }

        case 'refMany': {
            return RefManyControl;
        }

        case 'number': {
            return NumericControl;
        }

        case 'integer': {
            return IntegerControl;
        }

        case 'string': {
            if (property.propertySchema.contentMediaType) {
                return StringCodeControl;
            }

            return StringControl;
        }

        default: {

            if (property.name === '_id' || property.name === 'id') {
                return StringControl;
            }

            return JsonControl;
        }
    }
}

const configurableProps = ['readOnly'];

function configProps(config, value) {
    return config && configurableProps.reduce((prev, prop) => {
        let fieldConfig = config[prop];
        if (fieldConfig !== undefined) {
            if (typeof fieldConfig === 'function') {
                fieldConfig = fieldConfig(value);
            }
            prev[prop] = fieldConfig;
        }
        return prev;
    }, {});
}

const useStyles = makeStyles(theme => ({
    control: {
        padding: theme.spacing(1)
    },
    error: {
        color: theme.palette.error.main
    }
}));

function PropertyControl(props) {
    const [state, setState] = useReducer(spreadReducer, {});

    const { errors, property, onChange, config } = props;
    const { schema, controlErrors } = state;
    const classes = useStyles();

    useEffect(() => {
        const subscription = zzip(property.getSchema(), property.getTitle()).subscribe(
            ([schema, title]) => setState({ schema, title })
        );

        return () => subscription.unsubscribe();
    }, [property]);

    useEffect(() => setState({ controlErrors: null }), [errors]);

    const handleChange = value => {
        if (errors && errors.length && !controlErrors) {
            setErrors([]);
        }
        onChange(value);
    };

    const setErrors = controlErrors => setState({ controlErrors });

    if (schema) {
        const ControlComponent = config?.control || controlComponentFor(property);

        const currentErrors = ControlComponent.ownErrorMessages ? null : (controlErrors || errors);

        const control = <ControlComponent {...state}
                                          {...props}
                                          {...configProps(config)}
                                          errors={currentErrors}
                                          onError={setErrors}
                                          onChange={handleChange}/>;

        return (
            <div className={classes.control}>
                <ErrorMessages errors={currentErrors}>
                    {control}
                </ErrorMessages>
            </div>
        );
    }

    return <LinearProgress/>;
}

export default PropertyControl;
