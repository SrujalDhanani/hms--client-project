// components/PrivateRoute.js
import React from 'react';
import Cookies from "js-cookie";

import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = ({ component: Component, ...rest }) => {

  const isAuthenticated = Cookies.get('token');
  return (
    isAuthenticated ? <Outlet /> : <Navigate to="/" />
  );
};

export default PrivateRoutes;