import React, { useState, useMemo } from 'react';
import { Menu, Car, User, FileText, Calendar, Home, Eye, CheckCircle, X, ArrowLeft, Check, XCircle, Clock, Search, Download, Send, Copy } from 'lucide-react';
import { STATUS } from '../../../../core/resource/utils/Formatters';
import { formatFCFA } from '../../../../core/resource/utils/Formatters';


const InfoRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-400">{icon}</span>
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
};

// Composant QuoteCard 
const QuoteCard = ({ quote, onTreatClick, onRejectClick, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);
  const statusConfig = STATUS[quote.status];

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{quote.id}</h2>
        <span
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: statusConfig.bg,
            color: '#065F46',
          }}
        >
          {statusConfig.label}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <InfoRow icon={<Car size={18} />} label="Véhicule:" value={quote.vehicle} />
        <InfoRow icon={<User size={18} />} label="Client:" value={quote.client} />
        <InfoRow icon={<FileText size={18} />} label="Sinistre:" value={quote.reference} />
        <InfoRow icon={<Calendar size={18} />} label="Date:" value={quote.date} />
        <InfoRow icon={<Home size={18} />} label="Garage:" value={quote.garage} />
      </div>

      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Montant total</p>
          <p className="text-3xl font-bold text-blue-600">
            {formatFCFA(quote.amount)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Franchise: {formatFCFA(quote.deductible)}
          </p>
        </div>
      </div>

      <div className="flex flex-1 gap-3">
        <button 
          onClick={() => onViewDetails(quote)}
          className="w-full bg-blue-600 text-sm hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          <Eye size={18} />
          Voir détails
        </button>
        
        {quote.status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => onTreatClick(quote)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center w-23 justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <CheckCircle size={18} />
              Traiter
            </button>
            <button
              onClick={() => onRejectClick(quote)}
              className="flex-1 bg-red-500 hover:bg-red-600 w-24 text-sm text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <XCircle size={18} />
              Rejeter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteCard