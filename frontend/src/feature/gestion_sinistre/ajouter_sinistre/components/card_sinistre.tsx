import React from 'react';

import { useStorageApp, type SinistreType } from '../../../../core/resource/store/storageApp';


type cardSinistreType = {
    urlLogo: string,
    title: string,
    subtitle: string,
    value: SinistreType,
    onPress: ()=>void
}

const CardSinistre: React.FunctionComponent<cardSinistreType> = ({urlLogo, title, subtitle, onPress, value}) => {
  const {changeSinistre} = useStorageApp();

  

  return (
    <div className='border-gray-300 rounded-lg border-2 p-3.5 mt-5 cursor-pointer' onClick={()=>{
        changeSinistre(value);
    }}>
        <div className='inline-block rounded-4xl p-2'>
            <img src={urlLogo} alt="" className='w-12 h-12'/>
        </div>
        <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
        </div>
    </div>
  )
}

export default CardSinistre;