import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/spinner'

function Loading() {

    return(
        <div className="repo-graph-loading-spinner" style={{display: 'block', position: 'fixed', top: '50%', left: '50%'}}>
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
      </div>
    )
}

export default Loading  
