// src/utils/dataMappers.js
import { StatutDevis, StatutAccord } from './enums';
import { formatDate } from './Formatters';


// Mapper une réparation du backend vers le frontend
export const mapReparationToFrontend = (reparationBackend) => {
  return {
    id: reparationBackend.idReparation,
    name: reparationBackend.nom,
    category: reparationBackend.categorie,
    price: reparationBackend.prix || 0,
    selected: reparationBackend.selected || false
  };
};


// Mapper un devis du backend vers le frontend
export const mapDevisToFrontend = (devisBackend) => {
   return {
    id: devisBackend.id,
    idSinistre: devisBackend.sinistre || null,
    status: mapStatutDevisToFrontend(devisBackend.statut),
    vehicle: devisBackend.sinistre?.vehicule?.marque || 'Véhicule non spécifié',
    client: `${devisBackend.sinistre?.assure?.personne?.prenom || ''} ${devisBackend.sinistre?.assure?.personne?.nom || ''}`.trim(),
    reference: devisBackend.sinistre?.numero_sinistre || 'N/A',
    date: devisBackend.dateDevis ? new Date(devisBackend.dateDevis).toLocaleDateString('fr-FR') : 'N/A',
    garage: 'Garage Partenaire', 
    amount: devisBackend.montant || 0,
    deductible: devisBackend.franchise || 0,
    vehicleImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop', // Image par défaut
    repairs: devisBackend.reparations ? devisBackend.reparations.map(mapReparationToFrontend) : []
  };
};

// Mapper un accord du backend vers le frontend
export const mapAccordToFrontend = (accordBackend) => {
  return {
    id: accordBackend.id,
    devisId: accordBackend.devis?.id,
    montantValide: accordBackend.montantValide || 0,
    conditions: accordBackend.conditions || '',
    numeroAccord: accordBackend.numeroAccord,
    dateEmission: accordBackend.dateEmission ? new Date(accordBackend.dateEmission).toLocaleDateString('fr-FR') : 'N/A',
    statut: mapStatutAccordToFrontend(accordBackend.statut),
    vehicule: accordBackend.devis?.sinistre?.vehicule?.modele || 'Véhicule non spécifié',
    client: `${accordBackend.devis?.sinistre?.assure?.personne?.prenom || ''} ${accordBackend.devis?.sinistre?.assure?.personne?.nom || ''}`.trim(),
    garage: 'Garage Partenaire', // À adapter
    franchise: accordBackend.franchise || 0,
    priseEnCharge: accordBackend.priseEnCharge || 0,
    referenceSinistre: accordBackend.devis?.sinistre?.numero_sinistre || 'N/A'
  };
};

// Mapper les statuts
export const mapStatutDevisToFrontend = (statutBackend) => {
  switch (statutBackend) {
    case StatutDevis.Enattente: return 'pending';
    case StatutDevis.Valide: return 'approved';
    case StatutDevis.Rejete: return 'rejected';
    default: return 'pending';
  }
};

export const mapStatutAccordToFrontend = (statutBackend) => {
  switch (statutBackend) {
    case StatutAccord.Accepte: return 'Accepter';
    case StatutAccord.Refuse: return 'Refuser';
    default: return 'Refuser';
  }
};

// Mapper vers le backend
export const mapDevisToBackend = (devisFrontend) => {
  return {
    id: devisFrontend.id,
    statut: mapStatutDevisToBackend(devisFrontend.status),
    dateDevis: new Date().toISOString().split('T')[0],
    montant: devisFrontend.amount,
    franchise: devisFrontend.deductible,
    sinistre:  devisFrontend.idSinistre
  };
};

export const mapAccordToBackend = (accordFrontend, devis) => {
  return {
    id: accordFrontend.id,
    numeroAccord: accordFrontend.numeroAccord,
    dateEmission: new Date().toISOString().split('T')[0],
    statut: mapStatutAccordToBackend(accordFrontend.statut),
    montantValide: accordFrontend.montantValide,
    conditions: accordFrontend.conditions,
    franchise: accordFrontend.franchise,
    priseEnCharge: accordFrontend.priseEnCharge,
    devis: devis
  };
};

export const mapStatutDevisToBackend = (statutFrontend) => {
  switch (statutFrontend) {
    case 'pending': return StatutDevis.Enattente;
    case 'approved': return StatutDevis.Valide;
    case 'rejected': return StatutDevis.Rejete;
    default: return StatutDevis.Enattente;
  }
};

export const mapStatutAccordToBackend = (statutFrontend) => {
  switch (statutFrontend) {
    case 'Accepter': return StatutAccord.Accepte;
    case 'Refuser': return StatutAccord.Refuse;
    default: return StatutAccord.Refuse;
  }
};