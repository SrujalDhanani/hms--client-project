import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Input from "./../components/parts/input.js";
import ErrorSnackbar from "./../components/ErrorSnackbar.js";
import SuccessSnackbar from "./../components/SuccessSnackbar.js";
import { Link, useNavigate } from "react-router-dom";
import { Login_api } from "../service/api.js";
import { Helmet } from "react-helmet";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { decryption, encryption } from "../components/utils/utils.js";
import { useDispatch, useSelector } from "react-redux";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
} from "../redux/actions/authActions.js";
import Input2 from "../components/parts/input2.js";
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = Cookies.get("token");
  useEffect(() => {
    const storedToken = Cookies.get("rememberMeToken");
    const CookiesUserName = Cookies.get("username");
    const CookiesPassword = Cookies.get("password");
    if (storedToken) {
      const CookiesDecryptedUsername = decryption(CookiesUserName);
      const CookiesDecryptedPassword = decryption(CookiesPassword);
      setUsername(CookiesDecryptedUsername);
      setPassword(CookiesDecryptedPassword);
      setRememberMe(storedToken);
    }
    if (isAuthenticated) {
      let message = "Login Successful";
      handleExceptionSuccessMessages(message);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  }, [isAuthenticated, navigate]);

  const [ExceptionError, setExceptionError] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFieldType, setPasswordFieldType] = useState("password");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setPasswordFieldType(showPassword ? "password" : "text");
  };

  function handleExceptionError(res) {
    setExceptionError((ExceptionError) => [
      ...ExceptionError,
      { id: Date.now(), message: res.response.data.ErrorMessage },
    ]);
  }
  function handleExceptionError1(res) {
    setExceptionError((ExceptionError) => [
      ...ExceptionError,
      { id: Date.now(), message: res },
    ]);
  }
  function handleExceptionSuccessMessages(resp) {
    console.log("successMessages", resp);
    setSuccessMessages((successMessages) => [
      ...successMessages,
      { id: Date.now(), message: resp },
    ]);
  }
  function clearErrors(id) {
    setExceptionError((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== id)
    );
  }
  function clearSuccess(id) {
    setSuccessMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== id)
    );
  }
  const res = {
    data: { Message: "adaSwdw" },
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  function handleUsernameChange(event) {
    setUsername(event.target.value);
    setValidationErrors((prevErrors) => ({ ...prevErrors, username: "" }));
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
    setValidationErrors((prevErrors) => ({ ...prevErrors, password: "" }));
  }
  function handleRememberMeChange(event) {
    setRememberMe(!rememberMe);
  }
  const [validationErrors, setValidationErrors] = useState({
    username: "",
    password: "",
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};

    if (username.trim() === "") {
      errors.username = "Username is required.";
    }
    if (password.trim() === "") {
      errors.password = "Password is required.";
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    dispatch(loginRequest());
    const encryptedUsername = encryption(username);
    const encryptedPassword = encryption(password);
    // const decryptedPassword = decryption(decryption(encryptedPassword));
    // const decryptedUsername = decryption(decryption(encryptedUsername));
    if (loading) {
      return;
    }
    try {
      setLoading(true);

      const res = await Login_api(encryptedUsername, encryptedPassword);
      console.log(res);
      if (res.status == 200) {
        if (res.data.ErrorCode === undefined) {
          Cookies.remove("token");
          Cookies.set("token", res.data.token);
          localStorage.setItem("userdata", JSON.stringify(res.data));
          console.log(res);
          dispatch(loginSuccess(res));

          // Cookies store
          if (rememberMe) {
            Cookies.set("rememberMeToken", true, { expires: 30 });
            Cookies.set("username", encryptedUsername, { expires: 30 });
            Cookies.set("password", encryptedPassword, { expires: 30 });
          } else {
            Cookies.set("rememberMeToken", "", { expires: 30 });
            Cookies.set("username", "", { expires: 30 });
            Cookies.set("password", "", { expires: 30 });
          }

          setTimeout(function () {
            navigate("/dashboard");
          }, 2000);
        } else {
          handleExceptionError1(res.data.ErrorMessage);
        }
      } else if (res.status == 400) {
        handleExceptionError1(res.data.ErrorMessage);
        //dispatch(loginFailure('An error occurred during login.'));
      } else if (res.status == 500) {
        handleExceptionError1(res.statusText);
        dispatch(loginFailure("An error occurred during login."));
      }
    } catch (error) {
      handleExceptionError1(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <ErrorSnackbar
        errorMessages={ExceptionError}
        onClearErrors={clearErrors}
      />
      <SuccessSnackbar
        successMessages={successMessages}
        onclearSuccess={clearSuccess}
      />

      <Helmet>
        <title>Login | J mehta</title>
      </Helmet>
      <div className="login_wrapper">
        <div className="login_logo_area">
          <div className="login_logo">
            <img src="./img/login/logo.png" />
          </div>
          <h1>J. Mehta & Co.</h1>
          <h2>Human Resource Management System</h2>
        </div>
        <div className="login_form_area">
          <h1>Welcome</h1>
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Type your username"
              type="text"
              label="Username"
              value={username}
              onChange={handleUsernameChange}
            />
            {validationErrors.username && (
              <div className="error">{validationErrors.username}</div>
            )}
            <Input
              type="password"
              placeholder="Enter Here"
              label="Password"
              value={password}
              togglePasswordVisibility={togglePasswordVisibility}
              showPassword={showPassword}
              onChange={handlePasswordChange}
            />
            {validationErrors.password && (
              <div className="error">{validationErrors.password}</div>
            )}

            <div className="keep_me_forget_pass">
              <div className="checkbox_wrap">
                <input
                  id="keep_logged_in"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  showPassword={showPassword}
                />
                <label htmlFor="keep_logged_in" style={{}}>
                  Keep me logged in
                </label>
              </div>
              <div className="password_wrap">
                <Link to="/forgotpass">
                  <span>Forgot your password?</span>
                </Link>
              </div>
            </div>
            <div className="submit_button">
              <input type="submit" value="Login" />
            </div>
          </form>

          <p>
            Haven't sign up yet? <Link>Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
