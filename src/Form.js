import React from 'react'
import './Form.css'

class Form extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className= "form">
                <form className="demo-form" onSubmit={this.props.onSubmit}>
                    <label htmlFor="username">Github API</label>
                    <div className="panel panel-default"/>
                    <div className={`form-group`}>
                        <input type="text" required className="form-control" name="username"
                            placeholder="conchuiroriain"
                            onChange={this.props.onChangeValue}/>
                    </div>
                    <button type= "submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }
}
export default Form;
