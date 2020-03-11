import React, { Component } from "react";
import Project from "../abis/Project.json";
import Web3 from 'web3';


const ipfsClient = require('ipfs-http-client');
//connected to the infura public gatway but can be change to the personal network nodes
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

const IPFS_URL = "https://ipfs.infura.io/ipfs/";

class uploadToIPFSUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {

            buffer: null,
            file_name: "",
            account: "",
            project: null,
            loading: true,
        }
        this.UploadToIPFS = this.UploadToIPFS.bind(this)
    }
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
            this.setState({ loading: false })
        } else {
            console.log("contract not deployed to network")
        }
    }

    async UploadToIPFS(id, title, files) {
        for await (const result of ipfs.add(Buffer(files))) {
            console.log(result)
            this.state.project.methods.updateDoc(id, title, result.path).send({ from: this.state.account })
        }
    }



}
export default uploadToIPFSUpdate