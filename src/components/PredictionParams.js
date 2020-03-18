import React from 'react'
import math from '../util/math'
import Slider from '@material-ui/core/Slider'

class PredictionParams extends React.Component {

  render() {
    const {p, socialContactReduction, onChangeSocialContactReduction} = this.props

    return (
      <div>
        Exponential base in per day increase of cases:
        <br/>
        <b>{math.round(1 + p, 4)}</b>
        <br/>
        <br/>
        Cases double every <b>{math.round(1/p, 2)}</b> days.
        <br/>
        <Slider
          value={100 * this.props}
          onChange={onChangeSocialContactReduction}
        />
      </div>
    )
  }

}


export default PredictionParams