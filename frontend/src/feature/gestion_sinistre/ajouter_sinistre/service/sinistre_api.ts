import type { Sinistre } from "../../../../core/resource/store/storageApp";

export type VehiculeJoinPropriete = {
    immatriculation: string,
    marque: string,
    modele: string,
    nomProprietaire: string,
    prenomProprietaire: string
}

export class SinistreAPI {

    static async getJoinColumn(): Promise<VehiculeJoinPropriete[]> {
    try {
        const response = await fetch('http://localhost:3001/api/vehicule/join', {
            method: 'GET'
        });
       
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
        }
        const data = await response.json() as VehiculeJoinPropriete[];
        return data;
    } catch (error) {
        throw error;
    }
}


    static async postSinistre(si: Sinistre): Promise<string>{
        
        await SinistreAPI.delay(2000);


        const formData = new FormData();
        const sinistre = {
            description: si.description,
            id_vehicule: si.id_vehicule,
            date_sinistre: si.date_sinistre,
            degats: si.degatsImage.map((degat) => ({
                        intitule: degat.intitule,
                        description: degat.decription,
                        photos_degats: degat.imageList.map((img) => ({
                            fileName: img.file.name, 
                        })
            ),
        }))

        }
        const blob = new Blob([JSON.stringify(sinistre)], {type: "application/json"});
        formData.append('sinistre', blob);


        si.degatsImage.forEach((degat, iDegat) => {
            degat.imageList.forEach((img, iImg) => {
            formData.append(
                "files",                  
                img.file,
                `degat_${iDegat}_img_${iImg}_${img.file.name}` 
            );
            });
        });
        
        const response = await fetch("http://localhost:3001/api/sinistres", {
            method: "POST",
            body: formData, 
        });
        if(!response.ok){
            throw new Error("Une erreur est survenu");
        }
        
        return await response.text();
        
            
    }    

    static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}