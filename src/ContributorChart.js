import React from 'react'
import * as d3 from 'd3'
import './ContributorChart.css'

class ContributorChart extends React.Component{
    constructor(props){
        super(props);

        this.state ={
            contributorData: {},
            hasData: false,
            data: {
            nodes:[{name: '0'},{name: '1'},{name: '2'},{name: '3'},{name: '4'},{name: '5'},{name: '6'},{name: '7'}],
            links:[{target: 1, source: 0},
                    {target: 3, source: 0},
                    {target: 5, source: 0},
                    {target: 7, source: 0},
                    {target: 2, source: 1},
                    {target: 4, source: 3},
                    {target: 6, source: 7}]
            }
        };
        this.drawChart = this.drawChart.bind(this);
    }

    componentDidMount(){
        this.drawChart();
    }

    drawChart(){
        const data= this.state.data;

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
            .force('center',d3.forceCenter(width/2,height/2))
            .force('y',d3.forceY(0))
            .force('x',d3.forceX(0));

        const dragStart = d => {
            if(!d3.event.active)
                simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        };

        const drag = d => {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        };

        const dragEnd = d => {
            if(!d3.event.active)
                simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        const link = chart.append('g')
            .attr('class','links')
            .selectAll('lines')
            .data(data.links).enter()
            .append('line')

        const node = d3.select('.chartContainer')
            .selectAll('div')
            .data(data.nodes).enter()
            .append('div')
            .attr('class', d => {return 'circle circle-' + d.name;})
            .call(d3.drag()
                .on('start',dragStart)
                .on('drag',drag)
                .on('end',dragEnd)
            ).on('mouseover',d => {
                tooltip.html(d.name)
                    .style('left',d3.event.pageX + 5 + 'px')
                    .style('top',d3.event.pageY + 5 + 'px')
                    .style('opacity',.9);
            }).on('mouseout',() => {
                tooltip.style('opacity',0)
                    .style('left',0)
                    .style('top',0);
            });

        const ticked = () => {
            link
                .attr("x1", d => { return d.source.x; })
                .attr("y1", d => { return d.source.y; })
                .attr("x2", d => { return d.target.x; })
                .attr("y2", d => { return d.target.y; });
            node
                .attr('style', d => {
                    return 'left: ' + d.x +'px; top: ' + (d.y + 72) + 'px';
                });
        };

        simulation.nodes(data.nodes)
            .on('tick',ticked);

        simulation.force('link',d3.forceLink(data.links))

    } 

    render() {
        return (
          <div className='container'>
            <h1>National Contiguity</h1>
            <div className='chartContainer'>
              <svg className='chart'>
              </svg>
            </div>
          </div>
        ); 
    }   
}

export default ContributorChart
