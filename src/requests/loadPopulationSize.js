import axios from 'axios'

const apiUrl = 'https://restcountries.eu/rest/v2/name/'

const loadPopulationSize = country => new Promise((resolve, reject) => {
  axios
    .get(apiUrl + country)
    .then(res => {
      if (res.data && res.data.length > 0) {
        resolve(res.data[0].population)
      } else {
        reject(new Error('Could not find country'))
      }
    })
    .catch(reject)
})

export {loadPopulationSize}
