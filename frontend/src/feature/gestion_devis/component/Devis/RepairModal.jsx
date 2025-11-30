import React, { useState, useMemo } from 'react';
import { Menu, Car, User, FileText, Calendar, Home, Eye, CheckCircle, X, ArrowLeft, Check, XCircle, Clock, Search, Download, Send, Copy } from 'lucide-react';
import { STATUS } from '../../../../core/resource/utils/Formatters';
import { formatFCFA } from '../../../../core/resource/utils/Formatters';


const RepairModal = ({ quote, isOpen, onClose, onPreview }) => {
  const [repairs, setRepairs] = useState(quote.repairs);

  if (!isOpen) return null;

  const totalSelected = repairs
    .filter(r => r.selected)
    .reduce((sum, r) => sum + r.price, 0);
  
  const insuranceCoverage = totalSelected - quote.deductible;
  const categories = Array.from(new Set(repairs.map(r => r.category)));

  const toggleRepair = (repairId) => {
    setRepairs(prevRepairs =>
      prevRepairs.map(r =>
        r.id === repairId ? { ...r, selected: !r.selected } : r
      )
    );
  };

  const handlePreview = () => {
    onClose();
    setTimeout(() => {
      onPreview(repairs);
    }, 300);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white">{quote.id}</h2>
              <p className="text-blue-100 text-sm">{quote.vehicle} - {quote.client}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {categories.map(category => {
              const categoryRepairs = repairs.filter(r => r.category === category);
              return (
                <div key={category} className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 border-l-4 border-blue-600 pl-3">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {categoryRepairs.map(repair => (
                      <label
                        key={repair.id}
                        className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md"
                        style={{
                          borderColor: repair.selected ? '#2563EB' : '#E5E7EB',
                          backgroundColor: repair.selected ? '#EFF6FF' : '#FFFFFF',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={repair.selected}
                            onChange={() => toggleRepair(repair.id)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{repair.name}</p>
                            <p className="text-xs text-gray-500">{repair.category}</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-blue-600">
                          {formatFCFA(repair.price)}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t-2 border-gray-200 px-6 py-4 bg-gray-50 flex-shrink-0">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Montant total du devis</span>
                <span className="font-semibold text-gray-900">{formatFCFA(totalSelected)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600 font-medium">Montant sélectionné</span>
                <span className="font-bold text-blue-600">{formatFCFA(totalSelected)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-orange-600">Franchise client</span>
                <span className="font-semibold text-orange-600">- {formatFCFA(quote.deductible)}</span>
              </div>
              <div className="h-px bg-gray-300 my-2" />
              <div className="flex justify-between">
                <span className="text-lg font-bold text-green-600">Prise en charge assurance</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatFCFA(insuranceCoverage)}
                </span>
              </div>
            </div>

            <button
              onClick={handlePreview}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Prévisualiser et valider
            </button>
          </div>
        </div>
      </div>

      <style>{`
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
      `}</style>
    </>
  );
};

export default RepairModal