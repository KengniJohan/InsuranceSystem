import React, { useEffect, useState } from 'react'

import date from '../assets/calendar.png';
import clock from  '../assets/clock.png';
import edit from  '../assets/edit.png';
import trash from  '../assets/trash.png';
import plus from '../assets/plus.png';
import { useStorageApp, type DegatType, type Sinistre } from '../../../../core/resource/store/storageApp';

import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SinistreAPI, type VehiculeJoinPropriete } from '../service/sinistre_api';
import ModalDegat from '../components/modal_degat';
import ButtonSinistreAdd from '../components/button_sinistre_add';
import InputFormSinistre from '../components/input_form_sinistre';
import ButtonDegatAdd from '../components/button_degat_add';
import ModalVehicule from '../components/modal_vehicule';
import ModalDegatEdit from '../components/modal_degat_edit';



export type KeyNewAdd = {
    numberSinistre: String
}
const AjouterSinistre: React.FunctionComponent = () => {

    
 

    
    const queryClient = useQueryClient();
    const [dataVehiculeJoin, setDataVehiculeJoin] = useState<VehiculeJoinPropriete[]>([]);
    const [idVehicule, setIdVehicule] = useState<string>('');
    // const [idPolicier, setIdPolicier] = useState<string>("");
    const [description, setDescription]= useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date|null>(null);
    const [time, setTime] = useState<Date|null>(null);
    const {openModalDegat, degatAddList, openModalVehicule, setAllDegat, openModalDegatEdit, setDegatSelectEdit} = useStorageApp();
    const navigation = useNavigate();
    const [messageError, setMessageError] = useState<string>('');
    const [degatSelect, setDegatSelect] = useState<DegatType>({
        id: 0,
        intitule: "",
        decription: "",
        imageList: []
    });


    const { data: vehiculeJoinPropriete } = useQuery({
        queryKey: ['vehiculeJoin'],
        queryFn: async()=> await SinistreAPI.getJoinColumn()
    })

    useEffect(()=>{
        if(vehiculeJoinPropriete){
            console.log(vehiculeJoinPropriete);
            setDataVehiculeJoin(vehiculeJoinPropriete);
        }else{
            console.log('nope')
        }
    }, [vehiculeJoinPropriete]);

    

    const { mutate } = useMutation<string, Error, Sinistre>({
        mutationKey: ['upload'],
        mutationFn: async(sinistre: Sinistre)=>{
            return await SinistreAPI.postSinistre(sinistre);
        },
        onSuccess: (numeroSinistre: string)=>{
            queryClient.setQueryData(['newKey'],  numeroSinistre);
            // navigation('/sinistre/add-succes', {
            // state: {
            //     sinistreNumber: numeroSinistre
            //         } 
            //     }
            // )
        },
        onError: ()=>{
            queryClient.setQueryData(['newKey'],  null);

        }
    })


    const filterDegatlist = (idFilter: number)=>{
        const degatTemp = degatAddList.filter((item)=> item.id != idFilter);                        
        setAllDegat(degatTemp);
    }

    const fetchSinistre = async()=>{
        
        const sinistreTemp: Sinistre = {
            description: description,
            date_sinistre: selectedDate?.getTime(),
            id_vehicule: idVehicule,
            // id_policier: idPolicier,
            id_policier: "0",
            degatsImage: degatAddList
        }

        
        mutate(sinistreTemp);
        navigation('/sinistre/ajout_sinistre_resultat');
    }


  return (
   <div className='bg-red-200 w-full h-full' style={{backgroundColor: '#F5F5F5'}}>
          
          <ModalDegat/>
          <ModalDegatEdit degatSelect={degatSelect}/>
          <ModalVehicule data = {dataVehiculeJoin} setValue={setIdVehicule}/>


      
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Déclarer un sinistre</h1>
                <p className="text-gray-600">Nous sommes là pour vous accompagnez</p>
            </div>
            <div className='bg-white p-8 pt-12 relative'>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Détail du sinistre</h1>
                

                <InputFormSinistre
                    placeholder='dd/mm/yyyy'
                    type="date"
                    title='Date du sinistre'
                    iconUrl={date}
                    dateValue={selectedDate}
                    onChangeDate={setSelectedDate}
                />

                <InputFormSinistre
                    placeholder='--:--'
                    type="hours"
                    title='Heure du sinistre'
                    iconUrl={clock}
                    dateValue={time}
                    onChangeDate={setTime}
                />
                <div onClick={openModalVehicule}>
                    <InputFormSinistre

                        value={idVehicule}
                        onchange={setIdVehicule}
                        placeholder="Entrer l'immatriculation du véhicule sinistré"
                        type="idVehicule"
                        title="Immatriculation du véhicule"
                    
                    />
                </div>
              
                <InputFormSinistre
                    value={description}
                    onchange={setDescription}
                    placeholder='Décrivez précisement les circonstance du sinistre...'
                    type="text"
                    title='Description des faits'
                
                />
                <ButtonDegatAdd iconURL={plus} title='Ajouter un dégat' onPress={openModalDegat}/>
                <div className='flex'>
                    {degatAddList.map((item, index)=>{
                        return (
                        <div className='mx-2.5' key={index}>
                            <img src={item.imageList[0].url} className='w-40 h-40 rounded-lg' />
                            <h1 className="text-lg text-gray-900 w-40">{item.intitule}</h1>
                            <h1 style={{overflowWrap: "break-word"}} className="w-40 text-xs text-gray-400 mb-2 whitespace-normal wrap-break-word">{item.decription}</h1>     
                            <div className=''>
                                <div className='flex justify-end gap-2'>
                                    
                                    <span className='hover:bg-gray-200 rounded-2xl p-1 cursor-pointer' onClick={()=>{
                                     
                                        setDegatSelectEdit(item);
                                        openModalDegatEdit();

                                
                                    }}>
                                        <img src={edit} className='w-6 h-6'/>
                                    </span>

                                    <span className='hover:bg-gray-200 rounded-2xl p-1 cursor-pointer' onClick={()=>{filterDegatlist(item.id)}}>
                                        <img src={trash} className='w-6 h-6'/>
                                    </span>

                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
                <div className='flex gap-2.5'>
                    <ButtonSinistreAdd title='Retour' type='outline' onPress={()=>{console.log("fsdfsdfd")}} />    
                    <ButtonSinistreAdd title='Envoyer' onPress={function(){ 

                        fetchSinistre();
                        setAllDegat([]);
                    }}/>
            
                </div>
                {/* <ButtonSinistreAdd/> */}
            </div>
            
            



          </main>
          
          
        </div>
  )
}

export default AjouterSinistre