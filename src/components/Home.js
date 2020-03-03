
import React, { Component }  from "react";
import Dropzone from 'react-dropzone'
import Web3 from 'web3';
import Identicon from "identicon.js";
import {
    Card,  Button
} from 'react-bootstrap';

//import smart contract into the project
import Project from "../abis/Project.json";

const ipfsClient = require('ipfs-http-client');
//connected to the infura public gatway but can be change to the personal network nodes
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

const IPFS_URL = "https://ipfs.infura.io/ipfs/";
//tpyical hash on ipfs QmcgpsyWgH8Y8ajJz1Cu72KnS5uo2Aa2LpzU7kinSupNKC
class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            buffer: null,
            file_name:"",
            account: "",
            project: null,
            docCount: 0,
            docs: [],
            loading: true,
        }
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

    onDrop(acceptedFiles) {
        acceptedFiles.forEach((file) => {
        this.setState({ file_name: file.name })
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onloadend = () => {
            // Do whatever you want with the file contents
            this.setState({ buffer: Buffer(reader.result) })
        }

        })
    }

    onSubmit = (event) => {
        event.preventDefault()
        console.log("Submitting file to ipfs...")
        if (this.state.buffer === null) {
            window.alert("No files selected");
        }
        else { this.uploadToIPFSUpload() }
    }

    async uploadToIPFSUpload() {
        for await (const result of ipfs.add(this.state.buffer)) {
            console.log(result.path)
            this.uploadDoc(result.path)
            this.createPost(this.state.account + " made changes " + this.state.file_name);
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

    uploadDoc(content) {
        this.setState({ loading: true })
        this.state.project.methods.uploadDoc(content, this.state.file_name).send({ from: this.state.account })
            .on('receipt', (receipt) => {
                console.log('loaded')
            })
        window.location.reload()
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
            const docCount = await project.methods.docCount().call()

            //get the count to render each post (needed cause mapping)
            this.setState({ docCount })
            for (var i = 0; i <= docCount; i++) {
                const doc = await project.methods.docs(i).call()

                this.setState({

                    docs: [...this.state.docs, doc]//creates new array with new element added to he end es6 specific
                })

            }
            this.setState({ docs: this.state.docs.slice(1) })
            this.setState({ loading: false })
        } else {
            console.log("contract not deployed to network")
        }
    }

    render() {
        return (
            <div>
                 <br/>
                 <br/>
                <h4>Files in the Project</h4>
                <div class="row">
                {this.state.docs.map((doc, key) => {
                    return (
                        <div>
                        <div class="col-sm-6" >
                        <Card style={{ width: '15em' }}>
                                <Card.Img
                                variant="top"
                                style={{ width: '2em' }}
                                src={`data:image/png;base64,${new Identicon(doc.author, 30).toString()}`} />
                            <Card.Body>
                                    <Card.Title>{doc.title}</Card.Title>
                                    <footer className="blockquote-footer"> Last edited by {doc.author}</footer>
                                    <Button onClick={() => window.open(IPFS_URL + doc.content , "_blank")} variant="primary" >Go to document</Button>
                            </Card.Body>
                        </Card>
                        </div>
                        <br />
                        </div>
                )})}
                </div>
                <br />
                <div class="border-top border-dark"></div>
                <br />
                <Dropzone onDrop={(acceptedFiles) => { this.onDrop(acceptedFiles) }}>
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p>Drag 'n' drop some files here to add them in the project</p>
                            </div>
                        </section>
                    )}
                </Dropzone>
                <form onSubmit={this.onSubmit}>

                    <button type="submit" className="btn btn-primary btn-block">UPLOAD TO BLOCKCHAIN</button> 
                </form>   

            </div>
        );
    }
}
export default Home;
