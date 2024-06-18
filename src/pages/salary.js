import React, { useState, useEffect, useRef } from "react";
import Dashboard from "../components/dashboard.js";
import { AiFillCloseCircle } from "react-icons/ai";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Input2 from "../components/parts/input2.js";
import {
  SalaryStructure_Dropdown,
  SalaryStructure_edit,
  SalaryStructure_entry,
  SalaryStructure_get_by_id,
  get_Client_Page_Access,
} from "../service/api.js";
import { CheckBoxDuplicateRecord } from "../service/api.js";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import ErrorSnackbar from "../components/ErrorSnackbar.js";
import SuccessSnackbar from "../components/SuccessSnackbar.js";
import Spin from "../components/parts/spin.js";
import Load from "../components/parts/load.js";
import Access_Denied from "./deniedaccess.js";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { Grid } from "react-loader-spinner";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: "50%", // Adjust the width as needed
    maxHeight: "80%", // Adjust the max height as needed
    overflow: "auto", // Allow vertical scrolling if needed
  },
};

const Salary = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [showSpin, setShowSpin] = useState(false);
  const [showLoad, setShowLoad] = useState(true);
  const [ExceptionError, setExceptionError] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [buttonClicked, setButtonClicked] = useState("");
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [tableShow, setTableShow] = useState(false);
  const [basicShow, setBasicShow] = useState(true);
  const [salaryTypeOption, setSalaryTypeOption] = useState([
    { id: 1, label: "CTC" },
    { id: 2, label: "Gross" },
  ]);
  const [type, setType] = useState([
    { id: 1, label: "Fix" },
    { id: 2, label: "Percentage" },
  ]);

  const [salaryStructure, setSalaryStructure] = useState([
    { id: 1, label: "Fix" },
    { id: 2, label: "Percentage" },
    { id: 3, label: "Dependency" },
    { id: 4, label: "Balancing" },
  ]);
  const regex = /^(?!0\d)\d{0,18}(?:\.\d{0,2})?$/;
  const percentRegex =
    /^(?:100(?:\.00?)?|\d{0,2}(?:\.\d{0,2})?|\.(?:\d{1,2})?)$/;
  const [selectedType, setSelectedType] = useState([]);
  const [drip, setDrip] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [inputData, setInputData] = useState([]);
  const [selectedSalaryType, setSelectedSalaryType] = useState([]);
  const [salaryComponentOption, setSalaryComponentOption] = useState([]);
  const [selectedSalaryStructure, setSelectedSalaryStructure] = useState([]);
  const [selectedSalaryComponent, setSelectedSalaryComponent] = useState([]);
  const [dependencyData, setDependencyData] = useState([]);
  const salaryComponentOptionRef = useRef(null);
  const [SalaryComponentShow, setSalaryComponentShow] = useState(false);
  const [addAccess, setAddAccess] = useState(false);
  // console.log("salaryComponentOptionRef", salaryComponentOptionRef)

  useEffect(() => {
    get_SalaryComponent();
    PageAccess();
  }, []);

  const [data, setData] = useState({
    StartRange: "",
    EndRange: "",
    SalaryStructute: [],
    IsActive: true,
    SalaryType: "",
    SalaryStructureName: "",
    SalaryStructureSName: "",

    //Basic
    Amount: "",
    Type: "",

    //Other Salary Components
    SalaryComponent: "",
    SalaryStructureType: "",
    SalaryStructureAmount: "",

  });





  const [validationErrors, setValidationErrors] = useState({
    StartRange: "",
    EndRange: "",
    SalaryType: "",

    Amount: "",
    Type: "",

    SalaryComponent: "",
    SalaryStructureType: "",
    SalaryStructureAmount: " ",
    SalaryStructureName: " ",
    SalaryStructureSName: " ",
    totalAmountKey: " ",

  });

  // const [tempData, settempdata] = useState([]);
  // useEffect(() => {
  //   settempdata(data);
  // }, [data]);

  // console.log("------------------data---------------------", data)
  // console.log("tempdata", tempData);

  // useEffect(() => {
  //   if (tempData.length > 0) {
  //     tempData.forEach((Type, index) => {
  //       let keyToAccess = "";
  //       if (Type.id === 1) {
  //         keyToAccess = "Amount";
  //       } else if (Type.id === 2) {
  //         keyToAccess = "StartRange";
  //       }

  //       if (keyToAccess) {
  //         console.log(`Type ${index + 1}:`, Type[keyToAccess]);
  //       } else {
  //         console.log(`Type ${index + 1} does not have a valid id`);
  //       }
  //     });
  //   }
  // }, [tempData]);

  // const [tempData, setTempData] = useState([]);

  // useEffect(() => {
  //   setTempData(data.SalaryStructute);
  // }, [data]);
  // const [updatedTempData, setUpdatedTempData] = useState(false)
  // useEffect(() => {
  //   if (updatedTempData && (tempData.Type === "1" || tempData.Type === "2")) {
  //     let newKey;
  //     if (tempData.Type === "1") {
  //       newKey = "newKey";
  //       setTempData({
  //         ...tempData,
  //         [newKey]: tempData.Amount
  //       });
  //     } else if (tempData.Type === "2") {
  //       newKey = "newKey";
  //       setTempData({
  //         ...tempData,
  //         [newKey]: tempData.StartRange
  //       });
  //     }
  //     // Reset the flag after updating tempData
  //     setUpdatedTempData(false);
  //   }
  // }, [tempData, updatedTempData]);

  // // This effect watches for changes in data and triggers the update of tempData
  // useEffect(() => {
  //   if (data && data.Type) {
  //     setTempData(data);
  //     setUpdatedTempData(true);
  //   }
  // }, [data.SalaryStructute]);

  // console.log("------------------data---------------------", data);
  // console.log("tempData", tempData);


  //   const [grid, setGrid] = useState([
  //     ["selerycomponent", ""],
  //     ["salarytype", ""],
  //     ["salaryamount", ""]
  // ]);


  //   const [tempGrid, setTempGrid] = useState(false);

  //   useEffect(() => {
  //     setGrid(data);
  //   }, [data]);

  //   useEffect(() => {
  //     if (tempGrid && (grid.Type === "1" || grid.Type === "2")) {
  //       const newKey = "newKey"; // Define the new key here
  //       let updatedValue;

  //       if (grid.Type === "1") {
  //         updatedValue = data.Amount;
  //       } else if (grid.Type === "2") {
  //         updatedValue = data.StartRange;
  //       }

  //       // Update the SalaryStructute array with the new key
  //       setData(prevData => {
  //         const updatedSalaryStructute = prevData.SalaryStructute.map(item => {
  //           if (item.CalculationType === grid.Type) {
  //             return { ...item, [newKey]: updatedValue };
  //           }
  //           return item;
  //         });

  //         return { ...prevData, SalaryStructute: updatedSalaryStructute };
  //       });

  //       setTempGrid(false); // Reset tempGrid after updating
  //     }
  //   }, [tempGrid, grid.Type, data.Amount, data.StartRange]);

  //   useEffect(() => {
  //     if (data.Type) {
  //       setTempGrid(true);
  //     }
  //   }, [data.SalaryStructute, data.Type]);

  //   console.log("grid", grid);




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

  function handleExceptionError(res) {
    setExceptionError((ExceptionError) => [
      ...ExceptionError,
      { id: Date.now(), message: res },
    ]);
  }

  function handleExceptionSuccessMessages(resp) {
    console.log(resp);
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

  const handleStartRangeChange = async (value) => {
    if (/^\d*$/.test(value)) {
      setData((prevData) => ({
        ...prevData,
        StartRange: value.slice(0, 50),
      }));
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        StartRange: "",
      }));
    }
  };

  const handleEndRangeChange = async (value) => {
    if (/^\d*$/.test(value)) {
      setData((prevData) => ({
        ...prevData,
        EndRange: value.slice(0, 50),
      }));
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        EndRange: "",
      }));
    }
  };


  const handleSelectChange = async (event) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedSalaryType(selectedValues);
    const selected = event.target.value;
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      SalaryType: "",
    }));
    setData((prevData) => ({
      ...prevData,
      SalaryType: selected,
    }));
  };

  const get_SalaryComponent = async () => {
    try {
      const res = await SalaryStructure_Dropdown();
      if (res.status === 200) {
        console.log(res.data.SalaryStructureData);
        salaryComponentOptionRef.current = res.data.SalaryStructureData;
        console.log(salaryComponentOptionRef.current);
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

  const PageAccess = async () => {
    try {
      // setLoading(true);
      const res = await get_Client_Page_Access("9");
      console.log(res.data);
      if (res.status === 200) {
        if (id ? res.data.AllowUpdate === true : res.data.AllowAdd === true) {
          setAddAccess(true);
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


  const handleSelectSalaryComponentChange = async (event) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );

    const selected = event.target.value;
    const label = getLabelById(salaryComponentOptionRef.current, selected);
    if (
      data.SalaryStructute?.some((item) => item.SalaryComponentID == selected)
    ) {
      Swal.fire({
        title: `${label} is already selected`,
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    } else {
      setSelectedSalaryComponent(selectedValues);
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        SalaryComponent: "",
      }));
      setData((prevData) => ({
        ...prevData,
        SalaryComponent: selected,
      }));
    }
  };

  const handleSelectSalaryStructureChange = async (event) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    console.log(selectedValues);
    setSelectedSalaryStructure(selectedValues);
    const selected = event.target.value;
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      SalaryStructureType: "",
    }));
    setData((prevData) => ({
      ...prevData,
      SalaryStructureType: selected,
    }));
  };

  const handleSelectSalaryStructureNameChange = async (value) => {
    console.log("event", value);

    if (value !== null) {
      // Regular expression to match alphabetic and numeric characters
      const alphanumericRegex = /^[a-zA-Z0-9]*$/;

      // Check if the entered value contains only alphanumeric characters
      if (!alphanumericRegex.test(value)) {
        // If it contains non-alphanumeric characters, set validation error
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          SalaryStructureName: "Salary Structure Name must contain only alphanumeric characters.",
        }));
      } else {
        // If it contains only alphanumeric characters, clear validation error and update data
        setData((prevData) => ({
          ...prevData,
          SalaryStructureName: value,
        }));
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          SalaryStructureName: "",
        }));
      }
    } else {
      // If the value is null (e.g., when the backspace key is pressed), clear validation error
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        SalaryStructureName: "",
      }));
    }
  };



  const handleSelectSalaryStructureSNameChange = async (value) => {
    console.log("event", value);

    if (value !== null) {
      // Regular expression to match only alphabetic characters
      const alphanumericRegex = /^[a-zA-Z0-9]*$/;

      // Check if the entered value contains only alphanumeric characters
      if (!alphanumericRegex.test(value)) {
        // If it contains non-alphabetic characters, set validation error
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          SalaryStructureSName: "Salary Structure Name must contain only alphanumeric characters.",
        }));
      } else {
        // If it contains only alphabetic characters, clear validation error and update data
        setData((prevData) => ({
          ...prevData,
          SalaryStructureSName: value,
        }));
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          SalaryStructureSName: "",
        }));
      }
    } else {
      // If the value is null (e.g., when the backspace key is pressed), clear validation error
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        SalaryStructureSName: "",
      }));
    }
  };




  const handleAmountChange = async (value) => {
    if (data.Type == "2") {
      if (value === "" || percentRegex.test(value)) {
        setData((prevData) => ({ ...prevData, Amount: value.slice(0, 50) }));
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Amount: "",
        }));
      }
    } else {
      if (value === "" || regex.test(value)) {
        setData((prevData) => ({ ...prevData, Amount: value.slice(0, 50) }));
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          Amount: "",
        }));
      }
    }
  };





  const handleSalaryStructureAmountChange = async (value) => {
    if (data.SalaryStructureType === "2") {
      if (value === "" || percentRegex.test(value)) {
        setData((prevData) => ({
          ...prevData,
          SalaryStructureAmount: value.slice(0, 50),
        }));
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          SalaryStructureAmount: "", // Clear error for SalaryStructureAmount
        }));

        // Clear totalAmountKey error when input is empty
        if (value === "") {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            totalAmountKey: "", // Clear error for totalAmountKey
          }));
        }
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          totalAmountKey: "Invalid input format", // Set error for totalAmountKey when input format is invalid
        }));
      }
    } else {
      if (value === "" || regex.test(value)) {
        setData((prevData) => ({
          ...prevData,
          SalaryStructureAmount: value.slice(0, 50),
        }));
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          SalaryStructureAmount: "", // Clear error for SalaryStructureAmount
        }));

        // Clear totalAmountKey error when input is empty
        if (value === "") {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            totalAmountKey: "", // Clear error for totalAmountKey
          }));
        }
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          totalAmountKey: "Invalid input format", // Set error for totalAmountKey when input format is invalid
        }));
      }
    }
  };


  const handleTypeChange = async (event) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedType(selectedValues);
    const selectedType = event.target.value;
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      Type: "",
    }));
    console.log(selectedType);
    setData((prevData) => ({
      ...prevData,
      Type: selectedType,
    }));
  };

  const api_get = async () => {
    setShowLoad(true);
    setTableShow(true);
    try {
      const resp = await SalaryStructure_get_by_id(id);
      console.log(resp);
      if (resp.status === 200) {
        console.log(resp.data.SalaryStructureData[0].StartRange);
        console.log(resp.data.SalaryStructureDetailData);
        setSelectedSalaryType(resp.data.SalaryStructureData[0].SalaryType);
        const salaryStructute = resp.data.SalaryStructureDetailData.map(
          (item) => {
            if (item.CalculationType === 3) {
              const dependencyValues = JSON.parse(item.CalculationValue);
              console.log(dependencyValues);
              setDependencyData(
                dependencyValues.map((item) => {
                  return {
                    status: true,
                    CalculationValue: item.CalculationValue,
                    SalaryComponentID:
                      item.SalaryComponentID == 0
                        ? "Basic"
                        : getLabelById(
                          salaryComponentOptionRef.current,
                          item.SalaryComponentID
                        ),
                  };
                })
              );
              return {
                SalaryComponentID: item.SalaryComponentID,
                CalculationType: item.CalculationType,
                CalculationValue: dependencyValues.map((item) => ({
                  SalaryComponentID: item.SalaryComponentID,
                  CalculationValue: item.CalculationValue,
                })),
              };
            } else {
              return {
                SalaryComponentID: item.SalaryComponentID,
                CalculationType: item.CalculationType,
                CalculationValue: item.CalculationValue,
              };
            }
          }
        );
        setDrip(
          resp.data.SalaryStructureDetailData.map((item) => {
            if (item.CalculationType === 3) {
              const dependencyValues = JSON.parse(item.CalculationValue);
              setDependencyData(dependencyValues);
              return {
                SalaryComponentID:
                  item.SalaryComponentID == 0
                    ? "Basic"
                    : getLabelById(
                      salaryComponentOptionRef.current,
                      item.SalaryComponentID
                    ),
                CalculationType: "Dependency",
                CalculationValue: dependencyValues.map((item) => ({
                  SalaryComponentID:
                    item.SalaryComponentID == 0
                      ? "Basic"
                      : getLabelById(
                        salaryComponentOptionRef.current,
                        item.SalaryComponentID
                      ),
                  CalculationValue: item.CalculationValue,
                })),
              };
            } else {
              return {
                SalaryComponentID:
                  item.SalaryComponentID == 0
                    ? "Basic"
                    : getLabelById(
                      salaryComponentOptionRef.current,
                      parseInt(item.SalaryComponentID)
                    ),
                CalculationType: getLabelById(
                  salaryStructure,
                  parseInt(item.CalculationType)
                ),
                CalculationValue: item.CalculationValue,
              };
            }
          })
        );
        console.log(drip);
        console.log(salaryStructute);
        const basicData = salaryStructute.filter(
          (item) => item.SalaryComponentID == 0
        );
        const balancingData = salaryStructute.some(
          (item) => item.CalculationType == 4
        );
        console.log(balancingData);
        setBasicShow(false);
        {
          balancingData
            ? setSalaryComponentShow(false)
            : setSalaryComponentShow(true);
        }
        setData({
          StartRange: resp.data.SalaryStructureData[0].StartRange,
          EndRange: resp.data.SalaryStructureData[0].EndRange,
          SalaryType: resp.data.SalaryStructureData[0].SalaryType,
          SalaryStructute: salaryStructute,

          //Basic
          Amount: basicData.CalculationValue,
          Type: basicData.CalculationType,

          //Other Salary Components
          SalaryComponent: "",
          SalaryStructureType: "",
          SalaryStructureAmount: "",
          SalaryStructureName: "",
          SalaryStructureSName: "",


        });
        console.log(data.SalaryStructute);
      } else if (resp.status === 401) {
        handleExceptionError("Unauthorized");
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
      }
      setShowLoad(false);
    } catch (error) {
      handleExceptionError(error.message);
    }

  };
  // console.log("SalaryStructute", data.SalaryStructute)


  const amtkey = async (salaryComponentname, dependencyData) => {
    console.log("salaryComponentname", salaryComponentname)

    try {
      //  console.log("SalaryStructute", SalaryStructute);

      console.log("salaryComponentOptionRef", salaryComponentOptionRef);

      const foundItem = salaryComponentOptionRef.current.find(item => item.name === salaryComponentname);
      const foundItemid = foundItem ? foundItem.id : null;
      console.log('foundItem', foundItemid);
      console.log("foundItemid", foundItemid);

      if (foundItemid) {
        const foundItem2 = data.SalaryStructute.find(item => parseInt(item.SalaryComponentID) === foundItemid);

        console.log("foundItem2", foundItem2)

        return foundItem2.AmountKey;


      } else {


        if (salaryComponentname == 'Basic') {
          console.log("abc")
          console.log("data.SalaryStructute ", data.SalaryStructute[0].AmountKey)
          return data.SalaryStructute[0].AmountKey;

        }

      }




      //   // return null; // Return null if no matching item is found!
    } catch (error) {
      //   console.error("An error occurred:", error);
      //   return null;
    }
  };
  console.log("SalaryStructute", data.SalaryStructute);



  const addDependencyData = async () => {
    console.log("dependency", dependencyData);
    const errors = {};
    let totalAmountKey = 0; // Initialize totalAmountKey

    // Calculate AmountKey for each item in dependencyData
    await Promise.all(dependencyData.map(async (item) => {
      const salaryComponentValue = await amtkey(item.SalaryComponentID);
      const AmountKey = salaryComponentValue * item.CalculationValue / 100;
      totalAmountKey += AmountKey; // Accumulate AmountKey for total calculation

      // Optionally, you can update the item with AmountKey if needed
      // item.AmountKey = AmountKey;
    }));

    console.log("total AmountKey", totalAmountKey);

    // Checking if any CalculationValue is missing or empty
    const isButtonDisabled = dependencyData?.some(
      (item) => !item.CalculationValue || item.CalculationValue === ""
    );

    if (dependencyData.length <= 0 || isButtonDisabled) {
      setSelectedSalaryComponent([]);
      setSelectedSalaryStructure([]);
      return; // Exit function early if there are no items or some are disabled
    }

    // Calculate total from data.SalaryStructute after AmountKey is set
    const currentTotal = data.SalaryStructute.reduce((acc, item) => acc + parseFloat(item.AmountKey || 0), 0);
    const newTotal = currentTotal + totalAmountKey;

    console.log("current total", currentTotal);
    console.log("new total", newTotal);

    // Check against StartRange
    if (newTotal > parseFloat(data.StartRange)) {
      errors.totalAmountKey = 'Total salary exceeds Start Range.';
      setValidationErrors(errors);
      return;
    }

    // Create new row for drip
    let newRow = {
      SalaryComponentID: getLabelById(
        salaryComponentOptionRef.current,
        parseInt(selectedSalaryComponent)
      ),
      CalculationType: "Dependency",
      CalculationValue: dependencyData, // Ensure this is correctly set
      AmountKey: totalAmountKey, // Set the total AmountKey here
    };

    // Update state and reset inputs
    setDrip([...drip, newRow]);
    setIsOpen(false);

    setInputData([]);
    setSelectedRows([]);
    setDependencyData([]);
    setSelectedSalaryComponent([]);
    setSelectedSalaryStructure([]);

    // Update data state with new SalaryStructute entry
    setData((prevData) => ({
      ...prevData,
      SalaryStructureAmount: "",
      SalaryStructute: [
        ...prevData.SalaryStructute,
        {
          CalculationValue: newRow.CalculationValue, // Check if this should be revised
          CalculationType: JSON.stringify(
            getIdByLabel(salaryStructure, newRow.CalculationType)
          ),
          SalaryComponentID: JSON.stringify(
            getIdByLabel(
              salaryComponentOptionRef.current,
              newRow.SalaryComponentID
            )
          ),
          AmountKey: newRow.AmountKey,
        },
      ],
    }));
  };







  const getTotalAmountKey = (salaryStructute) => {
    return salaryStructute.reduce((total, item) => total + parseFloat(item.AmountKey || 0), 0);
  };

  const addMoreData = () => {
    const amount = data.SalaryStructute.filter(
      (item) => item.CalculationType == 2
    ).reduce((total, item) => total + parseFloat(item.CalculationValue), 0);

    const errors = {};

    if (String(data.SalaryStructureName).trim() === "") {
      errors.SalaryStructureName = " SalaryStructureName is required.";
    }
    if (String(data.SalaryStructureSName).trim() === "") {
      errors.SalaryStructureSName = "SalaryStructureSName is required.";
    }
    if (String(data.SalaryComponent).trim() === "") {
      errors.SalaryComponent = "Salary Component is required.";
    }
    if (String(data.SalaryStructureType).trim() === "") {
      errors.SalaryStructureType = "Calculation Type is required.";
    }
    if (parseInt(selectedSalaryStructure) === 1 || parseInt(selectedSalaryStructure) === 2) {
      if (String(data.SalaryStructureAmount).trim() === "") {
        errors.SalaryStructureAmount = "Amount is required.";
      }
      if (String(data.SalaryStructureName).trim() === "") {
        errors.SalaryStructureName = "Amount is required.";
      }
      if (String(data.SalaryStructureSName).trim() === "") {
        errors.SalaryStructureName = "Amount is required.";
      }

      if (data.SalaryStructureAmount) {
        if (data.SalaryStructureType == "2" && !percentRegex.test(data.SalaryStructureAmount)) {
          errors.SalaryStructureAmount = "Amount in percentage cannot be greater than 100";
        }
        if (data.SalaryStructureType == "2" && data.SalaryStructureAmount > 100 - amount) {
          errors.SalaryStructureAmount = "Amount can't be added as it exceeds 100%.";
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    const newRow = {
      SalaryComponentID: getLabelById(salaryComponentOptionRef.current, parseInt(selectedSalaryComponent)),
      CalculationType: getLabelById(salaryStructure, parseInt(selectedSalaryStructure)),
      CalculationValue: selectedSalaryStructure == 4 ? "" : data.SalaryStructureAmount,
    };

    const newAmountKey =
      JSON.stringify(getIdByLabel(salaryStructure, newRow.CalculationType)) === "1"
        ? parseFloat(newRow.CalculationValue)
        : JSON.stringify(getIdByLabel(salaryStructure, newRow.CalculationType)) === "2"
          ? parseFloat(newRow.CalculationValue) * parseFloat(data.StartRange) / 100
          : 0;



    const totalAmountKey = getTotalAmountKey(data.SalaryStructute) + newAmountKey;

    if (totalAmountKey > parseFloat(data.StartRange)) {
      errors.totalAmountKey = ' total salary is more than the Start Range.';
      setValidationErrors(errors);
      return;
    }



    if (selectedSalaryStructure == 3) {
      setIsOpen(true);
      return;
    }

    setDrip([...drip, newRow]);
    setSelectedSalaryComponent([]);
    setSelectedSalaryStructure([]);

    setData((prevData) => {
      if (Object.keys(prevData.SalaryStructute).length === 0) {
        return {
          ...prevData,
          SalaryStructute: [
            {
              CalculationValue: newRow.CalculationValue,
              CalculationType: JSON.stringify(getIdByLabel(salaryStructure, newRow.CalculationType)),
              SalaryComponentID: JSON.stringify(getIdByLabel(salaryComponentOptionRef.current, newRow.SalaryComponentID)),
              AmountKey: newAmountKey
            },

          ],
        };

      } else {
        return {
          ...prevData,
          SalaryStructute: [
            ...prevData.SalaryStructute,
            {
              CalculationValue: newRow.CalculationValue,
              CalculationType: JSON.stringify(getIdByLabel(salaryStructure, newRow.CalculationType)),
              SalaryComponentID: JSON.stringify(getIdByLabel(salaryComponentOptionRef.current, newRow.SalaryComponentID)),
              AmountKey: newAmountKey
            },
          ],
        };
      }
    });

    if (selectedSalaryStructure == 4) {
      setSalaryComponentShow(false);
    }
    setTableShow(true);

    setData((prevData) => ({
      ...prevData,
      SalaryComponent: "",
      SalaryStructureType: "",
      SalaryStructureAmount: "",
    }));
    setSelectedSalaryComponent([]);
    setSelectedSalaryStructure([]);
  };


  const addBasicData = async () => {
    const errors = {};

    if (String(data.Amount).trim() === "") {
      errors.Amount = "Basic Amount is required.";
    }
    if (String(data.Type).trim() === "") {
      errors.Type = "Calculation Type is required.";
    }
    if (String(data.StartRange).trim() === "") {
      errors.StartRange = "Start Range is required.";
    }
    if (String(data.EndRange).trim() === "") {
      errors.EndRange = "End Range is required.";
    }
    if (data.Amount) {
      if (data.Type == "2" && !percentRegex.test(data.Amount)) {
        errors.Amount = "Amount in percentage cannot be greater than 100";
      }
    }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    console.log("data", data);

    const newRow = {
      SalaryComponentID: "Basic",
      CalculationType: getLabelById(salaryStructure, data.Type),
      CalculationValue: data.Amount,
    };

    const newAmountKey =
      JSON.stringify(getIdByLabel(salaryStructure, newRow.CalculationType)) === "1"
        ? parseFloat(newRow.CalculationValue)
        : JSON.stringify(getIdByLabel(salaryStructure, newRow.CalculationType)) === "2"
          ? parseFloat(newRow.CalculationValue) * parseFloat(data.StartRange) / 100
          : 0;

    const totalAmountKey = getTotalAmountKey(data.SalaryStructute) + newAmountKey;

    if (totalAmountKey > parseFloat(data.StartRange)) {
      errors.Amount = "Total salary exceeds Start Range.";
      setValidationErrors(errors);
      return;
    }

    setDrip([...drip, newRow]);
    setTableShow(true);

    setData((prevData) => {
      if (Object.keys(prevData.SalaryStructute).length === 0) {
        return {
          ...prevData,
          SalaryStructute: [
            {
              CalculationValue: newRow.CalculationValue,
              CalculationType: JSON.stringify(getIdByLabel(salaryStructure, newRow.CalculationType)),
              SalaryComponentID: newRow.SalaryComponentID === "Basic" ? "0" : "",
              AmountKey: newAmountKey
            },
          ],
        };
      } else {
        return {
          ...prevData,
          SalaryStructute: [
            ...prevData.SalaryStructute,
            {
              CalculationValue: newRow.CalculationValue,
              CalculationType: JSON.stringify(getIdByLabel(salaryStructure, newRow.CalculationType)),
              SalaryComponentID: newRow.SalaryComponentID === "Basic" ? "0" : "",
              AmountKey: newAmountKey
            },
          ],
        };
      }
    });

    setBasicShow(false);
    setSalaryComponentShow(true);
    setSelectedType("");
  };




  const getLabelById = (data_array, id) => {
    const foundItem = data_array?.find((item) => item.id == id);
    return foundItem ? foundItem.label : null;
  };

  const getIdByLabel = (data_array, SalaryComponentID) => {
    const foundItem = data_array?.find(
      (item) => item.label == SalaryComponentID
    );
    return foundItem ? foundItem.id : null;
  };

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }
  function closeModal() {
    setIsOpen(false);
    setInputData([]);
    setSelectedRows([]);
    setDependencyData([]);
    setSelectedSalaryComponent("");
    setSelectedSalaryStructure("");
  }

  const handleCheckBoxChange = (index) => {
    console.log(index);
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = [...prevSelectedRows];
      newSelectedRows[index] = !newSelectedRows[index];
      console.log(newSelectedRows);
      const newData = newSelectedRows.map((item, i) => {
        if (i === index) {
          if (newSelectedRows[i] === true) {
            return { ...dependencyData[i], status: newSelectedRows[i] };
          } else {
            return;
          }
        }
        return dependencyData[i];
      });
      console.log(newData);
      setDependencyData(
        newData.filter((item) => {
          return item !== undefined;
        })
      );
      return newSelectedRows;
    });
  };

  const handleInputDataChange = (
    SalaryComponentID,
    index,
    CalculationValue
  ) => {
    console.log(dependencyData);
    if (CalculationValue === "" || percentRegex.test(CalculationValue)) {
      setInputData((prevInputData) => {
        const newInputData = [...prevInputData];
        newInputData[index] = CalculationValue;
        console.log(newInputData);

        const newData = newInputData.map((item, i) => {
          if (i === index) {
            return {
              ...dependencyData[i],
              CalculationValue: CalculationValue,
              SalaryComponentID: SalaryComponentID,
            };
          }
          return dependencyData[i];
        });
        console.log(newData);
        setDependencyData(
          newData.filter((item) => {
            return item !== undefined;
          })
        );
        return newInputData;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(data);
    const errors = {};
    if (String(data.SalaryStructureName).trim() === "") {
      errors.SalaryStructureName = "SalaryStructureName  is required.";
    }
    if (String(data.SalaryStructureSName).trim() === "") {
      errors.SalaryStructureSName = "SalaryStructuresName  is required.";
    }
    if (String(data.StartRange).trim() === "") {
      errors.StartRange = "Start Range  is required.";
    }
    if (data.StartRange) {
      console.log(typeof data.StartRange);
    }
    if (String(data.EndRange).trim() === "") {
      errors.EndRange = "End Range  is required.";
    }
    if (String(data.SalaryType).trim() === "") {
      errors.SalaryType = "Salary Type is required.";
    }
    if (String(data.Amount).trim() === "") {
      errors.Amount = "Basic Amount  is required.";
    }
    if (String(data.Type).trim() === "") {
      errors.Type = "Calculation Type is required.";
    }
    if (
      String(data.SalaryStructureAmount) ||
      String(data.SalaryComponent) ||
      String(data.SalaryStructureType)
    ) {
      errors.SalaryComponent = "Remaining fields must be filled";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    console.log("data is validated now api call")

    if (id) {
      setShowSpin(true);
      try {
        const res = await SalaryStructure_edit(id, data);
        if (res.status === 200) {
          console.log(res);
          console.log(res.data.message);
          handleExceptionSuccessMessages(res.data.message);
          handleFormReset();
          if (buttonClicked == "submit") {
            setTimeout(function () {
              navigate("/salary-structure-list");
            }, 1000);
            setShowSpin(false);
          }
        } else if (res.status === 201) {
          var dataError = res.data.Errors;
          dataError.map((message, index) => {
            handleExceptionError(message.Message);
          });
        } else if (res.status === 400) {
          console.log(res);
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
          if (res.data.message) {
            handleExceptionError(res.data.message);
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
        const res = await SalaryStructure_entry(data);
        if (res.status === 200) {
          handleExceptionSuccessMessages(res.data.message);
          handleFormReset();
          setShowSpin(false);
          if (buttonClicked == "submit") {
            setTimeout(function () {
              navigate("/salary-structure-list");
            }, 1000);
            setShowSpin(false);
          }
        } else if (res.status === 201) {
          var dataError = res.data.Errors;
          dataError.map((message, index) => {
            handleExceptionError(message.Message);
          });
        } else if (res.status === 400) {
          console.log(res);
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
          if (res.data.message) {
            handleExceptionError(res.data.message);
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
    setData({
      StartRange: "",
      EndRange: "",
      SalaryType: "",
      SalaryStructute: {},
      Amount: "",
      Type: "",
      SalaryComponent: "",
      SalaryStructureType: "",
      SalaryStructureAmount: "",
      SalaryStructureName: "",
      SalaryStructureSName: "",

    });
    setSelectedSalaryComponent("");
    setSelectedSalaryStructure("");
    setSelectedType("");
    setSelectedSalaryType([]);
    setDrip([]);
    setTableShow(false);
    setBasicShow(true);
    setSalaryComponentShow(false);
    setValidationErrors({
      StartRange: "",
      EndRange: "",
      Amount: "",
      SalaryType: "",
      Type: "",
      SalaryComponent: "",
      SalaryStructureType: "",
      SalaryStructureAmount: "",
      SalaryStructureName: "",
      SalaryStructureSName: "",

    });
  };

  // const handleUpdate = (
  //   SalaryComponentID,
  //   CalculationType,
  //   CalculationValue
  // ) => {
  //   // console.log(getIdByLabel(salaryStructure, CalculationType));
  //   if (SalaryComponentID === "Basic") {
  //     setIsOpen1(true);
  //     const newDrip = drip.filter((item) => {
  //       return item.SalaryComponentID !== SalaryComponentID;
  //     });
  //     setDrip(newDrip);
  //     const newData = data.SalaryStructute.filter((item) => {
  //       return item.SalaryComponentID !== 0;
  //     });
  //     console.log(newData);
  //     setData((prevData) => ({
  //       ...prevData,
  //       SalaryStructute: newData,
  //     }));
  //     setSelectedType(getIdByLabel(salaryStructure, CalculationType));
  //     setData((prevData) => ({
  //       ...prevData,
  //       Amount: CalculationValue,
  //       Type: getIdByLabel(salaryStructure, CalculationType),
  //     }));
  //   } else {
  //     if (CalculationType === "Dependency") {
  //       setIsOpen(true);
  //       console.log(dependencyData);
  //       const newDrip = drip.filter((item) => {
  //         return item.SalaryComponentID !== SalaryComponentID;
  //       });
  //       console.log(newDrip);
  //       setDrip(newDrip);
  //       const newData = data.SalaryStructute.filter((item) => {
  //         return (
  //           item.SalaryComponentID !==
  //           getIdByLabel(salaryComponentOptionRef.current, SalaryComponentID)
  //         );
  //       });
  //       console.log(newData);
  //       setSelectedSalaryComponent(
  //         getIdByLabel(salaryComponentOptionRef.current, SalaryComponentID)
  //       );
  //       setData((prevData) => ({
  //         ...prevData,
  //         SalaryStructute: newData,
  //       }));
  //     } else if (CalculationType === "Balancing") {
  //       console.log("Balancing");
  //     } else {
  //       setIsOpen2(true);
  //       const newDrip = drip.filter((item) => {
  //         return item.SalaryComponentID !== SalaryComponentID;
  //       });
  //       console.log(newDrip);
  //       setDrip(newDrip);
  //       const newData = data.SalaryStructute.filter((item) => {
  //         return (
  //           item.SalaryComponentID !==
  //           getIdByLabel(salaryComponentOptionRef.current, SalaryComponentID)
  //         );
  //       });
  //       console.log(newData);
  //       setData((prevData) => ({
  //         ...prevData,
  //         SalaryStructute: newData,
  //       }));
  //       setSelectedSalaryStructure(
  //         getIdByLabel(salaryStructure, CalculationType)
  //       );
  //       setSelectedSalaryComponent(
  //         getIdByLabel(salaryComponentOptionRef.current, SalaryComponentID)
  //       );
  //       setData((prevData) => ({
  //         ...prevData,
  //         SalaryStructureAmount: CalculationValue,
  //       }));
  //     }
  //   }
  // };


  const handleDelete = (
    SalaryComponentID,
    CalculationType,
    CalculationValue
  ) => {
    console.log(data.SalaryStructute);
    const hasDependency = data.SalaryStructute?.some((item) => {
      return (
        item.CalculationType == 3 &&
        item.CalculationValue?.some(
          (dependency) =>
            dependency.SalaryComponentID ==
            (SalaryComponentID === "Basic"
              ? 0
              : getIdByLabel(
                salaryComponentOptionRef.current,
                SalaryComponentID
              ))
        )
      );
    });
    console.log(hasDependency);
    if (SalaryComponentID === "Basic") {
      if (hasDependency) {
        Swal.fire({
          title: `Cannot Delete '${SalaryComponentID}' as it is referenced as a Dependency`,
          icon: "error",
          showConfirmButton: true,
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });
      } else {
        if (data.SalaryStructute.length > 1) {
          Swal.fire({
            title: `Cannot Delete '${SalaryComponentID}' before other Components`,
            icon: "error",
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
          });
        } else {
          const newDrip = drip.filter((item) => {
            return item.SalaryComponentID != SalaryComponentID;
          });
          console.log(newDrip);
          console.log(data.SalaryStructute);
          setDrip(newDrip);
          const newData = data.SalaryStructute.filter((item) => {
            return item.SalaryComponentID != 0;
          });
          setData((prevData) => ({
            ...prevData,
            Type: "",
            Amount: "",
            SalaryStructute: newData,
          }));
          setBasicShow(true);
          setTableShow(false);
          setSalaryComponentShow(false);
        }
      }
    } else {
      if (CalculationType === "Dependency") {
        if (hasDependency) {
          Swal.fire({
            title: `Cannot Delete '${SalaryComponentID}' Component as it is referenced as a Dependency`,
            icon: "error",
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
          });
        } else {
          const newDrip = drip.filter((item) => {
            return item.SalaryComponentID != SalaryComponentID;
          });
          console.log(newDrip);
          setDrip(newDrip);
          const newData = data.SalaryStructute.filter((item) => {
            return (
              item.SalaryComponentID !=
              getIdByLabel(salaryComponentOptionRef.current, SalaryComponentID)
            );
          });
          console.log(newData);
          setData((prevData) => ({
            ...prevData,
            SalaryStructureAmount: "",
            SalaryStructute: newData,
          }));
        }
        console.log(data.SalaryStructute);
      } else {
        if (CalculationType == "Balancing") {
          setSalaryComponentShow(true);
        }
        if (hasDependency) {
          Swal.fire({
            title: `Cannot Delete '${SalaryComponentID}' Component as it is referenced as a Dependency`,
            icon: "error",
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
          });
        } else {
          const newDrip = drip.filter((item) => {
            return item.SalaryComponentID != SalaryComponentID;
          });
          console.log(newDrip);
          setDrip(newDrip);
          const newData = data.SalaryStructute.filter((item) => {
            return (
              item.SalaryComponentID !=
              getIdByLabel(salaryComponentOptionRef.current, SalaryComponentID)
            );
          });
          console.log(newData);
          setData((prevData) => ({
            ...prevData,
            SalaryStructute: newData,
          }));
          setData((prevData) => ({
            ...prevData,
            SalaryStructureAmount: "",
          }));
        }
        console.log(data.SalaryStructute);
      }
    }
  };

  return (
    <HelmetProvider>
      <Dashboard
        title={
          id === undefined ? "New Salary Structure" : "Edit Salary Structure"
        }
      >
        <Helmet>
          <title>
            {id === undefined ? "New Salary" : "Edit Salary"} Structure | J
            mehta
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
        <div className="new_client_title">
          <Link to="/salary-structure-list">
            <button>
              <AiFillCloseCircle />
              Close
            </button>
          </Link>
        </div>
        {showLoad ? (
          <Load />
        ) : (
          <>
            {addAccess ? (
              <>
                {" "}
                <div className="new_client_content_wrapper">
                  <div className="new_client_menu"></div>
                  <form
                    onSubmit={handleSubmit}
                    onReset={handleFormReset}
                    className="salary-form"
                  >

                    <div className="row ">
                      <div className="col new_client_form">
                        <div className="new_client_part_1 w-100">
                          <Input2
                            type="text"
                            placeholder="Enter Here"
                            label="Salary Structure Name" // Corrected label name
                            required
                            value={data.SalaryStructureName}
                            onChange={(e) => handleSelectSalaryStructureNameChange(e)}
                          />

                          {validationErrors.SalaryStructureName && (
                            <div className="error">
                              {validationErrors.SalaryStructureName}
                            </div>
                          )}

                        </div>
                      </div>
                      <div className="col new_client_form">
                        <div className="new_client_part_1 w-100">
                          <Input2
                            type="text"
                            placeholder="Enter Here"
                            label="Salary Structure SName"
                            required
                            value={data.SalaryStructureSName}
                            onChange={(e) => handleSelectSalaryStructureSNameChange(e)}
                          />
                          {validationErrors.SalaryStructureSName && (
                            <div className="error">
                              {validationErrors.SalaryStructureSName}
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    <>
                      <div className="row">
                        <div className="col new_client_form">
                          <div className="new_client_part_1 w-100">
                            <div className="dashboard_input_feild">
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
                        </div>
                        <div className="col new_client_form">
                          <div className="new_client_part_1 w-100">
                            <div className="dashboard_input_feild client_locationDate">
                              <Input2
                                type={"text"}
                                placeholder="Enter Here"
                                label="End Range"
                                required
                                value={data.EndRange}
                                onChange={(e) => handleEndRangeChange(e)}
                              />
                            </div>
                            {validationErrors.EndRange && (
                              <div className="error">
                                {validationErrors.EndRange}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col new_client_form">
                          <div
                            className="new_client_part_1 w-100"
                            style={{ marginBottom: "1rem" }}
                          >
                            <label className="salary-label">
                              Salary Type
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                              className="py-0 me_height"
                              value={selectedSalaryType}
                              // selectedOptions={selectedSalaryType}
                              onChange={handleSelectChange}
                              style={{ height: "2.6rem" }}
                            >
                              <option value="" hidden>
                                Salary Type
                              </option>
                              {salaryTypeOption.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {validationErrors.SalaryType && (
                              <div className="error mt-2">
                                {validationErrors.SalaryType}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* </div> */}

                        {basicShow && (
                          <>
                            <div className="row" style={{ fontFamily: "Geometria" }}>
                              <div className="col new_client_form">
                                <div className="new_client_part_1 w-100">
                                  <Input2
                                    type="text"
                                    placeholder="Enter Here"
                                    label="Amount"
                                    required
                                    value={data.Amount}
                                    onChange={(e) => handleAmountChange(e)}
                                  />
                                  {validationErrors.Amount && (
                                    <div className="error">
                                      {validationErrors.Amount}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="col new_client_form">
                                <div className="new_client_part_1 w-100">
                                  <label className="salary-label">
                                    Basic
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                  <select
                                    className="py-0 me_height"
                                    // selectedOptions={selectedType}
                                    value={selectedType}
                                    onChange={handleTypeChange}
                                    style={{ height: "2.6rem" }}
                                  >
                                    <option value="" hidden>
                                      Type
                                    </option>
                                    {type.map((option) => (
                                      <option key={option.id} value={option.id}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                  {validationErrors.Type && (
                                    <div className="error mt-2">
                                      {validationErrors.Type}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="col new_client_form">
                                <div
                                  className="new_client_part_1 w-100"
                                  style={{ marginBottom: "1rem" }}
                                >
                                  <div className="btn_save mt-4">
                                    <button
                                      onClick={addBasicData}
                                      className="tab1 button_transparent"
                                      type="button"
                                    >
                                      Add
                                      <AiOutlinePlusCircle />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </>



                        )}



                        {/* <div className="col new_client_form"></div> */}
                      </div>
                    </>


                    {SalaryComponentShow && (
                      <div className="row ">
                        <div className="col new_client_form">
                          <div className="new_client_part_1 w-100">
                            <label className="row-table">Salary Component</label>
                            <select
                              className="py-0 me_height"
                              value={selectedSalaryComponent}
                              // selectedOptions={selectedSalaryComponent}
                              onChange={handleSelectSalaryComponentChange}
                              style={{ height: "2.5rem" }}
                            >
                              <option value="" hidden>
                                Select Salary Component
                              </option>
                              {salaryComponentOptionRef.current?.map(
                                (option) => {
                                  const isOptionAlreadySelected =
                                    data.SalaryStructute?.some(
                                      (item) =>
                                        item.SalaryComponentID == option.id
                                    );

                                  return (
                                    <option
                                      key={option.id}
                                      value={option.id}
                                      hidden={isOptionAlreadySelected}
                                    >
                                      {option.label}
                                    </option>
                                  );
                                }
                              )}
                            </select>
                            {validationErrors.SalaryComponent && (
                              <div className="error mt-2">
                                {validationErrors.SalaryComponent}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col new_client_form">
                          <div className="new_client_part_1 w-100">
                            <label className="row-table">Salary Structure</label>
                            <select
                              className="py-0 me_height"
                              value={selectedSalaryStructure}
                              // selectedOptions={selectedSalaryStructure}
                              onChange={handleSelectSalaryStructureChange}
                              style={{ height: "2.5rem" }}
                            >
                              <option value="" hidden>
                                Select Salary Structure
                              </option>
                              {salaryStructure.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {validationErrors.SalaryStructureType && (
                              <div className="error mt-2">
                                {validationErrors.SalaryStructureType}
                              </div>
                            )}
                          </div>
                        </div>

                        {(parseInt(selectedSalaryStructure) === 1 ||
                          parseInt(selectedSalaryStructure) === 2) && (
                            <div className="col new_client_form">
                              <div className="new_client_part_1 w-100">
                                <Input2
                                  type={"text"}
                                  placeholder="Enter Here"
                                  label="Amount"
                                  className="py-1"
                                  value={data.SalaryStructureAmount}
                                  onChange={(e) =>
                                    handleSalaryStructureAmountChange(e)
                                  }
                                  style={{ height: "2.5rem" }}
                                />
                                {validationErrors.totalAmountKey && (
                                  <div className="error">{validationErrors.totalAmountKey}</div>
                                )}
                                {validationErrors.SalaryStructureAmount && (
                                  <div className="error">
                                    {validationErrors.SalaryStructureAmount}
                                  </div>

                                )}
                              </div>
                            </div>
                          )}

                        <div className="col new_client_form">
                          <div className="btn_save mt-4">
                            <button
                              onClick={addMoreData}
                              className="tab1 button_transparent"
                              type="button"

                            >
                              Add

                              <AiOutlinePlusCircle />

                            </button>

                          </div>

                        </div>
                      </div>
                    )}

                    <div className="row new_client_form">
                      {tableShow && (
                        <div className="client_panel_option mt-5">
                          <table className="client_panel_list_table salary-modal-table">
                            <thead>
                              <tr>
                                <th>Action</th>
                                <th>Salary Component</th>
                                <th>Salary Structure </th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {drip.map((row, index) => (
                                <tr key={index}>
                                  <td>
                                    {/* {id && (
                                <>
                                  <button
                                    type="button"
                                    className="btn salary-edit"
                                    onClick={() =>
                                      handleUpdate(
                                        row.SalaryComponentID,
                                        row.CalculationType,
                                        row.CalculationValue
                                      )
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="17"
                                      height="17"
                                      fill="currentColor"
                                      className="bi bi-pen"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                                    </svg>
                                  </button>
                                </>
                              )} */}
                                    {!(row.SalaryComponentID === "Basic") ? (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleDelete(
                                              row.SalaryComponentID,
                                              row.CalculationType,
                                              row.CalculationValue
                                            )
                                          }
                                          className="btn salary-delete"
                                        // disabled={}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-trash"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
                                          </svg>
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        {drip.length == 1 && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleDelete(
                                                row.SalaryComponentID,
                                                row.CalculationType,
                                                row.CalculationValue
                                              )
                                            }
                                            className="btn salary-delete"
                                          // disabled={}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              className="bi bi-trash"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
                                            </svg>
                                          </button>
                                        )}
                                      </>
                                    )}
                                  </td>
                                  <td>{row.SalaryComponentID}</td>
                                  <td>{row.CalculationType}</td>
                                  {row.CalculationType === "Dependency" ? (
                                    <td>
                                      {row.CalculationValue.map((item, i) => (
                                        <span key={i}>
                                          {!percentRegex.test(
                                            item.SalaryComponentID
                                          )
                                            ? item.SalaryComponentID
                                            : row.SalaryComponentID == 0
                                              ? "Basic"
                                              : getLabelById(
                                                salaryComponentOptionRef.current,
                                                item.SalaryComponentID
                                              )}
                                          ({item.CalculationValue}
                                          %)
                                          {i !==
                                            row.CalculationValue.length - 1 &&
                                            ", "}
                                        </span>
                                      ))}
                                    </td>
                                  ) : (
                                    <td>
                                      {row.CalculationValue}
                                      {row.CalculationType == "Percentage" ? (
                                        <span>%</span>
                                      ) : (
                                        <span></span>
                                      )}
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    <div className="btn_save d-flex mt-5 justify-content-end">
                      <button type="reset" className="tab1 save_button">
                        <img src="../img/clockwise.svg" />
                        Reset
                      </button>
                      <button
                        type="submit"
                        name="save"
                        onClick={() => setButtonClicked("submit")}
                        className="tab1 save_button"
                      >
                        <>
                          <img src="../img/Save.svg" />
                          {id === undefined ? "Save" : "Update"}
                          {showSpin && buttonClicked == "submit" && <Spin />}
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
                            {showSpin && buttonClicked == "saveAndMore" && (
                              <Spin />
                            )}
                          </>
                        </button>
                      )}
                    </div>
                  </form>
                </div>
                <Modal
                  isOpen={modalIsOpen}
                  onAfterOpen={afterOpenModal}
                  onRequestClose={closeModal}
                  style={customStyles}
                  contentLabel="Example Modal"
                >
                  <div className="new-client-title m-0">
                    <table className="client_panel_list_table salary-modal-table">
                      <thead>
                        <tr>
                          <th>Checkbox</th>
                          <th>Name </th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      {/* {!id ? (
                  <> */}
                      <tbody>
                        {drip.map((row, index) => (
                          <tr key={row.id}>
                            <td>
                              <label className="label_main">
                                <input
                                  type="checkbox"
                                  onChange={() => handleCheckBoxChange(index)}
                                  checked={selectedRows[index]}
                                />
                                <span className="geekmark"> </span>
                              </label>
                            </td>
                            <td>{row.SalaryComponentID}</td>
                            <td className="salary">
                              <Input2
                                type={"text"}
                                disabled={!selectedRows[index]}
                                placeholder={
                                  !selectedRows[index] ? "" : "Enter Value Here"
                                }
                                required
                                className={"salary-input"}
                                value={inputData[index]}
                                onChange={(e) =>
                                  handleInputDataChange(
                                    row.SalaryComponentID,
                                    index,
                                    e
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {/* </>
                ) : (
                  <>
                    <tbody>
                      {Array.isArray(dependencyData) &&
                        dependencyData.map((row, index) => (
                          <tr key={row.id}>
                            <td>
                              <label className="label_main">
                                <input type="checkbox" checked={1} />
                                <span className="geekmark"> </span>
                              </label>
                            </td>
                            <td>
                              {row.SalaryComponentID == 0
                                ? "Basic"
                                : getLabelById(
                                    salaryComponentOptionRef.current,
                                    row.SalaryComponentID
                                  )}
                            </td>
                            <td>
                              <Input2
                                type={"text"}
                                placeholder="Enter Here"
                                required
                                value={row.CalculationValue}
                                onChange={(e) =>
                                  UpdateInputDataChange(
                                    row.SalaryComponentID,
                                    index,
                                    e
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </>
                )} */}
                    </table>
                    <div className="mt-2">
                      <div className="new_client_title">
                        <button
                          className="tab1 save_button"
                          onClick={addDependencyData}
                        >
                          <img src="../img/Save.svg" />
                          Save
                        </button>{" "}
                        <button onClick={closeModal}>
                          <AiFillCloseCircle />
                          Close
                        </button>

                      </div>
                      {validationErrors.totalAmountKey && (
                        <div className="error">
                          {validationErrors.totalAmountKey}
                        </div>
                      )}

                    </div>

                  </div>
                </Modal>
              </>
            ) : (
              <Access_Denied />
            )}
          </>
        )}
      </Dashboard>
    </HelmetProvider>
  );
};

export default Salary;

