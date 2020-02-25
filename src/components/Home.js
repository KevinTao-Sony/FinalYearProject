
import React, { Component } from "react";
import Dropzone from './Dropzone.js';
import AtomList from "./file_upload.js"

class Home extends Component {


    render() {
        return (
            <div>
                
                 <br/>
                 <br/>
                <h2>HELLO</h2>
                <p>Upload Files to check for changes</p>
                    <AtomList />
                <br />
                <div class="border-top border-dark"></div>
                <br/>
                <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p>Drag 'n' drop some files here to add them in the project</p>
                            </div>
                        </section>
                    )}

                
                </Dropzone>

            </div>
        );
    }
}
export default Home;