
import React, { useState } from 'react';
import Dashboard from '../components/dashboard';
import ErrorSnackbar from '../components/ErrorSnackbar';
import SuccessSnackbar from '../components/SuccessSnackbar';
import { Helmet } from 'react-helmet';

const NotFound = () => {
    const [ExceptionError, setExceptionError] = useState([]);
    const [successMessages, setSuccessMessages] = useState([]);


    function clearErrors(id) {
        console.log(id)
        setExceptionError(prevMessages =>
            prevMessages.filter(msg => msg.id !== id)
        );
        console.log(ExceptionError)
    }
    function clearSuccess(id) {
        console.log(id)
        setSuccessMessages(prevMessages =>
            prevMessages.filter(msg => msg.id !== id)
        );
    }
    return (
        // <Dashboard>
        <>
            <Helmet>
                <title>404 - Not Found | J mehta</title>
            </Helmet>
            <ErrorSnackbar errorMessages={ExceptionError} onClearErrors={clearErrors} />
            <SuccessSnackbar successMessages={successMessages} onclearSuccess={clearSuccess} />
            <div className='new_client_title'>
                <h2>404 - Not Found</h2>
            </div>
        </>
        // </Dashboard>
    );
};

export default NotFound;
