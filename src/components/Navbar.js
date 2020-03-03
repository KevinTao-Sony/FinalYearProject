import React, { Component } from 'react';
import Identicon from "identicon.js";
import {
    NavLink,
} from "react-router-dom";
import './Main.css';
class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-primary flex-md-nowrap p-0 shadow">
                <ul className="header">
                    <li><NavLink exact to="/">Home</NavLink></li>
                    <li><NavLink to="/App">Feed</NavLink></li>
                </ul>
                <a className="navbar-brand col-sm-2 col-md-1 mr-0 text-light">
                    Collabrative Work Space
                </a>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                        <small className='text-secondary'>
                            <small id="account">{this.props.account}</small>
                        </small>
                        {this.props.account ?
                            <img className="ml-2"
                                width="30"
                                height="30"
                                //identicon specific
                                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}/> : <span></span>
                        }
                    </li>
                </ul>
            </nav>
            );

    }
}
export default Navbar;