import React from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";

const Input2 = ({
  placeholder,
  readOnly,
  type,
  label,
  required,
  disabled,
  value,
  onChange,
  style,
  autoFocus,
  min,
  showPassword,
  togglePasswordVisibility,
  className,
}) => {
  const toggleIconStyle = {
    position: "absolute",
    right: "10px", // Adjust this value as needed for proper alignment
    top: "70%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    display: showPassword == "d-none" ? "none" : "block",
  };
  return (
    <div className="dashboard_input_feild" style={{ position: "relative" }}>
      <h3 style={{ display: label ? "unset" : "none" }}>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </h3>
      <input
        placeholder={placeholder}
        type={type === "password" ? (showPassword ? "text" : "password") : type} // Toggle type based on showPassword statetype={type}
        disabled={disabled}
        readOnly={readOnly}
        style={style}
        value={value}
        className={className}
        onChange={(event) => onChange(event.target.value)}
        autoFocus={autoFocus}
        min={min}
      />
      {type === "password" && ( // Show password toggle icon only if type is password
        <div
          className="password-toggle2"
          style={toggleIconStyle}
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FaEyeSlash /> : <FaRegEye />}
        </div>
      )}
    </div>
  );
};

export default Input2;
