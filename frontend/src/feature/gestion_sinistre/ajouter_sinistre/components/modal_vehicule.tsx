import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStorageApp } from '../../../../core/resource/store/storageApp';
import type { VehiculeJoinPropriete } from '../service/sinistre_api';
import ButtonDegatAdd from './button_degat_add';
import ModalDegatEdit from './modal_degat_edit';


type ModalVehiculeProps = {
    data: VehiculeJoinPropriete[],
    setValue: (value: string)=>void
}
const ModalVehicule: React.FunctionComponent<ModalVehiculeProps> = ({data, setValue}) => {

  const { modalVehiculeIsOpen, closeModalVehicule } = useStorageApp();
  const [itemFocus, setItemFocus] = useState<string>("");
  const [itemSelect, setItemSelect] = useState<string>(""); 
//h-140
  return (
    <>
        <AnimatePresence
        >
        {modalVehiculeIsOpen && data &&
            <div className='w-full h-screen fixed z-5'>
                <div className='w-full h-full flex justify-center items-center z-50'>
                    <div className='w-full h-full bg-gray-950 opacity-20 absolute z-1' onClick={closeModalVehicule}/>
                    <div className='relative'>
                        <motion.div 
                        initial={{scale: 1.1, opacity: .8}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 1.1, opacity: .8}}
                        className='w-150 min-h-100 max-h-140 bg-white mt-10 pl-4.5 pr-4.5 z-5 rounded-lg overflow-y-scroll relative' style={{scrollbarWidth: 'none'}}>
                            <div className="mb-6 mt-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Vehicule assuré</h1>
                                <p className="text-gray-600">Selectionner le vehicule qui a subi le sinistre</p>
                            </div>
                            <div>
                                <table>
                                    <tr className='text-gray-500 border-b border-gray-400'>
                                        <td className='px-5 py-2'>Immatriculation</td>
                                        <td className='px-5 py-2'>Marque</td>
                                        <td className='px-5 py-2'>Modele</td>
                                        <td className='px-5 py-2'>Propriétaire</td>
                                    </tr>
                                
                                {data.map((item, index)=>{
                                    const valid = (index + 1) == data.length;
                                    //console.log(index + "-----------------" + data.length)
                                    return (
                                        <tr className={`${ !valid?'border-b border-gray-400':''} cursor-pointer ${(itemFocus == item.immatriculation) ? 'bg-blue-bird':''} ${(itemSelect == item.immatriculation)? 'bg-blue-bird':''}`} onMouseEnter={()=> setItemFocus(item.immatriculation)} onMouseLeave={()=>setItemFocus("")} onClick={()=> setItemSelect(item.immatriculation)}>
                                            <td className={`px-5 py-2 capitalize ${(itemFocus == item.immatriculation)? 'text-white':''} ${(itemSelect == item.immatriculation)? 'text-white':''}`}>{item.immatriculation}</td>
                                            <td className={`px-5 py-2 capitalize ${(itemFocus == item.immatriculation)? 'text-white':''} ${(itemSelect == item.immatriculation)? 'text-white':''}`}>{item.marque}</td>
                                            <td className={`px-5 py-2 capitalize ${(itemFocus == item.immatriculation)? 'text-white':''} ${(itemSelect == item.immatriculation)? 'text-white':''}`}>{item.modele}</td>
                                            <td className={`px-5 py-2 capitalize ${(itemFocus == item.immatriculation)? 'text-white':''} ${(itemSelect == item.immatriculation)? 'text-white':''}`}>{item.nomProprietaire + " " + item.prenomProprietaire}</td>
                                        </tr>
                                    )
                                })

                                }
                                </table>
                            </div>
                            {/* <div className='absolute bottom-0 border-t border-gray-400 w-full left-[-0.4%] h-20'>
                                <div className='flex justify-end mt-[-20px]'>
                                    <ButtonDegatAdd onPress={closeModalDegat} title='Annuler' type="outiline"/>
                                    <ButtonDegatAdd title='Enregistrer' onPress={()=>{}}/>
                                </div>
                            </div> */}
                            
                        </motion.div>
                        <div className='absolute border-t border-gray-400 w-full -bottom-5 z-10'>
                            <motion.div className='flex justify-end -mt-5 pr-4.5'
                                initial={{scale: 1.1, opacity: .8}}
                                animate={{scale: 1, opacity: 1}}
                                exit={{scale: 1.1, opacity: .8}}
                            
                            >
                                <ButtonDegatAdd onPress={closeModalVehicule} title='Annuler' type="outiline"/>
                                <>
                                {(itemSelect)?
                                    <ButtonDegatAdd title='Valider' 
                                        onPress={()=>{
                                            setValue(itemSelect);
                                            closeModalVehicule();
                                        }}
                                    />
                                        :
                                    <div className='flex justify-start mr-2.5'>
                                        <div className={`flex justify-center py-3 rounded-lg my-8 cursor-pointer items-center gap-2 px-4 bg-gray-600 opacity-50`}>
                                            <h1 className={`${'text-white'} text-lg select-none font-normal inline-block`}>Valider</h1>
                                        </div >
                                    </div>
                                }
                                </>
                            </motion.div>
                        </div>
                        
                    </div>
                </div>      
            </div>
            }
            </AnimatePresence>
        </>
  )
}

export default ModalVehicule