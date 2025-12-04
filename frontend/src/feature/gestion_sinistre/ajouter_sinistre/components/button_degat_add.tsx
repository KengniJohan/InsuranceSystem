import React from 'react';
import { motion } from 'framer-motion';


const ButtonDegatAdd: React.FunctionComponent<{title: string, iconURL?:string, type?: "normal"|"outiline", onPress?: ()=>void}> = ({title, iconURL, type = "normal", onPress}) => {



  return (
    <div className='flex justify-start mr-2.5'>
        <motion.div whileTap={{scale: .9}} onClick={onPress} className={`flex justify-center py-3 rounded-lg my-8 cursor-pointer items-center gap-2 px-4`}
        style={{backgroundColor: type == "normal"? '#2563EA': "#FFF", borderWidth: type == "normal"?0:3, borderColor: type == "normal"? "none":"#CCC"}}>
            {iconURL && <img src={iconURL} className='w-6 h-6' />}
            <h1 className={`${type == "normal"? 'text-white': 'text-gray-400'} text-lg select-none font-normal inline-block ${iconURL ? 'mr-2': ''}`}>{title}</h1>
        </motion.div >
    </div>
  )
}

export default ButtonDegatAdd