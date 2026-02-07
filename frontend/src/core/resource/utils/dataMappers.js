// src/utils/dataMappers.js
import { StatutDevis, StatutAccord } from './enums';
import { formatDate } from './formatters';


// Mapper une réparation du backend vers le frontend
export const mapReparationToFrontend = (reparationBackend) => {
  return {
    id: reparationBackend.id || reparationBackend.idReparation,
    name: reparationBackend.nom,
    category: reparationBackend.categorie,
    price: reparationBackend.prix || 0,
    selected: reparationBackend.selected || false
  };
};


// Mapper un devis du backend vers le frontend
// Le DTO retourne: { sinistre: { client: { nom, prenom }, vehicule: { marque, modele } } }
export const mapDevisToFrontend = (devisBackend) => {
  const sinistre = devisBackend.sinistre;
  const client = sinistre?.client;
  const vehicule = sinistre?.vehicule;
  
  return {
    id: devisBackend.id,
    idSinistre: sinistre?.id || null,
    status: mapStatutDevisToFrontend(devisBackend.statut),
    vehicle: vehicule ? `${vehicule.marque || ''} ${vehicule.modele || ''}`.trim() : 'Véhicule non spécifié',
    vehicleMarque: vehicule?.marque || 'N/A',
    vehicleModele: vehicule?.modele || 'N/A',
    vehicleImmatriculation: vehicule?.immatriculation || 'N/A',
    client: client ? `${client.prenom || ''} ${client.nom || ''}`.trim() : 'Client inconnu',
    clientNom: client?.nom || 'N/A',
    clientPrenom: client?.prenom || 'N/A',
    reference: sinistre?.numero || 'N/A',
    date: devisBackend.dateDevis ? new Date(devisBackend.dateDevis).toLocaleDateString('fr-FR') : 'N/A',
    garage: 'Garage Partenaire', 
    amount: devisBackend.montant || 0,
    deductible: devisBackend.franchise || 0,
    vehicleImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop',
    repairs: devisBackend.reparations ? devisBackend.reparations.map(mapReparationToFrontend) : []
  };
};

// Mapper un accord du backend vers le frontend
// Le DTO retourne: { devis: { sinistre: { client: { nom, prenom }, vehicule: { marque, modele } } } }
export const mapAccordToFrontend = (accordBackend) => {
  const devis = accordBackend.devis;
  const sinistre = devis?.sinistre;
  const client = sinistre?.client;
  const vehicule = sinistre?.vehicule;
  
  return {
    id: accordBackend.id,
    devisId: devis?.id,
    montantValide: accordBackend.montantValide || 0,
    conditions: accordBackend.conditions || '',
    numeroAccord: accordBackend.numeroAccord,
    dateEmission: accordBackend.dateEmission ? new Date(accordBackend.dateEmission).toLocaleDateString('fr-FR') : 'N/A',
    statut: mapStatutAccordToFrontend(accordBackend.statut),
    vehicule: vehicule ? `${vehicule.marque || ''} ${vehicule.modele || ''}`.trim() : 'Véhicule non spécifié',
    vehiculeMarque: vehicule?.marque || 'N/A',
    vehiculeModele: vehicule?.modele || 'N/A',
    vehiculeImmatriculation: vehicule?.immatriculation || 'N/A',
    client: client ? `${client.prenom || ''} ${client.nom || ''}`.trim() : 'Client inconnu',
    clientNom: client?.nom || 'N/A',
    clientPrenom: client?.prenom || 'N/A',
    garage: 'Garage Partenaire',
    franchise: accordBackend.franchise || 0,
    priseEnCharge: accordBackend.priseEnCharge || 0,
    referenceSinistre: sinistre?.numero || 'N/A'
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

// Mapper un sinistre du backend vers le frontend
export const mapSinistreToFrontend = (sinistreBackend) => {
  // Formatage de la date
  let dateFormatted = 'N/A';
  if (sinistreBackend.date) {
    try {
      const dateObj = new Date(sinistreBackend.date);
      dateFormatted = dateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      dateFormatted = sinistreBackend.date;
    }
  }

  return {
    id: sinistreBackend.id,
    numero: sinistreBackend.numero || `SIN-${sinistreBackend.id}`,
    date: dateFormatted,
    lieu: sinistreBackend.lieuSinistre || 'Non spécifié',
    statut: mapStatutSinistreToFrontend(sinistreBackend.statut),
    description: sinistreBackend.description || '',
    client: sinistreBackend.client 
      ? `${sinistreBackend.client.prenom || ''} ${sinistreBackend.client.nom || ''}`.trim() 
      : 'Client inconnu',
    vehicule: sinistreBackend.vehicule 
      ? `${sinistreBackend.vehicule.marque || ''} ${sinistreBackend.vehicule.modele || ''}`.trim()
      : 'Véhicule inconnu'
  };
};

export const mapStatutSinistreToFrontend = (statutBackend) => {
  switch (statutBackend) {
    case 'Ouvert': return 'Ouvert';
    case 'EnCours': return 'En cours';
    case 'Cloture': return 'Clôturé';
    default: return 'Ouvert';
  }
};
