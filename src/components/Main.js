import React, { Component } from "react";
import {
    Route,
    HashRouter
} from "react-router-dom";
import App from "./App";
import Home from "./Home";
import Navbar from "./Navbar";
import Web3 from 'web3';
import './Main.css';
//import smart contract into the project
import Project from "../abis/Project.json";



class Main extends Component {

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        //get the address and the ABI as stated on the web3 doc to create an instance of the smart contract
        const networkId = await web3.eth.net.getId()
        const networkData = Project.networks[networkId]
        if (networkData) {
            const project = web3.eth.Contract(Project.abi, networkData.address)
            this.setState({ project: project })
            //now  can call solidity methods from within browser , call function doesnt cost any gas
            const postCount = await project.methods.postCount().call()

            //get the count to render each post (needed cause mapping)
            this.setState({ postCount })
            for (var i = 0; i <= postCount; i++) {
                const post = await project.methods.posts(i).call()

                this.setState({

                    posts: [...this.state.posts, post]//creates new array with new element added to he end es6 specific
                })
            }
            this.setState({ loading: false })
        } else {
            console.log("contract not deployed to network")
        }
    }
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
