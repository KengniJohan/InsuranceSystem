import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Save, 
    AlertTriangle,
    RefreshCw,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { sinistreService } from '../../../services/api';

interface SinistreDetail {
    id: number;
    dateSinistre: string;
    lieuSinistre: string;
    description: string;
    statut: string;
    vehiculeId: number;
    vehiculeImmatriculation: string;
    vehiculeMarque: string;
    vehiculeModele: string;
    clientId: number;
    clientNom: string;
    clientPrenom: string;
}

const STATUTS = [
    { value: 'OUVERT', label: 'Ouvert' },
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'CLOTURE', label: 'Clôturé' }
];

export default function SinistreEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [sinistre, setSinistre] = useState<SinistreDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    // Formulaire
    const [formData, setFormData] = useState({
        description: '',
        statut: ''
    });

    const loadSinistreDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await sinistreService.getSinistreDetails(id);
            setSinistre(response.data);
            setFormData({
                description: response.data.description || '',
                statut: response.data.statut || 'OUVERT'
            });
        } catch (err) {
            console.error('Erreur lors du chargement:', err);
            setError('Impossible de charger les données du sinistre.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            loadSinistreDetails();
        }
    }, [id, loadSinistreDetails]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setSaving(true);
            setError(null);
            setSuccess(false);
            
            await sinistreService.updateSinistre(id, formData);
            
            setSuccess(true);
            
            // Recharger les données après la mise à jour
            await loadSinistreDetails();
            
            // Redirection après 1.5 secondes
            setTimeout(() => {
                navigate(`/sinistre/${id}`);
            }, 1500);
            
        } catch (err: unknown) {
            console.error('Erreur lors de la mise à jour:', err);
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du sinistre.';
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!sinistre && !loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 pt-24">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5" />
                            <span>{error || 'Sinistre non trouvé'}</span>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => navigate('/sinistres')}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Retour
                            </button>
                            <button 
                                onClick={loadSinistreDetails}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Réessayer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 pt-24">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button 
                        onClick={() => navigate(`/sinistre/${id}`)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Modifier le sinistre #{sinistre?.id}
                        </h1>
                        <p className="text-gray-500">Modifiez les informations du sinistre</p>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3">
                        <CheckCircle className="w-5 h-5" />
                        <span>Sinistre mis à jour avec succès ! Redirection...</span>
                    </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations non modifiables */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations générales</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Date du sinistre</label>
                                <p className="font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                                    {formatDate(sinistre?.dateSinistre || '')}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Lieu</label>
                                <p className="font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                                    {sinistre?.lieuSinistre || 'Non renseigné'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Véhicule</label>
                                <p className="font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                                    {sinistre?.vehiculeMarque} {sinistre?.vehiculeModele} ({sinistre?.vehiculeImmatriculation})
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Client</label>
                                <p className="font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                                    {sinistre?.clientPrenom} {sinistre?.clientNom}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Champs modifiables */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Détails modifiables</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">
                                    Statut
                                </label>
                                <select
                                    id="statut"
                                    name="statut"
                                    value={formData.statut}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    {STATUTS.map(statut => (
                                        <option key={statut.value} value={statut.value}>
                                            {statut.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Décrivez les circonstances du sinistre..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/sinistre/${id}`)}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Enregistrer
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
