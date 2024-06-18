import React from "react";
import Dashboard from "../components/dashboard";
import { Helmet } from "react-helmet";

export default function Access_Denied() {
  return (
    <>
      <Helmet>
        <title>J mehta</title>
      </Helmet>
      <div className="denied-access-container">
        <h2>Access Denied</h2>
        <p>You do not have permission to access this page.</p>
        <p>Please contact the administrator for assistance.</p>
      </div>
    </>
  );
}
