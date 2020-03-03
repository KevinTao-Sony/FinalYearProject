import React, { Component } from "react";
import {
    Route,
    HashRouter
} from "react-router-dom";
import App from "./App";
import Home from "./Home";
import Navbar from "./Navbar";



class Main extends Component {



    constructor(props) {
        super(props)
        this.state = {
            account: "",
            project: null,
            postCount: 0,
            posts: [],
            loading: true,
        }

    }
    render() {
        return (
            <HashRouter>
                <div>

                    <Navbar account={this.state.account} />

                    <div className="content">
                        <div className="content">
                            <Route exact path="/" component={Home} />
                            <Route path="/App" component={App} />
                        </div>
                    </div>
                </div>
            </HashRouter>
        );
    }
}// JavaScript source code
export default Main;
