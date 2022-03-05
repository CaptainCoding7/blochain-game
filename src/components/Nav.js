import React from 'react';
import './App.css';
import {Link} from 'react-router-dom';

function Nav(){
    const navStyle = {
        color: 'white'
    };


    return (
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
          <img src="./images/logo_ball.png" width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; Foot Cards Trading
          </a>
          <ul className="navbar-nav px-3">
            <Link onClick={(event) => {document.location.reload()}} style={navStyle} to="/marketplace" >
              <li>Marketplace</li>
            </Link>
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-muted"><span id="account"></span></small>
            </li>
          </ul>
        </nav>
    );
}

export default Nav;