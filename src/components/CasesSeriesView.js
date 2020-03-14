import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'


const getOptions = () => ({
  chart: {
    zoomType: 'x'
  },
  title: {
    text: 'Number of cumulated COVID-19 cases'
  },
  subtitle: {
    text: document.ontouchstart === undefined ?
      'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
  },
  xAxis: {
    type: 'datetime'
  },
  yAxis: {
    title: {
      text: 'Cases'
    }
  },
  legend: {
    enabled: false
  },
  plotOptions: {
    series: {
      fillColor: {

      },
      marker: {
        radius: 2
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1
        }
      },
      threshold: null
    }

  },

  series: [{
    type: 'area',
    name: 'USD to EUR',
    data: []
  }]
})

class CasesSeriesView extends React.Component {
  render() {
    return (
      <div>
        <h2>{this.props.country}</h2>
        {
          this.props.country && <HighchartsReact
            highcharts={Highcharts}
            options={getOptions()}
          />
        }
      </div>
    )
  }
}

export default CasesSeriesView