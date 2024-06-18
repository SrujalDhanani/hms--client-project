// App.js
import React, { useState, useEffect, useRef } from "react";
import Dashboard from "../components/dashboard.js";
import { AiFillCloseCircle } from "react-icons/ai";
import Input2 from "../components/parts/input2.js";
import {
  SalaryComponent_Dropdown,
  SalaryComponent_edit,
  SalaryComponent_entry,
  SalaryComponent_get_by_id,
  get_Client_Page_Access,
} from "../service/api.js";
import { CheckBoxDuplicateRecord } from "../service/api.js";
import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import ErrorSnackbar from "./../components/ErrorSnackbar.js";
import SuccessSnackbar from "./../components/SuccessSnackbar.js";
import Spin from "../components/parts/spin.js";
import Load from "../components/parts/load.js";
import Access_Denied from "./deniedaccess.js";

const SalaryEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSpin, setShowSpin] = useState(true);
  const [showLoad, setShowLoad] = useState(true);
  const [ExceptionError, setExceptionError] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [buttonClicked, setButtonClicked] = useState("");
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [salaryAccess, setSalaryAccess] = useState(false);


  const [data, setData] = useState({
    ParentComponentID: "",
    ComponentName: "",
    ComponentShortName: "",
    ComponentDisplayName: "",
    ComponentDisplayShortName: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    ParentComponentID: "",
    ComponentName: "",
    ComponentShortName: "",
    ComponentDisplayName: "",
    ComponentDisplayShortName: "",
  });

  const PageAccess = async () => {
    try {
      const res = await get_Client_Page_Access("7");
      if (res.status == 200) {
        if (id ? res.data.AllowUpdate === true : res.data.AllowAdd === true) {
          setSalaryAccess(true);
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
      setShowLoad(false);
    }
  };

  useEffect(() => {
    PageAccess();
  }, []);

  const api_get = async () => {
    setShowLoad(true);
    try {
      const resp = await SalaryComponent_get_by_id(id);
      console.log(resp);
      if (resp.status === 200) {
        setSelectedSalaryComponent(
          resp.data.SalaryComponentsData.ParentComponentID
        );
        console.log(resp.data.SalaryComponentsData.ParentComponentID);
        console.log(resp.data.SalaryComponentsData.SalaryComponentsID);
        setData({
          ParentComponentID: resp.data.SalaryComponentsData.ParentComponentID,
          ComponentName: resp.data.SalaryComponentsData.ComponentName,
          ComponentShortName: resp.data.SalaryComponentsData.ComponentShortName,
          ComponentDisplayName:
            resp.data.SalaryComponentsData.ComponentDisplayName,
          ComponentDisplayShortName:
            resp.data.SalaryComponentsData.ComponentDisplayShortName,
        });
        setShowLoad(false);
      } else if (resp.status === 400) {
        handleExceptionError(resp);
        setShowLoad(false);
      } else if (resp.status === 401) {
        handleExceptionError("Unauthorized");
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
        ///logout();
      } else if (resp.status === 500) {
        handleExceptionError(resp.statusText);
        setShowLoad(false);
      }
    } catch (error) {
      handleExceptionError(error.message);
    }
  };

  const [salaryComponentList, setSalaryComponentList] = useState([]);
  const [salaryComponentOption, setSalaryComponentOption] = useState([]);
  const [selectedSalaryComponent, setSelectedSalaryComponent] = useState([]);

  const get_SalaryComponent = async () => {
    try {
      const res = await SalaryComponent_Dropdown();
      console.log(res);
      if (res.status === 200) {
        const newOptions = res.data.SalaryComponentsData.map((item) => ({
          ParentComponentID: item.ParentComponentID,
          id: item.ParentComponentID,
          ComponentName: item.ComponentName,
          ComponentShortName: item.ComponentShortName,
          ComponentDisplayName: item.ComponentDisplayName,
          ComponentDisplayShortName: item.ComponentDisplayShortName,
        }));
        setSalaryComponentList(newOptions);
        console.log(newOptions);
        if (Array.isArray(newOptions)) {
          const newOptions1 = newOptions.map((item) => ({
            label: item.ComponentName,
            value: item.id,
          }));
          console.log(newOptions1);
          setSalaryComponentOption(newOptions1);
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
      handleExceptionError(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    get_SalaryComponent();
  }, []);

  const handleSelectChange = (event) => {
    const selected = event.target.value;
    console.log(selected);
    console.log(salaryComponentList);
    const selectedSalaryComp = salaryComponentList.find(
      (item) => item.id === Number(selected)
    );
    console.log(selectedSalaryComp);
    if (selectedSalaryComp) {
      const updatedSalaryComponent = salaryComponentList
        .filter((item) => item.id === Number(selected))
        .map((item) => ({
          ParentComponentID: item.ParentComponentID,
          ComponentName: item.ComponentName,
          ComponentShortName: item.ComponentShortName,
          ComponentDisplayName: item.ComponentDisplayName,
          ComponentDisplayShortName: item.ComponentDisplayShortName,
        }))[0];
      console.log(updatedSalaryComponent);
      setData((prevData) => ({
        ...prevData,
        ...updatedSalaryComponent,
      }));
    }
    setSelectedSalaryComponent([selected]);
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

  const handleComponentNameChange = async (value) => {
    if (value.trim().length > 50) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        ComponentName:
          "Component Display Name must not be more than 50 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        ComponentName: "",
      }));
    }
    setData((prevData) => ({ ...prevData, ComponentName: value.slice(0, 50) }));
  };

  const handleComponentShortNameChange = (value) => {
    if (value.trim().length > 10) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        ComponentShortName:
          "Component Short Name must not be more than 10 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        ComponentShortName: "",
      }));
    }
    setData((prevData) => ({
      ...prevData,
      ComponentShortName: value.slice(0, 10),
    }));
  };

  const handleComponentDisplayNameChange = async (value) => {
    setData((prevData) => ({
      ...prevData,
      ComponentDisplayName: value.slice(0, 100),
    }));
    if (value === "") {
      return;
    }
    var ob = {
      table: "ComponentName",
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
          ComponentDisplayName: "Location Name length should be 100 digits.",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          ComponentDisplayName: "",
        }));
      }
    } else if (resp.status === 400) {
      setDisabledBtn(true);
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        ComponentDisplayName: resp.data.Errors[0].Message,
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

  const handleComponentDisplayShortNameChange = (value) => {
    if (value.trim().length > 10) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        ComponentDisplayShortName:
          "Component Display Short Name must not be more than 10 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        ComponentDisplayShortName: "",
      }));
    }
    setData((prevData) => ({
      ...prevData,
      ComponentDisplayShortName: value.slice(0, 10),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (data.ComponentName.trim() === "") {
      errors.ComponentName = "Component Name is required.";
    }
    if (data.ComponentShortName.trim() === "") {
      errors.ComponentShortName = "Component Short Name is required.";
    }
    if (data.ComponentDisplayShortName.trim() === "") {
      errors.ComponentDisplayShortName =
        "Component Display Short Name is required.";
    }
    if (data.ComponentDisplayName.trim() === "") {
      errors.ComponentDisplayName = "Component Display Name is required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    if (id) {
      try {
        setShowSpin(true);
        const res = await SalaryComponent_edit(id, data);
        if (res.status === 200) {
          handleExceptionSuccessMessages(res.data.message);
          setShowSpin(false);
          setTimeout(function () {
            navigate("/salary-list");
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
              setShowSpin(false);
            });
          }
          if (res.data.Message) {
            handleExceptionError(res.data.Message);
            setShowSpin(false);
          }
        } else if (res.status === 401) {
          handleExceptionError("Unauthorized");
          setShowSpin(false);
          setTimeout(() => {
            localStorage.clear();
            navigate("/");
          }, 1000);
          ///logout();
        } else if (res.status === 500) {
          handleExceptionError(res.statusText);
          setShowSpin(false);
        }
      } catch (error) {
        handleExceptionError(error.message);
      } finally {
        setShowSpin(false);
      }
    } else {
      try {
        setShowSpin(true);
        const res = await SalaryComponent_entry(data);
        if (res.status == 200) {
          handleExceptionSuccessMessages(res.data.message);
          handleFormReset();
          setShowSpin(false);
          if (buttonClicked == "submit") {
            setTimeout(function () {
              navigate("/salary-list");
            }, 2000);
          }
        } else if (res.status === 200) {
          var dataError = res.data.Errors;
          dataError.map((message, index) => {
            handleExceptionError(message.Message);
            setShowSpin(false);
          });
        } else if (res.status === 400) {
          if (res.data.ErrorCode) {
            const validationErrorMessage = res.data.ErrorMessage;
            const errorMessagesArray = validationErrorMessage.split(", ");
            errorMessagesArray.forEach((errorMessage) => {
              const [, fieldName, errorMessageText] =
                errorMessage.match(/\"(.*?)\" (.*)/);
              handleExceptionError(`${fieldName} - ${errorMessageText}`);
              setShowSpin(false);
            });
          }
          if (res.data.Message) {
            handleExceptionError(res.data.Message);
            setShowSpin(false);
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
          setShowSpin(false);
        }
      } catch (error) {
        handleExceptionError(error.message);
      } finally {
        setShowSpin(false);
      }
    }
  };

  const handleFormReset = () => {
    setData({
      ParentComponentID: " ",
      ComponentName: "",
      ComponentShortName: "",
      ComponentDisplayName: "",
      ComponentDisplayShortName: "",
    });
    setValidationErrors({
      ParentComponentID: "",
      ComponentName: "",
      ComponentShortName: "",
      ComponentDisplayName: "",
      ComponentDisplayShortName: "",
    });
  };

  return (
    <Dashboard
      title={
        id === undefined ? "New Salary Component" : "Edit Salary Component"
      }
    >
      <Helmet>
        <title>
          {id === undefined ? "New Salary" : "Edit Salary"} Component | J mehta
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
          {salaryAccess ? (
            <div>
              <div className="new_client_title">
                <Link to="/salary-list">
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
                      <div
                        className="new_client_part_1 w-100"
                        style={{ marginBottom: "1rem" }}
                      >
                        <label>
                          Select Salary Component
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          className="py-0 me_height"
                          value={selectedSalaryComponent}
                          selectedOptions={selectedSalaryComponent}
                          onChange={handleSelectChange}
                        >
                          <option value="" hidden>
                            Select Salary Component
                          </option>
                          {salaryComponentOption.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {/* {validationErrors.ComponentName && (
                        <div className="error">
                          {validationErrors.ComponentName}
                        </div>
                      )} */}
                      </div>
                    </div>
                    <div className="col">
                      <div className="new_client_part_1 w-100"></div>
                    </div>
                  </div>
                  <div className="row new_client_form">
                    <div className="col new_client_form">
                      <div className="new_client_part_1 w-100">
                        <Input2
                          type={"text"}
                          placeholder="Enter Here"
                          label="Component Name"
                          required
                          value={data.ComponentName}
                          onChange={(e) => handleComponentNameChange(e)}
                          readOnly={1}
                        />
                        {validationErrors.ComponentName && (
                          <div className="error">
                            {validationErrors.ComponentName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col ">
                      <div className="new_client_part_1 w-100">
                        <Input2
                          type={"text"}
                          placeholder="Enter Here"
                          label="Component Short Name"
                          required
                          value={data.ComponentShortName}
                          onChange={(e) => handleComponentShortNameChange(e)}
                          readOnly={1}
                        />
                        {validationErrors.ComponentShortName && (
                          <div className="error">
                            {validationErrors.ComponentShortName}
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
                          label="Component Display Name"
                          value={data.ComponentDisplayName}
                          onChange={(e) => handleComponentDisplayNameChange(e)}
                        />
                        {validationErrors.ComponentDisplayName && (
                          <div className="error">
                            {validationErrors.ComponentDisplayName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col ">
                      <div className="new_client_part_1 w-100">
                        <Input2
                          type={"text"}
                          placeholder="Enter Here"
                          label="Component Display Short Name"
                          value={data.ComponentDisplayShortName}
                          onChange={(e) =>
                            handleComponentDisplayShortNameChange(e)
                          }
                        />
                        {validationErrors.ComponentDisplayShortName && (
                          <div className="error">
                            {validationErrors.ComponentDisplayShortName}
                          </div>
                        )}
                      </div>
                    </div>
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
          ) : (
            <Access_Denied />
          )}
        </>
      )}
    </Dashboard>
  );
};

export default SalaryEntry;
