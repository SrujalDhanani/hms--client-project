// App.js
import React, { useState, useEffect, useRef } from "react";
import Dashboard from "../components/dashboard.js";
import { AiFillPlusCircle } from "react-icons/ai";
import { Helmet } from "react-helmet";
import {
  SalaryComponent_entry_get,
  ExportDesignation_api,
  UploadFile_api,
  ImportDesignation_api,
  ImportDesignation_api_final,
  get_Client_Page_Access,
  SalaryComponentConfigurationSave,
  DeleteSalaryComponent_by_id,
} from "../service/api.js";
import { Link, useNavigate } from "react-router-dom";
import CustomPagination from "../components/CustomPagination.js";
import ErrorSnackbar from "./../components/ErrorSnackbar.js";
import SuccessSnackbar from "./../components/SuccessSnackbar.js";
import EditActionBtn from "../components/EditActionBtn.js";
import DeleteActionBtn from "../components/DeleteActionBtn.js";
import Swal from "sweetalert2";
import Load from "../components/parts/load.js";
import Access_Denied from "./deniedaccess.js";

const SalaryData = () => {
  const [ShowLoad, setShowLoad] = useState(true);
  var searchData = "";
  var currentPageItem = 1;
  var recordPerPageItem = 10;
  const [columns, setColumns] = useState([]);
  const [desi_list, setDesiList] = useState([]);
  const [recordPerPage, setRecordPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [isOptionsDropdownOpen, setIsOptionsDropdownOpen] = useState(false);
  const [isColumnChooserDropdownOpen, setIsColumnChooserDropdownOpen] =
    useState(false);
  const [reason, setReason] = useState(false);
  const [StoreFileName, setStoreFileName] = useState("");
  const [ExceptionError, setExceptionError] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [ViewAccesss, setViewAccess] = useState(true);
  const [AllAccess, setAllAccessData] = useState({});

  const isAllowUpdate = () => {
    return AllAccess.AllowUpdate === "1" && AllAccess.AllowView === "1";
  };

  const isAllowDelete = () => {
    return AllAccess.AllowDelete === "1" && AllAccess.AllowView === "1";
  };

  const isAllowAdd = () => {
    return AllAccess.AllowAdd === "1";
  };

  const shouldRenderTh =
    AllAccess.AllowView === "1" &&
    AllAccess.AllowDelete === "0" &&
    AllAccess.AllowUpdate === "0";

  const isEffectExecutedRef = useRef(false);

  useEffect(() => {
    if (!isEffectExecutedRef.current) {
      fetchData();
      isEffectExecutedRef.current = true;
    }
  }, []);

  const [pageAccess, setPageAccess] = useState({
    AllowAdd: 1,
    AllowUpdate: 1,
    AllowDelete: 1,
    AllowView: 1,
  });
  const pageAccessData = async () => {
    try {
      const resp = await get_Client_Page_Access("7");
      console.log(resp);
      if (resp.status === 200) {
        console.log(resp.data);
        const clientPageAccess = {
          AllowAdd: resp.data.AllowAdd ? 1 : 0,
          AllowUpdate: resp.data.AllowUpdate ? 1 : 0,
          AllowDelete: resp.data.AllowDelete ? 1 : 0,
          AllowView: resp.data.AllowView ? 1 : 0,
        };
        setPageAccess(clientPageAccess);
        console.log(clientPageAccess);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    pageAccessData();
  }, []);

  const visibilityStyle = (pageAccess) => {
    const AllowUpdateS = pageAccess.AllowUpdate;
    const AllowDeleteS = pageAccess.AllowDelete;

    return {
      AllowUpdateS: AllowUpdateS
        ? { visibility: "visible" }
        : { visibility: "hidden" },
      AllowDeleteS: AllowDeleteS
        ? { visibility: "visible" }
        : { visibility: "hidden" },
    };
  };

  const { AllowUpdateS, AllowDeleteS } = visibilityStyle(pageAccess);

  const handleNewUser = () => {
    if (pageAccess.AllowAdd) {
      navigate("/salary-add");
    } else {
      navigate("/deniedaccess");
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
  const handleDragStart = (e, index) => {
    setDraggedColumn(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const newColumns = [...columns];
    const draggedItem = newColumns[draggedColumn];
    newColumns.splice(draggedColumn, 1);
    newColumns.splice(index, 0, draggedItem);
    setColumns(newColumns);
    setDraggedColumn(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    currentPageItem = page;
    fetchData();
  };

  const fetchData = async () => {
    try {
      var dataObject = {
        filter: searchData,
        page: currentPageItem,
        limit: recordPerPageItem,
      };
      console.log(dataObject);
      const res = await SalaryComponent_entry_get(dataObject);
      if (res) {
        if (res.status === 200) {
          console.log(res);
          var logConfig = res.data.SalaryComponentsLogConfig;
          var logColumns = res.data.SalaryComponentsLogColumns;
          var newColumnArray = [];
          if (logConfig && logConfig.length > 0) {
            logColumns.forEach((column) => {
              if (column.Status === "Config") {
                let configMatch = logConfig.find(
                  (config) => config.ColumnName === column.ColumnName
                );
                if (configMatch) {
                  column.IsActive = configMatch.IsActive;
                  column.Priority = configMatch.Priority;
                  if (configMatch.Alias) {
                    column.Alias = configMatch.Alias;
                  }
                }
                newColumnArray.push({ ...column });
                newColumnArray = sortByPriority(newColumnArray);
              }
            });
          } else {
            logColumns.forEach((data) => {
              if (data.Status === "Config") {
                data.IsActive = true;
                newColumnArray.push(data);
              }
            });
          }
          setDesiList(res.data.data);
          setTotalPage(res.data.totalAllData);
          setColumns(newColumnArray);
          setReason(false);
          setShowLoad(false);
        } else if (res.status === 400) {
          handleExceptionError(res.data.ErrorMessage);
        } else if (res.status === 401) {
          handleExceptionError("Unauthorized");
          setTimeout(() => {
            localStorage.clear();
            navigate("/");
          }, 1000);
          ///logout();
        } else if (res.status === 500) {
          res = "Request failed with status code 500";
          handleExceptionError(res);
        }
      } else {
        res = "Request failed with status code 500";
        handleExceptionError(res);
      }
    } catch (error) {
      handleExceptionError(error.message);
    }
  };

  const sortByPriority = (dataArray) => {
    return dataArray.sort((a, b) => {
      return parseInt(a.Priority) - parseInt(b.Priority);
    });
  };
  const handleSalaryChooserChange = (index) => {
    const updatedColumns = [...columns];
    updatedColumns[index].IsActive = !updatedColumns[index].IsActive;
    setColumns(updatedColumns); // Check if this line is causing an infinite loop
    console.log(columns);
  };

  const handleSearchBox = (event) => {
    setSearch(event.target.value);
    searchData = event.target.value;
    fetchData();
  };

  const handleConfigurationSave = async () => {
    var newData = [];
    columns.map((columnData, index) => {
      var oj = {
        ColumnName: columnData.ColumnName,
        Priority: index + 1,
        IsActive: columnData.IsActive,
      };
      newData.push(oj);
    });
    try {
      const res = await SalaryComponentConfigurationSave(newData);
      if (res.status === 200) {
        handleExceptionSuccessMessages(res.data.message);
        setIsColumnChooserDropdownOpen(false);
      } else if (res.status === 401) {
        handleExceptionError("Unauthorized");
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
      } else {
        handleExceptionError(res);
        console.log("ggg");
      }
    } catch (error) {
      console.log("fff");
      handleExceptionError(error.message);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setRecordPerPage(newItemsPerPage);
    recordPerPageItem = newItemsPerPage;
    fetchData();
  };

  const DeleteSalaryComponent = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this data!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await DeleteSalaryComponent_by_id(id);
          if (res) {
            if (res.status === 200) {
              handleExceptionSuccessMessages(res.data.message);
              fetchData();
              // PageAccess()
            } else if (res.status === 400) {
              if (res.data.ErrorCode) {
                handleExceptionError(res.data.ErrorMessage);
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
        } catch (error) {
          handleExceptionError(error.message);
        }
      }
    });
  };

  const handleCheckBoxChange = (index) => {
    const updatedColumns = [...columns];
    updatedColumns[index].IsActive = !updatedColumns[index].IsActive;
    setColumns(updatedColumns);
  };

  const ExportDesignation = async () => {
    try {
      const res = await ExportDesignation_api();
      console.log(res);
      if (res.status == 200) {
        handleExceptionSuccessMessages(res.data.message);
        const url = res.data;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsOptionsDropdownOpen(false);
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
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    // const file = event.target.files[0]; // Get the first file from the FileList
    // if (file) {
    //     console.log('Selected file:', file);
    //     try {
    //         const res = await UploadFile_api(file);
    //         event.target.value = '';
    //         if (res.status == 200) {
    //             var FileName = res.data[0][0].filename;
    //             setStoreFileName(FileName);
    //             var result = await ImportDesignation_api(FileName);
    //             if (result.status == 200) {
    //                 handleExceptionSuccessMessages(res.data.message);
    //                 fetchData();
    //                 setIsOptionsDropdownOpen(false)
    //             } else if (result.status == 400) {
    //                 setDesiList(result.data.ErrorMessage);
    //                 setReason(true);
    //                 setIsOptionsDropdownOpen(false);
    //                 const errorMessage = "Something is wrong. Please check the reason column.";
    //                 handleExceptionError(errorMessage);
    //             } else if (res.status === 401) {
    //                 handleExceptionError('Unauthorized');
    //                 setTimeout(() => {
    //                     localStorage.clear();
    //                     navigate('/')
    //                 }, 1000);
    //                 ///logout();
    //             }
    //         } else {
    //             handleExceptionError(res.statusText);
    //         }
    //     } catch (error) {
    //         handleExceptionError(error.message);
    //     }
    // }
  };

  const ViewImportFileFormat = async () => {
    try {
      // const url = 'https://hrmsapi.resolutesolutions.in.net/uploads/ExportExcelDemo/DesignationDemoRpt.xlsx';
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', 'data.csv');
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // URL.revokeObjectURL(url);
      // setIsOptionsDropdownOpen(false)
    } catch (error) {
      handleExceptionError(error.message);
    }
  };
  const skipAndContinueImport = async () => {
    try {
      // const res = await ImportDesignation_api_final(StoreFileName);
      // console.log(res)
      // if (res) {
      //     if (res.status === 200) {
      //         fetchData();
      //         handleExceptionSuccessMessages(res.data.message);
      //     } else if (res.status === 400) {
      //         res = "Request failed with status code 400";
      //         handleExceptionError(res);
      //     } else if (res.status === 401) {
      //         handleExceptionError('Unauthorized');
      //         setTimeout(() => {
      //             localStorage.clear();
      //             navigate('/')
      //         }, 1000);
      //         ///logout();
      //     }
      //     else if (res.status === 500) {
      //         res = "Request failed with status code 500";
      //         handleExceptionError(res);
      //     }
      // }
    } catch (error) {
      handleExceptionError(error.message);
    }
  };
  return (
    <Dashboard title={"Salary Components"}>
      <ErrorSnackbar
        errorMessages={ExceptionError}
        onClearErrors={clearErrors}
      />
      <SuccessSnackbar
        successMessages={successMessages}
        onclearSuccess={clearSuccess}
      />
      <Helmet>
        <title>Salary Components List | J mehta</title>
      </Helmet>
      {ShowLoad ? (
        <Load />
      ) : (
        <>
          {pageAccess.AllowView ? (
            <>
              <div className="client_panel_menu new_client_title">
                <div className="client_panel_search">
                  <input
                    value={search}
                    onChange={handleSearchBox}
                    type="text"
                    placeholder="Search"
                    autoFocus
                  />
                </div>
                <div className="d-flex">
                  {/* <div className="client_panel_option">
                  <button
                    onClick={() =>
                      setIsOptionsDropdownOpen(!isOptionsDropdownOpen)
                    }
                  >
                    <img src="./img/Menu.svg" alt="Options" />
                    Options
                  </button>

                  <ul
                    className={`dropdown-menu ${
                      isOptionsDropdownOpen ? "open" : ""
                    }`}
                  >
                    <li onClick={ExportUser} className="ExportImport">
                      {" "}
                      <img src="./img/upload.svg" alt="Export " />
                      Export Users
                    </li>
                    <li className="ExportImport" onClick={handleButtonClick}>
                      {" "}
                      <img src="./img/uploadBigArrow.svg" alt="Import" />
                      <input
                        type="file"
                        id="fileInput"
                        ref={fileInputRef}
                        accept=".xlsx, .xls"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />{" "}
                      Import Users
                    </li>                    
                    <li onClick={ViewImportFileFormat} className="ExportImport">
                      {" "}
                      <img src="./img/excel-svg.svg" alt="Export " />
                      Export User Excel Sheet{" "}
                    </li>
                  </ul>
                </div> */}

                  <div className="client_panel_column_chooser">
                    <button
                      onClick={() =>
                        setIsColumnChooserDropdownOpen(
                          !isColumnChooserDropdownOpen
                        )
                      }
                    >
                      <img src="./img/right.svg" alt="Column Chooser" />
                      Column Chooser
                    </button>

                    <ul
                      className={`dropdown-menu ${
                        isColumnChooserDropdownOpen ? "open" : ""
                      }`}
                    >
                      {columns.map((col, index) => (
                        <li key={`${index}-${col.Alias}`}>
                          <label className="label_main">
                            {col.Alias}
                            <input
                              type="checkbox"
                              checked={col.IsActive}
                              onChange={() => handleCheckBoxChange(index)}
                            />
                            <span className="geekmark"> </span>
                          </label>
                        </li>
                      ))}

                      <li>
                        <button
                          type="button"
                          onClick={handleConfigurationSave}
                          className="btn btn-theme-primary"
                        >
                          Save
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="client_panel_new">
                    {!pageAccess.AllowAdd ? (
                      <div style={{ display: "none" }}></div>
                    ) : (
                      <button className="border-0" onClick={handleNewUser}>
                        <AiFillPlusCircle />
                        New
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: "none" }}></div>
          )}

          {pageAccess.AllowView ? (
            <div className="overflow-hidden">
              <div className="client_panel_list d-flex align-items-start scroll-container">
                <table
                  className="client_panel_list_table mb-4"
                  cellPadding="0"
                  cellSpacing="0"
                >
                  <tr>
                    <th>Sr. No.</th>
                    {((pageAccess.AllowDelete || pageAccess.AllowUpdate) &&
                          pageAccess.AllowView)  ? (
                          <>
                            <th width={reason === false ? "5%" : ""}>
                              {reason === false ? "Action" : "Reason"}
                            </th>
                          </>
                        ) : (
                          <div style={{ display: "none" }}></div>
                        )}
                    {columns.map(
                      (col, index) =>
                        col.IsActive && (
                          <th
                            key={col.Alias}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                          >
                            {col.Alias}
                          </th>
                        )
                    )}
                  </tr>
                  {desi_list.map((row, rowIndex) => (
                    <tr key={row.id}>
                      <td>
                        {(currentPage - 1) * recordPerPage + rowIndex + 1}
                      </td>
                      {((pageAccess.AllowDelete ||
                            pageAccess.AllowUpdate) &&
                            pageAccess.AllowView) === 1 ? (
                            <td key={rowIndex}>
                              {reason === false && (
                                <>
                                  <div className="d-flex">
                                    <EditActionBtn
                                      to={`/salary-edit/${row["ID"]}`}
                                      style={AllowUpdateS}
                                    />
                                    <DeleteActionBtn
                                      onClickHandle={() =>
                                        DeleteSalaryComponent(row["ID"])
                                      }
                                      id={row["ID"]}
                                      style={AllowDeleteS}
                                    />
                                  </div>
                                </>
                              )}
                              {reason === true && (
                                <>
                                  {row["Reason"]
                                    .split(", ")
                                    .map((item, index) => (
                                      <React.Fragment key={index}>
                                        {index + 1 + ". " + item}
                                        <br />
                                      </React.Fragment>
                                    ))}
                                </>
                              )}
                            </td>
                          ) : (
                            <div style={{ display: "none" }}></div>
                          )}

                      {columns.map((col) => {
                        let cellContent = null;
                        switch (col.ColumnName) {
                          case "SalaryComponentsID":
                            cellContent = row["ID"];
                            break;
                          case "ComponentName":
                            cellContent = row["ComponentName"];
                            break;
                          case "ComponentShortName":
                            cellContent = row["ComponentShortName"];
                            break;
                          case "ComponentDisplayName":
                            cellContent = row["ComponentDisplayName"];
                            break;
                          case "ComponentDisplayShortName\t":
                            cellContent = row["ComponentDisplayShortName"];
                            break;
                          case "ParentComponentID":
                            cellContent = row["ParentComponentID"];
                            break;
                          case "RefID":
                            cellContent = row["RefID"];
                            break;
                          case "AddedOn":
                            const AddedOnDate = new Date(row["AddedOn"]);
                            const AddedOnDay = String(
                              AddedOnDate.getDate()
                            ).padStart(2, "0");
                            const AddedOnMonth = String(
                              AddedOnDate.getMonth() + 1
                            ).padStart(2, "0");
                            const AddedOnYear = AddedOnDate.getFullYear();
                            cellContent = `${AddedOnDay}-${AddedOnMonth}-${AddedOnYear}`;
                            break;
                          case "AddedBy":
                            cellContent = row["AddedBy"];
                            break;
                          case "LastModifiedOn":
                            const LastModifiedOnDate = new Date(
                              row["LastModifiedOn"]
                            );
                            const LastModifiedOnDay = String(
                              LastModifiedOnDate.getDate()
                            ).padStart(2, "0");
                            const LastModifiedOnMonth = String(
                              LastModifiedOnDate.getMonth() + 1
                            ).padStart(2, "0");
                            const LastModifiedOnYear =
                              LastModifiedOnDate.getFullYear();
                            cellContent = `${LastModifiedOnDay}-${LastModifiedOnMonth}-${LastModifiedOnYear}`;
                            break;
                          case "LastModifiedBy":
                            cellContent = row["LastModifiedBy"];
                            break;
                          default:
                            break;
                        }
                        return (
                          col.IsActive && (
                            <td key={`${row.id}-${col.Alias}`}>
                              {cellContent}
                            </td>
                          )
                        );
                      })}
                    </tr>
                  ))}
                </table>
              </div>

              {reason === false && (
                <>
                  <CustomPagination
                    totalItems={totalPage}
                    itemsPerPage={recordPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onPageSelect={handleItemsPerPageChange}
                  />
                </>
              )}
              {reason === true && (
                <>
                  <div className="client_panel_new mt-4">
                    <button
                      onClick={skipAndContinueImport}
                      className="btn btn-md"
                    >
                      Skip & Continue Import
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Access_Denied />
          )}
        </>
      )}
    </Dashboard>
  );
};

export default SalaryData;
