// App.js
import React, { useState, useEffect } from "react";
import Dashboard from "../components/dashboard.js";
import { AiFillCloseCircle } from "react-icons/ai";
import Input2 from "../components/parts/input2.js";
import Textarea from "../components/parts/textarea.js";
import Checkbox from "../components/parts/checkbox.js";
import { Designation_entry } from "../service/api.js";
import {
  Designation_edit,
  CheckBoxDuplicateRecord,
  get_Client_Page_Access,
} from "../service/api.js";
import { Designation_get_by_id } from "../service/api.js";
import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import ErrorSnackbar from "./../components/ErrorSnackbar.js";
import SuccessSnackbar from "./../components/SuccessSnackbar.js";
import Access_Denied from "./deniedaccess.js";
import Load from "../components/parts/load.js";
import Spin from "../components/parts/spin.js";

const Designation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(true);

  const [ExceptionError, setExceptionError] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [buttonClicked, setButtonClicked] = useState("");
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [DesignationAccess, setDesignationAccess] = useState(false);
  const [showLoad, setShowLoad] = useState(true);
  const [showSpin, setShowSpin] = useState(false);

  useEffect(() => {
    PageAccess();
  }, []);

  const PageAccess = async () => {
    try {
      // setLoading(true);
      const res = await get_Client_Page_Access(1);
      if (res.status == 200) {
        if (id ? res.data.AllowUpdate === true : res.data.AllowAdd === true) {
          setDesignationAccess(true);
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
    setShowLoad(false);
    try {
      const resp = await Designation_get_by_id(id);
      if (resp.status === 200) {
        setData({
          designation:
            resp.data.data.DesignationName === null
              ? ""
              : resp.data.data.DesignationName,
          shortName:
            resp.data.data.DesignationSName === null
              ? ""
              : resp.data.data.DesignationSName,
          description: resp.data.data.Description,
          active: resp.data.data.IsActive,
        });
        setShowLoad(false);
      } else if (resp.status === 400) {
        handleExceptionError(resp);
      } else if (resp.status === 401) {
        handleExceptionError("Unauthorized");
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
        ///logout();
      } else if (resp.status === 500) {
        handleExceptionError(resp.statusText);
      }
    } catch (error) {
      handleExceptionError(error.message);
    }
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
  const [data, setData] = useState({
    designation: "",
    shortName: "",
    description: "",
    active: true,
  });

  // useEffect(() => {
  //   if (id) {
  //     api_get();
  //   }
  // }, [id]);

  const [validationErrors, setValidationErrors] = useState({
    designation: "",
    shortName: "",
    description: "",
  });

  const handleDesignationChange = async (value) => {
    setData((prevData) => ({ ...prevData, designation: value.slice(0, 100) }));
    if (value === "") {
      return;
    }
    var ob = {
      table: "Designation",
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
          designation: "Designation length should be 100 digits.",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          designation: "",
        }));
      }
    } else if (resp.status === 400) {
      setDisabledBtn(true);
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        designation: resp.data.Errors[0].Message,
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

  const handleShortNameChange = (value) => {
    if (value.trim().length > 10) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        shortName:
          "Designation Short Name must not be greater than 10 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, shortName: "" }));
    }
    setData((prevData) => ({ ...prevData, shortName: value.slice(0, 10) }));
  };

  const handleDescriptionChange = (value) => {
    if (value.trim().length > 500) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        description: "Description must not be greater than 500 characters.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({ ...prevErrors, description: "" }));
    }
    setData((prevData) => ({ ...prevData, description: value.slice(0, 500) }));
  };

  const handleActiveChange = (value) => {
    setIsChecked(!isChecked);
    setData((prevData) => ({ ...prevData, active: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (data.designation.trim() === "") {
      errors.designation = "Designation Name is required.";
    }
    if (data.shortName.trim() === "") {
      errors.shortName = "Designation Short Name is required.";
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    if (id) {
      setShowSpin(true);
      try {
        const res = await Designation_edit(id, data);

        if (res.status === 200) {
          console.log(res);
          handleExceptionSuccessMessages(res.data.message);
          handleFormReset();
          setShowSpin(false);
          if (buttonClicked == "submit") {
            setTimeout(function () {
              navigate("/all-designation");
            }, 1000);
          }
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
      } catch (error) {
        handleExceptionError(error.message);
      }
    } else {
      setShowSpin(true);
      try {
        const res = await Designation_entry(data);
        if (res.status === 200) {
          handleExceptionSuccessMessages(res.data.message);
          handleFormReset();
          setShowSpin(false);
          if (buttonClicked == "submit") {
            setTimeout(function () {
              navigate("/all-designation");
            }, 1000);
          }
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
      } catch (error) {
        handleExceptionError(error.message);
      }
    }
  };

  const handleFormReset = () => {
    // Reset the form by updating the state
    setData({
      designation: "",
      shortName: "",
      description: "",
      active: true,
    });
    setValidationErrors({
      designation: "",
      shortName: "",
      description: "",
    });
  };
  return (
    <Dashboard
      title={id === undefined ? "New Designation" : "Edit Designation"}
    >
      <Helmet>
        <title>
          {id === undefined ? "New Designation" : "Edit Designation"} | J mehta
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
          {DesignationAccess ? (
            <div>
              <div className="new_client_title">
                <Link to="/all-designation">
                  <button>
                    <AiFillCloseCircle /> Close
                  </button>
                </Link>
              </div>
              <div className="new_client_content_wrapper">
                <div className="new_client_menu"></div>
                <form onSubmit={handleSubmit} onReset={handleFormReset}>
                  <div className="row new_client_form">
                    <div className="col new_client_form">
                      <div className="new_client_part_1 w-100">
                        <Input2
                          type={"text"}
                          placeholder="Enter Here"
                          label="Designation Name"
                          value={data.designation}
                          onChange={(e) => handleDesignationChange(e)}
                          required
                          autoFocus={1}
                        />
                        {validationErrors.designation && (
                          <div className="error">
                            {validationErrors.designation}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col ">
                      <div className="new_client_part_1 w-100">
                        <Input2
                          type={"text"}
                          placeholder="Enter Here"
                          label="Designation Short Name"
                          value={data.shortName}
                          onChange={(e) => handleShortNameChange(e)}
                          required
                        />
                        {validationErrors.shortName && (
                          <div className="error">
                            {validationErrors.shortName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row ">
                    <div className="col-xl-12">
                      <div className="new_client_part_1 w-100">
                        <Textarea
                          label="Description"
                          placeholder="Enter your description..."
                          rows={4}
                          cols={50}
                          value={data.description}
                          onChange={(e) => handleDescriptionChange(e)}
                        />
                        {validationErrors.description && (
                          <div className="error mt-2">
                            {validationErrors.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row ">
                    <div className="col-xl-12">
                      <div className="new_client_part_1 mt-3">
                        <label className="label_main">
                          {" "}
                          Active
                          <input
                            type="checkbox"
                            checked={data.active}
                            onChange={(e) =>
                              handleActiveChange(e.target.checked)
                            }
                          />
                          <span class="geekmark"> </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="btn_save d-flex justify-content-end">
                    <button type="reset" className="tab1 save_button">
                      <img src="../img/clockwise.svg" />
                      Reset
                    </button>
                    <button
                      className="tab1 save_button"
                      disabled={disabledBtn}
                      onClick={() => setButtonClicked("submit")}
                      type="submit"
                    >
                      <img src="../img/Save.svg" />
                      {id === undefined ? "Save" : "Update"}
                      {buttonClicked == "submit" && showSpin && <Spin />}
                    </button>
                    {id === undefined && (
                      <button
                        type="submit"
                        disabled={disabledBtn}
                        onClick={() => setButtonClicked("saveAndMore")}
                        className="tab1 save_button me-0"
                      >
                        <img src="../img/Save.svg" />
                        Save & More
                        {buttonClicked == "saveAndMore" && showSpin && <Spin />}
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

export default Designation;
