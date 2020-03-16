const computePredictionFunction = (timeSeriesData, populationSize) => {
  const unknownRatio = 4
  const learningRate = Math.pow(10, 4)

  const {start, series} = extractSeries(timeSeriesData, populationSize)
  const p = fit(learningRate)(series, unknownRatio, populationSize)
  return {
    start,
    predict: predict(populationSize)(p),
  }
}

const extractSeries = (timeSeriesData, populationSize) => {
  console.log(timeSeriesData)
  let series = []
  let start = null
  for (const dataPoint of timeSeriesData) {
    if (start == null && dataPoint[1] > 0) {
      start = dataPoint[0]
    }
    if (start != null) {
      series.push(dataPoint[1] / populationSize)
    }
  }
  console.log(series)
  return {start, series}
}

const predict = populationSize => p => n => {
  if (n === 0) {
    return 1 / populationSize
  }
  let prevDay = predict(populationSize)(p)(n - 1)
  return prevDay + prevDay * (1 - prevDay) * p
}

const fit = learningRate => (series, unknownRatio, populationSize) => {
  let p = 0.2
  for (let i = 0; i < 200; i++) {
    console.log('p', p)
    p -= learningRate * lossDerivativeP(series, unknownRatio, populationSize, p)
  }
  return p
}

const loss = (series, unknownRatio, populationSize, p) => {
  let sum = 0
  for (let i = 0; i < series.length; i++) {
    let diff = predict(populationSize)(p)(i) - unknownRatio * series[i]
    sum += diff * diff
  }
  return sum / series.length
}

const lossDerivativeP = (series, unknownRatio, populationSize, p) => {
  let sum = 0
  let prevDayPredict = 0
  let prevDayPredictDerivative = 0
  for (let i = 0; i < series.length; i++) {
    if (i > 1) {
      prevDayPredict = predict(populationSize)(p)(i - 1)
    }
    // console.log(i, predict(p)(i))
    let diff = predict(populationSize)(p)(i) - unknownRatio * series[i]
    // console.log('diff', diff)
    let predictDerivative = predictDerivativeP(prevDayPredict, prevDayPredictDerivative)(populationSize)(p)(i)
    // console.log('predictDerivative', predictDerivative)
    sum += diff * predictDerivative
    prevDayPredictDerivative = predictDerivative
  }

  console.log('deriv', 2 * sum / series.length)

  return 2 * sum / series.length
}

const predictDerivativeP = (prevDayPredict, prevDayPredictDerivative) => populationSize => p => n =>
  n === 0 ? 0 :
    prevDayPredict * (1 - prevDayPredict) + (-2 * p * prevDayPredict + 1 + p) * prevDayPredictDerivative

export {computePredictionFunction}