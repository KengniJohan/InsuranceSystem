import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, Eye, AlertTriangle, Send } from 'lucide-react';
import { sinistreService } from '../../../services/api';
import { mapSinistreToFrontend } from '../../../core/resource/utils/dataMappers';

interface Sinistre {
    id: number;
    numero: string;
    date: string;
    lieu: string;
    statut: string;
    description: string;
    client: string;
    vehicule: string;
}

export default function ListingSinistres() {
    const [sinistres, setSinistres] = useState<Sinistre[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSinistres();
    }, []);

    const loadSinistres = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await sinistreService.getAllSinistres();
            const sinistresData = response.data.map(mapSinistreToFrontend);
            setSinistres(sinistresData);
        } catch (err) {
            console.error('Erreur lors du chargement des sinistres:', err);
            setError('Impossible de charger les sinistres. Vérifiez que le serveur est démarré.');
        } finally {
            setLoading(false);
        }
    };

    const getStatutStyle = (statut: string) => {
        switch (statut) {
            case 'Clôturé':
                return 'bg-green-100 text-green-700';
            case 'En cours':
                return 'bg-yellow-100 text-yellow-700';
            case 'Ouvert':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Stats
    const stats = {
        total: sinistres.length,
        ouvert: sinistres.filter(s => s.statut === 'Ouvert').length,
        enCours: sinistres.filter(s => s.statut === 'En cours').length,
        cloture: sinistres.filter(s => s.statut === 'Clôturé').length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des sinistres...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 pt-24">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                        <button 
                            onClick={loadSinistres}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 p-6 pt-24">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Sinistres</h1>
                        <p className="text-gray-600">Retrouvez et gérez toutes les déclarations de sinistre.</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={loadSinistres}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Actualiser
                        </button>
                        <Link 
                            to="/sinistre/ajouter-sinistre"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Plus className="w-4 h-4" />
                            Nouveau sinistre
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-200">
                        <p className="text-sm text-blue-600">Ouverts</p>
                        <p className="text-2xl font-bold text-blue-700">{stats.ouvert}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4 shadow-sm border border-yellow-200">
                        <p className="text-sm text-yellow-600">En cours</p>
                        <p className="text-2xl font-bold text-yellow-700">{stats.enCours}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 shadow-sm border border-green-200">
                        <p className="text-sm text-green-600">Clôturés</p>
                        <p className="text-2xl font-bold text-green-700">{stats.cloture}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                    {sinistres.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Aucun sinistre déclaré.</p>
                            <Link 
                                to="/sinistre/ajouter-sinistre"
                                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4" />
                                Déclarer un sinistre
                            </Link>
                        </div>
                    ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">N° Dossier</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Véhicule</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sinistres.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-blue-600">{s.numero}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{s.date}</td>
                                    <td className="px-6 py-4 text-gray-700">{s.client}</td>
                                    <td className="px-6 py-4 text-gray-700">{s.vehicule}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutStyle(s.statut)}`}>
                                            {s.statut}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link 
                                                to={`/sinistre/${s.id}`}
                                                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Détails
                                            </Link>
                                            <button
                                                disabled={s.statut === 'Clôturé'}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                                                    s.statut === 'Clôturé'
                                                        ? 'bg-purple-400 text-white cursor-not-allowed opacity-60'
                                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                                }`}
                                                title={s.statut === 'Clôturé' ? 'Sinistre clôturé' : 'Transférer au système garage (bientôt disponible)'}
                                            >
                                                <Send className="w-4 h-4" />
                                                Transférer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
        </div>
    );
}
