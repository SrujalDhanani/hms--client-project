import React from "react";
import Dashboard from "../components/dashboard";
import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import ErrorSnackbar from "./../components/ErrorSnackbar.js";
import SuccessSnackbar from "./../components/SuccessSnackbar.js";
import Spin from "../components/parts/spin.js";
import Load from "../components/parts/load.js";
import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Input2 from "../components/parts/input2.js";
import {
  State_get,
  PT_get_by_id,
  PT_entry,
  PT_CheckRange,
  CheckBoxDuplicateRecord,
  get_Client_Page_Access,
} from "../service/api.js";
import Select from "../components/parts/select.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Range } from "react-range";
import Access_Denied from "./deniedaccess.js";

const PTaxAdd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSpin, setShowSpin] = useState(false);
  const [showLoad, setShowLoad] = useState(true);
  const [ExceptionError, setExceptionError] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [buttonClicked, setButtonClicked] = useState("");
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [stateOption, setstateoption] = useState([]);
  const [isChecked, setIsChecked] = useState(true);

  const decimalValidation = /^(?!0\d)\d{0,18}(?:\.\d{0,2})?$/;

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

  const [pTAddAccess, setPTAddAccess] = useState(false);
  useEffect(() => {
    PageAccess();
  }, []);

  const PageAccess = async () => {
    try {
      const res = await get_Client_Page_Access("8");
      if (res.status === 200) {
        if (id ? res.data.AllowUpdate === true : res.data.AllowAdd === true) {
          setPTAddAccess(true);
          if (id) {
            api_get();
          }
          setShowLoad(false);
        }
        setShowLoad(false);
      } else if (res.status === 400) {
        if (res.data.ErrorCode) {
          console.log(res);
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

  const [data, setData] = useState({
    DeductionName: "",
    DeductionShortName: "",
    DeductionDisplayName: "",
    StartDate: "",
    EndDate: "",
    StateID: "",
    Month: [
      { Month: "January (01)", Employee: "", Employer: "" },
      { Month: "February (02)", Employee: "", Employer: "" },
      { Month: "March (03)", Employee: "", Employer: "" },
      { Month: "April (04)", Employee: "", Employer: "" },
      { Month: "May (05)", Employee: "", Employer: "" },
      { Month: "June (06)", Employee: "", Employer: "" },
      { Month: "July (07)", Employee: "", Employer: "" },
      { Month: "August (08)", Employee: "", Employer: "" },
      { Month: "September (09)", Employee: "", Employer: "" },
      { Month: "October (10)", Employee: "", Employer: "" },
      { Month: "November (11)", Employee: "", Employer: "" },
      { Month: "December (12)", Employee: "", Employer: "" },
    ],
    StartRange: "",
    EndRange: "",
    Amount: "",
    IsPercentage: true,
  });

  const [validationErrors, setValidationErrors] = useState({
    DeductionName: "",
    DeductionShortName: "",
    DeductionDisplayName: "",
    StartDate: "",
    EndDate: "",
    StateID: "",
    Month: "",
    StartRange: "",
    EndRange: "",
    IsPercentage: true,
    Amount: "",
  });

  const handleDeductionNameChange = async (value) => {
    setData((prevData) => ({ ...prevData, DeductionName: value.slice(0, 50) }));
    if (value === "") {
      return;
    }
    var ob = {
      table: "ClientProfessionalTax",
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
          DeductionName:
            "Deduction Name length should not be more than 50 characters.",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          DeductionName: "",
        }));
      }
    } else if (resp.status === 400) {
      setDisabledBtn(true);
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        DeductionName: resp.data.Errors[0].Message,
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

  const handleDeductionShortNameChange = async (value) => {
    if (value.trim().length > 10) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        DeductionShortName:
          "Deduction Short Name must not be more than 10 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        DeductionShortName: "",
      }));
    }
    setData((prevData) => ({
      ...prevData,
      DeductionShortName: value.slice(0, 10),
    }));
  };

  const handleDeductionDisplayNameChange = async (value) => {
    if (value.trim().length > 50) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        DeductionDisplayName:
          "Deduction Display Name must not be more than 50 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        DeductionDisplayName: "",
      }));
    }
    setData((prevData) => ({
      ...prevData,
      DeductionDisplayName: value.slice(0, 50),
    }));
  };

  const handleActiveChange = (value) => {
    setIsChecked(!isChecked);
    setData((prevData) => ({
      ...prevData,
      IsPercentage: !prevData.IsPercentage,
    }));
  };

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

  useEffect(() => {
    fetchStates();
    if (id) {
      api_get();
    }
  }, []);

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = async (event) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(selectedValues);
    const selected = event.target.value;
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      StateID: "",
      StartDate: "",
      EndDate: "",
    }));
    setData((prevData) => ({
      ...prevData,
      StateID: selected,
      StartDate: "",
      EndDate: "",
    }));
  };

  // function handleStartDateChange(value) {
  //   setData((prevData) => ({
  //     ...prevData,
  //     StartDate: value,
  //   }));
  //   setValidationErrors((prevErrors) => ({
  //     ...prevErrors,
  //     StartDate: "",
  //   }));
  // }

  // function handleEndDateChange(value) {
  //   setData((prevData) => ({
  //     ...prevData,
  //     EndDate: value,
  //   }));
  //   setValidationErrors((prevErrors) => ({
  //     ...prevErrors,
  //     EndDate: "",
  //   }));
  // }

  const handleStartDateChange = async (date) => {
    console.log(date);
    if (!date) return;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setData((prevData) => ({
      ...prevData,
      StartDate: formattedDate,
    }));
    var ob = {
      StartDate: formattedDate.trim(),
      EndDate: data.EndDate.trim(),
      StateID: data.StateID,
    };
    try {
      const resp = await PT_CheckRange(ob);
      if (resp.status === 200) {
        setDisabledBtn(false);
      } else if (resp.status === 400) {
        setDisabledBtn(true);
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          StartDate: resp.data.Message,
        }));
      } else if (resp.status === 401) {
        handleExceptionError("Unauthorized");
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
      } else if (resp.status === 500) {
        setDisabledBtn(false);
        handleExceptionError(resp.statusText);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const handleEndDateChange = async (date) => {
    if (!date) return;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setData((prevData) => ({
      ...prevData,
      EndDate: formattedDate,
    }));
    // if (data.StartDate) {
    //     if (formattedDate.length < data.StartDate.length) {
    //         setValidationErrors((prevErrors) => ({
    //             ...prevErrors,
    //             EndDate: "End Date should be greater than Start Date",
    //         }));
    //     } else {
    //         setValidationErrors((prevErrors) => ({
    //             ...prevErrors,
    //             EndDate: "",
    //         }));
    //     }
    // }
    var ob = {
      StartDate: data.StartDate.trim(),
      EndDate: formattedDate.trim(),
      StateID: data.StateID,
    };
    try {
      const resp = await PT_CheckRange(ob);
      if (resp.status === 200) {
        setDisabledBtn(false);
      } else if (resp.status === 400) {
        setDisabledBtn(true);
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          EndDate: resp.data.Message,
        }));
      } else if (resp.status === 401) {
        handleExceptionError("Unauthorized");
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
      } else if (resp.status === 500) {
        setDisabledBtn(false);
        handleExceptionError(resp.statusText);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const handleStartRangeChange = (value) => {
    if (/^\d*$/.test(value)) {
      if (!decimalValidation.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          StartRange: "Invalid Start Range",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          StartRange: "",
        }));
      }
      setData((prevData) => ({
        ...prevData,
        StartRange: value.slice(0, 21),
      }));
    }
  };

  const handleEndRangeChange = (value) => {
    if (/^\d*$/.test(value)) {
      if (!decimalValidation.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          EndRange: "Invalid End Range",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          EndRange: "",
        }));
      }
      setData((prevData) => ({
        ...prevData,
        EndRange: value.slice(0, 21),
      }));
    }
  };

  useEffect(() => {
    if (parseFloat(data.StartRange, 10) >= parseFloat(data.EndRange, 10)) {
      setValidationErrors((prevData) => ({
        ...prevData,
        EndRange: "Start Range should be less than End Range.",
      }));
    } else {
      setValidationErrors((prevData) => ({ ...prevData, EndRange: "" }));
    }
  }, [data.StartRange, data.EndRange]);

  const handleAmountChange = (value) => {
    if (parseFloat(value) < 0) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        Amount: "Value less than 0 is not admissible",
      }));
      return;
    }
    setValidationErrors((prevErrors) => ({ ...prevErrors, Amount: "" }));
    const isValidAmount = /^\d{0,18}(\.\d{1,2})?$/.test(value);

    const formattedValue = Math.min(Math.max(parseFloat(value), 0), 100);

    setData((prevData) => ({
      ...prevData,
      Amount: data.IsPercentage ? formattedValue : value.slice(0, 18),
    }));
    setValidationErrors((prevErrors) => ({ ...prevErrors, Amount: "" }));

    setData((prevData) => ({
      ...prevData,
      Month: prevData.Month.map((month) => ({
        ...month,
        Employee: data.IsPercentage ? formattedValue : value.slice(0, 18),
        Employer: data.IsPercentage ? formattedValue : value.slice(0, 18),
      })),
    }));
  };

  const handleMonthDataChange = (index, field, value) => {
    const formattedValue = Math.min(Math.max(parseFloat(value), 0), 100);
    setData((prevData) => ({
      ...prevData,
      Month: prevData.Month.map((month, i) => {
        if (i === index) {
          return {
            ...month,
            [field]: data.IsPercentage ? formattedValue : value.slice(0, 18),
          };
        }
        return month;
      }),
    }));
  };

  const api_get = async () => {
    setShowLoad(true);
    const PTresp = await PT_get_by_id(id);
    console.log(PTresp);
    const PTdata = PTresp.data.ProfessionalTaxData;
    try {
      if (PTresp.status === 200) {
        const dataArray = PTdata.Month;
        const dataMonth = JSON.parse(`${dataArray.replace(/\\/g, "")}`);
        setSelectedOptions(PTdata.StateID);
        setData({
          DeductionName:
            PTdata.DeductionName === null ? "" : PTdata.DeductionName,
          DeductionShortName:
            PTdata.DeductionShortName === null ? "" : PTdata.DeductionShortName,
          DeductionDisplayName:
            PTdata.DeductionDisplayName === null
              ? ""
              : PTdata.DeductionDisplayName,
          StateID: PTdata.StateID === null ? "" : PTdata.StateID,
          StartDate:
            PTdata.StartDate === null ? "" : PTdata.StartDate.slice(0, 10),
          EndDate: PTdata.EndDate === null ? "" : PTdata.EndDate.slice(0, 10),
          StartRange: PTdata.StartRange === null ? "" : PTdata.StartRange,
          EndRange: PTdata.EndRange === null ? "" : PTdata.EndRange,
          IsPercentage: PTdata.IsPercentage === null ? "" : PTdata.IsPercentage,
          Amount: PTdata.Amount === null ? "" : PTdata.Amount,
          Month: dataMonth,
        });
        setShowLoad(false);
      } else if (PTresp.status === 400) {
        handleExceptionError(PTresp);
      } else if (PTresp.status === 401) {
        handleExceptionError("Unauthorized");
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
        ///logout();
      } else if (PTresp.status === 500) {
        handleExceptionError(PTresp.statusText);
      }

      /// return; // Exit the function once the data is found
    } catch (error) {
      handleExceptionError(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(data);
    const errors = {};
    if (data.DeductionName.trim() === "") {
      errors.DeductionName = "Deduction Name is required.";
    }
    if (data.DeductionShortName.trim() === "") {
      errors.DeductionShortName = "Deduction Short Name is required.";
    }
    if (data.DeductionDisplayName.trim() === "") {
      errors.DeductionDisplayName = "Deduction Display Name is required.";
    }
    if (data.StateID === "0" || data.StateID.length === 0) {
      errors.StateID = "State/UT is required.";
    }
    if (data.StartDate.trim() === "") {
      errors.StartDate = "Start Date is required.";
    }
    if (data.StartRange.trim() === "") {
      errors.StartRange = "Start Range is required.";
    }
    if (data.EndRange.trim() === "") {
      errors.EndRange = "End Range is required.";
    }
    if (String(data.Amount).trim() === "") {
      errors.Amount = "Amount is Required";
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    if (id) {
      try {
        setShowSpin(true);
        const res = await PT_entry(data);
        if (res.status === 200) {
          console.log(res);
          handleExceptionSuccessMessages(res.data);
          setShowSpin(false);
          setTimeout(function () {
            navigate("/pt-list");
          }, 2000);
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
          console.log(res);
          handleExceptionError(res.data.Message);
        }
      } catch (error) {
        handleExceptionError(error.message);
      }
    } else {
      try {
        setShowSpin(true);
        const res = await PT_entry(data);
        console.log(data);
        if (res.status == 200) {
          handleExceptionSuccessMessages(res.data);
          handleFormReset();
          setShowSpin(false);
          if (buttonClicked == "submit") {
            setTimeout(function () {
              navigate("/pt-list");
            }, 2000);
          }
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
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleFormReset = () => {
    setData({
      DeductionName: "",
      DeductionShortName: "",
      DeductionDisplayName: "",
      StartDate: "",
      EndDate: "",
      StateID: "",
      Month: [
        { Month: "January(01)", Employee: "", Employer: "" },
        { Month: "February(02)", Employee: "", Employer: "" },
        { Month: "March(03)", Employee: "", Employer: "" },
        { Month: "April(04)", Employee: "", Employer: "" },
        { Month: "May(05)", Employee: "", Employer: "" },
        { Month: "June(0)", Employee: "", Employer: "" },
        { Month: "July(07)", Employee: "", Employer: "" },
        { Month: "August(08)", Employee: "", Employer: "" },
        { Month: "September(09)", Employee: "", Employer: "" },
        { Month: "October(10)", Employee: "", Employer: "" },
        { Month: "November(11)", Employee: "", Employer: "" },
        { Month: "December(12)", Employee: "", Employer: "" },
      ],
      StartRange: "",
      EndRange: "",
      IsPercentage: true,
      Amount: "",
    });

    setValidationErrors({
      DeductionName: "",
      DeductionShortName: "",
      DeductionDisplayName: "",
      StartDate: "",
      EndDate: "",
      StateID: "",
      Month: "",
      StartRange: "",
      EndRange: "",
      IsPercentage: true,
      Amount: "",
    });
  };

  return (
    <Dashboard
      title={
        id === undefined ? "New Professional Tax" : "Edit Professional Tax"
      }
    >
      <Helmet>
        <title>
          {id === undefined ? "New Professinal Tax" : "Edit Professional Tax"} |
          J mehta
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
          {pTAddAccess ? (
            <>
              <div>
                <div className="new_client_title">
                  <Link to="/pt-list">
                    <button>
                      <AiFillCloseCircle /> Close
                    </button>
                  </Link>
                </div>
                <div className="new_client_content_wrapper">
                  <div className="new_client_menu"></div>
                  <form
                    onSubmit={handleSubmit}
                    onReset={handleFormReset}
                    className="salary-form"
                  >
                    <div className="row new_client_form">
                      <div className="col new_client_form">
                        <div className="new_client_part_1 w-100">
                          <Input2
                            type={"text"}
                            placeholder="Enter Here"
                            label="Deduction Name"
                            required
                            value={data.DeductionName}
                            onChange={(e) => handleDeductionNameChange(e)}
                          />
                          {validationErrors.DeductionName && (
                            <div className="error">
                              {validationErrors.DeductionName}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col ">
                        <div className="new_client_part_1 w-100">
                          <Input2
                            type={"text"}
                            placeholder="Enter Here"
                            label="Deduction Short Name"
                            required
                            value={data.DeductionShortName}
                            onChange={(e) => handleDeductionShortNameChange(e)}
                          />
                          {validationErrors.DeductionShortName && (
                            <div className="error">
                              {validationErrors.DeductionShortName}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row new_client_form">
                      <div className="col new_client_form">
                        <div className="new_client_part_1 w-100">
                          <Input2
                            type={"text"}
                            placeholder="Enter Here"
                            label="Deduction Display Name"
                            required
                            value={data.DeductionDisplayName}
                            onChange={(e) =>
                              handleDeductionDisplayNameChange(e)
                            }
                          />
                          {validationErrors.DeductionDisplayName && (
                            <div className="error">
                              {validationErrors.DeductionDisplayName}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col new_client_form">
                        <div className="new_client_part_1 w-100 my-2">
                          <Select
                            label="State/UT"
                            options={stateOption}
                            selectedOptions={selectedOptions}
                            handleChange={handleSelectChange}
                            required
                            disabled={id ? 1 : 0}
                            style={{ opacity: id ? 0.5 : 1 }}
                          />
                          {validationErrors.StateID && (
                            <div className="error">
                              {validationErrors.StateID}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row new_client_form">
                      <div className="col new_client_form">
                        <div className="new_client_part_1 w-100">
                          <div className="dashboard_input_feild">
                            <div>
                              <h3 htmlFor="endDate">
                                Start Date
                                <span style={{ color: "red" }}>*</span>
                              </h3>
                            </div>
                            <DatePicker
                              id="endDate"
                              placeholderText="Enter Here"
                              selected={data.StartDate}
                              maxDate={data.EndDate}
                              onChange={(e) => handleStartDateChange(e)}
                              dateFormat="dd/MM/yyyy"
                            />
                            {validationErrors.StartDate && (
                              <div
                                className="error"
                                style={{ marginTop: "0.3rem" }}
                              >
                                {validationErrors.StartDate}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col new_client_form">
                        <div className="new_client_part_1 w-100">
                          <div className="dashboard_input_feild client_locationDate">
                            <div>
                              <h3 htmlFor="endDate">End Date</h3>
                            </div>
                            <DatePicker
                              id="endDate"
                              placeholderText="Enter Here"
                              selected={data.EndDate}
                              minDate={data.StartDate}
                              onChange={(e) => handleEndDateChange(e)}
                              dateFormat="dd/MM/yyyy"
                            />
                          </div>
                          {validationErrors.EndDate && (
                            <div className="error">
                              {validationErrors.EndDate}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row new_client_form">
                      <div className="col new_client_form">
                        <div className="new_client_part_1 w-100">
                          <Input2
                            type={"text"}
                            placeholder="Enter Here"
                            label="Start Range"
                            required
                            value={data.StartRange}
                            onChange={(e) => handleStartRangeChange(e)}
                          />
                          {validationErrors.StartRange && (
                            <div className="error">
                              {validationErrors.StartRange}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col new_client_form">
                        <div className="new_client_part_1 w-100">
                          <Input2
                            type={"text"}
                            placeholder="Enter Here"
                            label="End Range"
                            required
                            value={data.EndRange}
                            onChange={(e) => handleEndRangeChange(e)}
                          />
                          {validationErrors.EndRange && (
                            <div className="error">
                              {validationErrors.EndRange}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row new_client_form">
                      <div className="col new_client_form">
                        <div className="new_client_part_1 w-100">
                          <label
                            className="label_main"
                            style={{ margin: "0.4rem 0 0 0" }}
                          >
                            Is Percentage
                            <input
                              type="checkbox"
                              checked={data.IsPercentage}
                              onChange={(e) =>
                                handleActiveChange(e.target.checked)
                              }
                            />
                            <span class="geekmark"> </span>
                          </label>
                        </div>
                      </div>
                      <div className="col new_client_form">
                        <div className="new_client_part_1 w-100">
                          <Input2
                            type={"number"}
                            placeholder="Enter Here"
                            label="Amount"
                            required
                            value={data.Amount}
                            onChange={(e) => handleAmountChange(e)}
                            min={0}
                          />
                          {validationErrors.Amount && (
                            <div className="error">
                              {validationErrors.Amount}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="client_panel_list d-flex align-items-start scroll-container">
                      <table
                        className="client_panel_list_table"
                        cellPadding="0"
                        cellSpacing="0"
                      >
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>Employee</th>
                            <th>Employer</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.Month &&
                            data.Month.map((row, index) => (
                              <>
                                <tr key={index}>
                                  <td>{row.Month}</td>
                                  <td>
                                    <input
                                      type="number"
                                      className="tbl_enter"
                                      value={row.Employee}
                                      onChange={(e) =>
                                        handleMonthDataChange(
                                          index,
                                          "Employee",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="tbl_enter"
                                      value={row.Employer}
                                      onChange={(e) =>
                                        handleMonthDataChange(
                                          index,
                                          "Employer",
                                          e.target.value
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

                    <div className="btn_save d-flex justify-content-end">
                      <button type="reset" className="tab1 save_button">
                        <img src="../img/clockwise.svg" />
                        Reset
                      </button>
                      <button
                        type="submit"
                        disabled={disabledBtn}
                        name="save"
                        onClick={() => setButtonClicked("submit")}
                        className="tab1 save_button me-4"
                      >
                        <>
                          <img src="../img/Save.svg" />
                          {id === undefined ? "Save" : "Update"}
                          {showSpin && buttonClicked === "submit" && <Spin />}
                        </>
                      </button>
                      {id === undefined && (
                        <button
                          type="submit"
                          disabled={disabledBtn}
                          name="saveAndMore"
                          onClick={() => setButtonClicked("saveAndMore")}
                          className="tab1 save_button me-0"
                        >
                          <>
                            <img src="../img/Save.svg" />
                            Save & More
                            {showSpin && buttonClicked === "saveAndMore" && (
                              <Spin />
                            )}
                          </>
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <Access_Denied />
          )}
        </>
      )}
    </Dashboard>
  );
};

export default PTaxAdd;
