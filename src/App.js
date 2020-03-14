import React from 'react'
import './App.css'
import WorldMapOverview from './components/WorldMapOverview'
import {loadCovid19TimeSeriesData} from './requests/loadCovid19TimeSeriesData'
import CasesSeriesView from './components/CasesSeriesView'

class App extends React.Component {

  state = {
    covid19TimeSeriesData: null,
    selectedCountry: null,
  }

  componentDidMount() {
    loadCovid19TimeSeriesData().then(covid19TimeSeriesData => this.setState({covid19TimeSeriesData}))
  }

  onSelectCountry(selectedCountry) {
    this.setState({selectedCountry})
  }

  render() {
    return (
      <div className="App">
        <WorldMapOverview
          timeSeriesData={this.state.covid19TimeSeriesData}
          onSelectCountry={this.onSelectCountry.bind(this)}
        />
        <CasesSeriesView
          country={this.state.selectedCountry}
        />
      </div>
    )
  }
}

export default App
