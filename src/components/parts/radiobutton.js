import React from 'react';

const RadioButton2 = ({ label, value, checked, onChange, disabled, style }) => {
  return (
    <label className="radio-button">
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={style}
      />
      {label}
    </label>
  );
};

export default RadioButton2;
