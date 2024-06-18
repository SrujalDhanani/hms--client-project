import React, { useState, useEffect, useRef } from "react";
import Dashboard from "../components/dashboard.js";
import { AiFillPlusCircle } from "react-icons/ai";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import ErrorSnackbar from "./../components/ErrorSnackbar.js";
import SuccessSnackbar from "./../components/SuccessSnackbar.js";
import EditActionBtn from "../components/EditActionBtn.js";
import CustomPagination from "../components/CustomPagination.js";
import {
  ProfessionalTax_get,
  PT_configuration_update,
  get_Client_Page_Access,
} from "../service/api.js";
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

const PTaxList = () => {
  var searchData = "";
  var currentPageItem = 1;
  var recordPerPageItem = 10;
  const [ProfessionalTaxList, setProfessionalTaxList] = useState([]);
  const [isOptionsDropdownOpen, setIsOptionsDropdownOpen] = useState(false);
  const [isColumnChooserDropdownOpen, setIsColumnChooserDropdownOpen] =
    useState(false);
  const [ExceptionError, setExceptionError] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [recordPerPage, setRecordPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState([]);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [reason, setReason] = useState(false);
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
      const resp = await get_Client_Page_Access("8");
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

    return {
      AllowUpdateS: AllowUpdateS
        ? { visibility: "visible" }
        : { visibility: "hidden" },
    };
  };

  // Get visibility styles
  const { AllowUpdateS } = visibilityStyle(pageAccess);

  const handleNewUser = () => {
    if (pageAccess.AllowAdd) {
      navigate("/pt-add");
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
    if (pageAccess.AllowView === 1) {
      fetchData();
    } else {
      setShowLoad(false);
    }
  }, []);

  const handleCheckBoxChange = (index) => {
    const updatedColumns = [...columns];
    updatedColumns[index].IsActive = !updatedColumns[index].IsActive;
    setColumns(updatedColumns); // Check if this line is causing an infinite loop
    console.log(columns);
  };

  const fetchData = async () => {
    try {
      var dataObject = {
        filter: searchData,
        page: currentPageItem,
        limit: recordPerPageItem,
      };
      console.log(dataObject);
      const res = await ProfessionalTax_get(dataObject);
      if (res) {
        if (res.status === 200) {
          var logConfig = res.data.ProfessionalTaxLogConfiguration;
          var logColumns = res.data.ProfessionalTaxLogCols;
          console.log(logColumns);

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
            console.log("fff");
            console.log(logColumns);
            logColumns.forEach((data) => {
              if (data.Status === "Config") {
                data.IsActive = true;
                newColumnArray.push(data);
                console.log(newColumnArray);
              }
            });
          }
          console.log(res.data);
          setProfessionalTaxList(res.data.data);
          setTotalPage(res.data.totalAllData);
          console.log(newColumnArray);
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
          handleExceptionError("Request failed with status code 500");
        }
      } else {
        handleExceptionError("Request failed with status code 500");
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

  const handleConfigurationSave = async () => {
    var newData = [];
    columns.map((columnData, index) => {
      var oj = {
        ColumnName: columnData.ColumnName,
        Priority: index + 1,
        IsActive: columnData.IsActive,
      };
      newData.push(oj);
      console.log(newData);
    });
    try {
      const res = await PT_configuration_update(newData);
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
        // var message ='User Add Successful'
        handleExceptionError(res.statusText);
      }
    } catch (error) {
      var res = "Request failed with status code 500";
      handleExceptionError(res);
    }
  };

  //   const DeleteUser = async (id) => {
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: "You will not be able to recover this data!",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Delete",
  //     }).then(async (result) => {
  //       console.log(result);
  //       if (result.isConfirmed) {
  //         try {
  //           const res = await Delete_Employee_by_id(id);
  //           console.log(res);
  //           if (res) {
  //             if (res.status === 201) {
  //               fetchData();
  //               var message = "Professional Tax Record deleted Successfully";
  //               console.log(message);
  //               handleExceptionSuccessMessages(message);
  //             } else if (res.status === 400) {
  //               if (res.data.ErrorCode) {
  //                 handleExceptionError(res.data.ErrorMessage);
  //               }
  //               if (res.data.Message) {
  //                 handleExceptionError(res.data.Message);
  //               }
  //             } else if (res.status === 401) {
  //               handleExceptionError("Unauthorized");
  //               setTimeout(() => {
  //                 localStorage.clear();
  //                 navigate("/");
  //               }, 1000);
  //               ///logout();
  //             } else if (res.status === 500) {
  //               handleExceptionError(res.statusText);
  //             }
  //           }
  //         } catch (error) {
  //           handleExceptionError(error.message);
  //         }
  //       }
  //     });
  //   };

  return (
    <Dashboard title={"Professional Tax List"}>
      <Helmet>
        <title>Professional Tax List | J mehta</title>
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
                      className={`dropdown-menu ${
                        isColumnChooserDropdownOpen ? "open" : ""
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

          <div className="client_panel_list d-flex align-items-start scroll-container">
            <div className="user-table w-100">
              <table
                className="client_panel_list_table"
                cellPadding="0"
                cellSpacing="0"
              >
                <tr>
                {
                  pageAccess.AllowView ? (
                    <>
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
                    <div style={{display:"none"}}></div>
                  )}
                </tr>
                {pageAccess.AllowView ? (
                  ProfessionalTaxList.map((row, rowIndex) => (
                    <tr key={row.id}>
                      <td>
                        {(currentPage - 1) * recordPerPage + rowIndex + 1}
                      </td>
                      {((pageAccess.AllowDelete || pageAccess.AllowUpdate) &&
                      pageAccess.AllowView) ? (
                        <td key={rowIndex}> 
                        {reason === false && (
                          <>
                            <div className="d-flex">
                              <EditActionBtn
                                to={`/pt-edit/${row["ID"]}`}
                                style={AllowUpdateS}
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
                          case "ProfessionalTaxID":
                            cellContent = row["ID"];
                            break;
                          case "DeductionName":
                            cellContent = row["DeductionName"];
                            break;
                          case "DeductionShortName":
                            cellContent = row["DeductionShortName"];
                            break;
                          case "DeductionDisplayName":
                            cellContent = row["DeductionDisplayName"];
                            break;
                          case "StateName":
                            cellContent = row["StateName"];
                            break;
                          case "StartDate":
                            const StartDate = new Date(row["StartDate"]);
                            const StartDateDay = String(
                              StartDate.getDate()
                            ).padStart(2, "0");
                            const StartDateMonth = String(
                              StartDate.getMonth() + 1
                            ).padStart(2, "0");
                            const StartDateYear = StartDate.getFullYear();
                            cellContent = `${StartDateDay}-${StartDateMonth}-${StartDateYear}`;
                            break;
                          case "EndDate":
                            const EndDate = new Date(row["EndDate"]);
                            const EndDateDay = String(
                              EndDate.getDate()
                            ).padStart(2, "0");
                            const EndDateMonth = String(
                              EndDate.getMonth() + 1
                            ).padStart(2, "0");
                            const EndDateYear = EndDate.getFullYear();
                            cellContent = `${EndDateDay}-${EndDateMonth}-${EndDateYear}`;
                            break;
                          case "StartRange":
                            cellContent = row["StartRange"];
                            break;
                          case "EndRange":
                            cellContent = row["EndRange"];
                            break;
                            case "IsPercentage":
                              cellContent = row["IsPercentage"] ? (
                                <span className="badge badge-primary">
                                  Yes
                                </span>
                              ) : (
                                <span className="badge badge-warning">
                                  No
                                </span>
                              );
                              break;
                          case "Amount":
                            cellContent = row["Amount"];
                            break;
                          case "IsProfessionalTax":
                            cellContent = JSON.stringify(
                              row["IsProfessionalTax"]
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
              </table>
            </div>
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
            </div>
          ) : (
            <div style={{ display: "none" }}></div>
          )}
        </>
      )}
    </Dashboard>
  );
};
export default PTaxList;
