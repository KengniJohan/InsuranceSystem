import React, { useState, useMemo } from 'react';
import StatsCards from './StatCards';
import FilterTabs from './FilterTabs';
import QuoteCard from './QuoteCards';
import RepairModal from './RepairModal';
import PreviewModal from './PreviewModal';
import QuoteDetailsModal from './QuoteDetailsModal';
import { FileText } from 'lucide-react';
import { STATUS, formatFCFA } from '../../../../core/resource/utils/Formatters';

const DevisView = ({ quotes, onQuoteUpdate, onAddAgreement, createAgreement,onRefresh }) => {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isQuoteDetailsModalOpen, setIsQuoteDetailsModalOpen] = useState(false);
  const [previewRepairs, setPreviewRepairs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  const stats = useMemo(() => {
    const pending = quotes.filter(q => q.status === 'pending').length;
    const approved = quotes.filter(q => q.status === 'approved').length;
    const rejected = quotes.filter(q => q.status === 'rejected').length;
    const total = quotes.length;

    return { pending, approved, rejected, total };
  }, [quotes]);

  const filteredQuotes = useMemo(() => {
    if (activeFilter === 'all') return quotes;
    return quotes.filter(q => q.status === activeFilter);
  }, [quotes, activeFilter]);

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

      <StatsCards quotes={quotes} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

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
              onTreatClick={handleTreatClick}
              onRejectClick={handleRejectClick}
              onViewDetails={handleViewQuoteDetails}
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
            isOpen={isQuoteDetailsModalOpen}
            onClose={() => setIsQuoteDetailsModalOpen(false)}
            onTreatClick={handleTreatClick}
            onRejectClick={handleRejectClick}
          />
        </>
      )}
    </div>
  );
};

export default DevisView;