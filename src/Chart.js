
import React from 'react'
import * as d3 from 'd3'
import './Loading.js'
import './ContributorChart.css'

class Chart extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            username: '',
            contributorData: {},
            hasData: false,
       };
        this.drawChart = this.drawChart.bind(this);
    }

    componentDidMount(){
        this.drawChart();
    }

    drawChart(){
        const data = this.props.data;

        const width = 690,
              height = 500;

        const chart = d3.select('.chart')
            .attr('width',width)
            .attr('height',height);

        const tooltip = d3.select('.container')
            .append('div')
            .attr('class','tooltip')
            .html('Tooltip');
    
        const simulation = d3.forceSimulation()
            .force('link',d3.forceLink())
            .force('charge',d3.forceManyBody())
            .force('collide',d3.forceCollide())
            .force('center', d3.forceCenter(width/2,height/2))
            .force('y',d3.forceY(0))
            .force('x',d3.forceX(0));
    
        const dragStart = d => {
          if (!d3.event.active) simulation.alphaTarget(0.01).restart();
          d.fx = d.x;
          d.fy = d.y;
        };
        
        const drag = d => {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        };
        
        const dragEnd = d => {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        };

        const link = chart.append('g')
            .attr('class','links')
            .selectAll('line')
            .data(data.links).enter()
            .append('line');
    
        const node = chart.append('g')
            .attr('class','nodes')
            .selectAll('line')
            .data(data.nodes).enter()
            .append('circle')
            .attr('r',5)
            .attr('fill', d => {return (d.group === 0 ? 'orangered' : (d.group === 1 ? 'steelblue': 'lime'))})
            .attr('stroke', d => {return (d.group === 0 ? 'azure' : (d.group === 1 ? 'azure': 'azure'))})
            .call(d3.drag()
               .on('start', dragStart)
               .on('drag', drag)
               .on('end', dragEnd)
            ).on('mouseover',d => {
              tooltip.html(d.name)
                .style('left', d3.event.pageX + 5 +'px')
                .style('top', d3.event.pageY + 5 + 'px')
                .style('opacity', .9);
            }).on('mouseout', () => {
              tooltip.style('opacity', 0)
                .style('left', '0px')
                .style('top', '0px');
            }).on('dblclick', d => {
               console.log(d.name); return d.name;
            });
    
        const ticked = () => {
            link
              .attr("x1", d => { return d.source.x; })
              .attr("y1", d => { return d.source.y; })
              .attr("x2", d => { return d.target.x; })
              .attr("y2", d => { return d.target.y; });
    
          node
              .attr("cx", d => d.x)
              .attr("cy", d => d.y);
          };

          //Starting simulation
          simulation.nodes(data.nodes)
            .on('tick', ticked);
    
          simulation.force('link',d3.forceLink(data.links))
    
      }
    
    
    render(){  
        return (
          <div className='container'>
            <h1>{this.props.username.toUpper}</h1>
            <div className='chartContainer'>
              <svg className='chart' onDblClick={this.props.onDblClick}>
              </svg>
            </div>
            <div>
            <button className='btn btn-primary' type='submit' onClick={this.props.onReturn}>Return</button>
            </div>
            <div>
            <button className='btn btn-primary' type='submit' onClick={this.props.onChange}>Look at Languages</button>
            </div>
          </div>
        ); 
    }
}

export default Chart
