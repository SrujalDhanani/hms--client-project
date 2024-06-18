import React, { useState } from 'react';

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <div className='dashboard_checkbox_feild'>
      <label  className='form-check-label'>
      {label}
        <input
          className='ms-2'
          type='checkbox'
          checked={checked}
          onChange={onChange}
        />
       
      </label>
    </div>
  );
};

export default Checkbox;
