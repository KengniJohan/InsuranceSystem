import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, CheckCircle, Plus, List, ClipboardList, RefreshCw } from 'lucide-react';
import { statsService } from '../../services/api';

interface StatsData {
  sinistresEnCours: number;
  sinistresOuverts: number;
  sinistresClotures: number;
  totalSinistres: number;
  devisEnAttente: number;
  devisValides: number;
  devisRejetes: number;
  totalDevis: number;
  accordsAcceptes: number;
  accordsRefuses: number;
  totalAccords: number;
}

const defaultStats: StatsData = {
  sinistresEnCours: 0,
  sinistresOuverts: 0,
  sinistresClotures: 0,
  totalSinistres: 0,
  devisEnAttente: 0,
  devisValides: 0,
  devisRejetes: 0,
  totalDevis: 0,
  accordsAcceptes: 0,
  accordsRefuses: 0,
  totalAccords: 0,
};

const HomePage: React.FC = () => {
  const [statsData, setStatsData] = useState<StatsData>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await statsService.getStats();
      setStatsData(response.data || defaultStats);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError('Impossible de charger les statistiques');
      setStatsData(defaultStats);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      title: 'Sinistres',
      description: 'Gérer les déclarations de sinistres',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      links: [
        { label: 'Voir tous les sinistres', path: '/sinistre', icon: List },
        { label: 'Déclarer un sinistre', path: '/sinistre/ajouter-sinistre', icon: Plus },
      ]
    },
    {
      title: 'Devis',
      description: 'Consulter et valider les devis garage',
      icon: FileText,
      color: 'bg-blue-500',
      links: [
        { label: 'Gestion des devis', path: '/devis', icon: ClipboardList },
      ]
    },
    {
      title: 'Accords',
      description: 'Gérer les accords de prise en charge',
      icon: CheckCircle,
      color: 'bg-green-500',
      links: [
        { label: 'Voir les accords', path: '/accord', icon: List },
      ]
    },
  ];

  const stats = [
    { 
      label: 'Sinistres en cours', 
      value: String((statsData.sinistresEnCours || 0) + (statsData.sinistresOuverts || 0)), 
      color: 'text-orange-600', 
      bg: 'bg-orange-100' 
    },
    { 
      label: 'Devis en attente', 
      value: String(statsData.devisEnAttente || 0), 
      color: 'text-blue-600', 
      bg: 'bg-blue-100' 
    },
    { 
      label: 'Accords validés', 
      value: String(statsData.accordsAcceptes || 0), 
      color: 'text-green-600', 
      bg: 'bg-green-100' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue sur SecureAuto
          </h1>
          <p className="text-gray-600">
            Plateforme de gestion des sinistres et réparations automobiles
          </p>
        </div>

        {/* Stats rapides */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={loadStats}
              className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {loading ? (
            <>
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-6 shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </>
          ) : (
            stats.map((stat, index) => (
              <div key={index} className={`${stat.bg} rounded-xl p-6 shadow-sm`}>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))
          )}
        </div>

        {/* Menu principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className={`${item.color} p-4`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{item.title}</h2>
                    <p className="text-white/80 text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-2">
                  {item.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      to={link.path}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <link.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                        {link.label}
                      </span>
                      <svg 
                        className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="mt-8 bg-linear-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Action rapide</h3>
              <p className="text-blue-100">Déclarez un nouveau sinistre en quelques étapes</p>
            </div>
            <Link
              to="/sinistre/ajouter-sinistre"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouveau sinistre
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
