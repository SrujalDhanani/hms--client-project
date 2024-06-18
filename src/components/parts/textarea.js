import React, { useEffect, useState } from 'react';

const Textarea = ({ placeholder, label, disabled, rows, cols, value, onChange, required }) => {
  // const [text, setText] = useState('');

  // const handleTextChange = (event) => {
  //   setText(event.target.value);
  // };

  return (
    <div className='dashboard_textarea_feild'>
      <h3>{label}{required && <span style={{color:'red'}}>*</span>}</h3>
      <textarea
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        cols={cols}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};

export default Textarea;
