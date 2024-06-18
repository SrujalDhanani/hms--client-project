import React, { useState, useEffect, useRef } from "react";
import Dashboard from "../components/dashboard.js";
import { AiFillPlusCircle } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import ErrorSnackbar from "./../components/ErrorSnackbar.js";
import SuccessSnackbar from "./../components/SuccessSnackbar.js";
import EditActionBtn from "../components/EditActionBtn.js";
import DeleteActionBtn from "../components/DeleteActionBtn.js";
import { Helmet } from "react-helmet";
import {
  DeleteLocation_by_id,
  get_Client_Page_Access,
  Client_Location_get,
} from "../service/api.js";
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

const Client_Location_List = () => {
  var searchData = "";
  var currentPageItem = 1;
  var recordPerPageItem = 10;
  const [locationList, setLocationList] = useState([]);
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

  const [data2, setData2] = useState([]);
  const [filter2, setFilter2] = useState([]);
  const [currentPage0, setCurrentPage0] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const lastIndex = currentPage0 * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filter2.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filter2.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const requestSearch = (searchedVal) => {
    console.log(filter2);
    const filteredRows = data2.filter((row) => {
      return row.LocationName.toString()
        .toLowerCase()
        .includes(searchedVal.toString().toLowerCase());
    });
    if (searchedVal.length < 1) {
      setFilter2(data2);
    } else {
      setFilter2(filteredRows);
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

  const handleCheckBoxChange = (index) => {
    const updatedColumns = [...columns];
    updatedColumns[index].IsActive = !updatedColumns[index].IsActive;
    setColumns(updatedColumns); // Check if this line is causing an infinite loop
    console.log(columns);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [pageAccess, setPageAccess] = useState({
    AllowAdd: 1,
    AllowUpdate: 1,
    AllowDelete: 1,
    AllowView: 1,
  });
  const pageAccessData = async () => {
    try {
      const resp = await get_Client_Page_Access("5");
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
      navigate("/client-location-add");
    } else {
      navigate("/deniedaccess");
    }
  };

  function handleRecordsPerPageChange(e) {
    const newRecordsPerPage = parseInt(e.target.value);
    console.log(newRecordsPerPage);
    setCurrentPage0(1); // Reset to first page when changing records per page
    // Update recordsPerPage using useState setter function
    setRecordsPerPage(newRecordsPerPage);
  }

  function prePage() {
    if (currentPage0 !== 1) {
      setCurrentPage0(currentPage0 - 1);
    }
  }
  function changeCPage(dd) {
    setCurrentPage0(dd);
  }
  function nextPage() {
    if (currentPage0 !== npage) {
      setCurrentPage0(currentPage0 + 1);
    }
  }
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
          const res = await DeleteLocation_by_id(id);
          console.log(res);
          if (res) {
            if (res.status === 200) {
              fetchData();
              var message = "Client Location Record Deleted Successfully";
              console.log(message);
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

  const fetchData = async () => {
    try {
      const res = await Client_Location_get(1);
      if (res.status === 200) {
        const LocationData = res.data.ClientLocation;
        console.log(LocationData);
        setLocationList(LocationData);
        setData2(LocationData);
        setFilter2(LocationData);
        setShowLoad(false);
      } else if (res.status === 400) {
        handleExceptionError(res.data.ErrorMessage);
      } else if (res.status === 401) {
        handleExceptionError("Unauthorized");
        setShowLoad(false);
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 1000);
      } else if (res.status === 500) {
        handleExceptionError(res.data.errorMessage);
        setShowLoad(false);
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

  return (
    <Dashboard title={"Client Location List"}>
      <Helmet>
        <title>Client Location List | J mehta</title>
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
            <div className="client_panel_menu new_client_title">
              <div className="client_panel_search client_panel_option">
                <input
                  type="text"
                  onChange={(e) => requestSearch(e.target.value)}
                  placeholder="Search"
                  autoFocus
                />
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
          ) : (
            <div style={{ display: "none" }}></div>
          )}
          {locationList.length > 0 ? (
            <>
              {pageAccess.AllowView ? (
                <div>
                  <table
                    className="client_panel_list_table"
                    cellPadding="0"
                    cellSpacing="0"
                  >
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        {((pageAccess.AllowDelete || pageAccess.AllowUpdate) &&
                          pageAccess.AllowView) === 1 ? (
                          <>
                            <th width={reason === false ? "6%" : ""}>
                              {reason === false ? "Action" : "Reason"}
                            </th>
                          </>
                        ) : (
                          <div style={{ display: "none" }}></div>
                        )}
                        <th>Location Name</th>
                        <th>PAN</th>
                        <th>AddLine1</th>
                        <th>AddLine2</th>
                        <th>State Name</th>
                        <th>City Name</th>
                        <th>Pincode</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((item, index) => (
                        <>
                          <tr key={index}>
                            <td>{index + 1}</td>
                            {((pageAccess.AllowDelete ||
                              pageAccess.AllowUpdate) &&
                              pageAccess.AllowView) === 1 ? (
                              <>
                                <td key={item}>
                                  <>
                                    <div className="d-flex">
                                      {
                                        <EditActionBtn
                                          to={`/client-location-edit/${item["LocationID"]}`}
                                          style={AllowUpdateS}
                                        />
                                      }
                                      {
                                        <DeleteActionBtn
                                          onClickHandle={() =>
                                            DeleteUser(item["LocationID"])
                                          }
                                          id={item["LocationID"]}
                                          style={AllowDeleteS}
                                        />
                                      }
                                    </div>
                                  </>
                                </td>
                              </>
                            ) : (
                              <div style={{ display: "none" }}></div>
                            )}
                            <td>{item.LocationName}</td>
                            <td>{item.PAN}</td>
                            <td>{item.AddLine1}</td>
                            <td>{item.AddLine2}</td>
                            <td>{item.StateName}</td>
                            <td>{item.CityName}</td>
                            <td>{item.Pincode}</td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                  <nav>
                    <ul className="pagination-container custom-pagination mt-3">
                      <li className="pagination custom-pagination me-2">
                        <button
                          disabled={currentPage0 === 1}
                          className="page-btn text-white btn btn-sm btn-theme-primary"
                          onClick={prePage}
                        >
                          <i
                            className="fa fa-angle-double-left"
                            aria-hidden="true"
                          ></i>
                        </button>
                      </li>
                      {numbers.map((n, i) => (
                        <li
                          className="pagination custom-pagination me-2"
                          key={i}
                        >
                          <button
                            className={`page-btn btn btn-sm ${
                              n == currentPage ? "active" : ""
                            }`}
                            onClick={() => changeCPage(n)}
                          >
                            {n}
                          </button>
                        </li>
                      ))}
                      <li className="pagination custom-pagination me-2">
                        <button
                          className="page-btn text-white btn btn-sm btn-theme-primary  "
                          onClick={nextPage}
                          disabled={recordsPerPage >= data2.length}
                        >
                          <i
                            className="fa fa-angle-double-right"
                            aria-hidden="true"
                          ></i>
                        </button>
                      </li>

                      <div className="page-NavLink select-page">
                        <select
                          className="p-0 m-0 "
                          onChange={handleRecordsPerPageChange}
                          value={recordsPerPage}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                    </ul>
                  </nav>
                </div>
              ) : (
                <Access_Denied />
              )}
            </>
          ) : (
            <table
              className="client_panel_list_table"
              cellPadding="0"
              cellSpacing="0"
            >
              <tr>
                <td colSpan="8">No records found</td>
              </tr>
            </table>
          )}
        </>
      )}
    </Dashboard>
  );
};
export default Client_Location_List;
