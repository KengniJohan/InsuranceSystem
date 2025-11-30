import {create} from 'zustand';


export type SinistreType = "INCENDIE"|"VOL"|"CATASTROPHE NATURELLE"|"VANDALISME"|"ACCIDENT";


export type DegatType = {
    id: number,
    intitule:string,
    decription: string
    imageList: Array<ImageDegat>,

}
export type ImageDegat = {
    id: string,
    url: string,
    file: File
}


export type Sinistre = {
    description: string,
    date_sinistre: number|undefined,
    id_vehicule: string,
    id_policier: string,
    degatsImage: Array<DegatType>,
    
}
type useStorageAppType = {
    sinistre: SinistreType,
    changeSinistre: (value: SinistreType)=>void,
    modalDegatIsOpen: boolean,
    openModalDegat: ()=>void,
    closeModalDegat: ()=>void,
    degatAddList: Array<DegatType>,
    addDegat: (value: DegatType)=>void,
    setAllDegat: (value: Array<DegatType>)=>void,
    menuOpen: boolean,
    onMenuClick: ()=>void,
    activeView: 'devis'|'accord',
    onViewChange: (value: 'devis'|'accord')=>void,
    modalVehiculeIsOpen: boolean,
    openModalVehicule: ()=>void,
    closeModalVehicule: ()=>void,
    modalDegatEditIsOpen: boolean,
    openModalDegatEdit: ()=>void,
    closeModalDegatEdit: ()=>void,
    degatSelectEdit: DegatType,
    setDegatSelectEdit: (value: DegatType)=>void
}

export const useStorageApp = create<useStorageAppType>((set, get)=>({
    sinistre: 'VOL',
    changeSinistre: (value: SinistreType)=>{
        set({sinistre: value});
    },
    modalDegatIsOpen: false,
    openModalDegat: ()=>{
        set({modalDegatIsOpen: true});
    },
    closeModalDegat: ()=>{
        set({modalDegatIsOpen: false});
    },
    modalDegatEditIsOpen: false,
    openModalDegatEdit: ()=>{
        set({modalDegatEditIsOpen: true});
    },
    closeModalDegatEdit: ()=>{
        set({modalDegatEditIsOpen: false});
    },
    degatAddList: [],
    addDegat: (value: DegatType)=>{
        const degatTemp = [...get().degatAddList];
        set({degatAddList: [...degatTemp, value]});
    },
    menuOpen: false,
    onMenuClick: ()=>{
        set({menuOpen: !get().menuOpen});
    },
    activeView: 'devis',
    onViewChange: (value: 'devis'|'accord')=>{
        set({activeView: value});
    },
    modalVehiculeIsOpen: false,
    openModalVehicule: ()=>{
        set({modalVehiculeIsOpen: true});
    },
    closeModalVehicule: ()=>{
        set({modalVehiculeIsOpen: false});
    },
    setAllDegat: (value: DegatType[])=>{
        set({degatAddList: value});
    },
    degatSelectEdit: {
        id: 0,
        intitule: "fsdf",
        decription: "",
        imageList: []
    },
    setDegatSelectEdit: (value: DegatType)=>{
        set({degatSelectEdit: value});
        
    }
}));