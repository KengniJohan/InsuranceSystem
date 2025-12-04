import React from 'react';
import exclamationY from '../assets/exclamation-yellow.png';


const CardUrgence = () => {


  return (
    <div className='flex gap-5 p-3 my-5' style={{backgroundColor: '#FEFBE8'}}>
        <div>
            <img src={exclamationY} className='w-9 h-9' />
        </div>
        <div className='h-full flex flex-col gap-4'>
            <h1 className='font-bold'  style={{color: '#9B804D'}}>En cas d'urgence</h1>
            <h1 className='text-xxl' style={{color: '#ECCB5F'}}>Si votre véhicule n'est pas en état ou si vous êtes bléssé, appélé immediatement notre assistance au <span className='font-bold'  style={{color: '#9B804D'}}>56 232 0256</span></h1>
        </div>
    </div>
  )
}

export default CardUrgence;