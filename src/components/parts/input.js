import React, { useState } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";

const Input = ({
  placeholder,
  type,
  label,
  onChange,
  value,
  showPassword,
  togglePasswordVisibility,
}) => {
  // const [username, setUsername] = useState('');

  // const handleUsernameChange = (event) => {
  //   setUsername(event.target.value);
  // };
  const toggleIconStyle = {
    color: "white",
    position: "absolute",
    right: "10px", // Adjust this value as needed for proper alignment
    top: "56%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    display: showPassword == "d-none" ? "none" : "block",
  };

  return (
    <div className="dashboard_input_feild" style={{ position: "relative" }}>
      <h3>{label}</h3>
      <input
        value={value}
        placeholder={placeholder}
        type={type === "password" ? (showPassword ? "text" : "password") : type} //
        onChange={onChange}
      />
      {type === "password" && (
        <div
          className="password-toggle"
          style={toggleIconStyle}
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaEyeSlash /> : <FaRegEye />}
        </div>
      )}
    </div>
  );
};

export default Input;
