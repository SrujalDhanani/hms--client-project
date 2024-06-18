import React, { useState, useEffect } from "react";
import Dashboard from "../components/dashboard.js";
import { AiFillCloseCircle } from "react-icons/ai";
import Input2 from "../components/parts/input2.js";
import Select from "../components/parts/select.js";
import RadioButton2 from "../components/parts/radiobutton.js";
import {
  User_entry_api,
  User_get_by_id,
  CheckBoxDuplicateRecord,
  CheckMailDuplicateRecord,
  get_Client_User_Pages,
  get_Client_Page_Access,
  Designation_Dropdown,
  Department_Dropdown,
} from "../service/api.js";
import { User_edit } from "../service/api.js";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Department_get, Designation_get } from "../service/api.js";
import Textarea from "../components/parts/textarea.js";
import ErrorSnackbar from "./../components/ErrorSnackbar.js";
import SuccessSnackbar from "./../components/SuccessSnackbar.js";
import { decryption } from "../components/utils/utils.js";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import Access_Denied from "./deniedaccess.js";
import Load from "../components/parts/load.js";
import Spin from "../components/parts/spin.js";

const steps = ["Personal Details", "User Access"];

const User_entry = () => {
  const [UserAccessPages, setUserAccessPages] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [ExceptionError, setExceptionError] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [buttonClicked, setButtonClicked] = useState("");
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [showSpin, setShowSpin] = useState(false);
  const [showLoad, setShowLoad] = useState(true);
  const [passwordFieldType, setPasswordFieldType] = useState("password");
  const [passwordFieldType2, setPasswordFieldType2] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleCPasswordVisibility = () => {
    setShowCPassword(!showCPassword);
  };

  const [data, setData] = useState({
    Username: "",
    Password: "",
    cpassword: "",
    Firstname: "",
    Lastname: "",
    Mobilenumber1: "",
    Mobilenumber2: "",
    Emailid: "",
    Homeaddress: "",
    Remarks: "",
    DesignationID: "",
    DepartmentID: "",
    Role: true,
    UserAccessData: [],
    Active: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    Username: "",
    Password: "",
    cpassword: "",
    Firstname: "",
    Lastname: "",
    Mobilenumber1: "",
    Mobilenumber2: "",
    Emailid: "",
    Homeaddress: "",
    Remarks: "",
    DesignationID: "",
    DepartmentID: "",
    Role: "",
    UserAccessData: [],
  });
  console.log(validationErrors);

  const [UserAddAccess, setUserAddAccess] = useState(false);
  useEffect(() => {
    PageAccess();
  }, []);

  const PageAccess = async () => {
    try {
      // setLoading(true);
      const res = await get_Client_Page_Access("3");
      if (res.status === 200) {
        if (id ? res.data.AllowUpdate === true : res.data.AllowAdd === true) {
          setUserAddAccess(true);
          get_designation();
          get_department();
          fetchPageData();
          if (id) {
            api_get();
          }
          setShowLoad(false);
        }
        setShowLoad(false);
      } else if (res.status === 400) {
        if (res.data.ErrorCode) {
          const validationErrorMessage = res.data.ErrorMessage;
          const errorMessagesArray = validationErrorMessage.split(", ");

          errorMessagesArray.forEach((errorMessage) => {
            const [, fieldName, errorMessageText] =
              errorMessage.match(/\"(.*?)\" (.*)/);

            // Format error message and push it to the formattedErrorMessages array
            handleExceptionError(`${fieldName} - ${errorMessageText}`);
          });
        }
        if (res.data.Message) {
          handleExceptionError(res.data.Message);
        }
      } else if (res.status === 401) {
        handleExceptionError("Unauthorized");
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
        ///logout();
      } else if (res.status === 200) {
        var dataError = res.data.Errors;
        dataError.map((message, index) => {
          handleExceptionError(message.Message);
        });
      } else if (res.status === 500) {
        handleExceptionError(res.statusText);
      }
    } catch (error) {
      handleExceptionError(error.message);
    }
  };

  const api_get = async () => {
    setShowLoad(true);
    try {
      const resp = await User_get_by_id(id);
      console.log(decryption(resp.data.ClientUser.EmailID));
      console.log(resp);
      if (resp.status === 200) {
        // setIsChecked(resp.data.ClientUser.IsActive);
        setSelectedOptions(resp.data.ClientUser.DesignationID);
        setSelectedDepartment(resp.data.ClientUser.DepartmentID);
        console.log(resp.data.ClientUserPermission);

        const departmentDataID = resp.data.ClientUser.DepartmentID;
        const designationDataID = resp.data.ClientUser.DesignationID;
        localStorage.setItem("departmentID", JSON.stringify(departmentDataID));
        localStorage.setItem(
          "designationID",
          JSON.stringify(designationDataID)
        );

        const updatedUserAccessData = resp.data.ClientUserPermission.map(
          (permission) => ({
            ...permission,
            AllowAdd: permission.AllowAdd ? "1" : "0",
            AllowDelete: permission.AllowDelete ? "1" : "0",
            AllowUpdate: permission.AllowUpdate ? "1" : "0",
            AllowView: permission.AllowView ? "1" : "0",
          })
        );

        setData({
          Username: resp.data.ClientUser.Username,
          Password: decryption(resp.data.ClientUser.Password),
          cpassword: decryption(resp.data.ClientUser.Password),
          Firstname: resp.data.ClientUser.FirstName,
          Lastname: resp.data.ClientUser.LastName,
          Mobilenumber1: resp.data.ClientUser.MobileNumber1,
          Mobilenumber2: resp.data.ClientUser.MobileNumber2,
          Emailid: decryption(resp.data.ClientUser.EmailID),
          Homeaddress: resp.data.ClientUser.HomeAddress,
          Remarks: resp.data.ClientUser.Remarks,
          DepartmentID: resp.data.ClientUser.DepartmentID,
          DesignationID: resp.data.ClientUser.DesignationID,
          Role: resp.data.ClientUser.IsTL,
          UserAccessData: updatedUserAccessData,
          UserID: resp.data.ClientUser.UserID,
          Active: resp.data.ClientUser.IsActive,
        });
        console.log(data);
        setShowLoad(false);
      } else if (resp.status === 401) {
        handleExceptionError("Unauthorized");
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
        ///logout();
      }
    } catch (error) {
      handleExceptionError(error.message);
    }
  };

  const handleActiveChange = (value) => {
    setIsChecked(!isChecked);
    setData((prevData) => ({ ...prevData, Active: value }));
  };

  function handleExceptionError(res) {
    setExceptionError((ExceptionError) => [
      ...ExceptionError,
      { id: Date.now(), message: res },
    ]);
  }

  function handleExceptionSuccessMessages(resp) {
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

  function handleRadioChange1(newValue) {
    setData({ ...data, Role: newValue });
  }

  const handleSelectChange = async (event) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(selectedValues);
    const selected = event.target.value;
    setValidationErrors((prevErrors) => ({ ...prevErrors, DesignationID: "" }));
    setData((prevData) => ({
      ...prevData,
      DesignationID: selected,
    }));
  };

  const handleSelectChange1 = async (event) => {
    console.log(event.target.value);
    const selectedValues1 = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedDepartment(selectedValues1);
    console.log(selectedValues1);
    const selected = event.target.value;
    setValidationErrors((prevErrors) => ({ ...prevErrors, DepartmentID: "" }));
    setData((prevData) => ({
      ...prevData,
      DepartmentID: selected,
    }));
  };

  const [options, setOptions] = useState([]);
  const [departmentOption, setDepartmentOption] = useState([]);

  const get_designation = async () => {
    const designationID = JSON.parse(localStorage.getItem("designationID"));
    try {
      const res = await Designation_Dropdown();
      console.log(res);
      if (res.status === 200) {
        const newOptions = res.data.DropdownData.filter(
          (item) =>
            item.IsActive === true || item.DesignationID === designationID
        ).map((item) => ({
          id: item.DesignationID,
          name: item.DesignationName,
        }));
        setOptions([...options, ...newOptions]);
      } else if (res.status === 401) {
        handleExceptionError("Unauthorized");
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
        ///logout();
      }
    } catch (error) {
      handleExceptionError(error.message);
    }
  };

  const get_department = async () => {
    const DepartmentID = JSON.parse(localStorage.getItem("departmentID"));
    console.log(DepartmentID);
    try {
      const res = await Department_Dropdown();
      if (res.status === 200) {
        const newOptions1 = res.data.DropdownData.filter(
          (item) => item.IsActive === true || item.DepartmentID === DepartmentID
        ).map((item) => ({
          id: item.DepartmentID,
          name: item.DepartmentName,
        }));
        console.log(newOptions1);
        setDepartmentOption([...departmentOption, ...newOptions1]);
      } else if (res.status === 401) {
        handleExceptionError("Unauthorized");
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
        ///logout();
      }
    } catch (error) {
      handleExceptionError(error.message);
    }
  };

  const handleUsernameChange = async (value) => {
    setData((prevData) => ({ ...prevData, Username: value.slice(0, 50) }));
    if (value === "") {
      return;
    }
    var ob = {
      table: "User",
      name: value.trim(),
      id: id ? id : "0",
    };
    console.log(ob);
    const resp = await CheckBoxDuplicateRecord(ob);
    console.log(resp);
    if (resp.status === 200) {
      setDisabledBtn(false);
      if (value.trim().length > 50) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Username: "Username shouldnot have more than 50 characters.",
        }));
      } else {
        setValidationErrors((prevErrors) => ({ ...prevErrors, Username: "" }));
      }
    } else if (resp.status === 400) {
      setDisabledBtn(true);
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        Username: resp.data.Errors[0].Message,
      }));
    } else if (resp.status === 401) {
      handleExceptionError("Unauthorized");
      setTimeout(() => {
        localStorage.clear();
        navigate("/");
      }, 1000);
      ///logout();
    } else if (resp.status === 500) {
      setDisabledBtn(false);
      handleExceptionError(resp.statusText);
    }
  };

  const handlePasswordChange = (value) => {
    if (value.trim().length > 50) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        Password: "Password must not be greater than 50 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, Password: "" }));
    }
    setData((prevData) => ({ ...prevData, Password: value.slice(0, 50) }));
  };

  const handleConfirmPasswordChange = (value) => {
    if (value.trim().length > 50) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        cpassword: "Password must not be greater than 50 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, cpassword: "" }));
    }
    setData((prevData) => ({ ...prevData, cpassword: value.slice(0, 50) }));
  };

  const handleFirstNameChange = (value) => {
    if (value.trim().length > 50) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        Firstname: "First Name must not be greater than 50 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, Firstname: "" }));
    }
    setData((prevData) => ({ ...prevData, Firstname: value.slice(0, 50) }));
  };

  const handleLastNameChange = (value) => {
    if (value.trim().length > 50) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        Lastname: "Last Name must not be greater than 50 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, Lastname: "" }));
    }
    setData((prevData) => ({ ...prevData, Lastname: value.slice(0, 50) }));
  };

  const handleMobileNumber1Change = (value) => {
    if (/^\d*$/.test(value)) {
      if (value.trim().length > 10) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Mobilenumber1: "Mobile Number length should be 10 digits.",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Mobilenumber1: "",
        }));
      }
      setData((prevData) => ({
        ...prevData,
        Mobilenumber1: value.slice(0, 10),
      }));
    }
  };

  const handleMobileNumber2Change = (value) => {
    if (/^\d*$/.test(value)) {
      if (value.trim().length > 10) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Mobilenumber2:
            "Mobile Number must not be greater than 10 characters.",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Mobilenumber2: "",
        }));
      }
      setData((prevData) => ({
        ...prevData,
        Mobilenumber2: value.slice(0, 10),
      }));
    }
  };

  const handleEmailIDChange = async (value) => {
    if (value.trim().length > 50) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        Emailid: "EmailID must not be greater than 50 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, Emailid: "" }));
    }
    setData((prevData) => ({ ...prevData, Emailid: value.slice(0, 50) }));

    var ob = {
      useremail: value.trim(),
      id: id ? id : "0",
    };
    const resp = await CheckMailDuplicateRecord(ob);
    console.log(resp);
    if (resp.status === 200) {
      // setDisabledBtn(false);
      console.log(validationErrors);
      setValidationErrors((prevErrors) => ({ ...prevErrors, Emailid: "" }));
    } else if (resp.status === 400) {
      console.log("abc");
      setDisabledBtn(true);
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        Emailid: resp.data.Message,
      }));
      console.log("abcdef");
      console.log(validationErrors);
    } else if (resp.status === 401) {
      handleExceptionError("Unauthorized");
      setTimeout(() => {
        localStorage.clear();
        navigate("/");
      }, 1000);
      ///logout();
    } else if (resp.status === 500) {
      setDisabledBtn(false);
      handleExceptionError(resp.statusText);
    }
  };

  const handleHomeAddressChange = (value) => {
    if (value.trim().length > 500) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        Homeaddress: "Address must not be greater than 500 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, Homeaddress: "" }));
    }
    setData((prevData) => ({ ...prevData, Homeaddress: value.slice(0, 500) }));
  };
  const handleRemarkChange = (value) => {
    if (value.trim().length > 500) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        Remarks: "Remarks must not be greater than 500 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, Remarks: "" }));
    }
    setData((prevData) => ({ ...prevData, Remarks: value.slice(0, 500) }));
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const NumberValidation =
        /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;

      if (activeStep === 0) {
        const errors = {};

        if (data.Username.trim() === "") {
          errors.Username = "User Name is required.";
        }
        if (data.Password.trim() === "") {
          errors.Password = "Password is required.";
        }
        if (data.cpassword.trim() === "") {
          errors.cpassword = "Confirm Password is required.";
        }
        if (data.cpassword) {
          if (data.cpassword !== data.Password) {
            errors.cpassword = "Password is not matched.";
          }
        }
        if (data.Firstname.trim() === "") {
          errors.Firstname = "First Name is required.";
        }
        if (data.Lastname.trim() === "") {
          errors.Lastname = "Last Name is required.";
        }
        if (data.Mobilenumber1.trim() === "") {
          errors.Mobilenumber1 = "Mobile Number is required.";
        }
        if (data.Mobilenumber1) {
          if (!NumberValidation.test(data.Mobilenumber1)) {
            errors.Mobilenumber1 = "Invalid Mobile Number format.";
          }
        }
        if (data.Mobilenumber2) {
          if (!NumberValidation.test(data.Mobilenumber2)) {
            errors.Mobilenumber2 = "Invalid Mobile Number format.";
          }
        }
        if (data.Emailid.trim() === "") {
          errors.Emailid = "Email ID is required.";
        }
        if (data.Emailid) {
          const email_pattern = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
          if (!email_pattern.test(data.Emailid)) {
            errors.Emailid = "Invalid Email format";
          }
        }
        if (data.Homeaddress.trim() === "") {
          errors.Homeaddress = "Home Address is required.";
        }
        if (data.DesignationID.length === 0) {
          errors.DesignationID = "Designation is required.";
        }
        if (data.DepartmentID.length === 0) {
          errors.DepartmentID = "Department is required.";
        }

        if (Object.keys(errors).length > 0) {
          setValidationErrors(errors);
          return;
        }
        setValidationErrors({});
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }

      if (activeStep === 1) {
        if (id) {
          setShowSpin(true);
          const res = await User_edit(id, data);
          console.log(res);
          if (res.status === 200) {
            handleExceptionSuccessMessages(res.data.message);
            handleFormReset();
            setShowSpin(false);
            setTimeout(function () {
              navigate("/all-users");
            }, 1000);
          } else if (res.status === 201) {
            var dataError = res.data.Errors;
            dataError.map((message, index) => {
              handleExceptionError(message.Message);
            });
          } else if (res.status === 400) {
            if (res.data.ErrorCode) {
              const validationErrorMessage = res.data.ErrorMessage;
              const errorMessagesArray = validationErrorMessage.split(", ");

              errorMessagesArray.forEach((errorMessage) => {
                const [, fieldName, errorMessageText] =
                  errorMessage.match(/\"(.*?)\" (.*)/);
                handleExceptionError(`${fieldName} - ${errorMessageText}`);
              });
            }
            if (res.data.Message) {
              handleExceptionError(res.data.Message);
            }
          } else if (res.status === 401) {
            handleExceptionError("Unauthorized");
            setTimeout(() => {
              localStorage.clear();
              navigate("/");
            }, 1000);
            ///logout();
          } else if (res.status === 500) {
            handleExceptionError(res.statusText);
          }
        } else {
          setShowSpin(true);
          const res = await User_entry_api(data);
          if (res.status === 200) {
            handleExceptionSuccessMessages(res.data.message);
            handleFormReset();
            setShowSpin(false);
            setTimeout(function () {
              navigate("/all-users");
            }, 1000);
          } else if (res.status === 201) {
            var dataError = res.data.Errors;
            dataError.map((message, index) => {
              handleExceptionError(message.Message);
            });
          } else if (res.status === 400) {
            if (res.data.ErrorCode) {
              const validationErrorMessage = res.data.ErrorMessage;
              const errorMessagesArray = validationErrorMessage.split(", ");

              errorMessagesArray.forEach((errorMessage) => {
                const [, fieldName, errorMessageText] =
                  errorMessage.match(/\"(.*?)\" (.*)/);
                handleExceptionError(`${fieldName} - ${errorMessageText}`);
              });
            }
            if (res.data.Message) {
              handleExceptionError(res.data.Message);
            }
          } else if (res.status === 401) {
            handleExceptionError("Unauthorized");
            setTimeout(() => {
              localStorage.clear();
              navigate("/");
            }, 1000);
            ///logout();
          } else if (res.status === 500) {
            handleExceptionError(res.statusText);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormReset = () => {
    let resetFields = {};
    switch (activeStep) {
      case 0:
        resetFields = {
          Username: "",
          Password: "",
          cpassword: "",
          Firstname: "",
          Lastname: "",
          Mobilenumber1: "",
          Mobilenumber2: "",
          Emailid: "",
          Homeaddress: "",
          Remarks: "",
          Designation: "",
          Department: "",
          Role: true,
        };
        break;
      case 1:
        resetFields = {
          UserAccessData: data.UserAccessData.map((page) => ({
            ...page,
            AllowAdd: "0",
            AllowView: "0",
            AllowUpdate: "0",
            AllowDelete: "0",
          })),
        };
        break;
      default:
        break;
    }
    setData((prevData) => ({
      ...prevData,
      ...resetFields,
    }));
    setValidationErrors({
      Username: "",
      Password: "",
      cpassword: "",
      Firstname: "",
      Lastname: "",
      Mobilenumber1: "",
      Mobilenumber2: "",
      Emailid: "",
      Homeaddress: "",
      Remarks: "",
      DesignationID: "",
      DepartmentID: "",
      Role: "",
      UserAccessData: [],
    });
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleConfirmation = () => {
    if (id) {
      Swal.fire({
        title: "User Updated Successfully",
        text: "",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ok",
        timer: 1000,
      }).then((result) => {
        if (result.isConfirmed) {
          // setTimeout(function () {
          navigate("/all-users");
          // }, 1000);
        } else {
          console.log("User clicked Cancel or closed the dialog");
        }
      });
    } else {
      Swal.fire({
        title: "User Added Successfully",
        text: "",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ok",
        timer: 1000,
      }).then((result) => {
        if (result.isConfirmed) {
          // setTimeout(function () {
          navigate("/all-users");
          // }, 1000);
        } else {
          console.log("User clicked Cancel or closed the dialog");
        }
      });
    }
  };

  const fetchPageData = async () => {
    try {
      const res = await get_Client_User_Pages();
      console.log(res);
      if (res.status === 200) {
        const userPages = res.data.data;
        console.log(userPages);
        setUserAccessPages(userPages);
        if (id) {
          setData((prevData) => ({
            ...prevData,
            UserAccessData: userPages.map((page) => {
              console.log(page.PageID);
              const existingPage = prevData.UserAccessData.find(
                (item) => item && item.PageID === page.PageID
              );
              console.log(existingPage);
              return existingPage
                ? existingPage
                : {
                    AllowAdd: "0",
                    AllowView: "0",
                    AllowUpdate: "0",
                    AllowDelete: "0",
                    PageID: page.PageID,
                  };
            }),
          }));
        } else {
          setData((prevData) => ({
            ...prevData,
            UserAccessData: userPages.map((page) => ({
              AllowAdd: "0",
              AllowView: "0",
              AllowUpdate: "0",
              AllowDelete: "0",
              PageID: page.PageID,
            })),
          }));
          console.log(data);
        }
      } else if (res.status === 401) {
        handleExceptionError("Unauthorized");
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
        ///logout();
      }
    } catch (error) {
      handleExceptionError(error.message);
    }
  };

  const areAllChecked = (columnName) => {
    const pages = data.UserAccessData.filter(
      (page) => page[columnName] === "1"
    );
    return pages.length === data.UserAccessData.length;
  };

  const handleHeaderCheckboxChange = (columnName, checked) => {
    const updatedData = { ...data };
    updatedData.UserAccessData = Array.isArray(updatedData.UserAccessData)
      ? updatedData.UserAccessData
      : [];
    updatedData.UserAccessData.forEach((page) => {
      switch (columnName) {
        case "AllowAdd":
          page.AllowAdd = checked ? "1" : "0";
          break;
        case "AllowUpdate":
          if (checked) {
            page.AllowView = "1";
          } else {
            page.AllowView = "0";
          }
          page.AllowUpdate = checked ? "1" : "0";
          break;
        case "AllowDelete":
          if (checked) {
            page.AllowView = "1";
          } else {
            page.AllowView = "0";
          }
          page.AllowDelete = checked ? "1" : "0";
          break;
        case "AllowView":
          if (page.AllowUpdate === "1" || page.AllowDelete === "1") {
            page.AllowView = "1";
          }
          page.AllowView = checked ? "1" : "0";
          break;
        default:
          break;
      }
    });
    setData(updatedData);
    console.log(data);
  };

  const handleColumnCheckboxChange = (columnName, pageID, checked) => {
    const pageIndex = UserAccessPages.findIndex(
      (page) => page.PageID === pageID
    );

    if (pageIndex !== -1) {
      const updatedData = { ...data };

      updatedData.UserAccessData = Array.isArray(updatedData.UserAccessData)
        ? updatedData.UserAccessData
        : [];

      switch (columnName) {
        case "AllowAdd":
          updatedData.UserAccessData[pageIndex].AllowAdd = checked ? "1" : "0";
          break;
        case "AllowUpdate":
          updatedData.UserAccessData[pageIndex].AllowUpdate = checked
            ? "1"
            : "0";
          if (checked) {
            updatedData.UserAccessData[pageIndex].AllowView = "1";
          }
          break;
        case "AllowDelete":
          updatedData.UserAccessData[pageIndex].AllowDelete = checked
            ? "1"
            : "0";
          if (checked) {
            updatedData.UserAccessData[pageIndex].AllowView = "1";
          }
          break;
        case "AllowView":
          updatedData.UserAccessData[pageIndex].AllowView = checked ? "1" : "0";
          break;
        default:
          break;
      }
      setData(updatedData);
    } else {
      console.log(`Page with ID ${pageID} not found.`);
    }
    console.log(data);
  };

  return (
    <Dashboard title={id === undefined ? "New User" : "Edit User"}>
      <Helmet>
        <title>{id === undefined ? "New User" : "Edit User"} | J mehta</title>
      </Helmet>
      <ErrorSnackbar
        errorMessages={ExceptionError}
        onClearErrors={clearErrors}
      />
      <SuccessSnackbar
        successMessages={successMessages}
        onclearSuccess={clearSuccess}
      />
      {showLoad ? (
        <Load />
      ) : (
        <>
          {UserAddAccess ? (
            <>
              <div className="new_client_title">
                <Link to="/all-users">
                  <button>
                    <AiFillCloseCircle /> Close
                  </button>
                </Link>
              </div>
              <div className="new_client_menu"></div>

              <Box sx={{ width: "100%" }}>
                <Stepper
                  sx={{ width: "50%", margin: "auto" }}
                  activeStep={activeStep}
                >
                  {steps.map((label, index) => {
                    return (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <div>
                  {activeStep === steps.length ? (
                    <div>
                      <Typography sx={{ mt: 5, mb: 1 }}>
                        {handleConfirmation()}
                      </Typography>
                    </div>
                  ) : (
                    <>
                      <Typography sx={{ mt: 5, mb: 1 }}></Typography>
                      <div className="new_client_content_wrapper">
                        <form onSubmit={handleSubmit} onReset={handleFormReset}>
                          <div>
                            {activeStep === 0 && (
                              <>
                                <div className="row new_client_form">
                                  <div className="col new_client_form">
                                    <div className="new_client_part_1 w-100">
                                      <Input2
                                        placeholder="Enter Here"
                                        label="First Name"
                                        value={data.Firstname}
                                        onChange={(e) =>
                                          handleFirstNameChange(e)
                                        }
                                        required
                                        autoFocus={1}
                                      />
                                      {validationErrors.Firstname && (
                                        <div className="error">
                                          {validationErrors.Firstname}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col ">
                                    <div className="new_client_part_1 w-100">
                                      <Input2
                                        placeholder="Enter last name"
                                        label="Last Name"
                                        value={data.Lastname}
                                        onChange={(e) =>
                                          handleLastNameChange(e)
                                        }
                                        required
                                      />
                                      {validationErrors.Lastname && (
                                        <div className="error">
                                          {validationErrors.Lastname}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="row new_client_form">
                                  <div className="col new_client_form">
                                    <div className="new_client_part_1 w-100">
                                      <Input2
                                        placeholder="Enter Here"
                                        label="Username"
                                        value={data.Username}
                                        onChange={(e) =>
                                          handleUsernameChange(e)
                                        }
                                        required
                                      />
                                      {validationErrors.Username && (
                                        <div className="error">
                                          {validationErrors.Username}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col ">
                                    <div className="new_client_part_1 w-100">
                                      <Input2
                                        placeholder="Enter Here"
                                        label="Email ID "
                                        value={data.Emailid}
                                        onChange={(e) => handleEmailIDChange(e)}
                                        required
                                      />
                                      {validationErrors.Emailid && (
                                        <div className="error">
                                          {validationErrors.Emailid}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="row new_client_form">
                                  <div className="col new_client_form">
                                    <div className="new_client_part_1 w-100">
                                      <Input2
                                        type="password"
                                        placeholder="Enter Here"
                                        label="Password"
                                        required
                                        value={data.Password}
                                        togglePasswordVisibility={
                                          togglePasswordVisibility
                                        }
                                        showPassword={showPassword}
                                        onChange={(e) =>
                                          handlePasswordChange(e)
                                        }
                                      />
                                      {validationErrors.Password && (
                                        <div className="error">
                                          {validationErrors.Password}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col new_client_form">
                                    <div className="new_client_part_1 w-100">
                                      <Input2
                                        type={passwordFieldType2}
                                        placeholder="Enter Here"
                                        label="Confirm Password"
                                        value={data.cpassword}
                                        togglePasswordVisibility={
                                          toggleCPasswordVisibility
                                        }
                                        showPassword={showCPassword}
                                        onChange={(e) =>
                                          handleConfirmPasswordChange(e)
                                        }
                                        required
                                      />
                                      {validationErrors.cpassword && (
                                        <div className="error">
                                          {validationErrors.cpassword}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="row new_client_form">
                                  <div className="col new_client_form">
                                    <div className="new_client_part_1 w-100">
                                      <Input2
                                        placeholder="Enter mobile number "
                                        label="Mobile Number 1"
                                        value={data.Mobilenumber1}
                                        onChange={(e) =>
                                          handleMobileNumber1Change(e)
                                        }
                                        required
                                      />
                                      {validationErrors.Mobilenumber1 && (
                                        <div className="error">
                                          {validationErrors.Mobilenumber1}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col ">
                                    <div className="new_client_part_1 w-100">
                                      <Input2
                                        placeholder="Enter mobile number"
                                        label="Mobile Number 2"
                                        value={data.Mobilenumber2}
                                        onChange={(e) =>
                                          handleMobileNumber2Change(e)
                                        }
                                      />
                                      {validationErrors.Mobilenumber2 && (
                                        <div className="error">
                                          {validationErrors.Mobilenumber2}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="row new_client_form">
                                  <div className="col new_client_form">
                                    <div className="new_client_part_1 w-100">
                                      <Select
                                        label="Designation"
                                        options={options}
                                        selectedOptions={selectedOptions}
                                        handleChange={handleSelectChange}
                                      />
                                      {validationErrors.DesignationID &&
                                        data.DesignationID.trim() === "" && (
                                          <div className="error">
                                            {validationErrors.DesignationID}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                  <div className="col ">
                                    <div className="new_client_part_1 w-100">
                                      <Select
                                        label="Department"
                                        options={departmentOption}
                                        selectedOptions={selectedDepartment}
                                        handleChange={handleSelectChange1}
                                      />
                                      {validationErrors.DepartmentID &&
                                        data.DepartmentID.trim() === "" && (
                                          <div className="error">
                                            {validationErrors.DepartmentID}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                                <div className="row new_client_form">
                                  <div className="col new_client_form">
                                    <div className="new_client_part_1 w-100">
                                      <Textarea
                                        label="Home Address"
                                        placeholder="Enter home address..."
                                        rows={4}
                                        cols={50}
                                        value={data.Homeaddress}
                                        onChange={(e) =>
                                          handleHomeAddressChange(e)
                                        }
                                        required
                                      />
                                      {validationErrors.Homeaddress && (
                                        <div className="error mt-2">
                                          {validationErrors.Homeaddress}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col ">
                                    <div className="new_client_part_1 w-100">
                                      <Textarea
                                        label=" Remarks"
                                        placeholder="Enter Here..."
                                        rows={4}
                                        cols={50}
                                        value={data.Remarks}
                                        onChange={(e) => handleRemarkChange(e)}
                                      />
                                      {validationErrors.Remarks && (
                                        <div className="error mt-2">
                                          {validationErrors.Remarks}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="row new_client_form">
                                  <div
                                    className="col new_client_form"
                                    style={{ marginTop: "0.78vw" }}
                                  >
                                    <div className="radio_button_label">
                                      <h2>
                                        Select Role
                                        <span style={{ color: "red" }}>*</span>
                                      </h2>
                                    </div>
                                    <RadioButton2
                                      label="Team Leader"
                                      value="1"
                                      checked={data.Role === false}
                                      onChange={() => handleRadioChange1(false)}
                                    />
                                    <RadioButton2
                                      label="Exceutive"
                                      value="2"
                                      checked={data.Role === true}
                                      onChange={() => handleRadioChange1(false)}
                                    />
                                  </div>
                                  <div className="col ">
                                    <div className="new_client_part_1 w-100">
                                      <div className="row ">
                                        <div className="new_client_part_1 mt-3">
                                          <label className="label_main">
                                            {" "}
                                            Active
                                            <input
                                              type="checkbox"
                                              checked={data.Active}
                                              onChange={(e) =>
                                                handleActiveChange(
                                                  e.target.checked
                                                )
                                              }
                                            />
                                            <span class="geekmark"> </span>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                            {activeStep === 1 && (
                              <div className="client_panel_list d-flex align-items-start">
                                <table
                                  className="client_panel_list_table user-checkbox"
                                  cellPadding="0"
                                  cellSpacing="0"
                                >
                                  <thead>
                                    <tr>
                                      <th></th>
                                      <th></th>
                                      <th>
                                        <input
                                          type="checkbox"
                                          checked={areAllChecked("AllowAdd")}
                                          onChange={(e) =>
                                            handleHeaderCheckboxChange(
                                              "AllowAdd",
                                              e.target.checked
                                            )
                                          }
                                        />
                                      </th>
                                      <th>
                                        <input
                                          type="checkbox"
                                          checked={areAllChecked("AllowUpdate")}
                                          onChange={(e) =>
                                            handleHeaderCheckboxChange(
                                              "AllowUpdate",
                                              e.target.checked
                                            )
                                          }
                                        />
                                      </th>
                                      <th>
                                        <input
                                          type="checkbox"
                                          checked={areAllChecked("AllowDelete")}
                                          onChange={(e) =>
                                            handleHeaderCheckboxChange(
                                              "AllowDelete",
                                              e.target.checked
                                            )
                                          }
                                        />
                                      </th>
                                      <th>
                                        <input
                                          type="checkbox"
                                          checked={areAllChecked("AllowView")}
                                          onChange={(e) =>
                                            handleHeaderCheckboxChange(
                                              "AllowView",
                                              e.target.checked
                                            )
                                          }
                                        />
                                      </th>
                                    </tr>
                                    <tr>
                                      <th>Pages</th>
                                      <th>Page ID</th>
                                      <th>Add</th>
                                      <th>Update</th>
                                      <th>Delete</th>
                                      <th>View</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {UserAccessPages.map((col, index) => (
                                      <>
                                        <tr key={index}>
                                          <td>{col.PageName}</td>
                                          <td>{col.PageID}</td>
                                          <td>
                                            <input
                                              type="checkbox"
                                              checked={
                                                data.UserAccessData[index]
                                                  ?.AllowAdd === "1"
                                              }
                                              onChange={(e) =>
                                                handleColumnCheckboxChange(
                                                  "AllowAdd",
                                                  col.PageID,
                                                  e.target.checked
                                                )
                                              }
                                            />
                                          </td>
                                          <td>
                                            <input
                                              type="checkbox"
                                              checked={
                                                data.UserAccessData[index]
                                                  ?.AllowUpdate === "1"
                                              }
                                              onChange={(e) =>
                                                handleColumnCheckboxChange(
                                                  "AllowUpdate",
                                                  col.PageID,
                                                  e.target.checked
                                                )
                                              }
                                            />
                                          </td>
                                          <td>
                                            <input
                                              type="checkbox"
                                              checked={
                                                data.UserAccessData[index]
                                                  ?.AllowDelete === "1"
                                              }
                                              onChange={(e) =>
                                                handleColumnCheckboxChange(
                                                  "AllowDelete",
                                                  col.PageID,
                                                  e.target.checked
                                                )
                                              }
                                            />
                                          </td>
                                          <td>
                                            <input
                                              type="checkbox"
                                              checked={
                                                data.UserAccessData[index]
                                                  ?.AllowView === "1"
                                              }
                                              onChange={(e) =>
                                                handleColumnCheckboxChange(
                                                  "AllowView",
                                                  col.PageID,
                                                  e.target.checked
                                                )
                                              }
                                            />
                                          </td>
                                        </tr>
                                      </>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>

                          <div className="btn_save d-flex justify-content-end mt-5">
                            {activeStep !== 1 && (
                              <button
                                type="reset"
                                className="tab1 save_button me-4"
                                onClick={() => setButtonClicked("reset")}
                              >
                                <img src="../img/clockwise.svg" />
                                Reset
                              </button>
                            )}
                            {activeStep !== 0 && (
                              <button
                                className="tab1 save_button"
                                onClick={handleBack}
                              >
                                {" "}
                                <img src="../img/Back1.svg" /> Back{" "}
                              </button>
                            )}
                            <button
                              type="submit"
                              className="tab1 save_button me-4"
                              disabled={disabledBtn}
                              onClick={() => setButtonClicked("submit")}
                            >
                              {activeStep === steps.length - 1 ? (
                                <>
                                  <img src="../img/Save.svg" />
                                  {id === undefined ? "Save" : "Update"}
                                  {showSpin && <Spin />}
                                </>
                              ) : (
                                <>
                                  Next
                                  <img src="../img/Next.svg" alt="" />
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    </>
                  )}
                </div>
              </Box>
            </>
          ) : (
            <Access_Denied />
          )}
        </>
      )}
    </Dashboard>
  );
};

export default User_entry;
