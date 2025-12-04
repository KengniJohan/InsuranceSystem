import React from 'react';
import { motion } from 'framer-motion';


const ButtonSinistreAdd = ({title, type = "normal", onPress}: {title: string, type?: "outline"|"normal", onPress: ()=>void}) => {



  return (
    <motion.div 
    onClick={onPress}
    whileTap={{scale: .9}} className='flex justify-center py-1.5 rounded-lg my-8 cursor-pointer w-full'
      style={{backgroundColor: type == "normal"? '#2563EA': "#FFF", borderWidth: type == "normal"?0:3, borderColor: type == "normal"? "none":"#CCC"}}
    >
        <h1 className={`text-lg select-none ${type == "normal"? 'text-white': 'text-gray-600'}`}>{title}</h1>
    </motion.div >
  )
}

export default ButtonSinistreAdd