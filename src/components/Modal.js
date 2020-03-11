import React, { useState, Component, createRef} from "react";
import { Modal, Button } from 'react-bootstrap';
import Dropzone from 'react-dropzone'; 
import Project from "../abis/Project.json";
import Web3 from 'web3';



const ipfsClient = require('ipfs-http-client');
//connected to the infura public gatway but can be change to the personal network nodes
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

const IPFS_URL = "https://ipfs.infura.io/ipfs/";

export default class ModelDrop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            acceptedFiles: [],
            show: false,
            file_title:"",
            buffer: null,
            file_id:"",
            files: "",
            account: "",
            project: null,
            loading: true,
        }

    }

    async componentWillMount() {
        this.setState({ file_title: this.props.document.title })
        this.setState({ file_id: this.props.document.id })
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

    createPost(content) {
        this.setState({ loading: true })
        this.state.project.methods.createPost(content).send({ from: this.state.account })
            .on('receipt', (receipt) => {
                console.log('loaded')
            })
        window.location.reload()
    }

    async UpdateToIPFS(id, title, files) {
        for await (const result of ipfs.add(Buffer(files))) {
            console.log(id.toNumber(), title, result.path)
            this.state.project.methods.updateDoc(id, result.path, title).send({ from: this.state.account })
            this.createPost("Updated document: " + title);
            this.setState({ show: false })
        }
    }

    render() {
        return (
            <>
                <Button variant="secondary" style={{ marginTop: "0" }} onClick={() => this.setState({ show: true })}>
                    Update Document
             </Button>

                <Modal show={this.state.show} onHide={() => this.setState({ show: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Document by uploading new version</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Dropzone onDrop={(acceptedFiles) => {
                            this.setState({ acceptedFiles: acceptedFiles })
                            acceptedFiles.forEach((file) => {

                                const reader = new FileReader()
                                reader.readAsText(file)
                                reader.onabort = () => console.log('file reading was aborted')
                                reader.onerror = () => console.log('file reading has failed')
                                reader.onloadend = () => {
                                    // Do whatever you want with the file contents
                                    this.setState({ buffer: Buffer(reader.result) })
                                }

                            })


                        }}>
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p>Drag 'n' drop some files here to add them in the project</p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                        
                        {this.state.acceptedFiles.map(file => (
                            <li key={file.path}>
                                {file.path} - {file.size} bytes
                     </li>))}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ show: false })}>
                            Close
                     </Button>
                        <Button type="submit" variant="primary" onClick={() => this.state.buffer != null ? this.UpdateToIPFS(this.state.file_id, this.state.file_title, this.state.buffer) : window.alert("No files selected") }>
                            Save
                     </Button>
                    </Modal.Footer>

                </Modal>
            </>
        );
    }
}
