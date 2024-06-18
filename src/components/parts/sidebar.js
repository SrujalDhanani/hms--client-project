// Sidebar.js
import React, { useState, useContext } from "react";
import { MdLogout } from "react-icons/md";
import { HiOutlineChevronDown } from "react-icons/hi";
import { BiSolidUser } from "react-icons/bi";
import { HiOutlineMenu } from "react-icons/hi"; // Import the mobile icon
import { Link, useNavigate } from "react-router-dom";
import SidebarContext from "../../SidebarProvider";
import Cookies from "js-cookie"
// import { HiOutlineChevronDown } from 'react-icons/hi';

const Sidebar = () => {
  const navigate = useNavigate();
  const {
    isSidebarOpen,
    toggleSidebar,
    isSidebarOpen2,
    toggleSidebar2,
    isSidebarOpen3,
    toggleSidebar3,
    isSidebarOpen4,
    toggleSidebar4,
    isSidebarOpen5,
    toggleSidebar5,
  } = useContext(SidebarContext);
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleDropdown1 = () => {
    setActiveMenu(activeMenu === 0);

    const menuElement = document.getElementById("menu1"); // Get the menu element by index
    if (menuElement) {
      menuElement.classList.toggle("active"); // Toggle the 'active' class
    }
  };
  const toggleDropdown2 = () => {
    setActiveMenu(activeMenu === 1);
    const menuElement = document.getElementById("menu2"); // Get the menu element by index
    if (menuElement) {
      menuElement.classList.toggle("active"); // Toggle the 'active' class
    }
  };
  const toggleDropdown3 = () => {
    setActiveMenu(activeMenu === 2);
    const menuElement = document.getElementById("menu3"); // Get the menu element by index
    if (menuElement) {
      menuElement.classList.toggle("active"); // Toggle the 'active' class
    }
  };
  const toggleDropdown4 = () => {
    setActiveMenu(activeMenu === 4);
    const menuElement = document.getElementById("menu4"); // Get the menu element by index
    if (menuElement) {
      menuElement.classList.toggle("active"); // Toggle the 'active' class
    }
  };
  const toggleDropdown5 = () => {
    setActiveMenu(activeMenu === 4);
    const menuElement = document.getElementById("menu5"); // Get the menu element by index
    if (menuElement) {
      menuElement.classList.toggle("active"); // Toggle the 'active' class
    }
  };

  const logout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toggleSidebar5(false);
    toggleSidebar4(false);
    toggleSidebar3(false);
    toggleSidebar2(false);
    toggleSidebar(false);
    localStorage.clear();
    Cookies.remove("token");
    navigate("/");
  };
  return (
    <>
      <aside>
        {/* <div className={`mobile-icon ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
        <HiOutlineMenu />
      </div> */}
        <h2>My activity</h2>
        <ul>
          <li
            id="menu1"
            className={`menu_item ${isSidebarOpen ? "active" : ""}`}
          >
            <div className="menu_text" onClick={toggleSidebar}>
              <div className="main_part_menu m1">
                <img
                  src={`../img/${isSidebarOpen ? "user_white" : "user_side"
                    }.svg`}
                  alt="User"
                />
                Users
              </div>
              <HiOutlineChevronDown />
            </div>
            <ul className="submenu p-0">
              <Link to="/all-department">
                <li>Department </li>
              </Link>
              <Link to="/all-designation">
                <li> Designation </li>
              </Link>
              <Link to="/all-users">
                <li> Users </li>
              </Link>
            </ul>
          </li>
          <li
            id="menu2"
            className={`menu_item ${isSidebarOpen2 ? "active" : ""}`}
          >
            <div className="menu_text" onClick={toggleSidebar2}>
              <div className="main_part_menu m2">
                <img
                  src={`../img/${isSidebarOpen2 ? "people_white" : "people"
                    }.svg`}
                  alt="People"
                />
                Clients
              </div>
              <HiOutlineChevronDown />
            </div>
            <ul className="submenu p-0">
              <Link to="/client-location-list">
                <li>Client Location</li>
              </Link>
            </ul>
          </li>
          <li
            id="menu3"
            className={`menu_item ${isSidebarOpen3 ? "active" : ""}`}
          >
            <div className="menu_text" onClick={toggleSidebar3}>
              <div className="main_part_menu m2">
                <img
                  src={`../img/${isSidebarOpen3 ? "people_white" : "people"
                    }.svg`}
                  alt="People"
                />
                Employee
              </div>
              <HiOutlineChevronDown />
            </div>
            <ul className="submenu p-0">
              <Link to="/employee-list">
                <li>Employee</li>
              </Link>
            </ul>
          </li>
          <li
            id="menu4"
            className={`menu_item ${isSidebarOpen4 ? "active" : ""}`}
          >
            <div className="menu_text" onClick={toggleSidebar4}>
              <div className="main_part_menu m2">
                <img
                  src={`../img/${isSidebarOpen4 ? "people_white" : "people"
                    }.svg`}
                  alt="People"
                />
                Salary
              </div>
              <HiOutlineChevronDown />
            </div>
            <ul className="submenu p-0">
              <Link to="/salary-list">
                <li>Salary Components</li>
              </Link>
              <Link to="/salary-structure-list">
                <li>Salary Structure</li>
              </Link>
            </ul>
          </li>
          <li
            id="menu5"
            className={`menu_item ${isSidebarOpen5 ? "active" : ""}`}
          >
            <div className="menu_text" onClick={toggleSidebar5}>
              <div className="main_part_menu m2">
                <img
                  src={`../img/${isSidebarOpen5 ? "people_white" : "people"
                    }.svg`}
                  alt="People"
                />
                Professional Tax
              </div>
              <HiOutlineChevronDown />
            </div>
            <ul className="submenu p-0">
              <Link to="/pt-list">
                <li>Professional Tax</li>
              </Link>
            </ul>
          </li>
          {/* Repeat the same pattern for the other menu items */}
        </ul>
        <div className="logout-btn">
          <button className="logout-btn" onClick={logout}>
            <div className="logout-svg">
              <MdLogout />
            </div>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
