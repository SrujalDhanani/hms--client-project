import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./components/PrivateRoutes.js";

import Login from "./pages/login.js";
import Forgotpass from "./pages/forgotpass.js";
import Otp from "./pages/otp.js";
import Resetpass from "./pages/resetpass.js";

import Dashboard_main from "./pages/dashboard.js";

import Department from "./pages/department.js";
import Department_list from "./pages/department_list.js";

import Designation from "./pages/designation.js";
import Designation_list from "./pages/designation_list.js";

import User_entry from "./pages/user.js";
import User_panel from "./pages/user_panel.js";

import Employee_entry from "./pages/employee_entry.js";
import Employee_list from "./pages/employee_list.js";

import NotFound from "./pages/not_found.js";
import ClientLocationAdd from "./pages/client_location_add.js";
import Client_Location_List from "./pages/client-location-list.js";

import SalaryList from "./pages/salary-list.js";
import SalaryAdd from "./pages/salary-add.js";
import PTaxAdd from "./pages/pt-add.js";
import PTaxList from "./pages/pt-list.js";
import Salary from "./pages/salary.js";
import Salary_Structure from "./pages/salary-structure-list.js";

export const Routes1 = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgotpass" element={<Forgotpass />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/resetpass" element={<Resetpass />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard_main />} />

          <Route path="/all-users" element={<User_panel />} />
          <Route path="/add-user" element={<User_entry />} />
          <Route path="/edit-user/:id" element={<User_entry />} />

          <Route path="/all-designation" element={<Designation_list />} />
          <Route path="/designation" element={<Designation />} />
          <Route path="/designation/:id" element={<Designation />} />

          <Route path="/all-department" element={<Department_list />} />
          <Route path="/department/:id" element={<Department />} />
          <Route path="/department" element={<Department />} />

          <Route path="/employee-list" element={<Employee_list />} />
          <Route path="/employee-entry/:id" element={<Employee_entry />} />
          <Route path="/employee-entry" element={<Employee_entry />} />

          <Route
            path="/client-location-list"
            element={<Client_Location_List />}
          />
          <Route path="/client-location-add" element={<ClientLocationAdd />} />
          <Route
            path="/client-location-edit/:id"
            element={<ClientLocationAdd />}
          />

          <Route path="/salary-list" element={<SalaryList />} />
          <Route path="/salary-add" element={<SalaryAdd />} />
          <Route path="/salary-edit/:id" element={<SalaryAdd />} />

          <Route path="/salary" element={<Salary />} />
          <Route path="/salary-structure-list" element={<Salary_Structure />} />
          <Route path="/salary-structure-edit/:id" element={<Salary />} />

          <Route path="/pt-list" element={<PTaxList />} />
          <Route path="/pt-add" element={<PTaxAdd />} />
          <Route path="/pt-edit/:id" element={<PTaxAdd />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
