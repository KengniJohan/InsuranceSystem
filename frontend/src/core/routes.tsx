import Layout from "../Layout"
import AccordsDevis from "../feature/gestion_devis/page/AccordsDevis"
import { createBrowserRouter } from "react-router-dom";
import AjouterSinistre from "../feature/gestion_sinistre/ajouter_sinistre/pages/ajouter_sinistre";
import AjoutSinistreResultat from "../feature/gestion_sinistre/ajouter_sinistre/pages/ajout_sinistre_resultat";

export const routes = [
    {
        path: '/',
        element: <Layout/>,
        children: [
            {
                path: 'sinistre/ajouter_sinistre',
                element: <AjouterSinistre/>
            },
            {
                path: "sinistre/ajout_sinistre_resultat",
                element: <AjoutSinistreResultat/>
            },
            {
                path: "/",
                element: <AccordsDevis/>
            }
        ]
    },
    
];

export const router = createBrowserRouter(routes);