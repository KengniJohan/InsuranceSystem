import Layout from "../Layout"
import AccordsDevis from "../feature/gestion-devis/page/AccordsDevis"
import { createBrowserRouter } from "react-router-dom";
import AjouterSinistre from "../feature/gestion-sinistre/ajouter-sinistre/pages/AjouterSinistre";
import AjoutSinistreResultat from "../feature/gestion-sinistre/ajouter-sinistre/pages/AjoutSinistreResultat";
import ListingSinistres from "../feature/gestion-sinistre/listing-sinistre/ListingSinistres";
import SinistreDetailPage from "../feature/gestion-sinistre/detail-sinistre/SinistreDetailPage";
import SinistreEditPage from "../feature/gestion-sinistre/detail-sinistre/SinistreEditPage";
import HomePage from "../feature/home/HomePage";

export const routes = [
    {
        path: '/',
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <HomePage/>
            },
            {
                path: 'sinistre/ajouter-sinistre',
                element: <AjouterSinistre/>
            },
            {
                path: "sinistre/ajout-sinistre-resultat",
                element: <AjoutSinistreResultat/>
            },
            {
                path: "sinistre",
                element: <ListingSinistres/>
            },
            {
                path: "sinistres",
                element: <ListingSinistres/>
            },
            {
                path: "sinistre/:id",
                element: <SinistreDetailPage/>
            },
            {
                path: "sinistre/:id/modifier",
                element: <SinistreEditPage/>
            },
            {
                path: "devis",
                element: <AccordsDevis activeView={'devis'}/>
            },
            {
                path: "accord",
                element: <AccordsDevis activeView={'accord'}/>
            },
            
        ]
    },
    
];

export const router = createBrowserRouter(routes);
