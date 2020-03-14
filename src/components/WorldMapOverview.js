import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highmaps'

const map = require('../highmaps/world')


const getOptions = (data, onSelectCountry) => ({
  title: {
    text: null
  },
  mapNavigation: {
    enabled: false
  },
  colorAxis: {
    min: 10,
    type: 'logarithmic',
    stops: [
      [0, '#FFEFEF'],
      [0.5, Highcharts.getOptions().colors[5]],
      [1, Highcharts.Color(Highcharts.getOptions().colors[5]).brighten(-0.5).get()]
    ]
  },
  legend: {
    layout: 'vertical',
    align: 'left',
    verticalAlign: 'bottom'
  },
  plotOptions: {
    map: {
      allAreas: true,
      joinBy: 'iso-a2',
      mapData: map
    }
  },
  series: [{
    joinBy: ['name'],
    data: data,
    name: 'Cases',
    point:{
      events:{
        click: function(){
          onSelectCountry(this.name);
        }
      }
    }
  }]
})

const loadCountryCasesData = timeSeriesData => {
  const countryToCases = {}

  if (timeSeriesData != null) {
    for (let i = 1; i < timeSeriesData.length; i++) {
      const country = timeSeriesData[i][1]
      if (!(country in countryToCases)) {
        countryToCases[country] = 0
      }
      countryToCases[country] += parseInt(timeSeriesData[i][timeSeriesData[i].length - 1])
    }
  }

  return Object.entries(countryToCases).map(([country, cases]) => ({
    name: mapCountryName(country),
    value: cases
  }))
}

const mapCountryName = country => {
  const countryMap = {
    'North Macedonia': 'Macedonia',
    'US': 'United States of America',
    'Korea, South': 'South Korea',
    'Czechia': 'Czech Republic',
    'Congo (Kinshasa)': 'Democratic Republic of the Congo',
    'Cote d\'Ivoire': 'Ivory Coast'
  }
  if (country in countryMap) {
    return countryMap[country]
  }
  return country
}

class WorldMapOverview extends React.Component {

  render() {
    return (
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={'mapChart'}
          options={getOptions(loadCountryCasesData(this.props.timeSeriesData), this.props.onSelectCountry)}
        />
      </div>
    )
  }
}

export default WorldMapOverview