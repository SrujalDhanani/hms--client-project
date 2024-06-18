// import React from 'react';

// const Select = ({ options, label, value, onChange }) => {
//   return (
//     <div className='dashboard_select_field'>
//       <h3>{label}</h3>
//       <Form.Select value={value} onChange={onChange}>
//         <option value="" disabled>Select an option</option>
//         {options.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </Form.Select>
//     </div>
//   );
// };

// export default Select;
import React from 'react';
import { Form } from 'react-bootstrap';

function Select({ options, selectedOptions, defaultValue, handleChange, label, required, disabled, style, autoFocus }) {
  return (
    <div className='dashboard_select_field'>
      <h3>{label}{required && <span style={{ color: 'red' }}>*</span>}</h3>
      <Form.Select
        value={selectedOptions || defaultValue}
        onChange={handleChange}
        disabled={disabled}
        style={style}
        autoFocus={autoFocus}
      >
        <option value={''} key={0} hidden>Select {label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </Form.Select>
    </div>
  );
}

export default Select;
