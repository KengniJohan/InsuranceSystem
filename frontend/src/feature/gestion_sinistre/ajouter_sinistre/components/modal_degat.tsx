import React, { useState } from 'react'
import InputFormSinistre from './input_form_sinistre';
import upload from '../assets/upload.png';
import drop from "..//assets/delete.png";
import ButtonDegatAdd from './button_degat_add';
import { useStorageApp, type DegatType, type ImageDegat } from '../../../../core/resource/store/storageApp';
import { AnimatePresence, motion } from 'framer-motion';



function randomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  return Array.from(array, (n) => chars[n % chars.length]).join("");
}


const ModalDegat = () => {

  const [intitule, setIntitule] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<ImageDegat[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const {modalDegatIsOpen, closeModalDegat, addDegat, degatAddList} = useStorageApp();
  const [messageError, setMessageError] = useState<String>("");


  const degatAddPress = ()=>{
    const degatTemp: DegatType = {
        id: degatAddList.length,
        intitule: intitule,
        decription: description,
        imageList: images
    }
    addDegat(degatTemp);
    setImages([]);
    setIntitule('');
    setDescription('');
    closeModalDegat();
  }

  const close = ()=>{
    setImages([]);
    setIntitule('');
    setDescription('');
    closeModalDegat();
  }
  const addImages = (fileSelect: FileList) => {
    const files = fileSelect;
    if (!files) return;

    const newImages: ImageDegat[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newImages.push({
        id: randomString(16),
        url: url,
        file
      });
    }
    setImages((prev) => [...prev, ...newImages]);
  };
  const handleSelectImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      addImages(event.target.files);
    }
  };
  
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };


    const handleDragLeave = () => {
        setIsDragging(false);
    };


    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        addImages(event.dataTransfer.files);
        }
    };
  
   
  return (
    <>
    <AnimatePresence
    >
    {modalDegatIsOpen &&
        <div className='w-full h-screen fixed z-5'>
            <div className='w-full h-full flex justify-center items-center z-50'>
                <div className='w-full h-full bg-gray-950 opacity-20 absolute z-1' onClick={close}/>

                <motion.div 
                initial={{scale: 1.1, opacity: .8}}
                animate={{scale: 1, opacity: 1}}
                exit={{scale: 1.1, opacity: .8}}
                className='w-150 h-140 bg-white mt-10 pl-4.5 pr-4.5 z-5 rounded-lg overflow-y-scroll relative' style={{scrollbarWidth: 'none'}}>
                    <div className="mb-6 mt-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajouter un dégat</h1>
                        <p className="text-gray-600">Remplissez les détails du dégat</p>
                    </div>
                    <InputFormSinistre

                        value={intitule}
                        onchange={setIntitule}
                        placeholder="Ex: rayure sur la portière avant"
                        type="string"
                        title='Intitulé'
                    
                    />

                    <InputFormSinistre
                        value={description}
                        onchange={setDescription}
                        placeholder="Détaillé l'emplacement, la nature et l'étendu des dégats"
                        type="text"
                        title='Desciption détaillé'
                    
                    />

                    <div className='mt-5'>
                        <h1 className='txt-lg font-bold text-lg'>{"Images du dégats"}</h1>
                        <label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: "none" }}
                                onChange={handleSelectImages}
                            />
                            <div 
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop} 
                                className='border-2 border-dashed border-gray-300 h-30 rounded-lg flex flex-col items-center justify-center'
                            >
                                <img src={upload} className='w-10 h-10' />
                                <h1 className='text-lg text-gray-500'>Glissez-déposez vos images ici ou cliquez pour selectionner.</h1>
                            </div>
                        </label>
                        <h1 className='text-sm text-gray-500 font-semibold'>Format acceptés: JPG, PNG.</h1>
                    </div>
                    <div style={{ display: "flex", marginTop: "20px", gap: "10px" }}>
                        {images.map((src, index) => (
                        <div className='relative' key={index}>
                            <div className='absolute top-2 right-2 bg-white rounded-2xl cursor-pointer'>
                                <img src={drop} className='w-6 h-6 p-1' onClick={()=>{
                                    const itemsFilter = images.filter((value)=> value.id != src.id);
                                    setImages(itemsFilter);
                                }}/>
                            </div>
                            <img
                                key={index}
                                src={src.url}
                                alt="selected"
                                width={100}
                                height={100}
                                style={{ borderRadius: 8, objectFit: "cover" }}
                            />
                        </div>
                        
                        ))}
                        
                    </div>
                    {messageError && <div className='absolute'>
                    <h1 className='text-red-500'>{messageError}</h1>    
                    </div>}
                    <div className='flex justify-end'>
                        <ButtonDegatAdd onPress={close} title='Annuler' type="outiline"/>
                        {!intitule || !description || images.length == 0 ?
                                    <div className='flex justify-start mr-2.5' onClick={()=> setMessageError('Veillez remplir tous les champs et selectionner au moins une image')}>
                                        <div className={`flex justify-center py-3 rounded-lg my-8 cursor-pointer items-center gap-2 px-4 bg-gray-600 opacity-50`}>
                                            <h1 className={`${'text-white'} text-lg select-none font-normal inline-block`}>Enregistrer</h1>
                                        </div>
                                    </div>:
                            <ButtonDegatAdd title='Enregistrer' onPress={degatAddPress}/>
                        }
                    </div>

                </motion.div>
            </div>      
        </div>
        }
        </AnimatePresence>
    </>
  )
}

export default ModalDegat