import React, { useState, useMemo } from 'react';
import { Menu, Car, User, FileText, Calendar, Home, Eye, CheckCircle, X, ArrowLeft, Check, XCircle, Clock, Search, Download, Send, Copy } from 'lucide-react';
import { STATUS } from '../../utils/Formatters';
import { formatFCFA } from '../../utils/Formatters';
import { AGREEMENT_STATUS } from '../../utils/Formatters';


const AgreementDetailsModal = ({ agreement, isOpen, onClose, onSend }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[60]"
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white">{agreement.numeroAccord}</h2>
              <p className="text-blue-100 text-sm">Devis: {agreement.devisId}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Informations générales</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Numéro d'accord:</span>
                    <span className="font-semibold">{agreement.numeroAccord}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Devis associé:</span>
                    <span className="font-semibold">{agreement.devisId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date d'émission:</span>
                    <span className="font-semibold">{agreement.dateEmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut:</span>
                    <span
                      className="px-2 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: AGREEMENT_STATUS[agreement.statut].bg,
                        color: AGREEMENT_STATUS[agreement.statut].color,
                      }}
                    >
                      {AGREEMENT_STATUS[agreement.statut].label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Client & Véhicule</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-semibold">{agreement.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Véhicule:</span>
                    <span className="font-semibold">{agreement.vehicule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Garage:</span>
                    <span className="font-semibold">{agreement.garage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sinistre:</span>
                    <span className="font-semibold">{agreement.referenceSinistre}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Détails financiers</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Montant validé:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatFCFA(agreement.montantValide)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Franchise client:</span>
                    <span className="text-lg font-semibold text-orange-600">
                      - {formatFCFA(agreement.franchise)}
                    </span>
                  </div>
                  <div className="h-px bg-gray-300" />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-bold text-green-600">
                      Prise en charge assurance
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatFCFA(agreement.priseEnCharge)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Conditions de prise en charge</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-h-40 overflow-y-auto">
                  <p className="text-gray-800 leading-relaxed">{agreement.conditions}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-white flex gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition-all"
            >
              Fermer
            </button>
            {agreement.statut === 'Accepter' && (
              <button
                onClick={() => onSend(agreement)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Transmettre au garage
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AgreementDetailsModal