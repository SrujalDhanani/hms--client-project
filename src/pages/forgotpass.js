import react, { useState } from 'react';
import Input from '../components/parts/input.js';
import { Link, useNavigate } from 'react-router-dom';
import { forgot_pass } from '../service/api.js';
import { Helmet } from 'react-helmet';
import ErrorSnackbar from './../components/ErrorSnackbar.js';
import SuccessSnackbar from './../components/SuccessSnackbar.js';
import { encryption } from '../components/utils/utils.js';

function Forgotpass() {
  const navigate = useNavigate();
  const [ExceptionError, setExceptionError] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  function handleExceptionError(respo) {
    // alert("sf");
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
  const [mail, setmail] = useState('');
  console.log(mail)
  function handlemailChange(event) {
    setmail(event.target.value);
    setValidationErrors((prevErrors) => ({ ...prevErrors, mail: '' }));
  }
  const [validationErrors, setValidationErrors] = useState({
    mail: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};
    // Perform validation here
    if (mail.trim() === '') {
      errors.mail = 'Email is required.';
    }
    if (mail) {
      const email_pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!email_pattern.test(mail)) {
        errors.mail = "Invalid email format";
      }
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    // const encryptedEmail = encryption(mail)
    const res = await forgot_pass(mail);
    console.log(res);
    if (res.status === 200) {
      console.log("2000")
      const ForgotDetail = res.data.ForgotDetail;
      const forgotDetailString = JSON.stringify(ForgotDetail);
      console.log(res.data.ForgotDetail) // Check if UserOtpDetID exists
      if (ForgotDetail) {
        console.log("aa")
        localStorage.removeItem("ForgotDetail");
        localStorage.setItem("ForgotDetail", forgotDetailString);
        localStorage.removeItem("mail");
        localStorage.setItem("mail", mail);
        let resp = "OTP Sent";
        handleExceptionSuccessMessages(resp);
        setTimeout(function () {
          navigate('/otp')
        }, 2000);
      } else {
        console.log("bb")
        // Handle scenario where UserOtpDetID is missing
        localStorage.setItem("ForgotDetail", forgotDetailString);
        localStorage.setItem("mail", mail);
        let resp = "OTP Sent";
        handleExceptionSuccessMessages(resp);
        setTimeout(function () {
          navigate('/otp')
        }, 2000);
      }
    } else {
      let respo = "User not Found";
      handleExceptionError(respo);
    }
  }
  return (
    <>
      <ErrorSnackbar errorMessages={ExceptionError} onClearErrors={clearErrors} />
      <SuccessSnackbar successMessages={successMessages} onclearSuccess={clearSuccess} />
      <Helmet>
        <title>Forgot Password | J mehta</title>
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
          <h1>Forgot password?</h1>
          <form onSubmit={handleSubmit}>
            <Input placeholder='Type your email ' type="text" label="Email" value={mail}
              onChange={handlemailChange} />
            {validationErrors.mail && <div className="error">{validationErrors.mail}</div>}


            <div className='submit_button'>
              <input type="submit" value="Send OTP" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Forgotpass;