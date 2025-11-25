import React, { useState, useMemo } from 'react';
import { Menu, Car, User, FileText, Calendar, Home, Eye, CheckCircle, X, ArrowLeft, Check, XCircle, Clock, Search, Download, Send, Copy } from 'lucide-react';
import { STATUS } from '../../utils/Formatters';
import { formatFCFA } from '../../utils/Formatters';
import { AGREEMENT_STATUS } from '../../utils/Formatters';


const AgreementCard = ({ agreement, onViewDetails, onSend }) => {
  const statusConfig = AGREEMENT_STATUS[agreement.statut];
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{agreement.numeroAccord}</h3>
          <p className="text-sm text-gray-500">Devis: {agreement.devisId}</p>
        </div>
        <span
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: statusConfig.bg,
            color: statusConfig.color,
          }}
        >
          {statusConfig.label}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Car className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 font-medium">Véhicule:</span>
          <span className="text-gray-900">{agreement.vehicule}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 font-medium">Client:</span>
          <span className="text-gray-900">{agreement.client}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 font-medium">Émis le:</span>
          <span className="text-gray-900">{agreement.dateEmission}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm text-gray-600 mb-1">Montant validé</p>
          <p className="text-xl font-bold text-blue-600">
            {formatFCFA(agreement.montantValide)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Prise en charge</p>
          <p className="text-xl font-bold text-green-600">
            {formatFCFA(agreement.priseEnCharge)}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Conditions de prise en charge</p>
        <div className="text-sm text-gray-800 bg-blue-50 p-3 rounded-lg border border-blue-200 h-24 overflow-y-auto">
          <p className="leading-relaxed">{agreement.conditions}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(agreement)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
        >
          <Eye className="w-4 h-4" />
          Détails
        </button>
        {agreement.statut === 'Accepter' && (
          <button
            onClick={() => onSend(agreement)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <Send className="w-4 h-4" />
            Transmettre
          </button>
        )}
        <button
          onClick={() => navigator.clipboard.writeText(agreement.numeroAccord)}
          className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 flex items-center justify-center"
          title="Copier le numéro"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AgreementCard