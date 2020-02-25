import React, { Component } from 'react';
import Identicon from "identicon.js";
import './Main.css';

class Feed extends Component {
    render() {
        return (
            <div className="container-fluid mt-5">
                <div className="row">
                    <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
                        <div className="content mr-auto ml-auto">
                      
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                const content = this.postContent.value
                                const title = this.postTitle.value
                                this.props.createPost(content, title)
                            }}>
                                <div className="form-group mr-sm-2">
                                    <input
                                        id="postTitle"
                                        type="text"
                                        ref={(input) => { this.postTitle = input }}
                                        className="form-control"
                                        placeholder="Title placeholder"
                                        required />
                                </div>
                                <div className="form-group mr-sm-2">
                                    <textarea
                                        id="postContent"
                                        type="text"
                                        ref={(input) => { this.postContent = input }}
                                        className="form-control"
                                        placeholder="content placeholder"
                                        required />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">Share</button>
                            </form>

                            {this.props.posts.map((post, key) => {
                                return (
                                    <div className="card mb-4" key={key}>
                                        <div className="card-header">
                                            <img className="mr-2"
                                                width="30"
                                                height="30"
                                                //identicon specific
                                                src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`} />


                                            <small className="test-muted">{post.author}</small>
                                            <br/>
                                            <big>{post.title}</big>
                                        </div>
                                        <ul id="postList" className="list-group list-group-flush">
                                            <li className="list-group-item">
                                                

                                                <p>{post.content}</p>
                                                
                                            </li>

                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </main>
                </div>
            </div>
        );

    }
}
export default Feed;