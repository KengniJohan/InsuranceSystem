import React, { useState, useMemo } from 'react';
import StatsCards from './StatCards';
import FilterTabs from './FilterTabs';
import QuoteCard from './QuoteCards';
import RepairModal from './RepairModal';
import PreviewModal from './PreviewModal';
import QuoteDetailsModal from './QuoteDetailsModal';
import AgreementDetailsModal from '../Accords/AgreementDetailModal';
import { FileText } from 'lucide-react';
import { STATUS, formatFCFA } from '../../../../core/resource/utils/formatters';

const DevisView = ({ quotes, agreements = [], onQuoteUpdate, onAddAgreement, createAgreement, onRefresh }) => {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isQuoteDetailsModalOpen, setIsQuoteDetailsModalOpen] = useState(false);
  const [isAccordModalOpen, setIsAccordModalOpen] = useState(false);
  const [selectedAccord, setSelectedAccord] = useState(null);
  const [previewRepairs, setPreviewRepairs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  // Fonction pour trouver l'accord associé à un devis
  const getAccordForQuote = (quoteId) => {
    return agreements.find(a => a.devisId === quoteId);
  };

  // Fonction pour voir l'accord associé
  const handleViewAccord = (quote) => {
    const accord = getAccordForQuote(quote.id);
    if (accord) {
      setSelectedAccord(accord);
      setIsAccordModalOpen(true);
    }
  };

  // Fonction pour obtenir le statut effectif d'un devis (basé sur l'accord s'il existe)
  const getEffectiveStatus = (quote) => {
    const accord = getAccordForQuote(quote.id);
    if (accord) {
      // Si un accord existe, le statut du devis dépend de l'accord
      return accord.statut === 'Accepter' ? 'approved' : 'rejected';
    }
    return quote.status;
  };

  // Créer une liste avec les statuts effectifs
  const quotesWithEffectiveStatus = useMemo(() => {
    return quotes.map(q => ({
      ...q,
      status: getEffectiveStatus(q)
    }));
  }, [quotes, agreements]);

  const stats = useMemo(() => {
    const pending = quotesWithEffectiveStatus.filter(q => q.status === 'pending').length;
    const approved = quotesWithEffectiveStatus.filter(q => q.status === 'approved').length;
    const rejected = quotesWithEffectiveStatus.filter(q => q.status === 'rejected').length;
    const total = quotesWithEffectiveStatus.length;

    return { pending, approved, rejected, total };
  }, [quotesWithEffectiveStatus]);

  const filteredQuotes = useMemo(() => {
    if (activeFilter === 'all') return quotesWithEffectiveStatus;
    return quotesWithEffectiveStatus.filter(q => q.status === activeFilter);
  }, [quotesWithEffectiveStatus, activeFilter]);

  const handleTreatClick = (quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
    setIsPreviewOpen(false);
  };

  const handleRejectClick = async (quote) => {
    if (window.confirm(`Êtes-vous sûr de vouloir rejeter le devis ${quote.id} ?`)) {
      try {
        const newAgreement = await createAgreement(quote, 'Refuser');
        
        await onQuoteUpdate(quote.id, { status: 'rejected' });
        onAddAgreement(newAgreement);
        
        alert(`Devis ${quote.id} refusé. Un accord de refus a été créé.`);
      } catch (error) {
        alert('Erreur lors du rejet du devis. Veuillez réessayer.');
        await onRefresh();
      }
    }
  };

  const handlePreview = (repairs) => {
    setPreviewRepairs(repairs);
    setIsPreviewOpen(true);
  };

  const handleBackToRepairs = () => {
    setIsPreviewOpen(false);
    setTimeout(() => {
      setIsModalOpen(true);
    }, 300);
  };

  const handleValidate = async (quote, selectedRepairs, totalAmount) => {
    try {
      const newAgreement = await createAgreement(quote, 'Accepter', selectedRepairs, totalAmount);
      
      await onQuoteUpdate(quote.id, { 
        status: 'approved',
        amount: totalAmount,
        repairs: selectedRepairs
      });
      onAddAgreement(newAgreement);
      
      setIsPreviewOpen(false);
      setIsModalOpen(false);
      
      alert(`Devis ${quote.id} approuvé. Un accord d'acceptation a été créé.`);
    } catch (error) {
      alert('Erreur lors de la validation du devis. Veuillez réessayer.');
      await onRefresh();
    }
  };

  const handleRejectFromPreview = (quote) => {
    if (window.confirm(`Êtes-vous sûr de vouloir rejeter le devis ${quote.id} ?`)) {
      const newAgreement = createAgreement(quote, 'Refuser');
      
      onQuoteUpdate(quote.id, { status: 'rejected' });
      onAddAgreement(newAgreement);
      
      setIsPreviewOpen(false);
      setIsModalOpen(false);
      
      alert(`Devis ${quote.id} refusé. Un accord de refus a été créé.`);
    }
  };

  const handleViewQuoteDetails = (quote) => {
    setSelectedQuote(quote);
    setIsQuoteDetailsModalOpen(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Devis Garage</h1>
        <p className="text-gray-600">Consultez et validez les devis de réparation</p>
      </div>

      <StatsCards quotes={quotesWithEffectiveStatus} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredQuotes.map((quote, index) => (
          <div
            key={quote.id}
            style={{
              animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <QuoteCard 
              quote={quote} 
              accord={getAccordForQuote(quote.id)}
              onTreatClick={handleTreatClick}
              onRejectClick={handleRejectClick}
              onViewDetails={handleViewQuoteDetails}
              onViewAccord={handleViewAccord}
            />
          </div>
        ))}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun devis trouvé
            </h3>
            <p className="text-gray-500">
              {activeFilter === 'all' 
                ? "Aucun devis n'est disponible pour le moment."
                : `Aucun devis avec le statut "${STATUS[activeFilter]?.label || activeFilter}" n'a été trouvé.`
              }
            </p>
          </div>
        </div>
      )}

      {selectedQuote && (
        <>
          <RepairModal
            quote={selectedQuote}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPreview={handlePreview}
          />
          <PreviewModal
            quote={selectedQuote}
            selectedRepairs={previewRepairs}
            isOpen={isPreviewOpen}
            onBack={handleBackToRepairs}
            onValidate={handleValidate}
            onReject={() => handleRejectFromPreview(selectedQuote)}
          />
          <QuoteDetailsModal
            quote={selectedQuote}
            accord={getAccordForQuote(selectedQuote.id)}
            isOpen={isQuoteDetailsModalOpen}
            onClose={() => setIsQuoteDetailsModalOpen(false)}
            onTreatClick={handleTreatClick}
            onRejectClick={handleRejectClick}
          />
        </>
      )}

      {/* Modal pour voir l'accord associé au devis */}
      {selectedAccord && (
        <AgreementDetailsModal
          agreement={selectedAccord}
          isOpen={isAccordModalOpen}
          onClose={() => {
            setIsAccordModalOpen(false);
            setSelectedAccord(null);
          }}
          onSend={(accord) => {
            alert(`Accord ${accord.numeroAccord} transmis au garage avec succès !`);
            setIsAccordModalOpen(false);
            setSelectedAccord(null);
          }}
        />
      )}
    </div>
  );
};

export default DevisView;
