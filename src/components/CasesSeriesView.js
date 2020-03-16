import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import moment from 'moment'
import {mapCountryName} from '../util/mapCountryName'
import {computePredictionFunction} from '../prediction/prediction'
import {loadPopulationSize} from '../requests/loadPopulationSize'

const getOptions = (data, predictionData) => ({
  chart: {
    zoomType: 'x',
  },
  title: {
    text: 'Number of cumulated COVID-19 cases',
  },
  subtitle: {
    text: document.ontouchstart === undefined ?
      'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in',
  },
  xAxis: {
    type: 'datetime',
  },
  yAxis: {
    title: {
      text: 'Cases',
    },
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    series: {
      fillColor: {},
      color: Highcharts.getOptions().colors[5],
      marker: {
        radius: 2,
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1,
        },
      },
      threshold: null,
    },
  },
  tooltip: {
    xDateFormat: '%Y-%m-%d',
  },
  series: [{
    type: 'area',
    name: 'Official cases',
    data: data,
  }, {
    type: 'area',
    name: 'Predicted actual cases',
    data: predictionData,
  }]
})

const extractTimeSeriesData = (timeSeriesData, country) => {
  let series = []
  for (let i = 4; i < timeSeriesData[0].length; i++) {
    let timestamp = moment(timeSeriesData[0][i]).add(moment().utcOffset(), 'minutes').valueOf()
    let cases = 0
    for (let j = 1; j < timeSeriesData.length; j++) {
      if (mapCountryName(timeSeriesData[j][1]) === country) {
        cases += parseInt(timeSeriesData[j][i])
      }
    }
    series.push([timestamp, cases])
  }
  return series
}

const extractPredictedTimeSeriesData = ({start, predict}, days, populationSize) => {
  let series = []
  for (let i = 0; i < days; i++) {
    series.push([start + 24 * 60 * 60 * 1000 * (i - 9), Math.round(populationSize * predict(i))])
  }
  return series
}

const getActiveCasesOptions = duration => predictionData => ({
  chart: {
    zoomType: 'x',
  },
  title: {
    text: 'Number of active COVID-19 cases',
  },
  subtitle: {
    text: document.ontouchstart === undefined ?
      'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in',
  },
  xAxis: {
    type: 'datetime',
  },
  yAxis: {
    title: {
      text: 'Cases',
    },
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    series: {
      fillColor: {},
      color: Highcharts.getOptions().colors[5],
      marker: {
        radius: 2,
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1,
        },
      },
      threshold: null,
    },
  },
  tooltip: {
    xDateFormat: '%Y-%m-%d',
  },
  series: [{
    type: 'area',
    name: 'Predicted active cases',
    data: extractActiveCases(duration)(predictionData),
  }]
})

const extractActiveCases = duration => data => {
  let activeCasesData = []
  for (let i = 0; i < data.length; i++) {
    let sum = 0
    if (i >= duration) {
      sum -= data[i-duration][1]
    }
    sum += data[i][1]
    activeCasesData.push([data[i][0], sum])
  }
  return activeCasesData
}

class CasesSeriesView extends React.Component {

  state = {}

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.country !== this.props.country) {
      loadPopulationSize(this.props.country)
        .then(populationSize => {
          this.setState({
            predict: computePredictionFunction(
              extractTimeSeriesData(this.props.timeSeriesData, this.props.country), populationSize,
            ),
            populationSize,
          })
        })
    }
  }

  render() {
    if (this.state.predict == null) {
      return <div/>
    }
    let predictionData = extractPredictedTimeSeriesData(this.state.predict, 120, this.state.populationSize)
    return (
      <div>
        <h2>{this.props.country}</h2>
        {
          this.props.country &&
          <>
            <HighchartsReact
              highcharts={Highcharts}
              options={getOptions(
                extractTimeSeriesData(this.props.timeSeriesData, this.props.country),
                predictionData,
              )}
            />
            <HighchartsReact
              highcharts={Highcharts}
              options={getActiveCasesOptions(21)(predictionData)}
            />
          </>
        }
      </div>
    )
  }
}

export default CasesSeriesView