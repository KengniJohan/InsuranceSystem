import React from 'react';
import successItem from '../assets/checkItem.png';
import { Link } from 'react-router-dom';
import succesLogo from '../assets/positive.json';
import Lottie from "lottie-react";
import { useIsMutating, useQuery, useQueryClient } from '@tanstack/react-query';
import ErrorAdd from '../components/error_add';
import LoaderAdd from '../components/loader_add';
import ButtonSinistreAdd from '../components/button_sinistre_add';



const AjoutSinistreResultat: React.FunctionComponent = () => {


  const queryClient = useQueryClient();
  const mutating = useIsMutating({
    mutationKey: ['upload']
  });

  const { data } = useQuery({
    queryKey: ['newKey'],
    queryFn: ()=> queryClient.getQueryData<String>(['newKey'])
  })

//  const location = useLocation();
//   const data = location.state;
//   if(!data){
//     return <h1>stop</h1>
//   }



  if(!(mutating > 0) && data == null){
    return (
         <ErrorAdd/>
    )
  }

  if((mutating > 0)){
    return (
         <LoaderAdd/>
    )
  }


  return (
    <div className='bg-red-200 w-full h-full pb-30' style={{backgroundColor: '#F5F5F5'}}>
          
         

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Déclarer un sinistre</h1>
                <p className="text-gray-600">Nous sommes là pour vous accompagnez</p>
            </div>
            <div className='bg-white p-8 pt-12'>
                <>
                    <div className='flex justify-center'>
                        <Lottie animationData={succesLogo}/>
                        {/* <img src={success} className='w-40 h-40'/> */}
                    </div>
                    <h1 className='font-bold text-center text-2xl'>Déclaration enregistrer !</h1>
                    <h1 className='text-center text-lg text-gray-400 mt-3'>Votre sinistre à été enregistrer avec le numero de dossier !</h1>
                    <h1 className='font-bold text-center text-2xl mt-3' style={{color: "2#563EA"}}>{data}</h1>
                
                
                    <div style={{backgroundColor: "#F5F5F5"}} className='p-10 rounded-lg mt-4'>
                        <h1 className='font-bold text-left text-lg'>Prochaine étapes: </h1>
                        <div className='flex items-center gap-2 mt-3'>
                            <img src={successItem} className='w-6 h-6'/>
                            <h1>Attendre un devis de la part du garage</h1>
                        </div>
                        <div className='flex items-center gap-2 mt-3'>
                            <img src={successItem} className='w-6 h-6'/>
                            <h1>Traiter le devis afin de choisir les reparation à prendre en charge</h1>
                        </div>
                        <div className='flex items-center gap-2 mt-3'>
                            <img src={successItem} className='w-6 h-6'/>
                            <h1>Envoyer le refus de prise en charge du devis dans le cas contraire</h1>
                        </div>
                    </div>
                    <Link to={'/'}>
                        <ButtonSinistreAdd title='Retour à mon espace' onPress={()=>{}}/>
                    </Link>
                </>  
            </div>
            
            



          </main>
          
          
        </div>
  )
}

export default AjoutSinistreResultat;


