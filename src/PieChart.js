import React from 'react';
import Plot from 'react-plotly.js';

function PieChart(props) {
    return(
        <div className='container'>
            <h2>Most popular language per repo for your github user</h2>
                <Plot data = {[
                    {
                        data: props.data,
                        labels: props.labels,
                        type: 'pie',
                        textFont: {
                            color: 'rgb(190,170,200)'
                        }
                    }
                ]}
                layout = {{
                    width:600,
                    height:350,
                    paper_bgcolor: 'rgba(5,1,10,50)',
                    plot_bgcolor: 'rgba(0,0,0,0)'
                }}
            />
        </div>
    );
}
export default PieChart;
                
