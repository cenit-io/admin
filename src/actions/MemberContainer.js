import React, { useEffect, useRef, useCallback } from 'react';
import Loading from '../components/Loading';
import { Chip, Toolbar, Typography, useTheme } from "@material-ui/core";
import { appBarHeight } from "../layout/AppBar";
import ActionRegistry, { ActionKind } from "./ActionRegistry";
import { makeStyles } from '@material-ui/core/styles';
import Show from "./Show";
import Random from "../util/Random";
import { catchError, switchMap, tap } from "rxjs/operators";
import { isObservable, of } from "rxjs";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ActionPicker from "./ActionPicker";
import Alert from "./Alert";
import { DataTypeSubject } from "../services/subjects";
import Skeleton from "@material-ui/lab/Skeleton";
import { useSpreadState } from "../common/hooks";
import FrezzerLoader from "../components/FrezzerLoader";
import ContainerContext, { useContainerContext } from "./ContainerContext";
import { useTenantContext } from "../layout/TenantContext";
import * as pluralize from "pluralize";
import Button from "@material-ui/core/Button";
import ReloadIcon from "@material-ui/icons/Refresh";

import "./Records";
import "./DataType";
import './DownloadFile';
import './PullReview';
import './Pull';
import './Schedule';
import './ConfigureApp';
import './Authorize';
import './RetryTask';
import './ShredCollection';
import './ShredTenant';
import './PushCollection';
import './Reinstall';
import './SwitchTrust';
import './DataTypeConfig';
import './Filter';
import './ApplicationAccess';
import './RegisterApp';
import './ProcessFlow';
import './Oauth2AuthorizationAccess';
import './Oauth1AuthorizationAccess';
import './AccessTokens';
import './RunScript';
import './RunAlgorithm';
import './SwitchTenant';

const useActionContainerStyles = makeStyles(theme => ({
    toolbar: {
        width: ({ width }) => `calc(${width} - ${theme.spacing(3)}px)`,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        height: appBarHeight(theme)
    },
    breadcrumb: {
        display: 'flex',
        alignItems: 'center',
        maxWidth: ({ width }) => `calc(${width} - ${theme.spacing(9)}px)`
    },
    recordTitle: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    },
    actionContainer: {
        width: '100%',
        overflow: 'auto',
        position: 'relative',
        height: props => `calc(${props.height} - ${appBarHeight(theme)})`
    }
}));

