
import React, { Component } from "react";
import Dropzone from './Dropzone.js';

class Home extends Component {
    render() {
        return (
            <div>
                 <br/>
                 <br/>
                <h2>HELLO</h2>
                <p>Upload Files to check for changes</p>

                <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            </div>
                        </section>
                    )}
                </Dropzone>

            </div>
        );
    }
}
export default Home;