import React, { useState, useMemo } from 'react';
import Header from '../component/Header';
import DevisView from '../component/Devis/DevisView';
import AccordsView from '../component/Accords/AccordsView';


// Données des devis avec réparations 
const quotesData = [
  {
    id: 'DEV-2024-001',
    status: 'pending',
    vehicle: 'Peugeot 308',
    client: 'Jean Dupont',
    reference: 'SIN-2024-5678',
    date: '15/11/2024',
    garage: 'Garage Martin Auto',
    amount: 985000,
    deductible: 230000,
    vehicleImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop',
    repairs: [
      { id: 'r1', name: 'Peinture carrosserie', category: 'Carrosserie', price: 0, selected: false },
      { id: 'r2', name: 'Remplacement phare gauche', category: 'Optique', price: 144000, selected: true },
      { id: 'r3', name: "Main d'œuvre carrosserie", category: "Main d'œuvre", price: 197000, selected: true },
      { id: 'r4', name: 'Polissage et finition', category: 'Finition', price: 98000, selected: true },
      { id: 'r5', name: 'Remplacement pare-choc avant', category: 'Carrosserie', price: 295000, selected: true },
      { id: 'r6', name: 'Peinture pare-choc', category: 'Peinture', price: 251000, selected: true },
    ],
  },
  {
    id: 'DEV-2024-002',
    status: 'pending',
    vehicle: 'Renault Clio',
    client: 'Marie Dubois',
    reference: 'SIN-2024-5679',
    date: '16/11/2024',
    garage: 'Auto Service Plus',
    amount: 416000,
    deductible: 164000,
    vehicleImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
    repairs: [
      { id: 'r7', name: 'Pare-choc avant', category: 'Carrosserie', price: 252000, selected: true },
      { id: 'r8', name: 'Peinture', category: 'Finition', price: 164000, selected: true },
    ],
  },
  {
    id: 'DEV-2024-003',
    status: 'approved',
    vehicle: 'Citroën C3',
    client: 'Pierre Martin',
    reference: 'SIN-2024-5680',
    date: '14/11/2024',
    garage: 'Carrosserie Moderne',
    amount: 957000,
    deductible: 262000,
    vehicleImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop',
    repairs: [
      { id: 'r9', name: 'Remplacement porte droite', category: 'Carrosserie', price: 564000, selected: true },
      { id: 'r10', name: "Main d'œuvre", category: "Main d'œuvre", price: 393000, selected: true },
    ],
  },
];

// Données initiales des accords 
const initialAgreementsData = [
  {
    id: 'ACC-2024-001',
    devisId: 'DEV-2024-003',
    montantValide: 957000,
    conditions: 'Prise en charge complète des réparations validées conformément au contrat d\'assurance et dans la limite des plafonds de garantie.',
    numeroAccord: 'AGRE-2024-5678',
    dateEmission: '18/11/2024',
    statut: 'Accepter',
    vehicule: 'Citroën C3',
    client: 'Pierre Martin',
    garage: 'Carrosserie Moderne',
    franchise: 262000,
    priseEnCharge: 695000,
    referenceSinistre: 'SIN-2024-5680'
  },
  {
    id: 'ACC-2024-002',
    devisId: 'DEV-2024-001',
    montantValide: 785000,
    conditions: 'Prise en charge partielle des réparations, exclusion de la peinture carrosserie non couverte par la garantie.',
    numeroAccord: 'AGRE-2024-5679',
    dateEmission: '19/11/2024',
    statut: 'Accepter',
    vehicule: 'Peugeot 308',
    client: 'Jean Dupont',
    garage: 'Garage Martin Auto',
    franchise: 230000,
    priseEnCharge: 555000,
    referenceSinistre: 'SIN-2024-5678'
  },
  {
    id: 'ACC-2024-003',
    devisId: 'DEV-2024-002',
    montantValide: 0,
    conditions: 'Devis refusé - Réparations non conformes au contrat d\'assurance et dépassement des plafonds de garantie applicables.',
    numeroAccord: 'AGRE-2024-5680',
    dateEmission: '20/11/2024',
    statut: 'Refuser',
    vehicule: 'Renault Clio',
    client: 'Marie Dubois',
    garage: 'Auto Service Plus',
    franchise: 164000,
    priseEnCharge: 0,
    referenceSinistre: 'SIN-2024-5679'
  }
];

// Configuration des statuts
export const STATUS = {
  pending: { label: 'En attente', color: '#FDE047', bg: '#FEF9C3' },
  approved: { label: 'Approuvé', color: '#22C55E', bg: '#D1FAE5' },
  rejected: { label: 'Refusé', color: '#e52121ff', bg: '#f610105d' },
};

export const AGREEMENT_STATUS = {
  Accepter: { label: 'Accepté', color: '#22C55E', bg: '#D1FAE5' },
  Refuser: { label: 'Refusé', color: '#EF4444', bg: '#FEE2E2' },
};

// Fonction utilitaire pour générer un numéro d'accord
export const generateNumeroAccord = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `AGRE-${year}${month}${day}-${random}`;
};

// Fonction utilitaire pour formater la date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR');
};

// Fonction pour formater les montants en FCFA
export const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
};

// Composant Principal
const AccordsDevis = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('devis');
  const [quotes, setQuotes] = useState(quotesData);
  const [agreements, setAgreements] = useState(initialAgreementsData);

  // Fonction pour créer un accord à partir d'un devis
  const createAgreement = (quote, statut, selectedRepairs = [], montantValide = 0) => {
    const selectedItems = selectedRepairs.filter(r => r.selected);
    const totalAmount = selectedItems.reduce((sum, r) => sum + r.price, 0);
    const priseEnCharge = statut === 'Accepter' ? totalAmount - quote.deductible : 0;
    
    const conditions = statut === 'Accepter' 
      ? `Prise en charge des réparations suivantes: ${selectedItems.map(r => r.name).join(', ')}. Prise en charge dans la limite des plafonds de garantie du contrat.`
      : 'Devis refusé - Non conforme au contrat d\'assurance. Les réparations demandées ne sont pas couvertes par les garanties souscrites.';

    const newAgreement = {
      id: `ACC-${new Date().getFullYear()}-${String(agreements.length + 1).padStart(3, '0')}`,
      devisId: quote.id,
      montantValide: statut === 'Accepter' ? totalAmount : 0,
      conditions,
      numeroAccord: generateNumeroAccord(),
      dateEmission: formatDate(new Date()),
      statut,
      vehicule: quote.vehicle,
      client: quote.client,
      garage: quote.garage,
      franchise: quote.deductible,
      priseEnCharge,
      referenceSinistre: quote.reference
    };

    return newAgreement;
  };

  const handleQuoteUpdate = (quoteId, updates) => {
    setQuotes(prevQuotes =>
      prevQuotes.map(q => 
        q.id === quoteId ? { ...q, ...updates } : q
      )
    );
  };

  const handleAddAgreement = (newAgreement) => {
    setAgreements(prev => [newAgreement, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onMenuClick={() => setMenuOpen(!menuOpen)} 
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {activeView === 'devis' ? (
          <DevisView
            quotes={quotes}
            onQuoteUpdate={handleQuoteUpdate}
            onAddAgreement={handleAddAgreement}
            createAgreement={createAgreement}
          />
        ) : (
          <AccordsView
            agreements={agreements}
          />
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default AccordsDevis;