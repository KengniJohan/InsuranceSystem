import React, { useState, useMemo } from 'react';
import { Menu, Car, User, FileText, Calendar, Home, Eye, CheckCircle, X, ArrowLeft, Check, XCircle, Clock, Search, Download, Send, Copy } from 'lucide-react';
import { STATUS } from '../../utils/Formatters';
import { formatFCFA } from '../../utils/Formatters';

const QuoteDetailsModal = ({ quote, isOpen, onClose, onTreatClick, onRejectClick }) => {
  if (!isOpen || !quote) return null;

  const statusConfig = STATUS[quote.status];
  const selectedRepairs = quote.repairs.filter(r => r.selected);
  const totalAmount = selectedRepairs.reduce((sum, r) => sum + r.price, 0);
  const insuranceCoverage = totalAmount - quote.deductible;

  const categories = Array.from(new Set(quote.repairs.map(r => r.category)));

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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white">Détails du Devis</h2>
              <p className="text-blue-100 text-sm">{quote.id} - {quote.vehicle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Image du véhicule */}
              <div className="lg:col-span-1">
                <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={quote.vehicleImage}
                    alt={quote.vehicle}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{quote.vehicle}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Client:</span> {quote.client}</p>
                      <p><span className="font-medium">Garage:</span> {quote.garage}</p>
                      <p><span className="font-medium">Sinistre:</span> {quote.reference}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations générales */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Informations générales</h3>
                    <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Numéro de devis:</span>
                        <span className="font-semibold">{quote.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Référence sinistre:</span>
                        <span className="font-semibold">{quote.reference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold">{quote.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Statut:</span>
                        <span
                          className="px-2 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: statusConfig.bg,
                            color: '#065F46',
                          }}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Détails financiers */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Détails financiers</h3>
                    <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Montant total:</span>
                        <span className="text-xl font-bold text-blue-600">
                          {formatFCFA(quote.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Franchise client:</span>
                        <span className="text-lg font-semibold text-orange-600">
                          {formatFCFA(quote.deductible)}
                        </span>
                      </div>
                      {quote.status !== 'pending' && (
                        <>
                          <div className="h-px bg-gray-300" />
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-xl font-bold text-green-600">
                              Prise en charge
                            </span>
                            <span className="text-2xl font-bold text-green-600">
                              {formatFCFA(insuranceCoverage)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Réparations */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Détail des réparations ({quote.repairs.length})
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {categories.map(category => {
                      const categoryRepairs = quote.repairs.filter(r => r.category === category);
                      return (
                        <div key={category} className="bg-white border border-gray-200 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 border-l-4 border-blue-600 pl-3">
                            {category}
                          </h4>
                          <div className="space-y-2">
                            {categoryRepairs.map(repair => (
                              <div
                                key={repair.id}
                                className={`flex items-center justify-between p-3 rounded-lg ${
                                  repair.selected 
                                    ? 'bg-green-50 border-2 border-green-200' 
                                    : 'bg-gray-50 border border-gray-200'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {repair.selected ? (
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                      <Check className="w-4 h-4 text-white" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 bg-gray-300 rounded-full" />
                                  )}
                                  <div>
                                    <p className="font-medium text-gray-900">{repair.name}</p>
                                    <p className="text-xs text-gray-500">{repair.category}</p>
                                  </div>
                                </div>
                                <p className={`text-lg font-bold ${
                                  repair.selected ? 'text-green-600' : 'text-gray-400'
                                }`}>
                                  {formatFCFA(repair.price)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
            
            {quote.status === 'pending' && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    setTimeout(() => onRejectClick(quote), 300);
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Rejeter
                </button>
                <button
                  onClick={() => {
                    onClose();
                    setTimeout(() => onTreatClick(quote), 300);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Traiter le devis
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuoteDetailsModal