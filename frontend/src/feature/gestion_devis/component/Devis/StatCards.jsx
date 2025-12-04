import React, { useState, useMemo } from 'react';
import { Menu, Car, User, FileText, Calendar, Home, Eye, CheckCircle, X, ArrowLeft, Check, XCircle, Clock, Search, Download, Send, Copy } from 'lucide-react';
import { STATUS } from '../../../../core/resource/utils/Formatters';
import { formatFCFA } from '../../../../core/resource/utils/Formatters';


const StatsCards = ({ quotes, activeFilter, onFilterChange }) => {
  const stats = useMemo(() => {
    const pending = quotes.filter(q => q.status === 'pending').length;
    const approved = quotes.filter(q => q.status === 'approved').length;
    const rejected = quotes.filter(q => q.status === 'rejected').length;
    const total = quotes.length;

    return { pending, approved, rejected, total };
  }, [quotes]);

  const cards = [
    {
      id: 'pending',
      label: 'En attente',
      count: stats.pending,
      sublabel: 'Devis à traiter',
      bg: 'bg-yellow-50',
      border: 'border-2 border-yellow-300',
      textColor: 'text-yellow-800',
      iconBg: 'bg-yellow-500',
      icon: <Clock className="w-6 h-6 text-white" />,
    },
    {
      id: 'approved',
      label: 'Approuvés',
      count: stats.approved,
      sublabel: 'Devis traités',
      bg: 'bg-green-50',
      border: 'border-2 border-green-300',
      textColor: 'text-green-800',
      iconBg: 'bg-green-500',
      icon: <CheckCircle className="w-6 h-6 text-white" />,
    },
    {
      id: 'rejected',
      label: 'Refusés',
      count: stats.rejected,
      sublabel: 'Devis refusés',
      bg: 'bg-red-50',
      border: 'border-2 border-red-300',
      textColor: 'text-red-800',
      iconBg: 'bg-red-500',
      icon: <XCircle className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => onFilterChange(card.id)}
          className={`
            ${card.bg} ${card.border} 
            rounded-xl p-5 cursor-pointer transition-all duration-200
            hover:shadow-lg transform hover:scale-105
            ${activeFilter === card.id ? 'ring-4 ring-blue-500 ring-opacity-50' : ''}
          `}
        >
          <div className="flex items-start justify-between mb-3">
            <p className={`text-sm font-medium ${card.textColor}`}>
              {card.label}
            </p>
            <div className={`${card.iconBg} rounded-full p-2`}>
              {card.icon}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className={`text-4xl font-bold ${card.textColor}`}>
                {card.count}
              </p>
              {card.sublabel && (
                <p className={`text-xs ${card.textColor} opacity-70 mt-1`}>
                  {card.sublabel}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards