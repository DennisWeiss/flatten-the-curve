import axios from 'axios'
import Papa from 'papaparse'

const dataSourceUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv'

const loadCovid19TimeSeriesData = () => new Promise((resolve, reject) => {
  axios
    .get(dataSourceUrl)
    .then(res => resolve(Papa.parse(res.data).data))
})

export {loadCovid19TimeSeriesData}
