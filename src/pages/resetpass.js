import React, { useEffect, useState } from 'react';
import Input from '../components/parts/input.js';
import { Link, useNavigate } from 'react-router-dom';
import { reset_pass } from '../service/api.js';
import { Helmet } from 'react-helmet';
import ErrorSnackbar from '../components/ErrorSnackbar.js';
import SuccessSnackbar from '../components/SuccessSnackbar.js';


function Resetpass() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('UserOtpDetID');
    useEffect(() => {
        if (isAuthenticated == null || isAuthenticated == undefined) {
            // navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const [successMessages, setSuccessMessages] = useState([]);
    const [ExceptionError, setExceptionError] = useState([]);

    const [Password, setPassword] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');
    function handlePasswordChange(event) {
        setPassword(event.target.value);
        setValidationErrors((prevErrors) => ({ ...prevErrors, Password: '' }));
    }
    function handleconfirmpasswordChange(event) {
        setconfirmpassword(event.target.value);
        setValidationErrors((prevErrors) => ({ ...prevErrors, confirmpassword: '' }));
    }
    const [validationErrors, setValidationErrors] = useState({
        Password: '',
        confirmpassword: '',
    });

    function handleExceptionError(respo) {
        setExceptionError(ExceptionError => [
            ...ExceptionError,
            { id: Date.now(), message: respo },
        ]);
    }
    function handleExceptionSuccessMessages(resp) {
        setSuccessMessages(successMessages => [
            ...successMessages,
            { id: Date.now(), message: resp },
        ]);
    }
    function clearErrors(id) {
        setExceptionError(prevMessages =>
            prevMessages.filter(msg => msg.id !== id)
        );
    }
    function clearSuccess(id) {
        setSuccessMessages(prevMessages =>
            prevMessages.filter(msg => msg.id !== id)
        );
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(Password);
        console.log(confirmpassword);
        const errors = {};

        if (Password.trim() === '') {
            errors.Password = 'Password is required.';
        }
        if (confirmpassword.trim() === '') {
            errors.confirmpassword = 'Password is required.';
        }
        if (confirmpassword) {
            if (confirmpassword !== Password) {
                errors.confirmpassword = 'Password is not matched.';
            }
        }
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        const storedForgotDetailString = localStorage.getItem("ForgotDetail");
        const ForgotDetail = JSON.parse(storedForgotDetailString);
        // const mail = localStorage.getItem("mail");
        const res = await reset_pass(ForgotDetail.OTP, ForgotDetail.Username, Password);
        if (res.status == 200) {
            // localStorage.removeItem('');
            // localStorage.setItem('', res.data.);
            // let resp = "Login Successful";
            // handleExceptionSuccessMessages(resp);
            localStorage.removeItem('ForgotDetail');
            localStorage.removeItem('mail');
            let resp = "Passward Change Successful";
            handleExceptionSuccessMessages(resp);
            setTimeout(function () {
                navigate('/')
            }, 2000);
        }
        else {
            let resp = "error";
            handleExceptionError(resp);
        }
    }
    return (
        <>
            <ErrorSnackbar errorMessages={ExceptionError} onClearErrors={clearErrors} />
            <SuccessSnackbar successMessages={successMessages} onclearSuccess={clearSuccess} />
            <Helmet>
                <title>Reset Password | J mehta</title>
            </Helmet>
            <div className="login_wrapper">
                <div className='login_logo_area'>
                    <div className='login_logo'>
                        <img src="./img/login/logo.png" />
                    </div>
                    <h1>J. Mehta & Co.</h1>
                    <h2>Human Resource Management System</h2>
                </div>
                <div className='login_form_area'>
                    <h1>Reset password</h1>
                    <form onSubmit={handleSubmit}>
                        <Input placeholder='Type your password' type="password" label="Enter new password" value={Password}
                            onChange={handlePasswordChange} />
                        {validationErrors.Password && <div className="error">{validationErrors.Password}</div>}
                        <Input placeholder='Type your password' type="password" label="Re-enter new password" value={confirmpassword}
                            onChange={handleconfirmpasswordChange} />
                        {validationErrors.confirmpassword && <div className="error">{validationErrors.confirmpassword}</div>}

                        <div className='submit_button'>
                            <input type="submit" value="Change password" />
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}

export default Resetpass;