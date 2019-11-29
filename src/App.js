import React from 'react';
import Form from './Form.js';
import Chart from './Chart.js'
import Loading from './Loading.js'
import PieChart from './PieChart.js'
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
            repoUserSubmitted: false,
            userData: {},
            userInfo: '',
            repoData: '',
            languageArray: '',
            infoArray: '',
            gettingLang: false,
            data: {
                nodes: [],
                links: []
            }
 
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
        this.handleGraphButton = this.handleGraphButton.bind(this);
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
        await octokit.users.listFollowersForUser({username: this.state.username})
            .then(result => {
                tempNodes.push({name: this.state.username,  index: 0, group: 0});

                for(let i = 0; i < result.data.length; i++){
                    tempNodes.push({name: result.data[i].login,  index: (i+1), group: 1});
                    tempLinks.push({source: (i+1), target: 0});
                    if(i > 14) break;
                }
            });

         var tempNodesToConcat = [];
         var tempLinksToConcat = [];
         var jHop = tempNodes.length;
         for(let c = 1; c < tempNodes.length; c++){
                                        
             let tempNodesTwo = [];
             let tempLinksTwo = [];
             await octokit.users.listFollowersForUser({username: tempNodes[c].name})
                .then(res => {
                        
                    for(let j = 0;  j < res.data.length; j++){
                            tempNodesTwo.push({name: res.data[j].login,  index: j, group: 2});
                            if(j > 14) break;
                        }
                    });
            

            for(let j = 0; j < tempNodesTwo.length; j++){
                tempLinksTwo.push({source:c, target: (j + jHop)});
                console.log("linking" + c + "to" + j);
            }
            
            jHop += tempNodesTwo.length;
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

    async handleGraphButton(event){
        this.setState({loading:true});
        await octokit.users.getByUsername({username: this.state.username})
            .then(result => {
                this.setState({userInfo: result.data});
            });

        await octokit.repos.listForUser({username: this.state.username})
            .then(result => {
                console.log(result.data);
                this.setState({repoData: result.data});
                console.log(this.state.repoData);
         });

        var array = [];
        var lang = null;
        for(let i =0; i <(this.state.repoData.length); i++){
            lang = this.state.repoData[i].language;
            if(!array.includes(lang) && lang != null){
                array.push(lang);
            }
        }

        var tempArray =[];
        for (let i = 0; i < this.state.repoData.length; i++){
            if(this.state.repoData[i].language !== null){
                tempArray.push(this.state.repoData[i].language);
            }
        }

        tempArray.sort();
        var a1 = [];
        var a2 = [];
        var prev = null;
        for(let i = 0; i < tempArray.length; i++){
            if(tempArray[i] !== prev ){
                a1.push(tempArray[i])
                a2.push(1);
            }else{
                a2[a2.length -1]++;
            }
            prev = tempArray[i];
        }
        console.log(a1);
        console.log(a2);

        this.setState({languageArray: a2});
        this.setState({infoArray: a1});
        
        console.log(this.state.languageArray);
        console.log(this.state.infoArray);
        this.setState({repoUserSubmitted: true});
        this.setState({loading: false});    
    }





    handleReturn(event){
        this.setState({
            userSubmitted: false,
            data: {}
        });
    }

    handleDblClick(event){
        console.log(this.state.username);
    }
    
    render() {
      return (
        <div className="App">
            {!this.state.userSubmitted && !this.state.loading && !this.state.repoUserSubmitted && 
                    <img src={ require('./github.png')} className ="logo" alt="logo" />}
                 <div className= "app-container">
                     {!this.state.userSubmitted && !this.state.loading && !this.state.repoUserSubmitted   
                            && <Form onChangeValue={this.handleChange} onSubmit= {this.handleSubmit}/>} 
                     {!this.state.userSubmitted && this.state.loading && !this.state.repoUserSubmitted && <Loading/>}
                     {this.state.userSubmitted && !this.state.loading && !this.state.repoUserSubmitted && 
                            <Chart onReturn={this.handleReturn} 
                            data = {this.state.data} username = {this.state.username}
                            onChange ={this.handleGraphButton} 
                            />}
                    {this.state.userSubmitted && !this.state.repoUserSubmitted && this.state.loading && <Loading/>}
                    {this.state.repoUserSubmitted && this.state.userSubmitted && !this.state.loading &&
                       <PieChart 
                       repoUserName = {this.state.username} data = {this.state.languageArray} labels = {this.state.infoArray}/>} 
                </div> 
        </div>
      );
    }
}
export default App;
