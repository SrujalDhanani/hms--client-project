// App.js
import React, { useState, useEffect } from "react";
import Dashboard from "../components/dashboard.js";
import { AiFillCloseCircle } from "react-icons/ai";
import Input2 from "../components/parts/input2.js";
import Textarea from "../components/parts/textarea.js";
import Checkbox from "../components/parts/checkbox.js";
import { Department_entry } from "../service/api.js";
import {
  Department_entry_get_by_id,
  CheckBoxDuplicateRecord,
} from "../service/api.js";
import { Department_edit, get_Client_Page_Access } from "../service/api.js";
import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import ErrorSnackbar from "./../components/ErrorSnackbar.js";
import SuccessSnackbar from "./../components/SuccessSnackbar.js";
import Access_Denied from "./deniedaccess.js";
import Load from "../components/parts/load.js";
import Spin from "../components/parts/spin.js";

const Department = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(true);
  const [buttonClicked, setButtonClicked] = useState("");
  const [ExceptionError, setExceptionError] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [showLoad, setShowLoad] = useState(true);
  const [showSpin, setShowSpin] = useState(false);
  const [DepartmentAccess, setDepartmentAccess] = useState(false);

  useEffect(() => {
    PageAccess();
  }, []);

  const PageAccess = async () => {
    try {
      const res = await get_Client_Page_Access(2);
      if (res.status === 200) {
        if (id ? res.data.AllowUpdate === true : res.data.AllowAdd === true) {
          setDepartmentAccess(true);
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
    const resp = await Department_entry_get_by_id(id);
    console.log(id);
    try {
      if (resp.status === 200) {
        setData({
          department:
            resp.data.data.DepartmentName === null
              ? ""
              : resp.data.data.DepartmentName,
          shortName:
            resp.data.data.DepartmentSName === null
              ? ""
              : resp.data.data.DepartmentSName,
          description:
            resp.data.data.Description === null
              ? ""
              : resp.data.data.Description,
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

      /// return; // Exit the function once the data is found
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
    department: "",
    shortName: "",
    description: "",
    active: true,
  });
  const [validationErrors, setValidationErrors] = useState({
    department: "",
    shortName: "",
    description: "",
  });

  const handleDepartmentChange = async (value) => {
    setData((prevData) => ({ ...prevData, department: value.slice(0, 100) }));
    if (value === '') {
      return;
    }
    var ob = {
        "table": "Department",
        "name": value.trim(),
        "id": id ? id : "0",
    }
    console.log(ob)
    const resp = await CheckBoxDuplicateRecord(ob);
    console.log(resp);
    if (resp.status === 200) {
      setDisabledBtn(false); if (value.trim().length > 100) {
        setValidationErrors((prevErrors) => ({ ...prevErrors, department: 'Department length should be 100 digits.' }));
      } else {
        setValidationErrors((prevErrors) => ({ ...prevErrors, department: '' }));
      }
    } else if (resp.status === 400) {
      setDisabledBtn(true);
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        department: resp.data.Errors[0].Message,
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
        shortName: "Department Short Name must not be greater than 10 characters.",
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
    setData((prevData) => ({ ...prevData, active: !prevData.active }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};

    if (data.department.trim() === "") {
      errors.department = "Department Name is required.";
    }
    if (data.shortName.trim() === "") {
      errors.shortName = "Department Short Name is required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    if (id) {
      setShowSpin(true);
      try {
        const res = await Department_edit(id, data);
        console.log(res);
        if (res.status === 200) {
          handleExceptionSuccessMessages(res.data.message);
          if (buttonClicked == "submit") {
            setTimeout(function () {
              navigate("/all-department");
            }, 1000);
            setShowSpin(false);
          }
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
          }, 3000);
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
        const res = await Department_entry(data);
        if (res.status === 200) {
          handleExceptionSuccessMessages(res.data.message);
          handleFormReset();
          setShowSpin(false);
          if (buttonClicked == "submit") {
            setTimeout(function () {
              navigate("/all-department");
            }, 1000);
            setShowSpin(false);
          }
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
        } else if (res.status === 201) {
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
    }
  };
  const handleFormReset = () => {
    // Reset the form by updating the state
    setData({
      department: "",
      shortName: "",
      description: "",
      active: true,
    });
    setValidationErrors({
      department: "",
      shortName: "",
      description: "",
    })
  };
  return (
    <Dashboard title={id === undefined ? "New Department" : "Edit Department"}>
      <Helmet>
        <title>
          {id === undefined ? "New Department" : "Edit Department"} | J mehta
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
          {DepartmentAccess ? (
            <div>
              <div className="new_client_title">
                {/* <h2>{id === undefined ? 'New' : 'Edit'} Department</h2> */}
                <Link to="/all-department">
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
                          placeholder="Enter Here"
                          label="Department Name"
                          value={data.department}
                          onChange={(e) => handleDepartmentChange(e)}
                          required
                          autoFocus
                        />
                        {validationErrors.department && (
                          <div className="error">
                            {validationErrors.department}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col ">
                      <div className="new_client_part_1 w-100">
                        <Input2
                          placeholder="Enter Here"
                          label="Department Short Name"
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
                    <button type="reset" className="tab1 save_button me-4">
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
                      <img src="../img/Save.svg" />
                      {id === undefined ? "Save" : "Update"}
                      {buttonClicked === "submit" && showSpin && <Spin />}
                    </button>
                    {id === undefined && (
                      <button
                        type="submit"
                        disabled={disabledBtn}
                        name="saveAndMore"
                        onClick={() => setButtonClicked("saveAndMore")}
                        className="tab1 save_button me-0"
                      >
                        <img src="../img/Save.svg" />
                        Save & More
                        {buttonClicked === "saveAndMore" && showSpin && <Spin />}
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

export default Department;
