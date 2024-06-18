// Header.js
import React, { useEffect, useState } from 'react';
import { BsBellFill } from 'react-icons/bs';
//import { BsChevronCompactDown } from 'react-icons/bs';
// import { Link, useNavigate } from 'react-router-dom';

const Header = ({ title }) => {

  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Set up interval to update current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    get_username();
    // Clean up function to clear the interval
    return () => {
      clearInterval(intervalId);
    };

  }, []);

  function capitalizeFirstLetter(str) {
    return (
      str.charAt(0).toUpperCase() + str.slice(1)
    );
  }

  const get_username = async () => {
    var data = localStorage.getItem('userdata');
    console.log("data", data)
    var userdata = JSON.parse(data);
    var fullName = userdata.Logindetail.Username;
    setUserName(capitalizeFirstLetter(fullName));
  }

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return (
      <h3>
        {formattedHours}:{minutes.toString().padStart(2, '0')}
        <sup>{ampm}</sup>
      </h3>
    );
  };

  return (
    <header>
      <div className='header_logo'>
        <img src="../img/login/logo.png" />
        <h2>J. Mehta & Co.</h2>
      </div>
      <div className="header_wrapper">
        <div>
          <div className='header_title_area'>
            <h4>{title}</h4>
          </div>
        </div>
        <div className='d-flex align-items-center'>
          <div className="header_date">
            {/* <h3>12:45<sup>PM</sup></h3> */}
            {/* {formattedHours}:{minutes.toString().padStart(2, '0')}
          <sup>{ampm}</sup> */}
            {formatTime(currentTime)}
          </div>
          <div className='header_profile_acc'>
            <img src="../img/user.svg" />
            <h5>{userName}</h5>
          </div>

          <div className='header_notification'>
            <BsBellFill />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
