import React, { useEffect, useState } from 'react';
import { makeStyles, Toolbar, Typography, Chip } from "@material-ui/core";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { appBarHeight } from "../layout/AppBar";
import ActionPicker from "./ActionPicker";
import { ActionKind } from "./ActionRegistry";
import zzip from "../util/zzip";

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        height: appBarHeight(theme)
    },
    breadcrumb: {
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center'
    },
    spacer: {
        flex: '1 1 100%',
    }
}));

const MemberActionsToolbar = ({ dataType, item, disabled, arity, onAction, kind, selectedKey, onItemPickup }) => {
    const [titles, setTitles] = useState(null);
    const classes = useToolbarStyles();

    useEffect(() => {
        const subscription = zzip(
            dataType.getTitle(),
            item.getTitle()
        ).subscribe(titles => setTitles(titles));

        return () => subscription.unsubscribe();
    }, [dataType, item]);

    let breadcumb;
    if (titles) {
        breadcumb = <div className={classes.breadcrumb}>
            <Chip label={titles[0]} onClick={() => onItemPickup({ dataTypeId: dataType.id })}/>
            <ChevronRight/>
            <Typography variant="h6">
                {titles[1]}
            </Typography>
        </div>;
    }

    return (
        <Toolbar className={classes.root}>
            {breadcumb}
            <div className={classes.spacer}/>
            <ActionPicker kind={ActionKind.member}
                          arity={1}
                          onAction={onAction}
                          disabled={disabled}/>
        </Toolbar>
    );
};

export default MemberActionsToolbar;