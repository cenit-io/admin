import React, { useEffect, useState } from 'react';
import QueryString from 'querystring';
import AuthorizationService, { CenitHostKey } from "./services/AuthorizationService";
import { CircularProgress } from "@material-ui/core";
import Main from "./layout/Main";
import API from "./services/ApiService";
import { catchError } from "rxjs/operators";
import { of } from "rxjs";
import './common/FlexBox.css';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Dialog from "@material-ui/core/Dialog";
import ExpiredIcon from "@material-ui/icons/HourglassEmpty";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { Alert } from "@material-ui/lab";

API.onError(() => AuthorizationService.authorize());

function App() {

    const [authorizing, setAuthorizing] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        API.onError(() => setError(true));
    }, []);

    useEffect(() => {
        if (authorizing) {
            const params = QueryString.parse(window.location.search.slice(1, window.location.search.length));

            if (params.cenitHost) {
                localStorage.setItem(CenitHostKey, params.cenitHost);
            }

            let authorize;
            if (params.code) {
                authorize = AuthorizationService.getAccessWith(params);
            } else {
                authorize = AuthorizationService.getAccess();
            }

            const subscription = authorize.pipe(
                catchError(() => {
                    setError(true);
                    return of(null);
                })
            ).subscribe(
                access => access && setAuthorizing(false)
            );

            return () => subscription.unsubscribe();
        }
    }, [authorizing]);

    if (authorizing) {
        return <div className='flex full-width full-v-height justify-content-center align-items-center'>
            <CircularProgress/>
        </div>;
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Main/>
            <Dialog maxWidth="xs"
                    open={error}>
                <Alert severity="error" icon={<ExpiredIcon component="svg"/>}>
                    <AlertTitle>
                        <b>Session Expired</b>
                    </AlertTitle>
                    The app will reboot in a few seconds, reload manually if not.
                </Alert>
            </Dialog>
        </MuiPickersUtilsProvider>
    );
}

export default App;