function MemberContainerLayout({ docked, subject, height, width, onSubjectPicked, onClose, onUpdate, activeActionKey }) {
    const [state, setState] = useSpreadState();

    const containerContext = useContainerContext();

    const [containerState, setContainerState] = containerContext;

    const tenantContext = useTenantContext();

    const { dataType, record, loading, actionKey, actionComponentKey } = containerState;

    const actionSubscription = useRef(null);
    const theme = useTheme();
    const classes = useActionContainerStyles({ width, height });

    const { dataTypeTitle, title, error, disabled } = state;

    const setError = error => setState({ error });

    const handleAction = useCallback(actionKey => {
        if (actionSubscription.current) {
            actionSubscription.current.unsubscribe();
            actionSubscription.current = null;
        }
        const action = ActionRegistry.byKey(actionKey);
        if (action) {
            if (action.executable) {
                const r = action.call(this, {
                    dataType, record, tenantContext, containerContext
                });
                if (isObservable(r)) {
                    setState({ loading: true });
                    actionSubscription.current = r.pipe(
                        catchError(e => containerContext.confirm({
                            title: 'Error',
                            message: `An error occurred: ${e.message}`,
                            justOk: true
                        }))
                    ).subscribe(
                        () => setContainerState({
                            loading: false,
                            actionKey: Show.key,
                            actionComponentKey: Random.string()
                        })
                    );
                }
            } else {
                setContainerState({
                    actionKey,
                    actionComponentKey: Random.string()
                });
            }
        }
    }, [dataType, record, tenantContext, containerContext]);

    useEffect(() => {
        if (activeActionKey && record) {
            setTimeout(() => handleAction(activeActionKey.key || activeActionKey));
        }
    }, [activeActionKey, record]);

    useEffect(() => {
        if (!error) {
            const subscription = subject.dataTypeSubject().dataType().pipe(
                tap(dataType => setContainerState({ dataType, record: null, selectedItems: [] })),
                switchMap(
                    dataType => {
                        if (dataType) {
                            return dataType.get(subject.id);
                        }
                        setError(`Data type with ID ${subject.dataTypeId} not found!`);
                        return of(null);
                    }
                )
            ).subscribe(record => {
                if (record) {
                    setContainerState({ record, selectedItems: [record] });
                    subject.updateCache(record);
                } else {
                    setError(`Record with ID ${subject.id} not found!`);
                }
            });
            return () => subscription.unsubscribe();
        }
    }, [subject, error]);

    useEffect(() => {
        const s1 = subject.title().subscribe(
            title => setState({ title })
        );
        const dataTypeSubject = subject.dataTypeSubject();
        const s2 = dataTypeSubject.title().subscribe(
            dataTypeTitle => setState({ dataTypeTitle })
        );
        dataTypeSubject.computeTitle();
        return () => {
            s1.unsubscribe();
            s2.unsubscribe();
        }
    }, [subject]);

    if (error) {
        return (
            <Alert message={error}>
                <Button variant="outlined"
                        color="primary"
                        endIcon={<ReloadIcon component="svg"/>}
                        onClick={() => setError(null)}>
                    Reload
                </Button>
            </Alert>
        );
    }

    if (!record) {
        return <Loading/>;
    }

    const handleUpdateItem = record => {
        setContainerState({ record, selectedItems: [record] });
        subject.updateCache(record);
        onUpdate && onUpdate(record)
    };

    let dataLink;
    if (dataTypeTitle) {
        dataLink = <Chip label={pluralize(dataTypeTitle)}
                         onClick={() => onSubjectPicked(DataTypeSubject.for(subject.dataTypeId).key)}/>;
    } else {
        dataLink = <Skeleton variant="circle"
                             width={theme.spacing(3)}
                             height={theme.spacing(3)}/>;
    }
    const breadcrumb = (
        <div className={classes.breadcrumb}>
            {dataLink}
            <ChevronRight/>
            <Typography variant="h6" className={classes.recordTitle}>
                {title || <Skeleton variant="text" width={theme.spacing(5)}/>}
            </Typography>
        </div>
    );

    const componentHeight = `${height} - ${appBarHeight(theme)}`;

    const ActionComponent = ActionRegistry.byKey(actionKey);

    const action = ActionComponent && <ActionComponent key={actionComponentKey}
                                                       docked={docked}
                                                       subject={subject}
                                                       dataType={dataType}
                                                       record={record}
                                                       onUpdate={handleUpdateItem}
                                                       height={componentHeight}
                                                       width={width}
                                                       onSubjectPicked={onSubjectPicked}
                                                       onCancel={() => handleAction(Show.key)}
                                                       onDisable={disabled => setState({ disabled })}
                                                       onClose={onClose}/>;

    return (
        <>
            <Toolbar className={classes.toolbar}>
                {breadcrumb}
                <ActionPicker kind={ActionKind.member}
                              arity={1}
                              onAction={handleAction}
                              disabled={disabled}
                              dataType={dataType}
                              selectedKey={actionKey}/>
            </Toolbar>
            <div className={classes.actionContainer}
                 style={{ height: `calc(${componentHeight})` }}>
                {action}
                {loading && <FrezzerLoader/>}
            </div>
        </>
    );
}

const InitialContextState = {
    selectedItems: [],
    landingActionKey: Show.key,
    actionKey: Show.key,
    actionComponentKey: Random.string()
};

export default function MemberContainer(props) {
    return (
        <ContainerContext initialState={InitialContextState}>
            <MemberContainerLayout {...props}/>
        </ContainerContext>
    );
};
