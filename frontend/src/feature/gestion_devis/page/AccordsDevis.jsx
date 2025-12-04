import React, { useState, useMemo,useEffect } from 'react';
import Header from '../component/Header';
import DevisView from '../component/Devis/DevisView';
import AccordsView from '../component/Accords/AccordsView';
import { devisService,accordService  } from '../../../services/api';
import { mapDevisToFrontend, mapAccordToFrontend, mapDevisToBackend, mapAccordToBackend} from '../../../core/resource/utils/dataMappers';
import { useStorageApp } from '../../../core/resource/store/storageApp';



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
  const activeView = useStorageApp(state => state.activeView);
 
  const [quotes, setQuotes] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [devisResponse, accordsResponse] = await Promise.all([
        devisService.getAllDevis(),
        accordService.getAllAccords()
      ]);
      console.log("Réponse devis :", devisResponse.data);
      const devisData = devisResponse.data.map(mapDevisToFrontend);
      const accordsData = accordsResponse.data.map(mapAccordToFrontend);

      setQuotes(devisData);
      setAgreements(accordsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Fallback sur les données mockées en cas d'erreur
      //setQuotes(quotesData);
      //setAgreements(initialAgreementsData);
    } finally {
      setLoading(false);
    }
  };

  const createAgreement = async (quote, statut, selectedRepairs = [], montantValide = 0) => {
    try {
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

      // Envoyer l'accord au backend
      const accordBackend = mapAccordToBackend(newAgreement, { id: quote.id });
      await accordService.createAccord(accordBackend);

      return newAgreement;
    } catch (error) {
      console.error('Erreur lors de la création de l\'accord:', error);
      throw error;
    }
  };

  const handleQuoteUpdate = async (quoteId, updates) => {
    try {
      // Mettre à jour localement d'abord
      setQuotes(prevQuotes =>
        prevQuotes.map(q => 
          q.id === quoteId ? { ...q, ...updates } : q
        )
      );

      // Mettre à jour dans le backend
      const quoteToUpdate = quotes.find(q => q.id === quoteId);
      if (quoteToUpdate) {
        const updatedQuote = { ...quoteToUpdate, ...updates };
        const quoteBackend = mapDevisToBackend(updatedQuote, { id: quoteId });
        await devisService.updateDevis(quoteId, quoteBackend);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du devis:', error);
      // Recharger les données en cas d'erreur
      loadData();
    }
  };

  const handleAddAgreement = (newAgreement) => {
    setAgreements(prev => [newAgreement, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {activeView === 'devis' ? (
          <DevisView
            quotes={quotes}
            onQuoteUpdate={handleQuoteUpdate}
            onAddAgreement={handleAddAgreement}
            createAgreement={createAgreement}
            onRefresh={loadData}
          />
        ) : (
          <AccordsView
            agreements={agreements}
            onRefresh={loadData}
          />
        )}
      </main>
    </div>
  );
};

export default AccordsDevis;