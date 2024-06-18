// App.js
import React, { useState, useEffect, useRef } from "react";
import Dashboard from "../components/dashboard.js";
import { AiFillPlusCircle } from "react-icons/ai";
import { Helmet } from "react-helmet";
import {
  Designation_entry_get,
  DesignationConfigurationSave,
  DeleteDesignation_by_id,
  ExportDesignation_api,
  UploadFile_api,
  ImportDesignation_api,
  ImportDesignation_api_final,
  get_Client_Page_Access,
  Designation_Dropdown,
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

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Designation_list = () => {
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
  const [showLoad, setShowLoad] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [pageAccess, setPageAccess] = useState({
    AllowAdd: 1,
    AllowUpdate: 1,
    AllowDelete: 1,
    AllowView: 1,
  });

  const pageAccessData = async () => {
    try {
      const resp = await get_Client_Page_Access(1);
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

  // Get visibility styles
  const { AllowUpdateS, AllowDeleteS } = visibilityStyle(pageAccess);

  const handleNewUser = () => {
    if (pageAccess.AllowAdd) {
      navigate("/add-user");
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
        filter: search,
        page: currentPageItem,
        limit: recordPerPageItem,
      };
      const res = await Designation_entry_get(dataObject);
      console.log(res);
      if (res) {
        if (res.status === 200) {
          var logConfig = res.data.DesignationLogConfig;
          var logColumns = res.data.DesignationLogColumns;
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
      /// console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    console.log(pageAccess.AllowView);
    if (pageAccess.AllowView === 1) {
      fetchData();
    } else {
      setShowLoad(false);
    }
  }, []);

  const sortByPriority = (dataArray) => {
    return dataArray.sort((a, b) => {
      // Convert Priority values to numbers and compare
      return parseInt(a.Priority) - parseInt(b.Priority);
    });
  };
  const handleDesignationChange = (index) => {
    const updatedColumns = [...columns];
    updatedColumns[index].IsActive = !updatedColumns[index].IsActive;
    setColumns(updatedColumns); // Check if this line is causing an infinite loop
    console.log(columns);
  };

  const handleSearchBox = (event) => {
    const value = event.target.value;
    setSearch(value);
    searchData = value;
    fetchData();
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

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
      const res = await DesignationConfigurationSave(newData);
      if (res.status == 200) {
        handleExceptionSuccessMessages(res.data.message);
        setIsColumnChooserDropdownOpen(false);
      } else if (res.status === 401) {
        handleExceptionError("Unauthorized");
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
        ///logout();
      } else {
        // var message ='Designation Add Successful'
        handleExceptionError(res);
      }
    } catch (error) {
      handleExceptionError(error.message);
    }
  };
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setRecordPerPage(newItemsPerPage);
    recordPerPageItem = newItemsPerPage;
    fetchData();
  };

  const DeleteDesignation = async (id) => {
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
          const res = await DeleteDesignation_by_id(id);
          if (res) {
            if (res.status === 200) {
              console.log(res);
              handleExceptionSuccessMessages(res.data.message);
              fetchData();
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
              /// res = "Request failed with status code 500";
              handleExceptionError(res.statusText);
            }
          }
        } catch (error) {
          handleExceptionError(error.message);
        }
      }
    });
  };

  const ExportDesignation = async () => {
    try {
      const res = await ExportDesignation_api();
      console.log(res);
      if (res.status === 200) {
        var message = "Designation Export Successfully";
        handleExceptionSuccessMessages(message);
        const url = res.data;

        // Create a temporary <a> element to trigger the download
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
    const file = event.target.files[0]; // Get the first file from the FileList
    if (file) {
      // You can now access the file data and perform further processing
      console.log("Selected file:", file);
      try {
        const res = await UploadFile_api(file);
        event.target.value = "";
        if (res.status == 200) {
          var FileName = res.data[0][0].filename;
          setStoreFileName(FileName);
          var result = await ImportDesignation_api(FileName);
          if (result.status === 200) {
            var message = "Designation Record Import Successfully";
            handleExceptionSuccessMessages(message);
            fetchData();
            setIsOptionsDropdownOpen(false);
          } else if (result.status == 400) {
            setDesiList(result.data.ErrorMessage);
            setReason(true);
            setIsOptionsDropdownOpen(false);
            var errorMessage =
              "Something is wrong. Please check the reason column.";
            handleExceptionError(errorMessage);
          } else if (res.status === 401) {
            handleExceptionError("Unauthorized");
            setTimeout(() => {
              localStorage.clear();
              navigate("/");
            }, 1000);
            ///logout();
          }
        } else {
          handleExceptionError(res.statusText);
        }
      } catch (error) {
        handleExceptionError(error.message);
      }
    }
  };

  const ViewImportFileFormat = async () => {
    try {
      const url =
        "http://hrmsapi.resolutesolutions.in.net/uploads/ClientExportExcelDemo/DesignationDemoRpt.xlsx";
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsOptionsDropdownOpen(false);
    } catch (error) {
      handleExceptionError(error.message);
    }
  };
  const skipAndContinueImport = async () => {
    try {
      const res = await ImportDesignation_api_final(StoreFileName);
      console.log(res);
      if (res) {
        if (res.status === 200) {
          fetchData();
          var message = "Designation Records Imported Successfully";
          handleExceptionSuccessMessages(message);
        } else if (res.status === 400) {
          res = "Request failed with status code 400";
          handleExceptionError(res);
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
      }
    } catch (error) {
      handleExceptionError(error.message);
    }
  };
  return (
    <Dashboard title={"Designation"}>
      <ErrorSnackbar
        errorMessages={ExceptionError}
        onClearErrors={clearErrors}
      />
      <SuccessSnackbar
        successMessages={successMessages}
        onclearSuccess={clearSuccess}
      />
      <Helmet>
        <title>Designation List | J mehta</title>
      </Helmet>
      {showLoad ? (
        <Load />
      ) : (
        <>
          {pageAccess.AllowView ? (
            <div className="client_panel_menu new_client_title">
              <div className="client_panel_search">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchBox}
                  placeholder="Search"
                  autoFocus
                />
              </div>
              <div className="d-flex">
                {pageAccess.AllowAdd ? (
                  <div className="client_panel_option">
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
                      <li onClick={ExportDesignation} className="ExportImport">
                        {" "}
                        <img src="./img/upload.svg" alt="Export " />
                        Export
                      </li>
                      <li className="ExportImport" onClick={handleButtonClick}>
                        {" "}
                        <img src="./img/uploadBigArrow.svg" alt="Import" />
                        <input
                          type="file"
                          id="fileInput"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />{" "}
                        Import
                      </li>
                      <li
                        onClick={ViewImportFileFormat}
                        className="ExportImport"
                      >
                        {" "}
                        <img src="./img/Menu(3).svg" alt="Export " />
                        Export Designation Records{" "}
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div style={{ display: "none" }}></div>
                )}
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
                            onChange={() => handleDesignationChange(index)}
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
                    <Link to="/designation">
                      <button className="border-0">
                        <AiFillPlusCircle />
                        New
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "none" }}></div>
          )}

          <div className="client_panel_list d-flex align-items-start scroll-container">
            <table
              className="client_panel_list_table"
              cellPadding="0"
              cellSpacing="0"
            >
              <tbody>
                <tr>
                  {pageAccess.AllowView ? (
                    <>
                      <th>Sr. No.</th>
                      {(pageAccess.AllowDelete || pageAccess.AllowUpdate) &&
                      pageAccess.AllowView ? (
                        <>
                          <th width={reason === false ? "6%" : ""}>
                            {reason === false ? "Action" : "Reason"}
                          </th>
                        </>
                      ) : (
                        <div style={{ display: "none" }}></div>
                      )}
                    </>
                  ) : (
                    <div style={{ display: "none" }}></div>
                  )}
                  {pageAccess.AllowView ? (
                    columns.map(
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
                    )
                  ) : (
                    <div></div>
                  )}
                </tr>
                {pageAccess.AllowView ? (
                  desi_list.map((row, rowIndex) => (
                    <tr key={row.id}>
                      <td>
                        {(currentPage - 1) * recordPerPage + rowIndex + 1}
                      </td>
                      {((pageAccess.AllowDelete || pageAccess.AllowUpdate) &&
                        pageAccess.AllowView) === 1 ? (
                        <td key={rowIndex}>
                          {reason === false && (
                            <>
                              <div className="d-flex">
                                <EditActionBtn
                                  to={`/designation/${row["ID"]}`}
                                  style={AllowUpdateS}
                                />
                                <DeleteActionBtn
                                  onClickHandle={() =>
                                    DeleteDesignation(row["ID"])
                                  }
                                  id={row["ID"]}
                                  style={AllowDeleteS}
                                />
                              </div>
                            </>
                          )}
                          {reason === true && (
                            <>
                              {row["Reason"].split(", ").map((item, index) => (
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
                          case "DesignationID":
                            cellContent = row["ID"];
                            break;
                          case "DesignationName":
                            cellContent = row["Designation"];
                            break;
                          case "DesignationSName":
                            cellContent = row["ShortName"];
                            break;
                          case "Description":
                            cellContent = row["Description"];
                            break;
                          case "IsManagementDes":
                            cellContent = row["ManagementLevel"];
                            break;
                          case "IsFactoryData":
                            cellContent = row["IsFactoryData"];
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
                          case "IsActive":
                            cellContent = row["Active"] ? (
                              <span className="badge badge-primary">
                                Active
                              </span>
                            ) : (
                              <span className="badge badge-warning">
                                Inactive
                              </span>
                            );
                            break;
                          default:
                            break;
                        }

                        // Render the table cell only if IsActive is true
                        return (
                          col.IsActive && (
                            <td key={`${row.id}-${col.Alias}`}>
                              {cellContent}
                            </td>
                          )
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <Access_Denied />
                )}
              </tbody>
            </table>
          </div>

          {pageAccess.AllowView ? (
            <div className="d-flex justify-content-end">
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
            <div style={{ display: "none" }}></div>
          )}
        </>
      )}
    </Dashboard>
  );
};

export default Designation_list;
