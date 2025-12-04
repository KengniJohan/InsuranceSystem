import React, { useState, useMemo } from 'react';
import { Menu, Car, User, FileText, Calendar, Home, Eye, CheckCircle, X, ArrowLeft, Check, XCircle, Clock, Search, Download, Send, Copy } from 'lucide-react';
import { STATUS } from '../../utils/Formatters';
import { formatFCFA } from '../../utils/Formatters';

const PreviewModal = ({ quote, selectedRepairs, isOpen, onBack, onValidate, onReject }) => {
  if (!isOpen) return null;

  const selectedItems = selectedRepairs.filter(r => r.selected);
  const totalAmount = selectedItems.reduce((sum, r) => sum + r.price, 0);
  const insuranceCoverage = totalAmount - quote.deductible;

  const handleValidate = () => {
    onValidate(quote, selectedRepairs, totalAmount);
  };

  const handleReject = () => {
    onReject(quote);
  };

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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="bg-white px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-3 transition-colors"
            >
              <ArrowLeft size={20} />
              Retour aux détails
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Prévisualisation du traitement</h2>
            <p className="text-gray-600 mt-1">Vérifiez les montants avant validation</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="mx-6 mt-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-4">Devis {quote.id}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-200 text-sm mb-1">Garage</p>
                  <p className="font-semibold">{quote.garage}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Client</p>
                  <p className="font-semibold">{quote.client}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Véhicule</p>
                  <p className="font-semibold">{quote.vehicle}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Sinistre</p>
                  <p className="font-semibold">{quote.reference}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Détail des montants
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Réparations prises en charge ({selectedItems.length})
              </p>

              <div className="space-y-2">
                {selectedItems.map((repair) => (
                  <div
                    key={repair.id}
                    className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <p className="font-medium text-gray-900">{repair.name}</p>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      {formatFCFA(repair.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Montant total du devis</span>
                  <span className="text-xl font-semibold text-gray-900">
                    {formatFCFA(quote.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-medium">Montant sélectionné</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatFCFA(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-600 font-medium">Franchise client</span>
                  <span className="text-xl font-bold text-orange-600">
                    - {formatFCFA(quote.deductible)}
                  </span>
                </div>
                <div className="h-px bg-gray-300 my-2" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-bold text-green-600">
                    Prise en charge assurance
                  </span>
                  <span className="text-3xl font-bold text-green-600">
                    {formatFCFA(insuranceCoverage)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[20px] font-bold text-red-600">
                    Reste à charge du client
                  </span>
                  <span className="text-3xl font-bold text-red-600">
                    {formatFCFA(quote.deductible)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-white flex gap-3 flex-shrink-0">
            <button
              onClick={handleReject}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-all"
            >
              Refuser le devis
            </button>
            <button
              onClick={handleValidate}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Approuver et transmettre
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewModal