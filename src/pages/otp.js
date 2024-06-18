import React, { useState, useEffect } from 'react';
import Input from '../components/parts/input.js';
import { Link, useNavigate } from 'react-router-dom';
import { forgot_pass, otp_api } from '../service/api.js';
import OtpInput from 'react-otp-input';
import { Helmet } from 'react-helmet';
import ErrorSnackbar from './../components/ErrorSnackbar.js';
import SuccessSnackbar from './../components/SuccessSnackbar.js';

function Otp() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('UserOtpDetID');
  useEffect(() => {
    if (isAuthenticated == null || isAuthenticated == undefined) {
      // navigate('/');
    }
  }, [isAuthenticated, navigate]);
  const [ExceptionError, setExceptionError] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
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
  const [otp, setotp] = useState('');
  function handleotpChange(newOtp) {
    setotp(newOtp);
  }
  const [validationErrors, setValidationErrors] = useState({
    otp: '',
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(otp);
    const errors = {};
    // Perform validation here
    if (otp.trim() === '') {
      errors.otp = 'otp is required.';
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const storedForgotDetailString = localStorage.getItem("ForgotDetail");
    const ForgotDetail = JSON.parse(storedForgotDetailString);
    const res = await otp_api(otp, ForgotDetail.Username);
    console.log(res);
    if (res.status == 201) {
      let resp = "OTP Verified";
      handleExceptionSuccessMessages(resp);
      setTimeout(function () {
        navigate('/resetpass')
      }, 2000);
    } else {
      let respo = "Enter valid OTP";
      handleExceptionError(respo);
      // window.location.href = '/otp';
    }
  }
  const handleResend = async () => {
    const mail = localStorage.getItem("mail");
    const res = await forgot_pass(mail);
    console.log(res)
    if (res.status == 200) {
      // localStorage.removeItem("UserOtpDetID");
      // localStorage.setItem("UserOtpDetID", res.data.data.UserOtpDetID);
      localStorage.removeItem("ForgotDetail");
      const ForgotDetail = res.data.ForgotDetail;
      const forgotDetailString = JSON.stringify(ForgotDetail);
      localStorage.setItem("ForgotDetail", forgotDetailString);
      let resp = "OTP Resend";
      handleExceptionSuccessMessages(resp);
    } else {
      let respo = "Error";
      handleExceptionError(respo);
      // window.location.href = '/otp';
    }
  }
  return (
    <>
      <ErrorSnackbar errorMessages={ExceptionError} onClearErrors={clearErrors} />
      <SuccessSnackbar successMessages={successMessages} onclearSuccess={clearSuccess} />
      <Helmet>
        <title>OTP | J mehta</title>
      </Helmet>
      <div className="login_wrapper otp_wrapper">
        <div className='login_logo_area'>
          <div className='login_logo'>
            <img src="./img/login/logo.png" />
          </div>
          <h1>J. Mehta & Co.</h1>
          <h2>Human Resource Management System</h2>
        </div>
        <div className='login_form_area'>
          <h1>Verify</h1>
          <form onSubmit={handleSubmit}>
            {/* <Input placeholder='' type="text" label="We sent an OTP to jmetha@gmail.com. Edit mail ID" value={otp}
                        onChange={handleotpChange}/> */}
            {validationErrors.otp && <div className="error">{validationErrors.otp}</div>}
            <OtpInput
              value={otp}
              onChange={handleotpChange}
              numInputs={6}
              renderSeparator={<span className="gapbetween"> </span>}
              placeholder=''
              renderInput={(props) => <input {...props} />} />
            <div className='submit_button'>
              <input type="submit" value="Verify" />
            </div>
          </form>
          <p>Didn't receive OTP?<Link onClick={handleResend}> Resend</Link></p>
        </div>
      </div>
    </>
  );
}

export default Otp;