import React, { useState, useEffect, useRef } from "react";
import Dashboard from "../components/dashboard.js";
import { AiFillPlusCircle } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import ErrorSnackbar from "./../components/ErrorSnackbar.js";
import SuccessSnackbar from "./../components/SuccessSnackbar.js";
import EditActionBtn from "../components/EditActionBtn.js";
import DeleteActionBtn from "../components/DeleteActionBtn.js";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  get_Client_Page_Access,
  SalaryStructure_get,
  DeleteSalaryStructure_by_id,
  SalaryComponentConfigurationSave,
  SalaryStructureConfigurationSave,
} from "../service/api.js";
import Swal from "sweetalert2";
import Load from "../components/parts/load.js";
import Access_Denied from "./deniedaccess.js";
import CustomPagination from "../components/CustomPagination.js";

const Salary_Structure = () => {
  var searchData = "";
  var currentPageItem = 1;
  var recordPerPageItem = 10;
  const [locationList, setLocationList] = useState([]);
  const [isOptionsDropdownOpen, setIsOptionsDropdownOpen] = useState(false);
  const [isColumnChooserDropdownOpen, setIsColumnChooserDropdownOpen] =
    useState(false);
  const [ExceptionError, setExceptionError] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [recordPerPage, setRecordsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([]);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [reason, setReason] = useState(false);
  const [showLoad, setShowLoad] = useState(true);
  const navigate = useNavigate();
  const [salaryTypeOption, setSalaryTypeOption] = useState([
    { id: 1, label: "CTC" },
    { id: 2, label: "Gross" },
  ]);

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
    console.log(e);
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

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setRecordsPerPage(newItemsPerPage);
    recordPerPageItem = newItemsPerPage;
    fetchData();
  };

  const [pageAccess, setPageAccess] = useState({
    AllowAdd: 1,
    AllowUpdate: 1,
    AllowDelete: 1,
    AllowView: 1,
  });
  const pageAccessData = async () => {
    try {
      const resp = await get_Client_Page_Access("9");
      console.log(resp);
      if (resp.status === 200) {
        const clientPageAccess = {
          AllowAdd: resp.data.AllowAdd ? 1 : 0,
          AllowUpdate: resp.data.AllowUpdate ? 1 : 0,
          AllowDelete: resp.data.AllowDelete ? 1 : 0,
          AllowView: resp.data.AllowView ? 1 : 0,
        };
        setPageAccess(clientPageAccess);
      }
    } catch (error) {
      console.log(error);
      handleExceptionError(error);
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
      navigate("/salary");
    } else {
      navigate("/deniedaccess");
    }
  };

  const getLabelById = (data_array, id) => {
    const foundItem = data_array?.find((item) => item.id == id);
    return foundItem ? foundItem.label : null;
  };

  const handleSearchBox = (event) => {
    setSearch(event.target.value);
    searchData = event.target.value;
    fetchData();
  };

  const DeleteUser = async (id) => {
    console.log(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this data!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      console.log(result);
      if (result.isConfirmed) {
        try {
          const res = await DeleteSalaryStructure_by_id(id);
          console.log(res);
          if (res) {
            if (res.status === 200) {
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

  const sortByPriority = (dataArray) => {
    return dataArray.sort((a, b) => {
      return parseInt(a.Priority) - parseInt(b.Priority);
    });
  };

  const fetchData = async () => {
    try {
      var dataObject = {
        filter: searchData,
        page: currentPageItem,
        limit: recordPerPageItem,
      };
      const res = await SalaryStructure_get(dataObject);
      console.log(res);
      if (res) {
        if (res.status === 200) {
          var logConfig = res.data.SlaryStructureLogConfig;
          var logColumns = res.data.SalaryStructureLogColumns;
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
                console.log("hhvdhdjhvd")
                newColumnArray = sortByPriority(newColumnArray);
                console.log("newColumnArray", newColumnArray)
              }
            });
            console.log("hdfhfdhvhdvf")
            newColumnArray = sortByPriority(newColumnArray);
          } else {
            logColumns.forEach((data) => {
              if (data.Status === "Config") {
                data.IsActive = true;
                newColumnArray.push(data);
                console.log("Abcdefghijklmnoprstuvwxyz")
              }
            });
          }
          setLocationList(res.data.data);
          setTotalPage(res.data.totalAllData);
          setColumns(newColumnArray);
          console.log("columns", columns)
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
  // async 
  useEffect(() => {
    if (pageAccess.AllowView === 1) {
      fetchData();
    } else {
      setShowLoad(false);
    }
  }, []);

  const handleConfigurationSave = async () => {
    console.log(columns);
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
      const res = await SalaryStructureConfigurationSave(newData);
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

  const handleCheckBoxChange = (index) => {
    const updatedColumns = [...columns];
    updatedColumns[index].IsActive = !updatedColumns[index].IsActive;
    setColumns(updatedColumns);
  };

  return (
    <HelmetProvider>
      <Dashboard title={"Salary Structure List"}>
        <Helmet>
          <title>Salary Structure List | J mehta</title>
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
                    {/* {pageAccess.AllowView ? ( */}
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
                  <li
                    // onClick={ViewImportFileFormat}
                    className="ExportImport"
                  >
                    {" "}
                    <img src="./img/upload.svg" alt="Export " />
                    View Import Format{" "}
                  </li>
                  <li
                    // onClick={ExportDepartment}
                    className="ExportImport"
                  >
                    {" "}
                    <img src="./img/upload.svg" alt="Export " />
                    Export Department
                  </li>
                  <li
                    className="ExportImport"
                    // onClick={handleButtonClick}
                  >
                    {" "}
                    <img src="./img/upload.svg" alt="Import" />
                    <input
                      type="file"
                      id="fileInput"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      // onChange={handleFileChange}
                    />{" "}
                    Import Department
                  </li>
                </ul>
              </div> */}
                    {/* ) : (
                <div style={{ display: "none" }}></div>
              )} */}
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
                        className={`dropdown-menu ${isColumnChooserDropdownOpen ? "open" : ""
                          }`}
                      >
                        {columns.map((col, index) => {
                          return (
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
                          );
                        })}

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
              <div className="client_panel_list d-flex align-items-start scroll-container">
                <div className="user-table w-100">
                  <table
                    className="client_panel_list_table"
                    cellPadding="0"
                    cellSpacing="0"
                  >
                    <thead>
                      <tr>
                        {pageAccess.AllowView ? (
                          <>
                            <th>Sr. No.</th>
                            {(pageAccess.AllowDelete ||
                              pageAccess.AllowUpdate) &&
                              pageAccess.AllowView ? (
                              <>
                                <th width={reason === false ? "5%" : ""}>
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
                    </thead>
                    <tbody>
                      {pageAccess.AllowView ? (
                        locationList.map((row, rowIndex) => (
                          <tr key={row.id}>
                            <td>
                              {(currentPage - 1) * recordPerPage + rowIndex + 1}
                            </td>
                            {(pageAccess.AllowDelete ||
                              pageAccess.AllowUpdate) &&
                              pageAccess.AllowView ? (
                              <td key={rowIndex}>
                                {reason === false && (
                                  <>
                                    <div className="d-flex">
                                      <EditActionBtn
                                        to={`/salary-structure-edit/${row["ID"]}`}
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
                                case "SalaryStructureID":
                                  cellContent = row["ID"];
                                  break;
                                case "StartRange":
                                  cellContent = row["StartRange"];
                                  break;
                                case "EndRange":
                                  cellContent = row["EndRange"];
                                  break;
                                case "SalaryStructureName":
                                  cellContent = row["SalaryStructureName"];
                                  break;
                                case "SalaryStructureSName":
                                  cellContent = row["SalaryStructureSName"];
                                  break;
                                case "SalaryType":
                                  cellContent = getLabelById(
                                    salaryTypeOption,
                                    row["SalaryType"]
                                  );
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
                        <div style={{ display: "none" }}></div>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <Access_Denied />
            )}

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
              </div>
            ) : (
              <div style={{ display: "none" }}></div>
            )}
          </>
        )}
      </Dashboard>
    </HelmetProvider>
  );
};
export default Salary_Structure;
