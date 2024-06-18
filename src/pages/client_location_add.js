// Client_Location_Add
import React, { useEffect, useState } from "react";
import Dashboard from "../components/dashboard.js";
import { AiFillCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import Input2 from "../components/parts/input2.js";
import { Helmet } from "react-helmet";
import {
  Add_Client_Location,
  ClientLocation_edit,
  ClientLocation_get_by_id,
  get_Client_Page_Access,
  City_get,
  State_get,
  Client_Location_get,
  CheckBoxDuplicateRecord,
} from "../service/api.js";
import ErrorSnackbar from "../components/ErrorSnackbar.js";
import SuccessSnackbar from "../components/SuccessSnackbar.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import { decryption } from "../components/utils/utils.js";
import saveIcon from "../Save.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Load from "../components/parts/load.js";
import Spin from "../components/parts/spin.js";
import Access_Denied from "./deniedaccess.js";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import RadioButton2 from "../components/parts/radiobutton.js";
import Select from "../components/parts/select.js";

export default function ClientLocationAdd() {
  const { id } = useParams();
  console.log(id);
  const [ExceptionError, setExceptionError] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const navigate = useNavigate();
  const [buttonClicked, setButtonClicked] = useState("");
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [ClientAccess, setClientAccess] = useState(false);
  const [showLoad, setShowLoad] = useState(true);
  const [spinLoad, setSpinLoad] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFieldType, setPasswordFieldType] = useState("password");
  const [showPassword2, setShowPassword2] = useState(false);
  const [passwordFieldType2, setPasswordFieldType2] = useState("password");
  const [locationID, setLocationID] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setPasswordFieldType(showPassword ? "password" : "text");
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
    setPasswordFieldType2(showPassword2 ? "password" : "text");
  };

  const [data, setData] = useState({
    LocationName: "",
    AddLine2: "",
    CityID: "",
    AddLine1: "",
    StateID: "",
    Pincode: "",

    PAN: "",
    IsGSTApplicable: true,
    GSTIN: "",
    IsPFApplicable: true,
    IsPFDuplicate: false,
    PFNumber: "",
    PFPassword: "",
    PFMobileNo: "",
    PFUsername: "",
    PFEmailID: "",

    IsESICApplicable: true,
    IsESICDuplicate: false,
    ESICNumber: "",
    ESICPassword: "",
    ESICMobileNo: "",
    ESICUsername: "",
    ESICEmailID: "",

    IsPTApplicable: true,
    IsPTDuplicate: false,
    PTNumber: "",
    PTEmployerNo: "",
    PTEmployeeNo: "",

    IsFactoryLicenseApplicable: true,
    IsFactoryDuplicate: false,
    FactoryLicenseNo: "",
    EndDate: "",
    StartDate: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    LocationName: "",
    AddLine2: "",
    CityID: "",
    AddLine1: "",
    StateID: "",
    Pincode: "",

    PAN: "",
    IsGSTApplicable: "",
    GSTIN: "",
    IsPFApplicable: "",
    IsPFDuplicate: "",
    PFNumber: "",
    PFPassword: "",
    PFMobileNo: "",
    PFUsername: "",
    PFEmailID: "",

    IsESICApplicable: "",
    IsESICDuplicate: "",
    ESICNumber: "",
    ESICPassword: "",
    ESICMobileNo: "",
    ESICUsername: "",
    ESICEmailID: "",

    IsPTApplicable: "",
    IsPTDuplicate: "",
    PTNumber: "",
    PTEmployerNo: "",
    PTEmployeeNo: "",

    IsFactoryLicenseApplicable: "",
    IsFactoryDuplicate: "",
    FactoryLicenseNo: "",
    EndDate: "",
    StartDate: "",
  });

  const [ClientID, setClientID] = useState();
  const api_get = async () => {
    setShowLoad(true);
    try {
      const resp = await ClientLocation_get_by_id(id);
      console.log(resp);
      if (resp.status === 200) {
        const ClientLocationDet = resp.data.ClientLocation;
        const formattedEndDate = new Date(ClientLocationDet.EndDate)
          .toISOString()
          .split("T")[0];
        const formattedStartDate = new Date(ClientLocationDet.StartDate)
          .toISOString()
          .split("T")[0];
        try {
          const res = await City_get(ClientLocationDet.StateID);
          if (res.status === 200) {
            const data = res.data.data;
            if (Array.isArray(data)) {
              const newOptions1 = data
                .filter((item) => item.IsActive === true)
                .map((item) => ({
                  id: item.CityID,
                  name: item.CityName,
                  stateId: item.StateID,
                }));
              setCityOption(newOptions1);
            } else {
              console.error("City data is not an array:", data);
            }
          } else if (res.status === 401) {
            handleExceptionError("Unauthorized");
            setTimeout(() => {
              localStorage.clear();
              navigate("/");
            }, 1000);
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
        console.log(ClientLocationDet.ClientID);
        setClientID(ClientLocationDet.ClientID);
        console.log(ClientLocationDet.CityID);

        setData({
          LocationName: ClientLocationDet.LocationName,
          AddLine2: ClientLocationDet.AddLine2,
          AddLine1: ClientLocationDet.AddLine1,
          CityID: ClientLocationDet.CityID,
          StateID: ClientLocationDet.StateID,
          Pincode: ClientLocationDet.Pincode,

          PAN: ClientLocationDet.PAN,
          IsGSTApplicable: ClientLocationDet.IsGSTApplicable,
          GSTIN: ClientLocationDet.GSTIN,
          IsPFApplicable: ClientLocationDet.IsPFApplicable,
          IsPFDuplicate: ClientLocationDet.IsPFDuplicate,
          PFNumber: ClientLocationDet.PFNumber,
          PFPassword: decryption(ClientLocationDet.PFPassword),
          PFMobileNo: ClientLocationDet.PFMobileNo,
          PFUsername: ClientLocationDet.PFUsername,
          PFEmailID: decryption(ClientLocationDet.PFEmailID),

          IsESICApplicable: ClientLocationDet.IsESICApplicable,
          IsESICDuplicate: ClientLocationDet.IsESICDuplicate,
          ESICNumber: ClientLocationDet.ESICNumber,
          ESICPassword: decryption(ClientLocationDet.ESICPassword),
          ESICMobileNo: ClientLocationDet.ESICMobileNo,
          ESICUsername: ClientLocationDet.ESICUsername,
          ESICEmailID: decryption(ClientLocationDet.ESICEmailID),

          IsPTApplicable: ClientLocationDet.IsPTApplicable,
          IsPTDuplicate: ClientLocationDet.IsPTDuplicate,
          PTNumber: ClientLocationDet.PTNumber,
          PTEmployerNo: ClientLocationDet.PTEmployerNo,
          PTEmployeeNo: ClientLocationDet.PTEmployeeNo,

          IsFactoryLicenseApplicable:
            ClientLocationDet.IsFactoryLicenseApplicable,
          IsFactoryDuplicate: ClientLocationDet.IsFactoryDuplicate,
          FactoryLicenseNo: ClientLocationDet.FactoryLicenseNo,
          EndDate: formattedEndDate,
          StartDate: formattedStartDate,
        });
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

  useEffect(() => {
    PageAccess();
  }, []);

  const PageAccess = async () => {
    try {
      const res = await get_Client_Page_Access("5");
      if (res.status == 200) {
        if (id ? res.data.AllowUpdate === true : res.data.AllowAdd === true) {
          setClientAccess(true);
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
            handleExceptionError(`${fieldName} - ${errorMessageText}`);
            setShowLoad(false);
          });
        }
        if (res.data.Message) {
          handleExceptionError(res.data.Message);
          setShowLoad(false);
        }
      } else if (res.status === 401) {
        handleExceptionError("Unauthorized");
        setShowLoad(false);
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
        ///logout();
      } else if (res.status === 200) {
        var dataError = res.data.Errors;
        dataError.map((message, index) => {
          handleExceptionError(message.Message);
          setShowLoad(false);
        });
      } else if (res.status === 500) {
        handleExceptionError(res.statusText);
        setShowLoad(false);
      }
    } catch (error) {
      handleExceptionError(error.message);
    } finally {
      // setLoading(false);
    }
  };

  const handleLocationNameChange = async (value) => {
    setData((prevData) => ({ ...prevData, LocationName: value.slice(0, 100) }));
    if (value === "") {
      return;
    }
    var ob = {
      table: "Location",
      name: value.trim(),
      id: id ? id : "0",
    };
    console.log(ob);
    const resp = await CheckBoxDuplicateRecord(ob);
    console.log(resp);
    if (resp.status === 200) {
      setDisabledBtn(false);
      if (value.trim().length > 100) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          LocationName: "Location Name length should be 100 digits.",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          LocationName: "",
        }));
      }
    } else if (resp.status === 400) {
      setDisabledBtn(true);
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        LocationName: resp.data.Errors[0].Message,
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

  const handleAddLine2Change = (value) => {
    if (value.trim().length > 200) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        AddLine2: "Address must not be greater than 200 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, AddLine2: "" }));
    }
    setData((prevData) => ({ ...prevData, AddLine2: value.slice(0, 200) }));
  };

  const handleAddLine1Change = (value) => {
    if (value.trim().length > 200) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        AddLine1: "Address must not be greater than 200 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, AddLine1: "" }));
    }
    setData((prevData) => ({ ...prevData, AddLine1: value.slice(0, 200) }));
  };

  const handlePincodeChange = (value) => {
    if (/^\d*$/.test(value)) {
      if (value.trim().length > 6) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Pincode: "Pincode must not be greater than 6 characters.",
        }));
      } else {
        setValidationErrors((prevErrors) => ({ ...prevErrors, Pincode: "" }));
      }
      setData((prevData) => ({ ...prevData, Pincode: value.slice(0, 6) }));
    }
  };

  const handlePANChange = (value) => {
    if (value.trim().length > 10) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        PAN: "PAN must not be greater than 10 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, PAN: "" }));
    }
    setData((prevData) => ({ ...prevData, PAN: value.slice(0, 10) }));
  };

  const handleGSTINChange = (value) => {
    if (value.trim().length > 15) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        GSTIN: "GSTIN must not be greater than 15 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, GSTIN: "" }));
    }
    setData((prevData) => ({ ...prevData, GSTIN: value.slice(0, 15) }));
  };

  const handlePFNumberChange = (value) => {
    if (value.trim().length > 15) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        PFNumber: "PFNumber must not be greater than 15 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, PFNumber: "" }));
    }
    setData((prevData) => ({ ...prevData, PFNumber: value.slice(0, 15) }));
  };

  const handlePFPasswordChange = (value) => {
    if (value.trim().length > 50) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        PFPassword: "PF Password length should be 50 digits.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        PFPassword: "",
      }));
    }
    setData((prevData) => ({ ...prevData, PFPassword: value.slice(0, 50) }));
  };

  const handlePFMobileNoChange = (value) => {
    if (/^\d*$/.test(value)) {
      if (value.trim().length > 10) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          PFMobileNo: "ESIC Mobile Number length should be 10 digits.",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          PFMobileNo: "",
        }));
      }
      setData((prevData) => ({
        ...prevData,
        PFMobileNo: value.slice(0, 10),
      }));
    }
  };

  const handlePFUsernameChange = (value) => {
    if (value.trim().length > 50) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        PFUsername: "PF User Name length should be 50 digits.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, PFUsername: "" }));
    }
    setData((prevData) => ({ ...prevData, PFUsername: value.slice(0, 50) }));
    // setValidationErrors((prevErrors) => ({ ...prevErrors, PFUsername: '' }));
  };

  const handlePFEmailIDChange = (value) => {
    if (value.trim().length > 50) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        PFEmailID: "PF Email ID length should be 50 digits.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, PFEmailID: "" }));
    }
    setData((prevData) => ({ ...prevData, PFEmailID: value.slice(0, 50) }));
    // setValidationErrors((prevErrors) => ({ ...prevErrors, PFEmailID: '' }));
  };

  const handleESICNumberChange = (value) => {
    if (/^\d*$/.test(value)) {
      if (value.trim().length > 17) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          ESICNumber: "ESIC No. should be of 17 digits.",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          ESICNumber: "",
        }));
      }
      setData((prevData) => ({ ...prevData, ESICNumber: value.slice(0, 17) }));
    }
  };

  const handleESICPasswordChange = (value) => {
    if (value.trim().length > 50) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        ESICPassword: "ESIC Password length should be 50 digits.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        ESICPassword: "",
      }));
    }
    setData((prevData) => ({ ...prevData, ESICPassword: value.slice(0, 50) }));
  };
  const handleESICMobileNoChange = (value) => {
    if (/^\d*$/.test(value)) {
      if (value.trim().length > 10) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          ESICMobileNo: "ESIC Mobile Number length should be 10 digits.",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          ESICMobileNo: "",
        }));
      }
      setData((prevData) => ({
        ...prevData,
        ESICMobileNo: value.slice(0, 10),
      }));
      // setValidationErrors((prevErrors) => ({ ...prevErrors, ESICMobileNo: '' }));
    }
  };
  const handleESICUsernameChange = (value) => {
    if (value.trim().length > 50) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        ESICUsername: "ESIC User Name length should be 50 digits.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        ESICUsername: "",
      }));
    }
    setData((prevData) => ({ ...prevData, ESICUsername: value.slice(0, 50) }));
    // setValidationErrors((prevErrors) => ({ ...prevErrors, ESICUsername: '' }));
  };
  const handleESICEmailIDChange = (value) => {
    if (value.trim().length > 50) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        ESICEmailID: "ESIC Email ID length should be 50 digits.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, ESICEmailID: "" }));
    }
    setData((prevData) => ({ ...prevData, ESICEmailID: value.slice(0, 50) }));
    // setValidationErrors((prevErrors) => ({ ...prevErrors, ESICEmailID: '' }));
  };

  const handlePTNumberChange = (value) => {
    if (value.trim().length > 15) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        PTNumber:
          "Professional Tax Registration Number length should be 15 digits.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, PTNumber: "" }));
    }
    setData((prevData) => ({ ...prevData, PTNumber: value.slice(0, 15) }));
    // setValidationErrors((prevErrors) => ({ ...prevErrors, PTNumber: '' }));
  };
  const handlePTEmployerNoChange = (value) => {
    if (value.trim().length > 15) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        PTEmployerNo: "PT Employer No length should be 15 digits.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        PTEmployerNo: "",
      }));
    }
    setData((prevData) => ({ ...prevData, PTEmployerNo: value.slice(0, 15) }));
    // setValidationErrors((prevErrors) => ({ ...prevErrors, PTEmployerNo: '' }));
  };
  const handlePTEmployeeNoChange = (value) => {
    if (value.trim().length > 15) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        PTEmployeeNo: "PT Employee No length should be 15 digits.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        PTEmployeeNo: "",
      }));
    }
    setData((prevData) => ({ ...prevData, PTEmployeeNo: value.slice(0, 15) }));
    // setValidationErrors((prevErrors) => ({ ...prevErrors, PTEmployeeNo: '' }));
  };

  const handleFactoryLicenseNoChange = (value) => {
    if (value.trim().length > 15) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        FactoryLicenseNo: "Factory License No length should be 15 digits.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        FactoryLicenseNo: "",
      }));
    }
    setData((prevData) => ({
      ...prevData,
      FactoryLicenseNo: value.slice(0, 15),
    }));
    // setValidationErrors((prevErrors) => ({ ...prevErrors, FactoryLicenseNo: '' }));
  };

  const handleStartDate = (date) => {
    if (!date) return;
    console.log(date);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because getMonth() returns zero-based index
    const day = date.getDate().toString().padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      StartDate: "", // Clear the error message
    }));

    setData((prevData) => ({
      ...prevData,
      StartDate: formattedDate,
    }));
  };

  const handleEndDate = (date) => {
    if (!date) return;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because getMonth() returns zero-based index
    const day = date.getDate().toString().padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      EndDate: "", // Clear the error message
    }));
    setData((prevData) => ({
      ...prevData,
      EndDate: formattedDate,
    }));
  };

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

  const [readOnly, setReadOnly] = useState(false);
  const [ClientLocationList, setClientLocationList] = useState([]);
  const [ClientLocationOption, setClientLocationOption] = useState([]);

  useEffect(() => {
    AddLocationData();
  }, []);

  const AddLocationData = async () => {
    setShowLoad(true);
    try {
      const res = await Client_Location_get(1);
      if (res.status === 200) {
        const LocationData = res.data.ClientLocation;
        console.log(LocationData);
        setClientLocationList(LocationData);

        if (Array.isArray(LocationData)) {
          const newOptions1 = LocationData
            // .filter((item) => item.IsActive === true)
            .map((item) => ({
              // LocationID: item.LocationID,
              label: item.LocationName,
              value: item.LocationID,
              PFNumber: item.PFNumber,
            }));
          // console.log(newOptions1)
          setClientLocationOption(newOptions1);
        } else {
          console.error("State data is not an array:", data);
        }
      } else if (res.status === 400) {
        handleExceptionError(res.data.ErrorMessage);
      } else if (res.status === 401) {
        handleExceptionError("Unauthorized");
        setShowLoad(false);
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
      } else if (res.status === 500) {
        handleExceptionError(res.data.errorMessage);
        setShowLoad(false);
      }
    } catch (error) {
      handleExceptionError(error.message);
    }
  };
  const [SelectedClientLocationPF, setSelectedClientLocationPF] = useState([]);
  const [SelectedClientLocationESIC, setSelectedClientLocationESIC] = useState(
    []
  );
  const [SelectedClientLocationPT, setSelectedClientLocationPT] = useState([]);
  const [SelectedClientLocationFactory, setSelectedClientLocationFactory] =
    useState([]);

  // const [selectLocationName, setselectLocationName] = useState({})

  const handleLocationPF = async (event) => {
    // setReadOnly(true)
    const selected = event.target.value;
    console.log(selected);

    const selectedLocation = ClientLocationList.find(
      (location) => location.LocationID === Number(selected)
    );
    if (selectedLocation) {
      const updatedPFValues = ClientLocationList.filter(
        (location) => location.LocationID === Number(selected)
      ).map((location) => ({
        PFNumber: location.PFNumber,
        PFMobileNo: location.PFMobileNo,
        PFUsername: location.PFUsername,
        PFPassword: decryption(location.PFPassword),
        PFEmailID: decryption(location.PFEmailID),
      }))[0];

      setData((prevData) => ({
        ...prevData,
        ...updatedPFValues,
      }));
    }
    setSelectedClientLocationPF([selected]);
  };

  const handleLocationESIC = async (event) => {
    setReadOnly(true);
    const selected = event.target.value;
    console.log(selected);

    const selectedLocation = ClientLocationList.find(
      (location) => location.LocationID === Number(selected)
    );
    if (selectedLocation) {
      const updatedPFValues = ClientLocationList.filter(
        (location) => location.LocationID === Number(selected)
      ).map((location) => ({
        ESICUsername: location.ESICUsername,
        ESICNumber: location.ESICNumber,
        ESICMobileNo: location.ESICMobileNo,
        ESICPassword: decryption(location.ESICPassword),
        ESICEmailID: decryption(location.ESICEmailID),
      }))[0];

      setData((prevData) => ({
        ...prevData,
        ...updatedPFValues,
      }));
    }
    setSelectedClientLocationESIC([selected]);
  };
  const handleLocationPT = async (event) => {
    setReadOnly(true);
    const selected = event.target.value;
    console.log(selected);

    const selectedLocation = ClientLocationList.find(
      (location) => location.LocationID === Number(selected)
    );
    if (selectedLocation) {
      const updatedPFValues = ClientLocationList.filter(
        (location) => location.LocationID === Number(selected)
      ).map((location) => ({
        PTNumber: location.PTNumber,
        PTEmployeeNo: location.PTEmployeeNo,
        PTEmployerNo: location.PTEmployerNo,
      }))[0];

      setData((prevData) => ({
        ...prevData,
        ...updatedPFValues,
      }));
    }
    setSelectedClientLocationPT([selected]);
  };
  const handleLocationFactory = async (event) => {
    setReadOnly(true);
    const selected = event.target.value;
    console.log(selected);

    const selectedLocation = ClientLocationList.find(
      (location) => location.LocationID === Number(selected)
    );
    if (selectedLocation) {
      const updatedPFValues = ClientLocationList.filter(
        (location) => location.LocationID === Number(selected)
      ).map((location) => ({
        FactoryLicenseNo: location.FactoryLicenseNo,
        StartDate: location.StartDate,
        EndDate: location.EndDate,
      }))[0];

      setData((prevData) => ({
        ...prevData,
        ...updatedPFValues,
      }));
    }
    setSelectedClientLocationFactory([selected]);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const NumberValidation =
        /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
      const PincodeValidation = /^([0-9]{6})$/;
      const PANValidation = /^([A-Z]{5}[0-9]{4}[A-Z]{1})$/;
      const GSTValidation =
        /^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1})$/;
      const ESICValidation = /^\d{17}$/;
      const errors = {};

      if (data.LocationName.trim() === "") {
        errors.LocationName = "Office/Location Name is required.";
      }
      if (data.AddLine2.trim() === "") {
        errors.AddLine2 = "Registered Address Line 2 is required.";
      }
      if (data.CityID === 0 || data.CityID === "") {
        errors.CityID = "City password is required.";
      }
      if (data.AddLine1.trim() === "") {
        errors.AddLine1 = "Registered Address Line 1 is required.";
      }
      if (data.StateID === 0 || data.StateID === "") {
        errors.StateID = "State is required.";
      }
      if (data.Pincode.trim() === "") {
        errors.Pincode = "Invalid pincode number.";
      }
      if (data.Pincode) {
        if (!PincodeValidation.test(data.Pincode)) {
          errors.Pincode = "Invalid pincode number.";
        }
      }

      if (data.PAN.trim() === "") {
        errors.PAN = "PAN Number is required.";
      }

      if (data.PAN) {
        if (!PANValidation.test(data.PAN)) {
          errors.PAN = "Invalid PAN format.";
        }
      }

      if (data.IsGSTApplicable) {
        if (data.GSTIN.trim() === "") {
          errors.GSTIN = "GSTIN is required.";
        }
      }
      if (data.IsGSTApplicable) {
        if (data.GSTIN) {
          if (!GSTValidation.test(data.GSTIN)) {
            errors.GSTIN = "Invalid GSTIN format.";
          }
        }
      }

      if (data.IsPFApplicable) {
        if (data.PFNumber.trim() === "") {
          errors.PFNumber = "PF Number is required.";
        }
        if (data.PFPassword.trim() === "") {
          errors.PFPassword = "PF Password is required.";
        }
        if (data.PFMobileNo.trim() === "") {
          errors.PFMobileNo = "PF Mobile number is required.";
        }
        if (data.PFMobileNo) {
          if (!NumberValidation.test(data.PFMobileNo)) {
            errors.PFMobileNo = "Invalid PF mobile number.";
          }
        }
        if (data.PFUsername.trim() === "") {
          errors.PFUsername = "PF Username is required.";
        }
        if (data.PFEmailID) {
          const email_pattern = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
          if (!email_pattern.test(data.PFEmailID)) {
            errors.PFEmailID = "Invalid email format";
          }
        }
        if (data.PFEmailID.trim() === "") {
          errors.PFEmailID = "PF Email ID is required.";
        }
        if (data.IsESICApplicable) {
          if (data.ESICNumber.trim() === "") {
            errors.ESICNumber = "ESIC Number is required.";
          }
          if (data.ESICNumber && !ESICValidation.test(data.ESICNumber)) {
            errors.ESICNumber = "Invalid ESIC Number format";
          }
          if (data.ESICPassword.trim() === "") {
            errors.ESICPassword = "ESIC Password is required.";
          }

          if (data.ESICMobileNo.trim() === "") {
            errors.ESICMobileNo = "ESIC Mobile number is required.";
          }
          if (data.ESICMobileNo) {
            if (!NumberValidation.test(data.ESICMobileNo)) {
              errors.ESICMobileNo = "Invalid ESIC mobile number.";
            }
          }
          if (data.ESICUsername.trim() === "") {
            errors.ESICUsername = "ESIC Username is required.";
          }
          if (data.ESICEmailID) {
            const email_pattern = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
            if (!email_pattern.test(data.ESICEmailID)) {
              errors.ESICEmailID = "Invalid email format";
              console.log("fff");
            }
          }
          if (data.ESICEmailID.trim() === "") {
            errors.ESICEmailID = "ESIC Email ID is required.";
          }
        }

        if (data.IsPTApplicable) {
          if (data.PTNumber.trim() === "") {
            errors.PTNumber =
              "Professional Tax Registration Number is required.";
          }
          if (data.PTEmployerNo.trim() === "") {
            errors.PTEmployerNo = "PT Employer No is required.";
          }
          if (data.PTEmployeeNo.trim() === "") {
            errors.PTEmployeeNo = "PT Employee No is required.";
          }
        }
        if (data.IsFactoryLicenseApplicable) {
          if (data.FactoryLicenseNo.trim() === "") {
            errors.FactoryLicenseNo = "Factory License No is required.";
          }
          if (data.EndDate.trim() === "") {
            errors.EndDate = "End Date is required.";
          }
          if (data.StartDate.trim() === "") {
            errors.StartDate = "Start Date is required.";
          }
        }
      }
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
      setValidationErrors({});
      console.log(data);
      if (ClientID) {
        setSpinLoad(true);
        const res = await ClientLocation_edit(ClientID, id, data);
        console.log(id);
        if (res.status == 200) {
          console.log(res);
          handleExceptionSuccessMessages(res.data);
          handleFormReset();
          setSpinLoad(false);
          setTimeout(function () {
            navigate("/client-location-list");
          }, 1000);
        } else if (res.status === 201) {
          var dataError = res.data.Errors;
          dataError.map((message, index) => {
            handleExceptionError(message.Message);
            setSpinLoad(false);
          });
        } else if (res.status === 400) {
          if (res.data.ErrorCode) {
            const validationErrorMessage = res.data.ErrorMessage;
            const errorMessagesArray = validationErrorMessage.split(", ");

            errorMessagesArray.forEach((errorMessage) => {
              const [, fieldName, errorMessageText] =
                errorMessage.match(/\"(.*?)\" (.*)/);
              handleExceptionError(`${fieldName} - ${errorMessageText}`);
              setSpinLoad(false);
            });
          }
          if (res.data.Message) {
            handleExceptionError(res.data.Message);
            setSpinLoad(false);
          }
        } else if (res.status === 401) {
          handleExceptionError("Unauthorized");
          setSpinLoad(false);
          setTimeout(() => {
            localStorage.clear();
            navigate("/");
          }, 1000);
          ///logout();
        } else if (res.status === 500) {
          handleExceptionError(res.statusText);
          setSpinLoad(false);
        }
      } else {
        setSpinLoad(true);
        const res = await Add_Client_Location(1, data);
        console.log(data);
        if (res.status === 200) {
          handleExceptionSuccessMessages(res.data);
          handleFormReset();
          setSpinLoad(false);
          if (buttonClicked == "submit") {
            setTimeout(function () {
              navigate("/client-location-list");
            }, 1000);
          }
        } else if (res.status === 201) {
          var dataError = res.data.Errors;
          dataError.map((message, index) => {
            handleExceptionError(message.Message);
            setSpinLoad(false);
          });
        } else if (res.status === 400) {
          if (res.data.ErrorCode) {
            const validationErrorMessage = res.data.ErrorMessage;
            const errorMessagesArray = validationErrorMessage.split(", ");

            errorMessagesArray.forEach((errorMessage) => {
              const [, fieldName, errorMessageText] =
                errorMessage.match(/\"(.*?)\" (.*)/);
              handleExceptionError(`${fieldName} - ${errorMessageText}`);
              setSpinLoad(false);
            });
          }
          if (res.data.Message) {
            handleExceptionError(res.data.Message);
            setSpinLoad(false);
          }
        } else if (res.status === 401) {
          handleExceptionError("Unauthorized");
          setSpinLoad(false);
          setTimeout(() => {
            localStorage.clear();
            navigate("/");
          }, 1000);
          ///logout();
        } else if (res.status === 500) {
          handleExceptionError(res.statusText);
          setSpinLoad(false);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function handleExceptionSuccessMessages(resp) {
    setSuccessMessages((successMessages) => [
      ...successMessages,
      { id: Date.now(), message: resp },
    ]);
  }
  function handleExceptionError(res) {
    setExceptionError((ExceptionError) => [
      ...ExceptionError,
      { id: Date.now(), message: res },
    ]);
  }

  const handleFormReset = () => {
    setData({
      LocationName: "",
      AddLine2: "",
      CityID: "",
      AddLine1: "",
      StateID: "",
      Pincode: "",

      PAN: "",
      IsGSTApplicable: true,
      GSTIN: "",
      IsPFApplicable: true,
      IsPFDuplicate: false,
      PFNumber: "",
      PFPassword: "",
      PFMobileNo: "",
      PFUsername: "",
      PFEmailID: "",

      IsESICApplicable: true,
      IsESICDuplicate: false,
      ESICNumber: "",
      ESICPassword: "",
      ESICMobileNo: "",
      ESICUsername: "",
      ESICEmailID: "",

      IsPTApplicable: true,
      IsPTDuplicate: false,
      PTNumber: "",
      PTEmployerNo: "",
      PTEmployeeNo: "",

      IsFactoryLicenseApplicable: true,
      IsFactoryDuplicate: false,
      FactoryLicenseNo: "",
      EndDate: "",
      StartDate: "",
    });
    setValidationErrors({
      LocationName: "",
      AddLine2: "",
      CityID: "",
      AddLine1: "",
      StateID: "",
      Pincode: "",

      PAN: "",
      IsGSTApplicable: "",
      GSTIN: "",
      IsPFApplicable: "",
      IsPFDuplicate: "",
      PFNumber: "",
      PFPassword: "",
      PFMobileNo: "",
      PFUsername: "",
      PFEmailID: "",

      IsESICApplicable: "",
      IsESICDuplicate: "",
      ESICNumber: "",
      ESICPassword: "",
      ESICMobileNo: "",
      ESICUsername: "",
      ESICEmailID: "",

      IsPTApplicable: "",
      IsPTDuplicate: "",
      PTNumber: "",
      PTEmployerNo: "",
      PTEmployeeNo: "",

      IsFactoryLicenseApplicable: "",
      IsFactoryDuplicate: "",
      FactoryLicenseNo: "",
      EndDate: "",
      StartDate: "",
    });
  };

  const [stateOption, setstateoption] = useState([]);
  const [cityOption, setCityOption] = useState([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await State_get();
        if (res.status === 200) {
          const data = res.data.data;
          if (Array.isArray(data)) {
            const newOptions1 = data
              .filter((item) => item.IsActive === true)
              .map((item) => ({
                id: item.StateID,
                name: item.StateName,
                countryId: item.CountryID,
              }));
            setstateoption(newOptions1);
          } else {
            console.error("State data is not an array:", data);
          }
        } else if (res.status === 401) {
          handleExceptionError("Unauthorized");
          setTimeout(() => {
            localStorage.clear();
            navigate("/");
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  const handleStateIDChange = async (stateId, value) => {
    console.log(stateId);
    try {
      const res = await City_get(value.id);
      if (res.status === 200) {
        const data = res.data.data;
        if (Array.isArray(data)) {
          const newOptions1 = data
            .filter((item) => item.IsActive === true)
            .map((item) => ({
              id: item.CityID,
              name: item.CityName,
              stateId: item.StateID,
            }));
          setCityOption(newOptions1);
        } else {
          console.error("City data is not an array:", data);
        }
      } else if (res.status === 401) {
        handleExceptionError("Unauthorized");
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }

    setValidationErrors((prevErrors) => ({ ...prevErrors, StateID: "" }));
    setData((prevData) => ({
      ...prevData,
      StateID: value ? value.id : "",
    }));
  };

  const handleSelectChange2 = (value, cityId) => {
    console.log(cityId);
    setValidationErrors((prevErrors) => ({ ...prevErrors, CityID: "" }));
    setData((prevData) => ({
      ...prevData,
      CityID: value ? cityId.id : "",
    }));
  };
 <ErrorSnackbar
        errorMessages={ExceptionError}
        onClearErrors={clearErrors}
      />
  return (
    <Dashboard title={id === undefined ? "Add Location" : "Edit Location"}>
      <Helmet>
        <title>
          {id === undefined ? "Add Location" : "Edit Location"} | J mehta
        </title>
      </Helmet>
     
      <SuccessSnackbar
        successMessages={successMessages}
        onclearSuccess={clearSuccess}
      />
      {showLoad ? (
        <Load />
      ) : (
        <>
          {ClientAccess ? (
            <div>
              <div className="new_client_title mb-3">
                <Link to="/client-location-list">
                  <button>
                    <AiFillCloseCircle /> Close
                  </button>
                </Link>
              </div>
              <hr className="mb-4"></hr>
              <div>
                <form onSubmit={handleSubmit} onReset={handleFormReset}>
                  <>
                    <div className="new_client_form" id="tab1">
                      <div className="new_client_part_1">
                        <Input2
                          placeholder="Enter Your PAN Number"
                          label="PAN"
                          value={data.PAN}
                          onChange={(e) => handlePANChange(e)}
                          required
                          autoFocus
                        />
                        {validationErrors.PAN && (
                          <div className="error">{validationErrors.PAN}</div>
                        )}
                      </div>
                      <div className="new_client_part_1">
                        <Input2
                          placeholder="Enter Here"
                          label="Office/Location Name"
                          value={data.LocationName}
                          onChange={(e) => handleLocationNameChange(e)}
                          required
                        />
                        {validationErrors.LocationName && (
                          <div className="error">
                            {validationErrors.LocationName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="new_client_form" id="tab1">
                      <div className="new_client_part_1">
                        <Input2
                          placeholder="Enter Here"
                          label="Registered Address Line 1"
                          value={data.AddLine1}
                          onChange={(e) => handleAddLine1Change(e)}
                          required
                        />
                        {validationErrors.AddLine1 && (
                          <div className="error">
                            {validationErrors.AddLine1}
                          </div>
                        )}
                      </div>
                      <div className="new_client_part_1">
                        <Input2
                          placeholder="Enter Here"
                          label="Registered Address Line 2"
                          value={data.AddLine2}
                          onChange={(e) => handleAddLine2Change(e)}
                          required
                        />
                        {validationErrors.AddLine2 && (
                          <div className="error">
                            {validationErrors.AddLine2}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="new_client_form" id="tab1">
                      <div className="new_client_part_1">
                        <div class="dashboard_input_feild">
                          <h3 className="my-2">
                            State/UT <span style={{ color: "red" }}>*</span>
                          </h3>
                          <Autocomplete
                            className="mt-0 border-0"
                            options={stateOption}
                            value={
                              data.StateID
                                ? stateOption.find(
                                    (option) => option.id == data.StateID
                                  ) || null
                                : null
                            }
                            onChange={handleStateIDChange}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select State/UT"
                                variant="outlined"
                                InputLabelProps={{
                                  className: "custom-label",
                                }}
                              />
                            )}
                          />
                          {validationErrors.StateID && (
                            <div className="error mt-1">
                              {validationErrors.StateID}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="new_client_part_1">
                        <div class="dashboard_input_feild">
                          <h3 className="my-2">
                            City<span style={{ color: "red" }}>*</span>
                          </h3>
                          <Autocomplete
                            className="mt-0 border-0"
                            options={cityOption}
                            value={
                              data.CityID
                                ? cityOption.find(
                                    (option) => option.id == data.CityID
                                  ) || null
                                : null
                            }
                            onChange={handleSelectChange2}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select City"
                                variant="outlined"
                                InputLabelProps={{
                                  className: "custom-label",
                                }}
                              />
                            )}
                          />
                          {validationErrors.CityID && (
                            <div className="error mt-1">
                              {validationErrors.CityID}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="new_client_form" id="tab1">
                      <div className="new_client_part_1">
                        <Input2
                          placeholder="Enter Here"
                          label="Pincode"
                          value={data.Pincode}
                          onChange={(e) => handlePincodeChange(e)}
                          required
                        />
                        {validationErrors.Pincode && (
                          <div className="error">
                            {validationErrors.Pincode}
                          </div>
                        )}
                      </div>
                      <div className="new_client_part_1 mt-2">
                        <div className="toggle_switch_btn gst">
                          <h3>
                            Is GST Applicable?
                            {data.IsGSTApplicable && (
                              <span style={{ color: "red" }}>*</span>
                            )}
                          </h3>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={data.IsGSTApplicable}
                              onChange={() => {
                                const newValue = !data.IsGSTApplicable;
                                setData((prevData) => ({
                                  ...prevData,
                                  IsGSTApplicable: newValue,
                                }));
                                setValidationErrors((prevErrors) => ({
                                  ...prevErrors,
                                  GSTIN: "",
                                }));
                              }}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                        <Input2
                          placeholder="Enter Your GST Number"
                          disabled={!data.IsGSTApplicable}
                          style={{ opacity: data.IsGSTApplicable ? 1 : 0.5 }}
                          value={data.IsGSTApplicable ? data.GSTIN : ""}
                          onChange={(e) => handleGSTINChange(e)}
                        />
                        {validationErrors.GSTIN && (
                          <div className="error">{validationErrors.GSTIN}</div>
                        )}
                      </div>
                    </div>
                    <hr />

                    <>
                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <div className="toggle_switch_btn">
                            <h3>
                              Is PF Applicable?
                              <span style={{ color: "red" }}>*</span>
                            </h3>
                            <label class="switch">
                              <input
                                type="checkbox"
                                checked={data.IsPFApplicable}
                                onChange={() => {
                                  const newValue = !data.IsPFApplicable;
                                  // setData(prevData => ({ ...prevData, IsPFApplicable: newValue }));

                                  if (data.IsPFApplicable) {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsPFDuplicate: false,
                                    }));
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsPFApplicable: newValue,
                                    }));
                                  } else {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsPFApplicable: newValue,
                                    }));
                                  }

                                  setValidationErrors((prevErrors) => ({
                                    ...prevErrors,
                                    PFNumber: "",
                                    PFPassword: "",
                                    PFMobileNo: "",
                                    PFUsername: "",
                                    PFEmailID: "",
                                  }));
                                }}
                              />
                              <span class="slider round"></span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <div className="toggle_switch_btn">
                            <h3>
                              Existing Location Available?
                              <span style={{ color: "red" }}>*</span>
                            </h3>
                            <label class="switch">
                              <input
                                type="checkbox"
                                checked={data.IsPFDuplicate} // Set to data.IsPFDuplicate if data.IsPFApplicable is true, otherwise false
                                onChange={() => {
                                  const newValue = !data.IsPFDuplicate;
                                  if (!data.IsPFApplicable) {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsPFDuplicate: false,
                                    }));
                                  } else {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsPFDuplicate: newValue,
                                    }));
                                  }
                                }}
                              />
                              <span class="slider round"></span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {data.IsPFDuplicate ? (
                        <div className="new_client_form mb-2" id="tab2">
                          <div className="new_client_part_1">
                            <select
                              className="py-0 me_height"
                              value={SelectedClientLocationPF}
                              selectedOptions={SelectedClientLocationPF}
                              onChange={handleLocationPF}
                            >
                              <option value="">Select Location</option>
                              {ClientLocationOption.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}

                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <Input2
                            placeholder="Enter Here"
                            label="PF Number"
                            disabled={
                              data.IsPFDuplicate || !data.IsPFApplicable
                            }
                            required={data.IsPFApplicable}
                            style={{ opacity: data.IsPFApplicable ? 1 : 0.5 }}
                            value={
                              data.IsPFApplicable || data.IsPFDuplicate
                                ? data.PFNumber
                                : ""
                            }
                            readOnly={readOnly}
                            // value={selectLocationName.PFNumber}
                            onChange={(e) => handlePFNumberChange(e)}
                          />
                          {validationErrors.PFNumber && (
                            <div className="error">
                              {validationErrors.PFNumber}
                            </div>
                          )}
                        </div>
                        <div className="new_client_part_1">
                          <Input2
                            placeholder="Enter Here"
                            label="PF Username"
                            required={data.IsPFApplicable}
                            // disabled={!data.IsPFApplicable}
                            disabled={
                              data.IsPFDuplicate || !data.IsPFApplicable
                            }
                            style={{ opacity: data.IsPFApplicable ? 1 : 0.5 }}
                            value={
                              data.IsPFApplicable || data.IsPFDuplicate
                                ? data.PFUsername
                                : ""
                            }
                            // value={data.IsPFApplicable ? data.PFUsername : ''}
                            onChange={(e) => handlePFUsernameChange(e)}
                            readOnly={readOnly}
                          />

                          {validationErrors.PFUsername && (
                            <div className="error">
                              {validationErrors.PFUsername}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1 show-hide">
                          <Input2
                            placeholder="Enter Here"
                            label="PF Password"
                            disabled={
                              data.IsPFDuplicate || !data.IsPFApplicable
                            }
                            required={data.IsPFApplicable}
                            type="password"
                            style={{ opacity: data.IsPFApplicable ? 1 : 0.5 }}
                            value={
                              data.IsPFApplicable || data.IsPFDuplicate
                                ? data.PFPassword
                                : ""
                            }
                            onChange={(e) => handlePFPasswordChange(e)}
                            showPassword={
                              data.IsPFApplicable ? showPassword2 : "d-none"
                            } // Pass showPassword state to Input2
                            togglePasswordVisibility={togglePasswordVisibility2}
                          />
                          {validationErrors.PFPassword && (
                            <div className="error">
                              {validationErrors.PFPassword}
                            </div>
                          )}
                        </div>
                        <div className="new_client_part_1">
                          <Input2
                            placeholder="Enter Here"
                            label="PF Email ID"
                            disabled={
                              data.IsPFDuplicate || !data.IsPFApplicable
                            }
                            style={{ opacity: data.IsPFApplicable ? 1 : 0.5 }}
                            required={data.IsPFApplicable}
                            value={
                              data.IsPFApplicable || data.IsPFDuplicate
                                ? data.PFEmailID
                                : ""
                            }
                            // value={data.IsPFApplicable ? data.PFEmailID : ''}
                            onChange={(e) => handlePFEmailIDChange(e)}
                          />
                          {validationErrors.PFEmailID && (
                            <div className="error">
                              {validationErrors.PFEmailID}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <Input2
                            placeholder="Enter Here"
                            label="PF Mobile No."
                            disabled={
                              data.IsPFDuplicate || !data.IsPFApplicable
                            }
                            required={data.IsPFApplicable}
                            style={{ opacity: data.IsPFApplicable ? 1 : 0.5 }}
                            value={
                              data.IsPFApplicable || data.IsPFDuplicate
                                ? data.PFMobileNo
                                : ""
                            }
                            // value={data.IsPFApplicable ? data.PFMobileNo : ''}
                            onChange={(e) => handlePFMobileNoChange(e)}
                          />
                          {validationErrors.PFMobileNo && (
                            <div className="error">
                              {validationErrors.PFMobileNo}
                            </div>
                          )}
                        </div>
                        <div className="new_client_part_1"></div>
                      </div>
                    </>

                    <hr />
                    <>
                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <div className="toggle_switch_btn">
                            <h3>
                              Is ESIC Applicable?
                              <span style={{ color: "red" }}>*</span>
                            </h3>
                            <label class="switch">
                              <input
                                type="checkbox"
                                checked={data.IsESICApplicable}
                                onChange={() => {
                                  const newValue = !data.IsESICApplicable;
                                  // setData(prevData => ({ ...prevData, IsESICApplicable: newValue }));

                                  if (data.IsESICApplicable) {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsESICDuplicate: false,
                                    }));
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsESICApplicable: newValue,
                                    }));
                                  } else {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsESICApplicable: newValue,
                                    }));
                                  }

                                  setValidationErrors((prevErrors) => ({
                                    ...prevErrors,
                                    ESICNumber: "",
                                    ESICPassword: "",
                                    ESICMobileNo: "",
                                    ESICUsername: "",
                                    ESICEmailID: "",
                                  }));
                                }}
                              />
                              <span class="slider round"></span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <div className="toggle_switch_btn">
                            <h3>
                              Existing Location Available?
                              <span style={{ color: "red" }}>*</span>
                            </h3>
                            <label class="switch">
                              <input
                                type="checkbox"
                                checked={data.IsESICDuplicate} // Set to data.IsPFDuplicate if data.IsPFApplicable is true, otherwise false
                                onChange={() => {
                                  const newValue = !data.IsESICDuplicate;
                                  if (!data.IsESICApplicable) {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsESICDuplicate: false,
                                    }));
                                  } else {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsESICDuplicate: newValue,
                                    }));
                                  }
                                }}
                              />
                              <span class="slider round"></span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {data.IsESICDuplicate ? (
                        <div className="new_client_form mb-2" id="tab2">
                          <div className="new_client_part_1">
                            <select
                              className="py-0 me_height"
                              value={SelectedClientLocationESIC}
                              selectedOptions={SelectedClientLocationESIC}
                              onChange={handleLocationESIC}
                            >
                              <option value="">Select Location</option>
                              {ClientLocationOption.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}

                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <Input2
                            placeholder="Enter Here"
                            label="ESIC Number"
                            disabled={
                              data.IsESICDuplicate || !data.IsESICApplicable
                            }
                            style={{ opacity: data.IsESICApplicable ? 1 : 0.5 }}
                            required={data.IsESICApplicable}
                            value={
                              data.IsESICApplicable || data.IsESICDuplicate
                                ? data.ESICNumber
                                : ""
                            }
                            // value={data.IsESICApplicable ? data.ESICNumber : ''}
                            onChange={(e) => handleESICNumberChange(e)}
                          />
                          {validationErrors.ESICNumber && (
                            <div className="error">
                              {validationErrors.ESICNumber}
                            </div>
                          )}
                        </div>
                        <div className="new_client_part_1">
                          <Input2
                            placeholder="Enter Here"
                            label="ESIC Username"
                            disabled={
                              data.IsESICDuplicate || !data.IsESICApplicable
                            }
                            style={{ opacity: data.IsESICApplicable ? 1 : 0.5 }}
                            required={data.IsESICApplicable}
                            value={
                              data.IsESICApplicable || data.IsESICDuplicate
                                ? data.ESICUsername
                                : ""
                            }
                            // value={data.IsESICApplicable ? data.ESICUsername : ''}
                            onChange={(e) => handleESICUsernameChange(e)}
                          />
                          {validationErrors.ESICUsername && (
                            <div className="error">
                              {validationErrors.ESICUsername}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1 show-hide">
                          <Input2
                            placeholder="Enter Here"
                            label="ESIC Password"
                            disabled={
                              data.IsESICDuplicate || !data.IsESICApplicable
                            }
                            style={{ opacity: data.IsESICApplicable ? 1 : 0.5 }}
                            required={data.IsESICApplicable}
                            type="password"
                            value={
                              data.IsESICApplicable || data.IsESICDuplicate
                                ? data.ESICPassword
                                : ""
                            }
                            onChange={(e) => handleESICPasswordChange(e)}
                            showPassword={
                              data.IsESICApplicable ? showPassword : "d-none"
                            } // Pass showPassword state to Input2
                            togglePasswordVisibility={togglePasswordVisibility}
                          />
                          {validationErrors.ESICPassword && (
                            <div className="error">
                              {validationErrors.ESICPassword}
                            </div>
                          )}
                        </div>
                        <div className="new_client_part_1 show-hide">
                          <Input2
                            placeholder="Enter Here"
                            label="ESIC Email ID"
                            disabled={
                              data.IsESICDuplicate || !data.IsESICApplicable
                            }
                            style={{ opacity: data.IsESICApplicable ? 1 : 0.5 }}
                            required={data.IsESICApplicable}
                            value={
                              data.IsESICApplicable || data.IsESICDuplicate
                                ? data.ESICEmailID
                                : ""
                            }
                            // value={data.IsESICApplicable ? data.ESICEmailID : ''}
                            onChange={(e) => handleESICEmailIDChange(e)}
                          />
                          {validationErrors.ESICEmailID && (
                            <div className="error">
                              {validationErrors.ESICEmailID}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <Input2
                            placeholder="Enter Here"
                            label="ESIC Mobile No"
                            disabled={
                              data.IsESICDuplicate || !data.IsESICApplicable
                            }
                            style={{ opacity: data.IsESICApplicable ? 1 : 0.5 }}
                            required={data.IsESICApplicable}
                            value={
                              data.IsESICApplicable || data.IsESICDuplicate
                                ? data.ESICMobileNo
                                : ""
                            }
                            // value={data.IsESICApplicable ? data.ESICMobileNo : ''}
                            onChange={(e) => handleESICMobileNoChange(e)}
                          />
                          {validationErrors.ESICMobileNo && (
                            <div className="error">
                              {validationErrors.ESICMobileNo}
                            </div>
                          )}
                        </div>
                        <div className="new_client_part_1"></div>
                      </div>
                    </>

                    <hr />

                    <>
                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <div className="toggle_switch_btn">
                            <h3>
                              Is PT Applicable?
                              <span style={{ color: "red" }}>*</span>
                            </h3>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={data.IsPTApplicable}
                                onChange={() => {
                                  const newValue = !data.IsPTApplicable;
                                  if (data.IsPTApplicable) {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsPTDuplicate: false,
                                    }));
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsPTApplicable: newValue,
                                    }));
                                  } else {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsPTApplicable: newValue,
                                    }));
                                  }
                                  setValidationErrors((prevErrors) => ({
                                    ...prevErrors,
                                    PTNumber: "",
                                    PTEmployerNo: "",
                                    PTEmployeeNo: "", // Clear the error message
                                  }));
                                }}
                              />
                              <span class="slider round"></span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <div className="toggle_switch_btn">
                            <h3>
                              Existing Location Available?
                              <span style={{ color: "red" }}>*</span>
                            </h3>
                            <label class="switch">
                              <input
                                type="checkbox"
                                checked={data.IsPTDuplicate} // Set to data.IsPFDuplicate if data.IsPFApplicable is true, otherwise false
                                onChange={() => {
                                  const newValue = !data.IsPTDuplicate;
                                  if (!data.IsPTApplicable) {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsPTDuplicate: false,
                                    }));
                                  } else {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsPTDuplicate: newValue,
                                    }));
                                  }
                                }}
                              />
                              <span class="slider round"></span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {data.IsPTDuplicate ? (
                        <div className="new_client_form mb-2" id="tab2">
                          <div className="new_client_part_1">
                            <select
                              className="py-0 me_height"
                              value={SelectedClientLocationPT}
                              selectedOptions={SelectedClientLocationPT}
                              onChange={handleLocationPT}
                            >
                              <option value="">Select Location</option>
                              {ClientLocationOption.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}

                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <Input2
                            placeholder="Enter Here"
                            label="Professional Tax Registration Number"
                            disabled={
                              data.IsPTDuplicate || !data.IsPTApplicable
                            }
                            required={data.IsPTApplicable}
                            style={{ opacity: data.IsPTApplicable ? 1 : 0.5 }}
                            value={
                              data.IsPTApplicable || data.IsPTDuplicate
                                ? data.PTNumber
                                : ""
                            }
                            // value={data.IsPTApplicable ? data.PTNumber : ''}
                            onChange={(e) => handlePTNumberChange(e)}
                          />
                          {validationErrors.PTNumber && (
                            <div className="error">
                              {validationErrors.PTNumber}
                            </div>
                          )}
                        </div>
                        <div className="new_client_part_1">
                          <Input2
                            placeholder="Enter Here"
                            label="PT Employer No"
                            disabled={
                              data.IsPTDuplicate || !data.IsPTApplicable
                            }
                            style={{ opacity: data.IsPTApplicable ? 1 : 0.5 }}
                            required={data.IsPTApplicable}
                            value={
                              data.IsPTApplicable || data.IsPTDuplicate
                                ? data.PTEmployerNo
                                : ""
                            }
                            // value={data.IsPTApplicable ? data.PTEmployerNo : ''}
                            onChange={(e) => handlePTEmployerNoChange(e)}
                          />
                          {validationErrors.PTEmployerNo && (
                            <div className="error">
                              {validationErrors.PTEmployerNo}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <Input2
                            placeholder="Enter Here"
                            label="PT Employee No"
                            disabled={
                              data.IsPTDuplicate || !data.IsPTApplicable
                            }
                            style={{ opacity: data.IsPTApplicable ? 1 : 0.5 }}
                            required={data.IsPTApplicable}
                            value={
                              data.IsPTApplicable || data.IsPTDuplicate
                                ? data.PTEmployeeNo
                                : ""
                            }
                            // value={data.IsPTApplicable ? data.PTEmployeeNo : ''}
                            onChange={(e) => handlePTEmployeeNoChange(e)}
                          />
                          {validationErrors.PTEmployeeNo && (
                            <div className="error">
                              {validationErrors.PTEmployeeNo}
                            </div>
                          )}
                        </div>
                        <div className="new_client_part_1"></div>
                      </div>
                    </>

                    <hr />

                    <>
                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <div className="toggle_switch_btn">
                            <h3>
                              Is Factory License Applicable?
                              <span style={{ color: "red" }}>*</span>
                            </h3>
                            <label class="switch">
                              <input
                                type="checkbox"
                                checked={data.IsFactoryLicenseApplicable}
                                onChange={() => {
                                  const newValue =
                                    !data.IsFactoryLicenseApplicable;
                                  // setData(prevData => ({ ...prevData, IsFactoryLicenseApplicable: newValue }));

                                  if (data.IsFactoryLicenseApplicable) {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsFactoryDuplicate: false,
                                    }));
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsFactoryLicenseApplicable: newValue,
                                    }));
                                  } else {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsFactoryLicenseApplicable: newValue,
                                    }));
                                  }
                                  setValidationErrors((prevErrors) => ({
                                    ...prevErrors,
                                    EndDate: "",
                                    StartDate: "",
                                    FactoryLicenseNo: "",
                                  }));
                                }}
                              />
                              <span class="slider round"></span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <div className="toggle_switch_btn">
                            <h3>
                              Existing Location Available?
                              <span style={{ color: "red" }}>*</span>
                            </h3>
                            <label class="switch">
                              <input
                                type="checkbox"
                                checked={data.IsFactoryDuplicate} // Set to data.IsPFDuplicate if data.IsPFApplicable is true, otherwise false
                                onChange={() => {
                                  const newValue = !data.IsFactoryDuplicate;
                                  if (!data.IsFactoryLicenseApplicable) {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsFactoryDuplicate: false,
                                    }));
                                  } else {
                                    setData((prevData) => ({
                                      ...prevData,
                                      IsFactoryDuplicate: newValue,
                                    }));
                                  }
                                }}
                              />
                              <span class="slider round"></span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {data.IsFactoryDuplicate ? (
                        <div className="new_client_form mb-2" id="tab2">
                          <div className="new_client_part_1">
                            <select
                              className="py-0 me_height"
                              value={SelectedClientLocationFactory}
                              selectedOptions={SelectedClientLocationFactory}
                              onChange={handleLocationFactory}
                            >
                              <option value="">Select Location</option>
                              {ClientLocationOption.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}

                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <Input2
                            required={data.IsFactoryLicenseApplicable}
                            placeholder="Enter Here"
                            label="Factory License No"
                            disabled={
                              data.IsFactoryDuplicate ||
                              !data.IsFactoryLicenseApplicable
                            }
                            style={{
                              opacity: data.IsFactoryLicenseApplicable
                                ? 1
                                : 0.5,
                            }}
                            value={
                              data.IsFactoryLicenseApplicable ||
                              data.IsFactoryDuplicate
                                ? data.FactoryLicenseNo
                                : ""
                            }
                            // value={data.IsFactoryLicenseApplicable ? data.FactoryLicenseNo : ''}
                            onChange={(e) => handleFactoryLicenseNoChange(e)}
                          />
                          {validationErrors.FactoryLicenseNo && (
                            <div className="error">
                              {validationErrors.FactoryLicenseNo}
                            </div>
                          )}
                        </div>

                        <div className="new_client_part_1">
                          <div className="dashboard_input_feild client_locationDate mt-2">
                            <div>
                              <h3 htmlFor="startDate">
                                Start Date
                                {data.IsFactoryLicenseApplicable && (
                                  <span style={{ color: "red" }}>*</span>
                                )}
                              </h3>
                            </div>
                            <DatePicker
                              id="startDate"
                              placeholderText="Enter Here"
                              selected={
                                data.IsFactoryLicenseApplicable ||
                                data.IsFactoryDuplicate
                                  ? data.StartDate
                                  : ""
                              }
                              maxDate={data.EndDate}
                              onChange={handleStartDate}
                              dateFormat="dd/MM/yyyy"
                              disabled={
                                data.IsFactoryDuplicate ||
                                !data.IsFactoryLicenseApplicable
                              }
                              style={{
                                opacity: data.IsFactoryLicenseApplicable
                                  ? 1
                                  : 0.5,
                              }}
                            />
                          </div>
                          {validationErrors.StartDate && (
                            <div className="error">
                              {validationErrors.StartDate}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="new_client_form" id="tab2">
                        <div className="new_client_part_1">
                          <div className="dashboard_input_feild client_locationDate">
                            <div>
                              <h3 htmlFor="endDate">
                                End Date
                                {data.IsFactoryLicenseApplicable && (
                                  <span style={{ color: "red" }}>*</span>
                                )}
                              </h3>
                            </div>
                            <DatePicker
                              id="endDate"
                              placeholderText="Enter Here"
                              selected={
                                data.IsFactoryLicenseApplicable ||
                                data.IsFactoryDuplicate
                                  ? data.EndDate
                                  : ""
                              }
                              minDate={data.StartDate}
                              onChange={handleEndDate}
                              dateFormat="dd/MM/yyyy"
                              disabled={
                                data.IsFactoryDuplicate ||
                                !data.IsFactoryLicenseApplicable
                              }
                              style={{
                                opacity: data.IsFactoryLicenseApplicable
                                  ? 1
                                  : 0.5,
                              }}
                            />
                          </div>
                          {validationErrors.EndDate && (
                            <div className="error">
                              {validationErrors.EndDate}
                            </div>
                          )}
                        </div>
                        <div className="new_client_part_1"></div>
                      </div>
                    </>
                  </>

                  <div className="btn_save btn-right me-0 d-flex justify-content-end">
                    <button type="reset" className="tab1 save_button me-4">
                      <img src="../img/clockwise.svg" />
                      Reset
                    </button>

                    <button
                      className="tab1 save_button"
                      disabled={disabledBtn}
                      onClick={() => setButtonClicked("submit")}
                      type="submit"
                    >
                      <>
                        <img src="../img/Save.svg" />
                        {ClientID === undefined ? "Save" : "Update"}
                        {spinLoad && buttonClicked === "submit" && <Spin />}
                      </>
                    </button>

                    {ClientID === undefined && (
                      <button
                        type="submit"
                        disabled={disabledBtn}
                        onClick={() => setButtonClicked("saveAndMore")}
                        className="tab1 save_button me-4"
                      >
                        <>
                          <img src="../img/Save.svg" />
                          Save & More
                          {spinLoad && buttonClicked === "saveAndMore" && (
                            <Spin />
                          )}
                        </>
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <Access_Denied />
          )}
        </>
      )}
    </Dashboard>
  );
}
