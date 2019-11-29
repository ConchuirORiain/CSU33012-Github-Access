import React from 'react'
const Octokit = require('@octokit/rest')();

function Request(props){
    const octokit = new Octokit({
        auth: 'e9b2f883c61d1ecdce13b5cd6e1e562175bb4b35'
    });

    this.props.follower = "AAAAAH"
    return (
      (<div> {this.props.follower} </div>)
        );
}

export default Request;
