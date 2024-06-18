// App.js
import React, { useState, useEffect } from "react";
import Dashboard from "../components/dashboard.js";
import { AiFillCloseCircle } from "react-icons/ai";
import Input2 from "../components/parts/input2.js";
import { HiOutlineChevronDown } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";

const Dashboard_main = () => {
  const user = useSelector((state) => state);
  console.log(user);
  return (
    <div className="admin_dashboard_main">
      <Helmet>
        <title>Dashboard | J mehta</title>
      </Helmet>
      <Dashboard title={"Dashboard"}>
        {/* <div className="main_menu_admin_dashboard">
          <ul>
            <li>Home</li>
            <li>Data Input</li>
            <li>Upload Challan</li>
            <li>Generate Payroll</li>
            <li>Report</li>
          </ul>
        </div> */}
        <div className="admin_dashboard_status">
          <div className="admin_dashboard_status_part1">
            <div className="admin_dashboard_status_part1_line1">
              <div className="admin_dashboard_status1">
                <div className="admin_dashboard_status1_count">
                  <div className="admin_dashboard_status1_circle">
                    <h2>03</h2>
                  </div>
                </div>
                <div className="admin_dashboard_status1_title">
                  <p>New Client onboard Today</p>
                </div>
              </div>
              <div className="admin_dashboard_status2">
                <div className="admin_dashboard_status2_count">
                  <div className="admin_dashboard_status2_circle">
                    <h2>18</h2>
                  </div>
                </div>
                <div className="admin_dashboard_status2_title">
                  <p>New Client onboard Last week</p>
                </div>
              </div>
            </div>
            <div className="admin_dashboard_status_part1_line2">
              <div className="admin_dashboard_status3">
                <div className="admin_dashboard_status3_count">
                  <div className="admin_dashboard_status3_circle">
                    <h2>35</h2>
                  </div>
                </div>
                <div className="admin_dashboard_status3_title">
                  <p>New Client onboard Last Month</p>
                </div>
              </div>
              <div className="admin_dashboard_status4">
                <div className="admin_dashboard_status4_count">
                  <div className="admin_dashboard_status4_circle">
                    <h2>20</h2>
                  </div>
                </div>
                <div className="admin_dashboard_status4_title">
                  <p>Payroll Generate Last Month for Clients</p>
                </div>
              </div>
            </div>
          </div>
          <div className="admin_dashboard_status_part2">
            <div className="main_dashboard_date">
              <div className="date_admin_dashboard">
                <img src="./img/Calendar.svg" />
                <h3>01 June - 30 June</h3>
              </div>
              <div className="date_admin_icon">
                <HiOutlineChevronDown />
              </div>
            </div>
          </div>
        </div>
        <div className="admin_dashboard_top_5_wrap">
          <div className="admin_dashboard_top_5">
            <h2>Top 5 clients with highest payroll</h2>
            <table
              className="admin_dashboard_top_5_1"
              cellPadding="0"
              cellSpacing="0"
            >
              <thead>
                <tr>
                  <th>Sr. no</th>
                  <th>Clients</th>
                  <th>No. of employee</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>01</td>
                  <td>Olive Yew</td>
                  <td>20</td>
                </tr>
                <tr>
                  <td>02</td>
                  <td>Maureen Biologist</td>
                  <td>25</td>
                </tr>
                <tr>
                  <td>03</td>
                  <td>Peg Legge</td>
                  <td>15</td>
                </tr>
                <tr>
                  <td>04</td>
                  <td>Allie Grater</td>
                  <td>19</td>
                </tr>
                <tr>
                  <td>05</td>
                  <td>Aida Bugg</td>
                  <td>23</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="admin_dashboard_top_5">
            <h2>Top 5 clients with highest payroll</h2>

            <table
              className="admin_dashboard_top_5_1"
              cellPadding="0"
              cellSpacing="0"
            >
              <thead>
                <tr>
                  <th>Sr. no</th>
                  <th>Clients</th>
                  <th>No. of employee</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>01</td>
                  <td>Olive Yew</td>
                  <td>20</td>
                </tr>
                <tr>
                  <td>02</td>
                  <td>Maureen Biologist</td>
                  <td>25</td>
                </tr>
                <tr>
                  <td>03</td>
                  <td>Peg Legge</td>
                  <td>15</td>
                </tr>
                <tr>
                  <td>04</td>
                  <td>Allie Grater</td>
                  <td>19</td>
                </tr>
                <tr>
                  <td>05</td>
                  <td>Aida Bugg</td>
                  <td>23</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="admin_dashboard_top_5_wrap admin_dashboard_top_5_wrap_2">
          <div className="admin_dashboard_top_5">
            <h2>Top 5 clients with highest payroll</h2>
            <table
              className="admin_dashboard_top_5_1"
              cellPadding="0"
              cellSpacing="0"
            >
              <thead>
                <tr>
                  <th>Sr. no</th>
                  <th>Clients</th>
                  <th>Schedule date of data</th>
                  <th>Data received date</th>
                  <th>Delay in days</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>01</td>
                  <td>Olive Yew</td>
                  <td>01/05/2023</td>
                  <td>03/05/2023</td>
                  <td>
                    <span>2 Days</span>
                  </td>
                </tr>
                <tr>
                  <td>02</td>
                  <td>Maureen Biologist</td>
                  <td>06/04/2023</td>
                  <td>11/04/2023</td>
                  <td>
                    <span>5 Days</span>
                  </td>
                </tr>
                <tr>
                  <td>03</td>
                  <td>Peg Legge</td>
                  <td>20/02/2023</td>
                  <td>28/02/2023</td>
                  <td>
                    <span>7 Days</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Dashboard>
    </div>
  );
};

export default Dashboard_main;
