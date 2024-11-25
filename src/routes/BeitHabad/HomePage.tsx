import React from 'react'
import CandleLightingTimes from './CandleLightingTimes'
import LatestParasha from './LatestParasha'
import LatestVideo from './LatestVideo'
import CarouselChabd from './CarouselChabad'

const HomePage = () => {
  return (
    <div>
      <CarouselChabd />
      <CandleLightingTimes />
      <LatestParasha />
      <LatestVideo />


    </div>
  )
}

export default HomePage