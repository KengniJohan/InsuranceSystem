import React, { useState, useMemo } from 'react';
import AgreementsStatsCards from './AgreementStatsCards';
import AgreementsFilterTabs from './AgreementFilterTabs';
import AgreementsHeader from './AgreeementHeader';
import AgreementCard from './AgreementCard';
import AgreementDetailsModal from './AgreementDetailModal';
import { FileText } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useStorageApp } from '../../../../core/resource/store/storageApp';

const AccordsView = ({ agreements }) => {
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [agreementFilter, setAgreementFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
    const {onMenuClick, activeView, onViewChange} = useStorageApp();
    const location = useLocation();

  const agreementStats = useMemo(() => {
    const accepted = agreements.filter(a => a.statut === 'Accepter').length;
    const rejected = agreements.filter(a => a.statut === 'Refuser').length;
    const total = agreements.length;

    return { accepted, rejected, total };
  }, [agreements]);

  const filteredAgreements = useMemo(() => {
    let filtered = agreements;
    
    if (agreementFilter !== 'all') {
      filtered = filtered.filter(agreement => agreement.statut === agreementFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(agreement => 
        agreement.numeroAccord.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.devisId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.vehicule.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [agreements, agreementFilter, searchTerm]);

  const handleViewAgreementDetails = (agreement) => {
    setSelectedAgreement(agreement);
    setIsAgreementModalOpen(true);
  };

  const handleSendAgreement = (agreement) => {
    alert(`Accord ${agreement.numeroAccord} transmis au garage avec succès !`);
  };

  const handleExportAgreements = () => {
    alert('Export des accords en cours...');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Accords</h1>
        <p className="text-gray-600">Suivi des accords de prise en charge générés</p>
                    <div className='flex items-center justify-center ml-259 mt-[-45px]'>
                        <div className="flex bg-gray-100 rounded-lg p-1 mt-[]">
              <button
                onClick={() => onViewChange('devis')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeView === 'devis' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Devis
              </button>
              <button
                onClick={() => onViewChange('accords')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeView === 'accords' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Accords
              </button>
            </div>
        </div>
      </div>

      <AgreementsStatsCards agreements={agreements} activeFilter={agreementFilter} onFilterChange={setAgreementFilter} />

      <AgreementsFilterTabs activeFilter={agreementFilter} onFilterChange={setAgreementFilter} stats={agreementStats} />

  

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAgreements.map((agreement, index) => (
          <div
            key={agreement.id}
            style={{
              animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <AgreementCard
              agreement={agreement}
              onViewDetails={handleViewAgreementDetails}
              onSend={handleSendAgreement}
            />
          </div>
        ))}
      </div>

      {filteredAgreements.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun accord trouvé
            </h3>
            <p className="text-gray-500">
              Aucun accord ne correspond à vos critères de recherche.
            </p>
          </div>
        </div>
      )}

      {selectedAgreement && (
        <AgreementDetailsModal
          agreement={selectedAgreement}
          isOpen={isAgreementModalOpen}
          onClose={() => setIsAgreementModalOpen(false)}
          onSend={handleSendAgreement}
        />
      )}
    </div>
  );
};

export default AccordsView;