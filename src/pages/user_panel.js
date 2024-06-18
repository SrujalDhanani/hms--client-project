// App.js
import React, { useState, useEffect, useRef } from "react";
import Dashboard from "../components/dashboard.js";
import Modal from "react-modal";
import { AiFillCloseCircle, AiFillPlusCircle } from "react-icons/ai";
import Input2 from "../components/parts/input2.js";
import { HiOutlineChevronDown } from "react-icons/hi";
import { Helmet } from "react-helmet";
import { decryption, encryption } from "../components/utils/utils.js";
import {
  User_get,
  User_configuration_update,
  Delete_User_by_id,
  ExportUser_api,
  get_Client_Page_Access,
  UploadFile_api,
  ImportUser_api,
  ImportUser_api_final,
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

const User_panel = (props) => {
  var searchData = "";
  var currentPageItem = 1;
  var recordPerPageItem = 10;
  const [User_list, setUserList] = useState([]);
  const [isOptionsDropdownOpen, setIsOptionsDropdownOpen] = useState(false);
  const [isColumnChooserDropdownOpen, setIsColumnChooserDropdownOpen] =
    useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [ExceptionError, setExceptionError] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [recordPerPage, setRecordPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([]);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [reason, setReason] = useState(false);
  const [StoreFileName, setStoreFileName] = useState("");
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
      const resp = await get_Client_Page_Access(3);
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
    console.log(ExceptionError);
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
      const res = await User_get(dataObject);
      console.log(res);
      if (res) {
        if (res.status === 200) {
          var logConfig = res.data.UsersLogConfig;
          var logColumns = res.data.UsersLogColumns;
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
            newColumnArray = sortByPriority(newColumnArray);
          } else {
            logColumns.forEach((data) => {
              if (data.Status === "Config") {
                data.IsActive = true;
                newColumnArray.push(data);
              }
            });
          }
          const loggedInUser = JSON.parse(localStorage.getItem("userdata"));
          const loggedInUserId = loggedInUser.Logindetail.ClientUserID;

          const filteredUserList = res.data.data.filter(
            (user) => user.ID !== Number(loggedInUserId)
          );

          setUserList(filteredUserList);
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
      return parseInt(a.Priority) - parseInt(b.Priority);
    });
  };

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }
  function closeModal() {
    setIsOpen(false);
  }
  const handleCheckBoxChange = (index) => {
    const updatedColumns = [...columns];
    updatedColumns[index].IsActive = !updatedColumns[index].IsActive;
    setColumns(updatedColumns);
  };
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setRecordPerPage(newItemsPerPage);
    recordPerPageItem = newItemsPerPage;
    fetchData();
  };
  const handleSearchBox = (event) => {
    setSearch(event.target.value);
    searchData = event.target.value;
    fetchData();
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 1500);
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
    console.log(newData);
    try {
      const res = await User_configuration_update(newData);
      console.log(res);
      if (res.status === 200) {
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
        handleExceptionError(res.statusText);
      }
    } catch (error) {
      handleExceptionError(error.message);
    }
  };
  const DeleteUser = async (id) => {
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
          const res = await Delete_User_by_id(id);
          if (res) {
            if (res.status === 201) {
              fetchData();
              handleExceptionSuccessMessages(res.data.message);
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

  const ExportUser = async () => {
    try {
      const res = await ExportUser_api();
      console.log(res);
      if (res.status == 200) {
        var message = "User Export Successfully";
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
      try {
        const res = await UploadFile_api(file);
        event.target.value = "";
        if (res.status === 200) {
          var FileName = res.data[0][0].filename;
          setStoreFileName(FileName);
          var result = await ImportUser_api(FileName);
          if (result.status === 200) {
            var message = "User Record Import Successfully";
            handleExceptionSuccessMessages(message);
            fetchData();
          } else if (result.status === 400) {
            setUserList(result.data.ErrorMessage);
            setReason(true);
            setIsOptionsDropdownOpen(false);
            const errorMessage =
              "Something is wrong. Please check the reason column.";
            handleExceptionError(errorMessage);
          } else if (result.status === 401) {
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
        "http://hrmsapi.resolutesolutions.in.net/uploads/ClientExportExcelDemo/UserDemoRpt.xlsx";
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      handleExceptionError(error.message);
    }
  };

  const skipAndContinueImport = async () => {
    try {
      const res = await ImportUser_api_final(StoreFileName);
      if (res) {
        if (res.status === 200) {
          fetchData();
          var message = "User Record Import Successfully";
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
    <Dashboard title={"Users"}>
      <Helmet>
        <title>User List | J mehta</title>
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
                        <li onClick={ExportUser} className="ExportImport">
                          {" "}
                          <img src="./img/upload.svg" alt="Export " />
                          Export Users
                        </li>
                        <li
                          className="ExportImport"
                          onClick={handleButtonClick}
                        >
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
                        <li
                          onClick={ViewImportFileFormat}
                          className="ExportImport"
                        >
                          {" "}
                          <img src="./img/excel-svg.svg" alt="Export " />
                          Export User Excel Sheet{" "}
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

          <div className="overflow-hidden">
            <div className="client_panel_list d-flex align-items-start scroll-container">
              <div className="user-table mb-4 w-100">
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
                        <div style={{ display: "none" }}></div>
                      )}
                    </tr>
                    {pageAccess.AllowView ? (
                      User_list.map((row, rowIndex) => (
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
                                      to={`/edit-user/${row["ID"]}`}
                                      style={AllowUpdateS}
                                    />
                                    <DeleteActionBtn
                                      onClickHandle={() =>
                                        DeleteUser(row["ID"])
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
                              case "UserID":
                                cellContent = row["ID"];
                                break;
                              case "Username":
                                cellContent = row["Users"];
                              //   break;
                              // case "Password":
                              //   cellContent = decryption(row["Password"]);
                              //   break;
                              case "FirstName":
                                cellContent = row["FirstName"];
                                break;
                              case "LastName":
                                cellContent = row["LastName"];
                                break;
                              case "MobileNumber1":
                                cellContent = row["MobileNumber1"];
                                break;
                              case "MobileNumber2":
                                cellContent = row["MobileNumber2"];
                                break;
                              case "EmailID":
                                cellContent = decryption(row["EmailID"]);
                                break;
                              case "HomeAddress":
                                cellContent = row["HomeAddress"];
                                break;
                              case "IsTL":
                                cellContent = row["IsTL"] ? (
                                  <span className="badge badge-primary">
                                    Executive
                                  </span>
                                ) : (
                                  <span className="badge badge-warning">
                                    Team Leader
                                  </span>
                                );
                                break;
                              case "Remarks":
                                cellContent = row["Remarks"];
                                break;
                              case "DesignationID":
                                cellContent = row["DesignationID"];
                                break;
                              case "DepartmentID":
                                cellContent = row["DepartmentID"];
                                break;
                              case "IsManagementDes":
                                cellContent = row["ManagementLevel"];
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
                                cellContent = row["IsActive"] ? (
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

              <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >
                <div className="client_panel_option m-0">
                  <ul className="model_popup p-0">
                    <li>
                      {" "}
                      <img src="./img/Direct-access.svg" alt="Delete" />
                      Manage Functional Access
                    </li>
                    <li>
                      {" "}
                      <img src="./img/Direct-access.svg" alt="Location" />
                      Manage Client Access
                    </li>
                  </ul>
                </div>
              </Modal>
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
                <table className="page_list_table d-flex justify-content-end align-items-center mt-3">
                  <tr>
                    <th>
                      <div onClick={openModal}>
                        <img src="./img/filter-svg.svg" alt="filter-svg" />
                      </div>
                    </th>
                  </tr>
                </table>
              </div>
            ) : (
              <div style={{ display: "none" }}></div>
            )}
          </div>
        </>
      )}
    </Dashboard>
  );
};

export default User_panel;
