import React from 'react'
import CandleLightingTimes from './CandleLightingTimes'
import LatestParasha from './LatestParasha'
import LatestVideo from './LatestVideo'
import CarouselChabd from './CarouselChabad'
import ChabadAboutSection from './AboutChabad'

const HomePage = () => {
  return (
    <div>
      <CarouselChabd />
      <ChabadAboutSection />
      <LatestParasha />
      <CandleLightingTimes />
      <LatestVideo />


    </div>
  )
}

export default HomePage