// App.js
import React, { useState, useEffect } from "react";
import Dashboard from "../components/dashboard.js";
import { AiFillCloseCircle } from "react-icons/ai";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Input2 from "../components/parts/input2.js";
import Select from "../components/parts/select.js";
import ImageUpload from "../components/parts/imagefile.js";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { BsFillTrashFill } from "react-icons/bs";



import {
  Employee_edit,
  Employee_entry_api,
  Employee_get_by_id,
  upload_Employee_file,
  get_Client_Page_Access,
  CheckBoxDuplicateRecord,
  EmployeeRelation_Dropdown,
} from "../service/api.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorSnackbar from "./../components/ErrorSnackbar.js";
import SuccessSnackbar from "./../components/SuccessSnackbar.js";
import DocumentUpload from "../components/parts/documentfile.js";
import Access_Denied from "./deniedaccess.js";
import Load from "../components/parts/load.js";
import Spin from "../components/parts/spin.js";

const steps = [
  "Personal Details",
  "Family Details",
  "Emergency Contact Details",
  "Government Details",
  "Salary Details",
  "Document Details",
  "Bank Details",
];

const Employee_entry = () => {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [IsEPF, setIsEPF] = useState(false);
  const [IsESIC, setIsESIC] = useState(false);
  const [IsPT, setIsPT] = useState(false);
  const [IsActive, setIsActive] = useState(false);
  const [IsMarried, setIsMarried] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState("");
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [selectedDocumentFile, setSelectedDocumentFile] = useState("");
  const [ExceptionError, setExceptionError] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [buttonClicked, setButtonClicked] = useState("");
  const [disabledBtn, setDisabledBtn] = useState(false);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSpin, setShowSpin] = useState(false);
  const [showLoad, setShowLoad] = useState(true);


  const [EmployeeAddAccess, setEmployeeAddAccess] = useState(false);
  useEffect(() => {
    PageAccess();
    get_Relation();
  }, []);

  const PageAccess = async () => {
    try {
      // setLoading(true);
      const res = await get_Client_Page_Access("6");
      console.log(res);
      if (res.status === 200) {
        if (id ? res.data.AllowUpdate === true : res.data.AllowAdd === true) {
          setEmployeeAddAccess(true);
          if (id) {
            api_get();
          }
          setShowLoad(true);
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

  const handleLeaderChange = (event) => {
    // const selectedValues = Array.from(
    //   event.target.selectedOptions,
    //   (option) => option.value
    // );
    // setSelectedOptions(selectedValues);
    // const selected = event.target.value;
    // setValidationErrors((prevErrors) => ({ ...prevErrors, DesignationID: "" }));
    // setData((prevData) => ({
    //   ...prevData,
    //   DesignationID: selected,
    // }));
  };

  const handleDocumentChange = (event) => {
    const selectedValues1 = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedDocument(selectedValues1);

    const selected = event.target.value;
    setData((prevData) => ({
      ...prevData,
      DocumentTypeID: selected,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      DocumentTypeID: "",
    }));
  };

  const handleGenderChange = async (event) => {
    const selectedValues1 = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    console.log(selectedValues1);
    setSelectedGender(selectedValues1);
    const selected = event.target.value;
    setValidationErrors((prevErrors) => ({ ...prevErrors, Gender: "" }));
    setData((prevData) => ({
      ...prevData,
      Gender: selected,
    }));
  };

  const handleExecutiveChange = (event) => {
    // const selectedValues = Array.from(
    //   event.target.selectedOptions,
    //   (option) => option.value
    // );
    // setSelectedOptions(selectedValues);
    // const selected = event.target.value;
    // setValidationErrors((prevErrors) => ({ ...prevErrors, DesignationID: "" }));
    // setData((prevData) => ({
    //   ...prevData,
    //   DesignationID: selected,
    // }));
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

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const [EmployeeDataNew, setEmployeeDataNew] = useState([
    {
      RelationID: "",
      EmployeeRelationName: "",
      EmployeeRelationMobileNo: "",
      EmployeeRelationEmailID: "",
      EmployeeRelationDOB: "",
      EmployeeRelationAadharCardNo: "",
    }
  ])


  const [data, setData] = useState({
    //Personal Details
    EmployeeName: "",
    IsMarried: false,
    Gender: "",
    DOB: "",
    DOJ: "",
    DOA: "",
    MobileNo1: "",
    MobileNo2: "",
    EmailID: "",
    Image: "",

    //Family Details
    // RelationID: "",
    // EmployeeRelationName: "",
    // EmployeeRelationMobileNo: "",
    // EmployeeRelationEmailID: "",
    // EmployeeRelationDOB: "",
    // EmployeeRelationAadharCardNo: "",
    relationdata: EmployeeDataNew,

    //Emergency Details
    EmloyeeEmergencyContactName: "",
    EmloyeeEmergencyContactMobileNumber: "",
    EmloyeeEmergencyContactRelationID: "",

    //Government Details
    AadharCardNo: "",
    PAN: "",
    UAN: "",
    ESICNo: "",
    PTNo: "",
    EPFNo: "",
    IsEPF: false,
    IsPT: false,
    IsESIC: false,

    //Salary Details
    Aadhar: "",
    PAN: "",
    UAN: "",
    ESIC: "",
    ProfessionalTax: "",
    EmployeeProvidendFund: "",

    //Document Details
    DocumentTypeID: "",
    DocumentName: "",
    DocumentFilePath: "",

    //Bank Details
    BankName: "",
    BranchName: "",
    AccountNo: "",
    cAccountNo: "",
    IFSCode: "",
    AccountName: "",
    IsActive: false,
  });

  const initialRowState = {
    RelationID: "",
    EmployeeRelationName: "",
    EmployeeRelationMobileNo: "",
    EmployeeRelationEmailID: "",
    EmployeeRelationDOB: "",
    EmployeeRelationAadharCardNo: "",
  };
  // Logic Extra



  const [validationErrors, setValidationErrors] = useState({
    //Personal Details
    EmployeeName: "",
    Gender: "",
    DOB: "",
    IsMarried: "",
    DOJ: "",
    DOA: "",
    MobileNo1: "",
    MobileNo2: "",
    EmailID: "",
    Image: "",

    //Family Details
    // RelationID: "",
    // EmployeeRelationName: "",
    // EmployeeRelationMobileNo: "",
    // EmployeeRelationEmailID: "",
    // EmployeeRelationDOB: "",
    // EmployeeRelationAadharCardNo: "",
    relationdata: EmployeeDataNew,

    //Emergency Details
    EmloyeeEmergencyContactName: "",
    EmloyeeEmergencyContactMobileNumber: "",
    EmloyeeEmergencyContactRelationID: "",

    //Government Details
    AadharCardNo: "",
    PAN: "",
    UAN: "",
    ESICNo: "",
    PTNo: "",
    EPFNo: "",
    IsEPF: "",
    IsPT: "",
    IsESIC: "",

    //Salary Details
    Aadhar: "",
    PAN: "",
    UAN: "",
    ESIC: "",
    ProfessionalTax: "",
    EmployeeProvidendFund: "",

    //Document Details
    DocumentTypeID: "",
    DocumentName: "",
    DocumentFilePath: "",

    //Bank Details
    BankName: "",
    BranchName: "",
    AccountNo: "",
    cAccountNo: "",
    IFSCode: "",
    AccountName: "",
    IsActive: "",
  });

  const [relationOptions, setRelationOptions] = useState([]);
  const [relationOptions2, setRelationOptions2] = useState([]);

  // const get_Relation = async () => {
  //   try {
  //     const res = await EmployeeRelation_Dropdown();
  //     console.log(res);
  //     if (res.status === 200) {
  //       const newOptions = res.data.EmployeeRelation.map((item) => ({
  //         id: item.RelationID,
  //         name: item.Name,
  //       }));
  //       console.log(newOptions);
  //       setRelationOptions([...relationOptions, ...newOptions]);
  //       setRelationOptions2([...relationOptions2, ...newOptions]);
  //     } else if (res.status === 401) {
  //       handleExceptionError("Unauthorized");
  //       setTimeout(() => {
  //         localStorage.clear();
  //         navigate("/");
  //       }, 1000);
  //     }
  //   } catch (error) {
  //     handleExceptionError(error.message);
  //   }
  // };
  const get_Relation = async () => {
    try {
      const res = await EmployeeRelation_Dropdown();
      if (res.status === 200) {
        const newOptions = res.data.EmployeeRelation.map((item) => ({
          id: item.RelationID,
          name: item.Name,
        }));
        setRelationOptions(newOptions);
        setRelationOptions2(newOptions);
      } else if (res.status === 401) {
        handleExceptionError("Unauthorized");
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      handleExceptionError(error.message);
    }
  };

  const api_get = async () => {
    setShowLoad(true);
    try {
      const resp = await Employee_get_by_id(id);
      console.log(resp);
      if (resp.status === 200) {
        console.log(resp.data.EmployeeData.Gender);
        setSelectedGender(resp.data.EmployeeData.Gender);
        setSelectedDocument(
          resp.data.EmloyeeDocumentDetailtData.DocumentTypeID
        );
        setIsMarried(resp.data.EmployeeData.IsMarried);
        setSelectedImage(resp.data.EmployeeData.Image);
        setSelectedDocumentFile(
          resp.data.EmloyeeDocumentDetailtData.DocumentFilePath
        );
        setSelectedOptions(resp.data.EmployeeRelationDate.RelationID);
        setEmergencyRelationOptions(
          resp.data.EmloyeeEmergencyContactData.RelationID
        );

        setData({
          EmployeeName: resp.data.EmployeeData.EmployeeName,
          Gender: resp.data.EmployeeData.Gender,
          DOB: formatDate(resp.data.EmployeeData.DOB),
          IsMarried: resp.data.EmployeeData.IsMarried ? true : false,
          DOJ: formatDate(resp.data.EmployeeData.DOJ),
          DOA: formatDate(resp.data.EmployeeData.DOA),
          MobileNo1: resp.data.EmployeeData.MobileNo1,
          MobileNo2: resp.data.EmployeeData.MobileNo2,
          EmailID: resp.data.EmployeeData.EmailID,
          Image: resp.data.EmployeeData.Image,

          RelationID:
            resp.data.EmployeeRelationDate === null
              ? ""
              : resp.data.EmployeeRelationDate.RelationID,
          EmployeeRelationName:
            resp.data.EmployeeRelationDate === null
              ? ""
              : resp.data.EmployeeRelationDate.Name,
          EmployeeRelationMobileNo:
            resp.data.EmployeeRelationDate === null
              ? ""
              : resp.data.EmployeeRelationDate.MobileNo,
          EmployeeRelationEmailID:
            resp.data.EmployeeRelationDate === null
              ? ""
              : resp.data.EmployeeRelationDate.EmailID,
          EmployeeRelationDOB:
            resp.data.EmployeeRelationDate === null
              ? ""
              : formatDate(resp.data.EmployeeRelationDate.DOB),
          EmployeeRelationAadharCardNo:
            resp.data.EmployeeRelationDate === null
              ? ""
              : resp.data.EmployeeRelationDate.AadharCardNo,

          EmloyeeEmergencyContactRelationID:
            resp.data.EmloyeeEmergencyContactData.RelationID,
          EmloyeeEmergencyContactName:
            resp.data.EmloyeeEmergencyContactData.Name,
          EmloyeeEmergencyContactMobileNumber:
            resp.data.EmloyeeEmergencyContactData.MobileNo,

          AadharCardNo: resp.data.EmployeeData.AadharCardNo,
          PAN: resp.data.EmployeeData.PAN,
          UAN: resp.data.EmployeeData.UAN,
          ESICNo: resp.data.EmployeeData.ESICNo,
          PTNo: resp.data.EmployeeData.PTNo,
          EPFNo: resp.data.EmployeeData.EPFNo,
          IsEPF: resp.data.EmployeeData.IsEPF ? true : false,
          IsPT: resp.data.EmployeeData.IsPT ? true : false,
          IsESIC: resp.data.EmployeeData.IsESIC ? true : false,

          DocumentTypeID: resp.data.EmloyeeDocumentDetailtData.DocumentTypeID,
          DocumentName: resp.data.EmloyeeDocumentDetailtData.DocumentName,
          DocumentFilePath:
            resp.data.EmloyeeDocumentDetailtData.DocumentFilePath,

          BankName: resp.data.EmloyeeBankData.BankName,
          BranchName: resp.data.EmloyeeBankData.BranchName,
          AccountNo: resp.data.EmloyeeBankData.AccountNo,
          cAccountNo: resp.data.EmloyeeBankData.AccountNo,
          IFSCode: resp.data.EmloyeeBankData.IFSCode,
          AccountName: resp.data.EmloyeeBankData.AccountName,
          IsActive: resp.data.EmloyeeBankData.IsActive ? true : false,
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
      console.log(error.message);
      handleExceptionError(error.message);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const NumberValidation =
        /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
      const PANValidation = /^([A-Z]{5}[0-9]{4}[A-Z]{1})$/;
      const EmailValidation = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      const IFSCodeValidation = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      const BankAccountNumberValidation = /^[0-9]{9,18}$/;
      const AadharValidation = /^\d{12}$/;
      const UANValidation = /^\d{12}$/;
      const ESICValidation = /^\d{17}$/;

      // Rest of your function logic
      if (activeStep === 0) {
        const errors = {};
        if (data.EmployeeName.trim() === "") {
          errors.EmployeeName = "Employee Name is required.";
        }
        if (data.Gender.length === 0) {
          errors.Gender = "Gender is required.";
        }
        if (data.DOB.trim() === "") {
          errors.DOB = "Date of Birth is required.";
        }
        if (data.DOJ.trim() === "") {
          errors.DOJ = "Date of Joining is required.";
        }
        if (data.IsMarried) {
          if (data.DOA.trim() === "") {
            errors.DOA = "Date of Anniversary is required.";
          }
        }
        if (data.MobileNo1.trim() === "") {
          errors.MobileNo1 = "Mobile Number is required.";
        }
        if (data.MobileNo1) {
          if (!NumberValidation.test(data.MobileNo1)) {
            errors.MobileNo1 = "Invalid Mobile Number.";
          }
        }
        if (data.MobileNo2) {
          if (!NumberValidation.test(data.MobileNo2)) {
            errors.MobileNo2 = "Invalid mobile number.";
          }
        }
        if (data.EmailID.trim() === "") {
          errors.EmailID = "Email ID is required.";
        }
        if (data.EmailID) {
          if (!EmailValidation.test(data.EmailID)) {
            errors.EmailID = "Invalid Email format";
          }
        }
        if (data.Image.trim() === "") {
          errors.Image = "Image is required.";
        }
        if (Object.keys(errors).length > 0) {
          setValidationErrors(errors);
          return;
        }
        setValidationErrors({});
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }

      // if (activeStep === 1) {
      //   const errors = {};
      //   console.log("data for validation",data)
      //   if (data.RelationID.length === 0) {
      //     errors.Gender = "Relation is required.";
      //   }
      //   if (data.EmployeeRelationName.trim() === "") {
      //     errors.EmployeeRelationName = "Name is required.";
      //   }
      //   if (data.EmployeeRelationMobileNo.trim() === "") {
      //     errors.EmployeeRelationMobileNo = "Mobile Number is required.";
      //   }
      //   if (
      //     data.EmployeeRelationMobileNo &&
      //     !NumberValidation.test(data.EmployeeRelationMobileNo)
      //   ) {
      //     errors.EmployeeRelationMobileNo = "Invalid Mobile Number.";
      //   }
      //   if (data.EmployeeRelationAadharCardNo.trim() === "") {
      //     errors.EmployeeRelationAadharCardNo =
      //       "AadharCardNo number is required.";
      //   }
      //   if (
      //     data.EmployeeRelationAadharCardNo &&
      //     !AadharValidation.test(data.EmployeeRelationAadharCardNo)
      //   ) {
      //     errors.EmployeeRelationAadharCardNo = "Invalid Aadhar Number format.";
      //   }
      //   if (data.EmployeeRelationDOB.trim() === "") {
      //     errors.EmployeeRelationDOB = "DOB is required.";
      //   }
      //   if (data.EmployeeRelationEmailID.trim() === "") {
      //     errors.EmployeeRelationEmailID = "Email is required.";
      //   }
      //   if (data.EmployeeRelationEmailID) {
      //     if (!EmailValidation.test(data.EmployeeRelationEmailID)) {
      //       errors.EmployeeRelationEmailID = "Invalid Email Address.";
      //     }
      //   }
      //   if (Object.keys(errors).length > 0) {
      //     setValidationErrors(errors);
      //     return;
      //   }
      //   setValidationErrors({});
      //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
      // }
      // if (activeStep === 1) {
      //   const errors = {};

      //   EmployeeDataNew.forEach((dataItem, index) => {
      //     const itemErrors = {};

      //     if (dataItem.RelationID.trim() === "") {
      //       itemErrors.RelationID = "Relation is required.";
      //     }
      //     if (dataItem.EmployeeRelationName.trim() === "") {
      //       itemErrors.EmployeeRelationName = "Name is required.";
      //     }
      //     if (dataItem.EmployeeRelationMobileNo.trim() === "") {
      //       itemErrors.EmployeeRelationMobileNo = "Mobile Number is required.";
      //     } else if (!NumberValidation.test(dataItem.EmployeeRelationMobileNo)) {
      //       itemErrors.EmployeeRelationMobileNo = "Invalid Mobile Number.";
      //     }
      //     if (dataItem.EmployeeRelationAadharCardNo.trim() === "") {
      //       itemErrors.EmployeeRelationAadharCardNo = "AadharCardNo number is required.";
      //     } else if (!AadharValidation.test(dataItem.EmployeeRelationAadharCardNo)) {
      //       itemErrors.EmployeeRelationAadharCardNo = "Invalid Aadhar Number format.";
      //     }
      //     if (dataItem.EmployeeRelationDOB.trim() === "") {
      //       itemErrors.EmployeeRelationDOB = "DOB is required.";
      //     }
      //     if (dataItem.EmployeeRelationEmailID.trim() === "") {
      //       itemErrors.EmployeeRelationEmailID = "Email is required.";
      //     } else if (!EmailValidation.test(dataItem.EmployeeRelationEmailID)) {
      //       itemErrors.EmployeeRelationEmailID = "Invalid Email Address.";
      //     }

      //     if (Object.keys(itemErrors).length > 0) {
      //       errors[index] = itemErrors;
      //     }
      //   });

      //   if (Object.keys(errors).length > 0) {
      //     setValidationErrors(errors);
      //     return;
      //   }

      //   setValidationErrors({});
      //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
      // }
      if (activeStep === 1) {
        const errors = {};
        console.log("hhh", EmployeeDataNew);

        EmployeeDataNew.forEach((dataItem, index) => {
          const itemErrors = {};
          console.log("dataItem.EmployeeRelationDOB", dataItem.EmployeeRelationDOB);

          if (!dataItem.RelationID || dataItem.RelationID.trim() === "") {
            itemErrors.RelationID = "Relation is required.";
          }
          if (!dataItem.EmployeeRelationName || dataItem.EmployeeRelationName.trim() === "") {
            itemErrors.EmployeeRelationName = "Name is required.";
          }

          if (!dataItem.EmployeeRelationMobileNo || dataItem.EmployeeRelationMobileNo.trim() === "") {
            itemErrors.EmployeeRelationMobileNo = "Mobile Number is required.";
          } else if (!NumberValidation.test(dataItem.EmployeeRelationMobileNo)) {
            itemErrors.EmployeeRelationMobileNo = "Invalid Mobile Number.";
          }
          if (!dataItem.EmployeeRelationAadharCardNo || dataItem.EmployeeRelationAadharCardNo.trim() === "") {
            itemErrors.EmployeeRelationAadharCardNo = "Aadhar Card Number is required.";
          } else if (!AadharValidation.test(dataItem.EmployeeRelationAadharCardNo)) {
            itemErrors.EmployeeRelationAadharCardNo = "Invalid Aadhar Number format.";
          }
          if (!dataItem.EmployeeRelationDOB || dataItem.EmployeeRelationDOB.trim() === "") {
            itemErrors.EmployeeRelationDOB = "DOB is required.";
          } else {
            const currentDate = new Date();
            const selectedDate = new Date(dataItem.EmployeeRelationDOB);
            if (selectedDate > currentDate) {
              itemErrors.EmployeeRelationDOB = "DOB cannot be a future date.";
            }
          }
          if (!dataItem.EmployeeRelationEmailID || dataItem.EmployeeRelationEmailID.trim() === "") {
            itemErrors.EmployeeRelationEmailID = "Email is required.";
          } else if (!EmailValidation.test(dataItem.EmployeeRelationEmailID)) {
            itemErrors.EmployeeRelationEmailID = "Invalid Email Address.";
          }

          if (Object.keys(itemErrors).length > 0) {
            errors[index] = itemErrors;
          }
        });

        if (Object.keys(errors).length > 0) {
          console.log("Errors occurred:");
          console.log(errors);
          setValidationErrors(errors);
          return;
        }

        setValidationErrors({});
        console.log("No errors found.");
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }




      if (activeStep === 2) {
        const errors = {};
        if (data.EmloyeeEmergencyContactName.trim() === "") {
          errors.EmloyeeEmergencyContactName = "Contact Name is required.";
        }
        if (data.EmloyeeEmergencyContactRelationID.length === 0) {
          errors.EmloyeeEmergencyContactRelationID = "Relation is required.";
        }
        if (data.EmloyeeEmergencyContactMobileNumber.trim() === "") {
          errors.EmloyeeEmergencyContactMobileNumber =
            "Mobile number is required.";
        }
        if (data.EmloyeeEmergencyContactMobileNumber) {
          if (
            !NumberValidation.test(data.EmloyeeEmergencyContactMobileNumber)
          ) {
            errors.EmloyeeEmergencyContactMobileNumber =
              "Invalid Mobile Number.";
          }
        }
        if (Object.keys(errors).length > 0) {
          setValidationErrors(errors);
          return;
        }
        setValidationErrors({});
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }

      if (activeStep === 3) {
        const errors = {};
        if (data.AadharCardNo.trim() === "") {
          errors.AadharCardNo = "Aadhar Card Number is required.";
        }
        if (data.AadharCardNo && !AadharValidation.test(data.AadharCardNo)) {
          errors.AadharCardNo = "Invalid Aadhar Number format.";
        }
        if (data.PAN.trim() === "") {
          errors.PAN = "PAN is required.";
        }
        if (data.PAN && !PANValidation.test(data.PAN)) {
          errors.PAN = "Invalid PAN format.";
        }
        if (data.UAN.trim() === "") {
          errors.UAN = "UAN is required.";
        }
        if (data.UAN && !UANValidation.test(data.UAN)) {
          errors.UAN = "Invalid UAN format.";
        }
        if (IsESIC) {
          if (data.ESICNo.trim() === "") {
            errors.ESICNo = "ESIC Number is required.";
          }
        }
        // if (data.ESICNo && !ESICValidation.test(data.ESICNo)) {
        //   errors.ESICNo = "Invalid ESIC Number format.";
        // }
        if (IsEPF) {
          if (data.EPFNo.trim() === "") {
            errors.EPFNo = "Employee Providend Fund Number is required.";
          }
        }
        if (IsPT) {
          if (data.PTNo.trim() === "") {
            errors.PTNo = "Professional Tax is required.";
          }
        }
        if (Object.keys(errors).length > 0) {
          setValidationErrors(errors);
          return;
        }
        setValidationErrors({});
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }

      if (activeStep === 4) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }

      if (activeStep === 5) {
        const errors = {};
        if (data.DocumentTypeID.length === 0) {
          errors.DocumentTypeID = "Document Type is required.";
        }
        if (data.DocumentName.trim() === "") {
          errors.DocumentName = "Document Name is required.";
        }
        if (data.DocumentFilePath.trim() === "") {
          errors.DocumentFilePath = "Uploading of Documents is required.";
        }
        if (Object.keys(errors).length > 0) {
          setValidationErrors(errors);
          return;
        }
        setValidationErrors({});
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }

      if (activeStep === 6) {
        const errors = {};
        if (data.BankName.trim() === "") {
          errors.BankName = "Bank Name is required.";
        }
        if (data.BranchName.trim() === "") {
          errors.BranchName = "Branch Name is required.";
        }
        if (data.AccountNo.trim() === "") {
          errors.AccountNo = "Account Number is required.";
        }
        if (data.AccountNo) {
          if (!BankAccountNumberValidation.test(data.AccountNo)) {
            errors.AccountNo = "Invalid Account Number format";
          }
        }
        if (data.cAccountNo.trim() === "") {
          errors.cAccountNo = "Confirming your Account Number is required.";
        }
        if (data.cAccountNo) {
          if (!BankAccountNumberValidation.test(data.cAccountNo)) {
            errors.cAccountNo = "Invalid Account Number format";
          }
        }
        if (data.cAccountNo) {
          if (data.cAccountNo !== data.AccountNo) {
            errors.cAccountNo = "Account Number is not matched.";
          }
        }
        if (data.IFSCode.trim() === "") {
          errors.IFSCode = "IFSCode is required.";
        }
        if (data.IFSCode) {
          if (!IFSCodeValidation.test(data.IFSCode)) {
            errors.IFSCode = "Invalid IFSCode format.";
          }
        }
        if (data.AccountName.trim() === "") {
          errors.AccountName = "Account Name is required.";
        }
        if (Object.keys(errors).length > 0) {
          setValidationErrors(errors);
          return;
        }
        setValidationErrors({});

        if (id) {
          setShowSpin(true);
          const res = await Employee_edit(id, data);
          console.log(data);
          if (res.status === 200) {
            console.log(res);
            handleExceptionSuccessMessages(res.data.message);
            setTimeout(function () {
              navigate("/employee-list");
            }, 1000);
            setShowSpin(false);
          } else if (res.status === 201) {
            var dataError = res.data.Errors;
            console.log(dataError);
            dataError.map((message, index) => {
              handleExceptionError(message.Message);
            });
          } else if (res.status === 400) {
            if (res.data.ErrorCode) {
              const validationErrorMessage = res.data.ErrorMessage;
              const errorMessagesArray = validationErrorMessage.split(", ");
              console.log(res.data.ErrorCode);
              errorMessagesArray.forEach((errorMessage) => {
                const [, fieldName, errorMessageText] =
                  errorMessage.match(/\"(.*?)\" *(.*)/);
                handleExceptionError(`${fieldName} - ${errorMessageText}`);
              });
            }
            if (res.data.Message) {
              handleExceptionError(res.data.Message);
              console.log(res.data);
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
            console.log(res);
          }
        } else {
          setShowSpin(true);
          const res = await Employee_entry_api(data);
          if (res.status === 200) {
            console.log(res);
            handleExceptionSuccessMessages(res.data.message);
            setTimeout(function () {
              navigate("/employee-list");
            }, 1000);
            setShowSpin(false);
          } else if (res.status === 200) {
            var dataError = res.data.Errors;
            dataError.map((message, index) => {
              handleExceptionError(message.Message);
            });
          } else if (res.status === 400) {
            if (res.data.ErrorCode) {
              const validationErrorMessage = res.data.ErrorMessage;
              const errorMessagesArray = validationErrorMessage.split(", ");

              errorMessagesArray.forEach((errorMessage) => {
                // Extract field name and error message from each error message
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
          } else if (res.status === 500) {
            handleExceptionError(res.statusText);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEmployeeNameChange = async (value) => {
    setData((prevData) => ({ ...prevData, EmployeeName: value.slice(0, 50) }));
    if (value === "") {
      return;
    }
    var ob = {
      table: "Employee",
      name: value.trim(),
      id: id ? id : "0",
    };
    const resp = await CheckBoxDuplicateRecord(ob);
    if (resp.status === 200) {
      setDisabledBtn(false);
      if (value.trim().length > 50) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          EmployeeName: "Employee Name length not be more than 50 characters.",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          EmployeeName: "",
        }));
      }
    } else if (resp.status === 400) {
      setDisabledBtn(true);
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        EmployeeName: resp.data.Errors[0].Message,
      }));
      console.log(resp.data.Errors[0].Message);
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
      console.log(resp.statusText);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      try {
        const res = await upload_Employee_file(file);
        console.log(res);
        event.target.value = "";
        if (res.status === 200) {
          var FileName = res.data[0][0].filename;
          var LastModified = res.data[0][0].lastModified;
          console.log(LastModified);
          console.log(FileName);
          setSelectedImage(
            `http://hrmsapi.resolutesolutions.in.net/uploads/Document/${FileName}`
          );
          setData((prevData) => ({
            ...prevData,
            Image: `http://hrmsapi.resolutesolutions.in.net/uploads/Document/${FileName}`,
          }));
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            Image: "",
          }));
          var message = "Image Uploaded Successfully";
          handleExceptionSuccessMessages(message);
        } else if (res.status == 400) {
          handleExceptionError("");
        } else if (res.status === 401) {
          handleExceptionError("Unauthorized");
          setTimeout(() => {
            localStorage.clear();
            navigate("/");
          }, 1000);
          ///logout();
        } else {
          handleExceptionError(res.statusText);
        }
      } catch (error) {
        handleExceptionError(error.message);
      }
    }
  };


  const validationRules = [
    {
      key: "RelationID",
      maxLength: 3,
      errorMessage: "Name must not be more than 50 characters."
    },
    {
      key: "EmployeeRelationName",
      maxLength: 50,
      errorMessage: "Name must not be more than 50 characters."
    },
    {
      key: "EmployeeRelationMobileNo",
      maxLength: 10,
      errorMessage: "Mobile Number must not be more than 10 characters."
    },
    {
      key: "EmployeeRelationEmailID",
      maxLength: 50,
      errorMessage: "EmailID must not be greater than 50 characters."
    },
    {
      key: "EmployeeRelationAadharCardNo",
      maxLength: 12,
      errorMessage: "Aadhar card Number must not be greater than 12 characters."
    }
  ];
  console.log("EmployeeDataNew", EmployeeDataNew)



  // const handleSaveData = () => {
  //   const currentData = EmployeeDataNew[EmployeeDataNew.length - 1];
  //   let isValid = true;
  //   const newValidationErrors = {};

  //   validationRules.forEach(rule => {
  //     const { key, maxLength, errorMessage } = rule;
  //     if (currentData[key].trim().length > maxLength) {
  //       newValidationErrors[key] = errorMessage;
  //       isValid = false;
  //     }
  //   });

  //   if (isValid) {
  //     // Add a new empty object to EmployeeDataNew to allow adding new data
  //     setEmployeeDataNew([...EmployeeDataNew, {
  //       RelationID: "",
  //       EmployeeRelationName: "",
  //       EmployeeRelationMobileNo: "",
  //       EmployeeRelationEmailID: "",
  //       EmployeeRelationDOB: "",
  //       EmployeeRelationAadharCardNo: "",
  //     }]);

  //     // Clear validation errors
  //     setValidationErrors({});
  //   } else {
  //     // Update validation errors
  //     setValidationErrors(newValidationErrors);
  //   }
  // };
  // const handleInputChange = (index, key, value) => {
  //   const newData = [...EmployeeDataNew];
  //   newData[index][key] = value;
  //   setEmployeeDataNew(newData);
  // };


  // const handleSaveData = () => {
  //   // Always add a new empty object to EmployeeDataNew to allow adding new data
  //   setEmployeeDataNew([...EmployeeDataNew, {
  //     RelationID: "",
  //     EmployeeRelationName: "",
  //     EmployeeRelationMobileNo: "",
  //     EmployeeRelationEmailID: "",
  //     EmployeeRelationDOB: "",
  //     EmployeeRelationAadharCardNo: "",
  //   }]);

  //   // Clear validation errors
  //   setValidationErrors({});
  // };

  // const handleInputChange = (index, key, value) => {
  //   const newData = [...EmployeeDataNew];
  //   newData[index][key] = value;
  //   setEmployeeDataNew(newData);
  // };

  // const handleDeleteRow = (index) => {
  //   const newData = [...EmployeeDataNew];
  //   newData.splice(index, 1);
  //   setEmployeeDataNew(newData);
  // };


  //////this is for goint next
  const handleSaveData = () => {

    const currentData = EmployeeDataNew.length > 0 ? EmployeeDataNew[EmployeeDataNew.length - 1] : {};
    let isValid = true;
    ; const newValidationErrors = {};

    // Validate current row
    validationRules.forEach(rule => {
      const { key, maxLength, errorMessage } = rule;
      const value = currentData[key];
      if (typeof value === 'string' && value.trim().length > maxLength) {
        newValidationErrors[key] = errorMessage;
        isValid = false;
        
      }
    });

    // Check if current row is valid
    if (Object.values(currentData).every(val => typeof val !== 'string' || val.trim())) {
      if (isValid) {
        // Add a new empty object to EmployeeDataNew to allow adding new data
        setEmployeeDataNew([...EmployeeDataNew, {
          RelationID: "",
          EmployeeRelationName: "",
          EmployeeRelationMobileNo: "",
          EmployeeRelationEmailID: "",
          EmployeeRelationDOB: "",
          EmployeeRelationAadharCardNo: "",
        }]);

        // Clear validation errors
        setValidationErrors({});
      } else {
        // Update validation errors
        setValidationErrors(newValidationErrors);
      }
    } else {
      handleExceptionError("Please fill all fields in the current row before adding a new one.");
    }
  };

  const handleInputChange = (index, key, value) => {
    console.log("value", value)
    // if (key === "RelationID") {
    //   value = value?.target?.value
    // }
    console.log("value", value)
    console.log("target value", value?.target?.value)
    const newData = [...EmployeeDataNew];
    newData[index][key] = value;
    setEmployeeDataNew(newData);
    console.log("EmployeeDataNew")
  };

  const handleDeleteRow = (index) => {
    const newData = [...EmployeeDataNew];
    newData.splice(index, 1);
    setEmployeeDataNew(newData);
  };





  const [selectedOptions, setSelectedOptions] = useState([]);
  const [emergencyRelationOptions, setEmergencyRelationOptions] = useState([]);

  const handleSelectChange = async (event) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(selectedValues);
    const selected = event.target.value;
    console.log(selected);
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      RelationID: "",
    }));
    setData((prevData) => ({
      ...prevData,
      RelationID: selected,
    }));
  };

  const handleSelectChange1 = async (event) => {
    const selectedValues1 = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setEmergencyRelationOptions(selectedValues1);
    const selected = event.target.value;
    console.log(selected);
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      EmloyeeEmergencyContactRelationID: "",
    }));
    setData((prevData) => ({
      ...prevData,
      EmloyeeEmergencyContactRelationID: selected,
    }));
  };

  const [fName, setFName] = useState("");
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      try {
        const res = await upload_Employee_file(file);
        console.log(res);
        event.target.value = "";
        if (res.status === 200) {
          var FileName = res.data[0][0].filename;
          setFName(FileName);
          setSelectedDocumentFile(
            `http://hrmsapi.resolutesolutions.in.net/uploads/Document/${FileName}`
          );
          setData((prevData) => ({
            ...prevData,
            DocumentFilePath: `http://hrmsapi.resolutesolutions.in.net/uploads/Document/${FileName}`,
          }));
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            DocumentFilePath: "",
          }));
          var message = "Document Uploaded Successfully";
          handleExceptionSuccessMessages(message);
        } else if (res.status == 400) {
          handleExceptionError("");
        } else if (res.status === 401) {
          handleExceptionError("Unauthorized");
          setTimeout(() => {
            localStorage.clear();
            navigate("/");
          }, 1000);
          ///logout();
        } else {
          handleExceptionError(res.statusText);
        }
      } catch (error) {
        handleExceptionError(error.message);
      }
    }
  };

  return (
    <Dashboard title={id === undefined ? "New Employee" : "Edit Employee"}>
      <Helmet>
        <title>
          {id === undefined ? "New Employee" : "Edit Employee"} | J mehta
        </title>
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
          {EmployeeAddAccess ? (
            <>
              <div className="new_client_title mb-3">
                {/* <h2>New Client</h2> */}
                <Link to="/employee-list">
                  <button>
                    <AiFillCloseCircle /> Close
                  </button>
                </Link>
              </div>
              <hr className="mb-4"></hr>
              <Box sx={{ width: "100%" }}>
                <Stepper activeStep={activeStep}>
                  {steps.map((label, index) => {
                    return (
                      <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <div>
                  <div>
                    <Typography sx={{ mt: 5, mb: 1 }}></Typography>
                    <form onSubmit={handleSubmit}>
                      <div>
                        {activeStep === 0 && (
                          <>
                            <div className="new_client_form" id="tab1">
                              <div className="new_client_part_1">
                                <Input2
                                  placeholder="Enter Here"
                                  label="Employee Name (Exact As per AADHAR CARD)"
                                  value={data.EmployeeName}
                                  required
                                  autoFocus={1}
                                  onChange={(e) => handleEmployeeNameChange(e)}
                                />
                                {validationErrors.EmployeeName && (
                                  <div className="error">
                                    {validationErrors.EmployeeName}
                                  </div>
                                )}
                              </div>
                              <div className="new_client_part_1">
                                <Select
                                  label="Gender"
                                  options={[
                                    { id: "1", name: "Male" },
                                    { id: "2", name: "Female" },
                                    { id: "3", name: "Others" },
                                  ]}
                                  selectedOptions={selectedGender}
                                  handleChange={handleGenderChange}
                                  required={1}
                                />
                                {validationErrors.Gender && (
                                  <div className="error">
                                    {validationErrors.Gender}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="new_client_form" id="tab1">
                              <div className="new_client_part_1">
                                <Input2
                                  placeholder="Enter Here"
                                  label="Date of Birth"
                                  type="date"
                                  value={data.DOB}
                                  required
                                  onChange={(value) => {
                                    setData((prevData) => ({
                                      ...prevData,
                                      DOB: value,
                                    }));
                                    setValidationErrors((prevErrors) => ({
                                      ...prevErrors,
                                      DOB: "",
                                    }));
                                  }}
                                />
                                {validationErrors.DOB && (
                                  <div className="error">
                                    {validationErrors.DOB}
                                  </div>
                                )}
                              </div>
                              <div className="new_client_part_1">
                                <Input2
                                  placeholder="Select Your State"
                                  type="date"
                                  label="Date of Joining"
                                  value={data.DOJ}
                                  required
                                  onChange={(value) => {
                                    setData((prevData) => ({
                                      ...prevData,
                                      DOJ: value,
                                    }));
                                    setValidationErrors((prevErrors) => ({
                                      ...prevErrors,
                                      DOJ: "",
                                    }));
                                  }}
                                />
                                {validationErrors.DOJ && (
                                  <div className="error">
                                    {validationErrors.DOJ}
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* <div className="new_client_form" id="tab1">
                              <div className="new_client_part_1">
                                <div className="toggle_switch_btn gst">
                                  <h3>
                                    Married
                                    <span style={{ color: "red" }}>*</span>
                                  </h3>
                                  <input
                                    type="checkbox"
                                    checked={data.IsMarried}
                                    onChange={() => {
                                      const newValue = !data.IsMarried;
                                      setIsMarried(newValue);
                                      setData((prevData) => ({
                                        ...prevData,
                                        IsMarried: newValue,
                                      }));
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="new_client_part_1">
                                {IsMarried && (
                                  <Input2
                                    placeholder="Enter Here"
                                    label="Date of Anniversary"
                                    type="date"
                                    value={data.DOA}
                                    required
                                    onChange={(value) => {
                                      setData((prevData) => ({
                                        ...prevData,
                                        DOA: value,
                                      }));
                                      setValidationErrors((prevErrors) => ({
                                        ...prevErrors,
                                        DOA: "",
                                      }));
                                    }}
                                  />
                                )}
                                {validationErrors.DOA && (
                                  <div className="error">
                                    {validationErrors.DOA}
                                  </div>
                                )}
                              </div>
                            </div> */}
                            <div className="new_client_form" id="tab2">
                              <div className="new_client_part_1">
                                <div className="toggle_switch_btn">
                                  <h3>
                                    Are you Married?
                                    <span style={{ color: "red" }}>*</span>
                                  </h3>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={data.IsMarried}
                                      onChange={() => {
                                        const newValue = !data.IsMarried;
                                        setData((prevData) => ({
                                          ...prevData,
                                          IsMarried: newValue,
                                          DOA: newValue ? prevData.DOA : "",
                                        }));
                                      }}
                                    />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="new_client_part_1">
                                {data.IsMarried && (
                                  <Input2
                                    placeholder="Enter Here"
                                    label="Date of Anniversary"
                                    type="date"
                                    value={data.DOA}
                                    required
                                    onChange={(value) => {
                                      setData((prevData) => ({
                                        ...prevData,
                                        DOA: value,
                                      }));
                                      setValidationErrors((prevErrors) => ({
                                        ...prevErrors,
                                        DOA: "",
                                      }));
                                    }}
                                  />
                                )}
                                {validationErrors.DOA && (
                                  <div className="error">
                                    {validationErrors.DOA}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="new_client_form" id="tab1">
                              <div className="new_client_part_1">
                                <Input2
                                  placeholder="Enter Here"
                                  label="Mobile Number 1"
                                  value={data.MobileNo1}
                                  required
                                  onChange={(value) => {
                                    if (/^\d*$/.test(value)) {
                                      if (value.trim().length > 10) {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          MobileNo1:
                                            "Mobile Number must not be more than 10 characters.",
                                        }));
                                      } else {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          MobileNo1: "",
                                        }));
                                      }
                                      setData((prevData) => ({
                                        ...prevData,
                                        MobileNo1: value.slice(0, 10),
                                      }));
                                    }
                                  }}
                                />
                                {validationErrors.MobileNo1 && (
                                  <div className="error">
                                    {validationErrors.MobileNo1}
                                  </div>
                                )}
                              </div>
                              <div className="new_client_part_1">
                                <Input2
                                  placeholder="Enter Here"
                                  label="Mobile Number 2"
                                  value={data.MobileNo2}
                                  onChange={(value) => {
                                    if (/^\d*$/.test(value)) {
                                      if (value.trim().length > 10) {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          MobileNo2:
                                            "Mobile Number must not be more than 10 characters.",
                                        }));
                                      } else {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          MobileNo2: "",
                                        }));
                                      }
                                      setData((prevData) => ({
                                        ...prevData,
                                        MobileNo2: value.slice(0, 10),
                                      }));
                                    }
                                  }}
                                />
                                {validationErrors.MobileNo2 && (
                                  <div className="error">
                                    {validationErrors.MobileNo2}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="new_client_form" id="tab1">
                              <div className="new_client_part_1">
                                <Input2
                                  placeholder="Enter Here"
                                  label="Email ID"
                                  value={data.EmailID}
                                  required
                                  onChange={(value) => {
                                    if (value.trim().length > 50) {
                                      setValidationErrors((prevErrors) => ({
                                        ...prevErrors,
                                        EmailID:
                                          "EmailID must not be greater than 50 characters.",
                                      }));
                                    } else {
                                      setValidationErrors((prevErrors) => ({
                                        ...prevErrors,
                                        EmailID: "",
                                      }));
                                    }
                                    setData((prevData) => ({
                                      ...prevData,
                                      EmailID: value.slice(0, 50),
                                    }));
                                  }}
                                />
                                {validationErrors.EmailID && (
                                  <div className="error">
                                    {validationErrors.EmailID}
                                  </div>
                                )}
                              </div>
                              <div className="new_client_part_1">
                                <ImageUpload
                                  onChange={handleImageChange}
                                  label="Upload Profile Image"
                                  imageFile={selectedImage}
                                  required
                                />
                                {validationErrors.Image && (
                                  <div className="error">
                                    {validationErrors.Image}
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                        {activeStep === 1 && (
                          <>
                            <div className="client_panel_list border border-1">
                              <table className="client_panel_list_table emp_entry_tbl" cellPadding="0" cellSpacing="0">
                                <thead>
                                  <tr>
                                    <th>Select Relation</th>
                                    <th>Name</th>
                                    <th>Mobile No</th>
                                    <th>Email ID</th>
                                    <th>Date of Birth</th>
                                    <th>Aadhar Card Number</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {EmployeeDataNew.map((single, index) => (
                                    <tr key={index}>
                                      <td>
                                        <Select
                                          options={relationOptions}
                                          selectedOptions={single.RelationID}
                                          defaultValue={single.RelationID}
                                          handleChange={(e) => {
                                            const value = e.target.value;
                                            if (!value) {
                                              setValidationErrors((prevErrors) => ({
                                                ...prevErrors,
                                                [index]: { ...prevErrors[index], RelationID: "Name must not be more than 50 characters." },
                                              }));
                                            } else {
                                              setValidationErrors((prevErrors) => ({
                                                ...prevErrors,
                                                [index]: { ...prevErrors[index], RelationID: "" },
                                              }));
                                            }
                                            handleInputChange(index, "RelationID", value);
                                          }}
                                        />
                                        {validationErrors[index]?.RelationID && (
                                          <div className="error">{validationErrors[index].RelationID}</div>
                                        )}
                                      </td>
                                      <td>
                                        <Input2
                                          type="text"
                                          value={single.EmployeeRelationName}
                                          onChange={(value) => {
                                            if (value.trim().length > 50) {
                                              setValidationErrors((prevErrors) => ({
                                                ...prevErrors,
                                                [index]: { ...prevErrors[index], EmployeeRelationName: "Name must not be more than 50 characters." },
                                              }));
                                            } else {
                                              setValidationErrors((prevErrors) => ({
                                                ...prevErrors,
                                                [index]: { ...prevErrors[index], EmployeeRelationName: "" },
                                              }));
                                            }
                                            handleInputChange(index, "EmployeeRelationName", value.slice(0, 50));
                                          }}
                                          placeholder="Enter here"
                                          className="tbl_enter"
                                        />
                                        {validationErrors[index]?.EmployeeRelationName && (
                                          <div className="error" style={{ paddingTop: "1rem" }}>
                                            {validationErrors[index].EmployeeRelationName}
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        <Input2
                                          type="text"
                                          value={single.EmployeeRelationMobileNo}
                                          onChange={(value) => {
                                            if (/^\d*$/.test(value)) {
                                              if (value.trim().length > 10) {
                                                setValidationErrors((prevErrors) => ({
                                                  ...prevErrors,
                                                  [index]: { ...prevErrors[index], EmployeeRelationMobileNo: "Mobile Number must not be more than 10 characters." },
                                                }));
                                              } else {
                                                setValidationErrors((prevErrors) => ({
                                                  ...prevErrors,
                                                  [index]: { ...prevErrors[index], EmployeeRelationMobileNo: "" },
                                                }));
                                              }
                                              handleInputChange(index, "EmployeeRelationMobileNo", value.slice(0, 10));
                                            }
                                          }}
                                          placeholder="Enter here"
                                          className="tbl_enter"
                                        />
                                        {validationErrors[index]?.EmployeeRelationMobileNo && (
                                          <div className="error" style={{ paddingTop: "1rem" }}>
                                            {validationErrors[index].EmployeeRelationMobileNo}
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        <Input2
                                          type="text"
                                          value={single.EmployeeRelationEmailID}
                                          onChange={(value) => {
                                            if (value.trim().length > 50) {
                                              setValidationErrors((prevErrors) => ({
                                                ...prevErrors,
                                                [index]: { ...prevErrors[index], EmployeeRelationEmailID: "EmailID must not be greater than 50 characters." },
                                              }));
                                            } else {
                                              setValidationErrors((prevErrors) => ({
                                                ...prevErrors,
                                                [index]: { ...prevErrors[index], EmployeeRelationEmailID: "" },
                                              }));
                                            }
                                            handleInputChange(index, "EmployeeRelationEmailID", value.slice(0, 50));
                                          }}
                                          placeholder="Enter here"
                                          className="tbl_enter"
                                        />
                                        {validationErrors[index]?.EmployeeRelationEmailID && (
                                          <div className="error" style={{ paddingTop: "1rem" }}>
                                            {validationErrors[index].EmployeeRelationEmailID}
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        <Input2
                                          type="date"
                                          value={single.EmployeeRelationDOB}
                                          onChange={(value) => {
                                            const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
                                            if (value > currentDate) {
                                              setValidationErrors((prevErrors) => ({
                                                ...prevErrors,
                                                [index]: { ...prevErrors[index], EmployeeRelationDOB: "DOB cannot be a future date." },
                                              }));
                                            } else {
                                              setValidationErrors((prevErrors) => ({
                                                ...prevErrors,
                                                [index]: { ...prevErrors[index], EmployeeRelationDOB: "" },
                                              }));
                                            }
                                            handleInputChange(index, "EmployeeRelationDOB", value);
                                          }}
                                          max={new Date().toISOString().split("T")[0]} // Setting the max attribute to today's date
                                          placeholder="Enter here"
                                          className="tbl_enter"
                                        />
                                        {validationErrors[index]?.EmployeeRelationDOB && (
                                          <div className="error" style={{ paddingTop: "1rem" }}>
                                            {validationErrors[index].EmployeeRelationDOB}
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        <Input2
                                          type="text"
                                          value={single.EmployeeRelationAadharCardNo}
                                          onChange={(value) => {
                                            if (/^\d*$/.test(value)) {
                                              if (value.trim().length > 12) {
                                                setValidationErrors((prevErrors) => ({
                                                  ...prevErrors,
                                                  [index]: { ...prevErrors[index], EmployeeRelationAadharCardNo: "Aadhar card Number must not be greater than 12 characters." },
                                                }));
                                              } else {
                                                setValidationErrors((prevErrors) => ({
                                                  ...prevErrors,
                                                  [index]: { ...prevErrors[index], EmployeeRelationAadharCardNo: "" },
                                                }));
                                              }
                                              handleInputChange(index, "EmployeeRelationAadharCardNo", value.slice(0, 12));
                                            }
                                          }}
                                          placeholder="Enter here"
                                          className="tbl_enter"
                                        />
                                        {validationErrors[index]?.EmployeeRelationAadharCardNo && (
                                          <div className="error" style={{ paddingTop: "1rem" }}>
                                            {validationErrors[index].EmployeeRelationAadharCardNo}
                                          </div>
                                        )}
                                      </td>
                                      <td className="dust-data">
                                        <button className="trash" onClick={() => handleDeleteRow(index)}>
                                          <BsFillTrashFill />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className="btn_save mt-4">
                                <button
                                  className="tab1 button_transparent"
                                  type="button"
                                  onClick={handleSaveData}
                                >
                                  Add Another
                                  <AiOutlinePlusCircle />
                                </button>
                              </div>
                            </div>
                          </>
                        )}







                        {activeStep === 2 && (
                          <>
                            <div className="new_client_form" id="tab3">
                              <div className="new_client_part_1">
                                <Input2
                                  placeholder="Enter Here"
                                  label="Emergency Name"
                                  autoFocus={1}
                                  value={data.EmloyeeEmergencyContactName}
                                  onChange={(value) => {
                                    if (value.trim().length > 50) {
                                      setValidationErrors((prevErrors) => ({
                                        ...prevErrors,
                                        EmloyeeEmergencyContactName:
                                          "Name must not be more than 50 characters.",
                                      }));
                                    } else {
                                      setValidationErrors((prevErrors) => ({
                                        ...prevErrors,
                                        EmloyeeEmergencyContactName: "",
                                      }));
                                    }
                                    setData((prevData) => ({
                                      ...prevData,
                                      EmloyeeEmergencyContactName: value.slice(
                                        0,
                                        50
                                      ),
                                    }));
                                  }}
                                  required={1}
                                />
                                {validationErrors.EmloyeeEmergencyContactName && (
                                  <div className="error">
                                    {
                                      validationErrors.EmloyeeEmergencyContactName
                                    }
                                  </div>
                                )}
                              </div>
                              <div className="new_client_part_1">
                                <Select
                                  label={" Emergency Relation"}
                                  options={relationOptions2}
                                  selectedOptions={emergencyRelationOptions}
                                  handleChange={handleSelectChange1}
                                  required
                                />
                                {validationErrors.EmloyeeEmergencyContactRelationID && (
                                  <div className="error">
                                    {
                                      validationErrors.EmloyeeEmergencyContactRelationID
                                    }
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="new_client_form" id="tab3">
                              <div className="new_client_part_1">
                                <Input2
                                  placeholder="Enter Here"
                                  label=" Emergency Mobile Number"
                                  value={
                                    data.EmloyeeEmergencyContactMobileNumber
                                  }
                                  onChange={(value) => {
                                    if (/^\d*$/.test(value)) {
                                      if (value.trim().length > 10) {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          EmloyeeEmergencyContactMobileNumber:
                                            "Mobile Number must not be more than 10 characters.",
                                        }));
                                      } else {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          EmloyeeEmergencyContactMobileNumber:
                                            "",
                                        }));
                                      }
                                      setData((prevData) => ({
                                        ...prevData,
                                        EmloyeeEmergencyContactMobileNumber:
                                          value.slice(0, 10),
                                      }));
                                    }
                                  }}
                                  required={1}
                                />
                                {validationErrors.EmloyeeEmergencyContactMobileNumber && (
                                  <div className="error">
                                    {
                                      validationErrors.EmloyeeEmergencyContactMobileNumber
                                    }
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}

                        {activeStep === 3 && (
                          <>
                            <div className="new_client_form" id="tab4">
                              <div className="new_client_part_1">
                                <Input2
                                  placeholder="Enter Here"
                                  label="Aadhar Card Number"
                                  value={data.AadharCardNo}
                                  required
                                  autoFocus={1}
                                  onChange={(value) => {
                                    if (/^\d*$/.test(value)) {
                                      if (value.trim().length > 12) {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          AadharCardNo:
                                            "Aadhar card Number must not be greater than 12 characters.",
                                        }));
                                      } else {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          AadharCardNo: "",
                                        }));
                                      }
                                      setData((prevData) => ({
                                        ...prevData,
                                        AadharCardNo: value.slice(0, 12),
                                      }));
                                    }

                                  }}
                                />
                                {validationErrors.AadharCardNo && (
                                  <div className="error">
                                    {validationErrors.AadharCardNo}
                                  </div>
                                )}
                              </div>

                              <div className="new_client_part_1">
                                <Input2
                                  placeholder="Enter Here"
                                  label="Personal Account Number (PAN)"
                                  value={data.PAN}
                                  required
                                  onChange={(value) => {
                                    if (value.trim().length > 10) {
                                      setValidationErrors((prevErrors) => ({
                                        ...prevErrors,
                                        PAN: "PAN must not be greater than 10 characters.",
                                      }));
                                    } else {
                                      setValidationErrors((prevErrors) => ({
                                        ...prevErrors,
                                        PAN: "",
                                      }));
                                    }
                                    setData((prevData) => ({
                                      ...prevData,
                                      PAN: value.slice(0, 10),
                                    }));
                                  }}
                                />
                                {validationErrors.PAN && (
                                  <div className="error">
                                    {validationErrors.PAN}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="new_client_form" id="tab2">
                              <div className="new_client_part_1">
                                <Input2
                                  placeholder="Enter Here"
                                  label="UAN"
                                  value={data.UAN}
                                  required
                                  onChange={(value) => {
                                    if (/^\d*$/.test(value)) {
                                      if (value.trim().length > 12) {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          UAN: "UAN must not be greater than 12 characters.",
                                        }));
                                      } else {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          UAN: "",
                                        }));
                                      }
                                      setData((prevData) => ({
                                        ...prevData,
                                        UAN: value.slice(0, 12),
                                      }));
                                    }
                                  }}
                                />
                                {validationErrors.UAN && (
                                  <div className="error">
                                    {validationErrors.UAN}
                                  </div>
                                )}
                              </div>
                              <div className="new_client_part_1">
                                <div className="toggle_switch_btn gst">
                                  <h3>
                                    Is Professional Tax Applicable?
                                    {IsPT && (
                                      <span style={{ color: "red" }}>*</span>
                                    )}
                                  </h3>
                                  <label class="switch">
                                    <input
                                      type="checkbox"
                                      checked={data.IsPT}
                                      onChange={() => {
                                        const newValue = !data.IsPT;
                                        setIsPT(newValue);
                                        setData((prevData) => ({
                                          ...prevData,
                                          IsPT: newValue,
                                        }));
                                      }}
                                    />
                                    <span class="slider round"></span>
                                  </label>
                                </div>
                                <Input2
                                  placeholder="Professional Tax Registration Number"
                                  disabled={!IsPT}
                                  style={{ opacity: IsPT ? 1 : 0.5 }}
                                  value={data.IsPT ? data.PTNo : ""}
                                  onChange={(value) => {
                                    setData((prevData) => ({
                                      ...prevData,
                                      PTNo: value.slice(0, 15),
                                    }));
                                    setValidationErrors((prevErrors) => ({
                                      ...prevErrors,
                                      PTNo: "",
                                    }));
                                  }}
                                />
                                {validationErrors.PTNo && (
                                  <div className="error">
                                    {validationErrors.PTNo}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="new_client_form" id="tab2">
                              <div className="new_client_part_1">
                                <div className="toggle_switch_btn gst">
                                  <h3>
                                    Is ESIC Applicable?
                                    {IsESIC && (
                                      <span style={{ color: "red" }}>*</span>
                                    )}
                                  </h3>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={data.IsESIC}
                                      onChange={() => {
                                        const newValue = !data.IsESIC;
                                        setIsESIC(newValue);
                                        setData(prevData => ({
                                          ...prevData,
                                          IsESIC: newValue
                                        }));
                                      }}
                                    />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                                <div>
                                  {IsESIC ? (
                                    <Input2
                                      className={IsESIC ? "input-visible" : "input-hidden"}
                                      placeholder="ESIC Registration Number"
                                      value={data.ESICNo}
                                      onChange={(value) => {
                                        if (/^\d*$/.test(value)) {
                                          if (value.trim().length > 17) {
                                            setValidationErrors(prevErrors => ({
                                              ...prevErrors,
                                              ESICNo: "ESICNo must not be greater than 17 characters."
                                            }));
                                          } else {
                                            setValidationErrors(prevErrors => ({
                                              ...prevErrors,
                                              ESICNo: ""
                                            }));
                                          }

                                          setData(prevData => ({
                                            ...prevData,
                                            ESICNo: value.slice(0, 17)
                                          }));
                                        }
                                      }}

                                    />
                                  ) : (
                                    <div className="esicfield">ESIC Registration Number</div>
                                  )}

                                </div>
                                {validationErrors.ESICNo && (
                                  <div className="error">
                                    {validationErrors.ESICNo}
                                  </div>
                                )}
                              </div>
                              <div className="new_client_part_1">
                                <div className="toggle_switch_btn gst">
                                  <h3>
                                    Is Employee Providend Fund Applicable?
                                    {IsEPF && (
                                      <span style={{ color: "red" }}>*</span>
                                    )}
                                  </h3>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={data.IsEPF}
                                      onChange={() => {
                                        const newValue = !data.IsEPF;
                                        setIsEPF(newValue);
                                        setData(prevData => ({
                                          ...prevData,
                                          IsEPF: newValue
                                        }));
                                      }}
                                    />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                                <div>
                                  {IsEPF ? (
                                    <Input2
                                      placeholder="EPF Registration Number"
                                      value={data.EPFNo}
                                      onChange={(value) => {
                                        if (/^\d*$/.test(value)) {
                                          if (value.trim().length > 17) {
                                            setValidationErrors(prevErrors => ({
                                              ...prevErrors,
                                              EPFNo: "ESICNo must not be greater than 17 characters."
                                            }));
                                          } else {
                                            setValidationErrors(prevErrors => ({
                                              ...prevErrors,
                                              EPFNo: ""
                                            }));
                                          }
                                          setData(prevData => ({
                                            ...prevData,
                                            EPFNo: value.slice(0, 17)
                                          }));
                                        }
                                      }}
                                    />
                                  ) : (
                                    <div className="esicfield">EPF Registration Number</div>
                                  )}
                                </div>
                                {validationErrors.EPFNo && (
                                  <div className="error">
                                    {validationErrors.EPFNo}
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}

                        {activeStep === 4 && (
                          <>
                            <div className="client_tab_title">
                              <h2>Assign Team Member</h2>
                            </div>
                            <div
                              className="new_client_form margin-space"
                              id="tab4"
                            >
                              <div className="new_client_part_1">
                                <Select
                                  autoFocus={1}
                                  label="Team Leader"
                                  options={[
                                    { id: "1", name: "Male" },
                                    { id: "2", name: "Female" },
                                    { id: "3", name: "Others" },
                                  ]}
                                  value={selectedLeader} // Use an appropriate state to manage the selected value
                                  onChange={handleLeaderChange} // Implement the change handler function
                                />
                              </div>
                              <div className="new_client_part_1">
                                <Select
                                  autoFocus={0}
                                  label="Executive"
                                  options={[
                                    { id: "1", name: "Male" },
                                    { id: "2", name: "Female" },
                                    { id: "3", name: "Others" },
                                  ]}
                                  value={selectedExecutive} // Use an appropriate state to manage the selected value
                                  onChange={handleExecutiveChange} // Implement the change handler function
                                />
                              </div>
                            </div>
                          </>
                        )}
                        {activeStep === 5 && (
                          <>
                            <div className="new_client_form" id="tab6">
                              <div className="new_client_part_1">
                                <Input2
                                  placeholder="Enter Here"
                                  label="Document Name"
                                  value={data.DocumentName}
                                  required
                                  autoFocus={1}
                                  onChange={(value) => {
                                    if (value.trim().length > 200) {
                                      setValidationErrors((prevErrors) => ({
                                        ...prevErrors,
                                        DocumentName:
                                          "Document Name must not be greater than 200 characters.",
                                      }));
                                    } else {
                                      setValidationErrors((prevErrors) => ({
                                        ...prevErrors,
                                        DocumentName: "",
                                      }));
                                    }
                                    setData((prevData) => ({
                                      ...prevData,
                                      DocumentName: value.slice(0, 200),
                                    }));
                                  }}
                                />
                              </div>
                              <div className="new_client_part_1">
                                <Select
                                  label="Documents"
                                  options={[
                                    {
                                      id: 1,
                                      name: "Aadhar Card",
                                      value: "Aadhar Card",
                                    },
                                    {
                                      id: 2,
                                      name: "PAN Card",
                                      value: "PAN Card",
                                    },
                                    { id: 3, name: "L.C", value: "L.C" },
                                  ]}
                                  selectedOptions={selectedDocument}
                                  handleChange={handleDocumentChange}
                                />
                                {validationErrors.DocumentTypeID && (
                                  <div className="error">
                                    {validationErrors.DocumentTypeID}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="new_client_form" id="tab6">
                              <div className="new_client_part_1">
                                <DocumentUpload
                                  onChange={handleFileChange}
                                  label="Upload Documents"
                                  documentFile={selectedDocumentFile}
                                  fileName={fName}
                                  required
                                />
                                {validationErrors.DocumentFilePath && (
                                  <div className="error">
                                    {validationErrors.DocumentFilePath}
                                  </div>
                                )}
                              </div>
                              <div className="new_client_part_1"></div>
                            </div>
                          </>
                        )}

                        {activeStep === 6 && (
                          <>
                            <>
                              <div className="new_client_form" id="tab7">
                                <div className="new_client_part_1">
                                  <Input2
                                    placeholder="Enter Here"
                                    label="Bank Name"
                                    value={data.BankName}
                                    required
                                    autoFocus={1}
                                    onChange={(value) => {
                                      if (value.trim().length > 100) {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          BankName:
                                            "Bank Name must not be more than 100 characters.",
                                        }));
                                      } else {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          BankName: "",
                                        }));
                                      }
                                      setData((prevData) => ({
                                        ...prevData,
                                        BankName: value.slice(0, 100),
                                      }));
                                    }}
                                  />
                                  {validationErrors.BankName && (
                                    <div className="error">
                                      {validationErrors.BankName}
                                    </div>
                                  )}
                                </div>
                                <div className="new_client_part_1">
                                  <Input2
                                    placeholder="Enter Here"
                                    label="IFS Code"
                                    value={data.IFSCode}
                                    required
                                    onChange={(value) => {
                                      if (value.trim().length > 11) {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          IFSCode:
                                            "IFSCode must not be greater than 11 characters.",
                                        }));
                                      } else {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          IFSCode: "",
                                        }));
                                      }
                                      setData((prevData) => ({
                                        ...prevData,
                                        IFSCode: value.slice(0, 11),
                                      }));
                                    }}
                                  />
                                  {validationErrors.IFSCode && (
                                    <div className="error">
                                      {validationErrors.IFSCode}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="new_client_form">
                                <div className="new_client_part_1">
                                  <Input2
                                    placeholder="Enter Here"
                                    label="Branch Name"
                                    value={data.BranchName}
                                    required
                                    onChange={(value) => {
                                      if (value.trim().length > 100) {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          BranchName:
                                            "Branch Name must not be more than 100 characters.",
                                        }));
                                      } else {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          BranchName: "",
                                        }));
                                      }
                                      setData((prevData) => ({
                                        ...prevData,
                                        BranchName: value.slice(0, 100),
                                      }));
                                    }}
                                  />
                                  {validationErrors.BranchName && (
                                    <div className="error">
                                      {validationErrors.BranchName}
                                    </div>
                                  )}
                                </div>
                                <div className="new_client_part_1">
                                  <Input2
                                    placeholder="Enter Here"
                                    label="Account Name"
                                    value={data.AccountName}
                                    required
                                    onChange={(value) => {
                                      if (value.trim().length > 100) {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          AccountName:
                                            "AccountName must not be more than 100 characters.",
                                        }));
                                      } else {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          AccountName: "",
                                        }));
                                      }
                                      setData((prevData) => ({
                                        ...prevData,
                                        AccountName: value.slice(0, 100),
                                      }));
                                    }}
                                  />
                                  {validationErrors.AccountName && (
                                    <div className="error">
                                      {validationErrors.AccountName}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="new_client_form">
                                <div className="new_client_part_1">
                                  <Input2
                                    placeholder="Enter Here"
                                    label="Account Number"
                                    value={data.AccountNo}
                                    required
                                    onChange={(value) => {
                                      if (/^\d*$/.test(value)) {
                                        if (value.trim().length > 18) {
                                          setValidationErrors((prevErrors) => ({
                                            ...prevErrors,
                                            AccountNo:
                                              "Account Number must not be more than 18 characters.",
                                          }));
                                        } else {
                                          setValidationErrors((prevErrors) => ({
                                            ...prevErrors,
                                            AccountNo: "",
                                          }));
                                        }
                                        setData((prevData) => ({
                                          ...prevData,
                                          AccountNo: value.slice(0, 18),
                                        }));
                                      }
                                    }}
                                  />
                                  {validationErrors.AccountNo && (
                                    <div className="error">
                                      {validationErrors.AccountNo}
                                    </div>
                                  )}
                                </div>
                                <div className="new_client_part_1">
                                  <Input2
                                    placeholder="Re-enter Here"
                                    label="Confirm Account Number"
                                    value={data.cAccountNo}
                                    required
                                    onChange={(value) => {
                                      if (/^\d*$/.test(value)) {
                                        if (value.trim().length > 15) {
                                          setValidationErrors((prevErrors) => ({
                                            ...prevErrors,
                                            cAccountNo:
                                              "Account Number must not be more than 15 characters.",
                                          }));
                                        } else {
                                          setValidationErrors((prevErrors) => ({
                                            ...prevErrors,
                                            cAccountNo: "",
                                          }));
                                        }
                                        setData((prevData) => ({
                                          ...prevData,
                                          cAccountNo: value.slice(0, 15),
                                        }));
                                      }
                                    }}
                                  />
                                  {validationErrors.cAccountNo && (
                                    <div className="error">
                                      {validationErrors.cAccountNo}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="new_client_form">
                                <div className="new_client_part_1">
                                  <div className="toggle_switch_btn gst">
                                    <h3>
                                      Active
                                      <span style={{ color: "red" }}>*</span>
                                    </h3>
                                    <label class="switch">
                                      <input
                                        type="checkbox"
                                        checked={data.IsActive}
                                        onChange={() => {
                                          const newValue = !data.IsActive;
                                          setIsActive(newValue);
                                          setData((prevData) => ({
                                            ...prevData,
                                            IsActive: newValue,
                                          }));
                                        }}
                                      />
                                      <span class="slider round"></span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </>

                            {id && (
                              <div className="row mt-3">
                                <div className="col-xl-3">
                                  <div className="uploaded_files">
                                    <ul>
                                      <li>
                                        <div className="d-flex justify-content-between">
                                          <span className="file_name">
                                            {data.BankName}
                                          </span>
                                          <span>
                                            <img src="../img/big_check.svg" />
                                          </span>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div className="btn_save btn-right me-0 d-flex justify-content-end">
                        {activeStep !== 0 && (
                          <Button
                            disableRipple
                            className="tab1 save_button back"
                            onClick={handleBack}
                          >
                            <img src="../img/Back1.svg" alt="" />
                            Back
                          </Button>
                        )}
                        <Button
                          type="submit"
                          className="tab1 save_button"
                          variant="contained"
                          disableRipple
                        >
                          {activeStep === steps.length - 1 ? (
                            <>
                              <img src="../img/Save.svg" />
                              {id === undefined ? "Save" : "Update"}
                              {showSpin && buttonClicked === "submit" && (
                                <Spin />
                              )}
                            </>
                          ) : (
                            <>
                              Next
                              <img src="../img/Next.svg" alt="" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
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

export default Employee_entry;
