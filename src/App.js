import React from 'react';
import barChart from './barChart.js';
import Form from './Form.js';
import Chart from './Chart.js'
import Loading from './Loading.js'
import './App.css';
require('dotenv').config()
const Octokit = require('@octokit/rest');
const octokit = new Octokit({
   auth: process.env.GITHUB_ACCESS_TOKEN
});

class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            userSubmitted: false,
            loading: false,
            username: '',
            repoUserName: '',
            repoUserSubmitted: 'false',
            userData: {},
            repoData: {},
            data: {
                nodes: [],
                links: []
            }
            //nodes:[{name: '0'},{name: '1'},{name: '2'},{name: '3'},{name: '4'},{name: '5'},{name: '6'},{name: '7'}],
            //links:[{target: 1, source: 0},
            //        {target: 3, source: 0},
            //        {target: 5, source: 0},
            //        {target: 7, source: 0},
            //        {target: 2, source: 1},
            //        {target: 4, source: 3},
            //        {target: 6, source: 7}]
            //}
 
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
        this.handleDblClick = this.handleDblClick.bind(this);
    }

    handleChange(event){
        this.setState({username: event.target.value});
        console.log(this.state.username);
    }

    async handleSubmit(event){
        event.preventDefault();

        this.setState({loading: true});

        console.log(this.state.username);
        var tempNodes = [];
        var tempLinks = [];
        var highestIndex =0;
        await octokit.users.listFollowersForUser({username: this.state.username})
            .then(result => {
//                this.setState({userData: {
//                    name: result.data.login,
//                    id : result.data.id,
//                    type: result.data.type,
//                    following: result.data.following,
//                    followers: result.data.followers
                tempNodes.push({name: this.state.username,  index: 0, group: 0});

                for(let i = 0; i < result.data.length; i++){
                    tempNodes.push({name: result.data[i].login,  index: (i+1), group: 1});
                    tempLinks.push({source: (i+1), target: 0});
                    highestIndex++;
                    if(i > 14) break;
                }
            });
         highestIndex++;

         //for(let i = 0; i < tempNodes.length; i++){
         //           tempLinks.push({source: (i+1), target: 0});
         //           console.log("linking " + i + "to 0");
         //};
         var tempNodesToConcat = [];
         var tempLinksToConcat = [];
         for(let c = 1; c < tempNodes.length; c++){
                                        
             let tempNodesTwo = [];
             let tempLinksTwo = [];
             
             await octokit.users.listFollowersForUser({username: tempNodes[c].name})
                .then(res => {

                    for(let j = 0;  j < res.data.length; j++){
                            tempNodesTwo.push({name: res.data[j].login,  index: j, group: 2});
                    //        tempLinksTwo.push({source:c, target: j});
                            if(j > 14) break;
                        }
                    });
                

                for(let j = 0; j < tempNodesTwo.length; j++){
                    tempLinksTwo.push({source:c, target: (j+tempNodesTwo.length)});
                    console.log("linking" + c + "to" + j);
                }

            tempNodesToConcat.push(...tempNodesTwo);
            tempLinksToConcat.push(...tempLinksTwo);
        }

        tempNodes.push(...tempNodesToConcat);
        tempLinks.push(...tempLinksToConcat);

        this.setState({data:{
            nodes: tempNodes,
            links: tempLinks,
            }    
                
            });

        this.setState({loading: false});
        this.setState({userSubmitted: true});
        

        const x = JSON.stringify(this.state.data,null,'\n');
        console.log(x);
    }

    handleReturn(event){
        this.setState({
            userSubmitted: false,
            userData: {}
        });
    }

    handleDblClick(event){
        this.setState({repoUserName: event.target.value});
        console.log(this.state.repoUserName);
    }
    
    render() {
      return (
        <div className="App">
            {!this.state.userSubmitted && !this.state.loading && <img src={ require('./github.png')} className ="logo" alt="logo" />}
                 <div className= "app-container">
                     {!this.state.userSubmitted && !this.state.loading  
                            && <Form onChangeValue={this.handleChange} onSubmit= {this.handleSubmit}/>} 
                     {!this.state.userSubmitted && this.state.loading && <Loading/>}
                     {this.state.userSubmitted && !this.state.loading && <Chart data = {this.state.data} username = {this.state.username}
                                                                            onDblClick = {this.handleDblClick} />}
                </div> 
                   {/* *<barChart data={this.state.data} width={this.state.width} height={this.state.height}/> */}
        </div>
      );
    }
}
export default App;
