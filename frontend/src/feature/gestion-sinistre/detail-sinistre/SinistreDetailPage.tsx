import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Edit, 
    Calendar, 
    Car, 
    User, 
    FileText,
    AlertTriangle,
    RefreshCw,
    Image as ImageIcon,
    ChevronLeft,
    ChevronRight,
    X,
    Plus,
    Trash2,
    Loader2,
    Upload,
    Send
} from 'lucide-react';
import { sinistreService } from '../../../services/api';

interface ImageData {
    id: number;
    fileName: string;
    fileType: string;
    url: string;
}

interface DegatData {
    id: number;
    intitule: string;
    typeDegatCode?: string;
    typeDegatLibelle?: string;
    description: string;
    images: ImageData[];
}

interface SinistreDetail {
    id: number;
    numero: string;
    date: string;
    description: string;
    statut: string;
    vehicule: {
        id: number;
        immatriculation: string;
        marque: string;
        modele: string;
    } | null;
    client: {
        id: number;
        nom: string;
        prenom: string;
    } | null;
    degats: DegatData[];
}

export default function SinistreDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [sinistre, setSinistre] = useState<SinistreDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
    const [allImages, setAllImages] = useState<ImageData[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // États pour la gestion des dégâts
    const [showAddDegatModal, setShowAddDegatModal] = useState(false);
    const [newDegat, setNewDegat] = useState({ intitule: '', description: '' });
    const [newDegatFiles, setNewDegatFiles] = useState<File[]>([]);
    const [addingDegat, setAddingDegat] = useState(false);
    const [deletingDegatId, setDeletingDegatId] = useState<number | null>(null);
    const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    
    // Modal pour ajouter des images à un dégât existant
    const [showAddImagesModal, setShowAddImagesModal] = useState(false);
    const [selectedDegatForImages, setSelectedDegatForImages] = useState<DegatData | null>(null);
    const [imagesToAdd, setImagesToAdd] = useState<File[]>([]);
    const [addingImages, setAddingImages] = useState(false);

    // Vérifie si le sinistre est modifiable (statut Ouvert)
    const isModifiable = sinistre?.statut === 'Ouvert';

    const loadSinistreDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await sinistreService.getSinistreDetails(id);
            setSinistre(response.data);
            
            // Collecter toutes les images
            const images: ImageData[] = [];
            response.data.degats?.forEach((degat: DegatData) => {
                degat.images?.forEach((img: ImageData) => {
                    images.push(img);
                });
            });
            setAllImages(images);
        } catch (err) {
            console.error('Erreur lors du chargement des détails:', err);
            setError('Impossible de charger les détails du sinistre.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            loadSinistreDetails();
        }
    }, [id, loadSinistreDetails]);

    const getStatutStyle = (statut: string) => {
        switch (statut) {
            case 'Cloture':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'EnCours':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Ouvert':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatStatut = (statut: string) => {
        switch (statut) {
            case 'Cloture': return 'Clôturé';
            case 'EnCours': return 'En cours';
            case 'Ouvert': return 'Ouvert';
            default: return statut;
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

    const openImageViewer = (image: ImageData) => {
        const index = allImages.findIndex(img => img.id === image.id);
        setCurrentImageIndex(index >= 0 ? index : 0);
        setSelectedImage(image);
    };

    const navigateImage = (direction: 'prev' | 'next') => {
        if (allImages.length === 0) return;
        
        let newIndex: number;
        if (direction === 'prev') {
            newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : allImages.length - 1;
        } else {
            newIndex = currentImageIndex < allImages.length - 1 ? currentImageIndex + 1 : 0;
        }
        setCurrentImageIndex(newIndex);
        setSelectedImage(allImages[newIndex]);
    };

    // Ajouter un dégât avec images
    const handleAddDegat = async () => {
        if (!newDegat.intitule.trim()) {
            setActionError('L\'intitulé du dégât est requis.');
            return;
        }

        try {
            setAddingDegat(true);
            setActionError(null);
            
            // Utiliser l'endpoint avec images si des fichiers sont sélectionnés
            if (newDegatFiles.length > 0) {
                await sinistreService.addDegatWithImages(id, newDegat, newDegatFiles);
            } else {
                await sinistreService.addDegat(id, newDegat);
            }
            
            setNewDegat({ intitule: '', description: '' });
            setNewDegatFiles([]);
            setShowAddDegatModal(false);
            await loadSinistreDetails();
        } catch (err: unknown) {
            console.error('Erreur lors de l\'ajout du dégât:', err);
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'ajout du dégât.';
            setActionError(errorMessage);
        } finally {
            setAddingDegat(false);
        }
    };

    // Ajouter des images à un dégât existant
    const handleAddImagesToDegat = async () => {
        if (!selectedDegatForImages || imagesToAdd.length === 0) {
            return;
        }

        try {
            setAddingImages(true);
            setActionError(null);
            await sinistreService.addImagesToDegat(id, selectedDegatForImages.id, imagesToAdd);
            setImagesToAdd([]);
            setSelectedDegatForImages(null);
            setShowAddImagesModal(false);
            await loadSinistreDetails();
        } catch (err: unknown) {
            console.error('Erreur lors de l\'ajout des images:', err);
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'ajout des images.';
            setActionError(errorMessage);
        } finally {
            setAddingImages(false);
        }
    };

    // Supprimer une image d'un dégât
    const handleRemoveImage = async (degatId: number, imageId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
            return;
        }

        try {
            setDeletingImageId(imageId);
            setActionError(null);
            await sinistreService.removeImageFromDegat(id, degatId, imageId);
            await loadSinistreDetails();
        } catch (err: unknown) {
            console.error('Erreur lors de la suppression de l\'image:', err);
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'image.';
            setActionError(errorMessage);
        } finally {
            setDeletingImageId(null);
        }
    };

    // Ouvrir le modal pour ajouter des images à un dégât
    const openAddImagesModal = (degat: DegatData) => {
        setSelectedDegatForImages(degat);
        setImagesToAdd([]);
        setShowAddImagesModal(true);
    };

    // Gérer la sélection de fichiers pour nouveau dégât
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewDegatFiles(Array.from(e.target.files));
        }
    };

    // Gérer la sélection de fichiers pour ajouter à dégât existant
    const handleAddImagesFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImagesToAdd(Array.from(e.target.files));
        }
    };

    // Supprimer un dégât
    const handleRemoveDegat = async (degatId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce dégât ?')) {
            return;
        }

        try {
            setDeletingDegatId(degatId);
            setActionError(null);
            await sinistreService.removeDegat(id, degatId);
            await loadSinistreDetails();
        } catch (err: unknown) {
            console.error('Erreur lors de la suppression du dégât:', err);
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du dégât.';
            setActionError(errorMessage);
        } finally {
            setDeletingDegatId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des détails...</p>
                </div>
            </div>
        );
    }

    if (error || !sinistre) {
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
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/sinistres')}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Sinistre #{sinistre.id}
                            </h1>
                            <p className="text-gray-500">Détails du sinistre</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatutStyle(sinistre.statut)}`}>
                            {formatStatut(sinistre.statut)}
                        </span>
                        <button
                            disabled={sinistre.statut === 'Cloture'}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                                sinistre.statut === 'Cloture'
                                    ? 'bg-purple-400 text-white cursor-not-allowed opacity-60'
                                    : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                            title={sinistre.statut === 'Cloture' ? 'Sinistre clôturé' : 'Transférer au système garage (bientôt disponible)'}
                        >
                            <Send className="w-4 h-4" />
                            Transférer
                        </button>
                        <Link
                            to={`/sinistre/${id}/modifier`}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Modifier
                        </Link>
                    </div>
                </div>

                {/* Informations principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Infos sinistre */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Informations du sinistre
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Date du sinistre</p>
                                    <p className="font-medium text-gray-800">{formatDate(sinistre.date)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Numéro</p>
                                    <p className="font-medium text-gray-800 font-mono">{sinistre.numero || 'N/A'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Description</p>
                                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                    {sinistre.description || 'Aucune description'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Infos véhicule et client */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Car className="w-5 h-5 text-blue-600" />
                                Véhicule concerné
                            </h2>
                            {sinistre.vehicule ? (
                                <div className="space-y-2">
                                    <p className="text-gray-800 font-medium">
                                        {sinistre.vehicule.marque} {sinistre.vehicule.modele}
                                    </p>
                                    <p className="text-gray-600">
                                        Immatriculation: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{sinistre.vehicule.immatriculation}</span>
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-500">Véhicule non renseigné</p>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Client
                            </h2>
                            {sinistre.client ? (
                                <p className="text-gray-800 font-medium">
                                    {sinistre.client.prenom} {sinistre.client.nom}
                                </p>
                            ) : (
                                <p className="text-gray-500">Client non renseigné</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dégâts */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            Dégâts ({sinistre.degats?.length || 0})
                        </h2>
                        {isModifiable && (
                            <button
                                onClick={() => setShowAddDegatModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Ajouter un dégât
                            </button>
                        )}
                    </div>

                    {actionError && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {actionError}
                        </div>
                    )}

                    {!isModifiable && (
                        <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl text-sm">
                            Les dégâts ne peuvent être modifiés que lorsque le sinistre est au statut "Ouvert".
                        </div>
                    )}
                    
                    {sinistre.degats && sinistre.degats.length > 0 ? (
                        <div className="space-y-6">
                            {sinistre.degats.map((degat, index) => (
                                <div key={degat.id} className="border border-gray-200 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <span className="text-sm text-gray-500">Dégât #{index + 1}</span>
                                            <h3 className="font-medium text-gray-800">{degat.intitule || degat.typeDegatLibelle}</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {degat.typeDegatCode && (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                                    {degat.typeDegatCode}
                                                </span>
                                            )}
                                            {isModifiable && (
                                                <button
                                                    onClick={() => handleRemoveDegat(degat.id)}
                                                    disabled={deletingDegatId === degat.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Supprimer ce dégât"
                                                >
                                                    {deletingDegatId === degat.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {degat.description && (
                                        <p className="text-gray-600 mb-4">{degat.description}</p>
                                    )}
                                    
                                    {/* Images du dégât */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <ImageIcon className="w-4 h-4" />
                                                Photos ({degat.images?.length || 0})
                                            </p>
                                            {isModifiable && (
                                                <button
                                                    onClick={() => openAddImagesModal(degat)}
                                                    className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Upload className="w-3 h-3" />
                                                    Ajouter photos
                                                </button>
                                            )}
                                        </div>
                                        {degat.images && degat.images.length > 0 ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                {degat.images.map((image) => (
                                                    <div 
                                                        key={image.id}
                                                        className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
                                                    >
                                                        <img 
                                                            src={sinistreService.getImageUrl(image.id)}
                                                            alt={image.fileName}
                                                            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                            onClick={() => openImageViewer(image)}
                                                        />
                                                        {isModifiable && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRemoveImage(degat.id, image.id);
                                                                }}
                                                                disabled={deletingImageId === image.id}
                                                                className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-50"
                                                                title="Supprimer cette image"
                                                            >
                                                                {deletingImageId === image.id ? (
                                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                                ) : (
                                                                    <X className="w-3 h-3" />
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                                                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                                Aucune photo
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Aucun dégât enregistré pour ce sinistre</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal visionneuse d'images */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    
                    {allImages.length > 1 && (
                        <>
                            <button 
                                onClick={() => navigateImage('prev')}
                                className="absolute left-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button 
                                onClick={() => navigateImage('next')}
                                className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </>
                    )}
                    
                    <div className="max-w-4xl max-h-[80vh] p-4">
                        <img 
                            src={sinistreService.getImageUrl(selectedImage.id)}
                            alt={selectedImage.fileName}
                            className="max-w-full max-h-[75vh] object-contain rounded-lg"
                        />
                        <p className="text-center text-white mt-4">
                            {selectedImage.fileName}
                            {allImages.length > 1 && (
                                <span className="ml-2 text-gray-400">
                                    ({currentImageIndex + 1} / {allImages.length})
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            )}

            {/* Modal d'ajout de dégât */}
            {showAddDegatModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Ajouter un dégât</h3>
                            <button 
                                onClick={() => {
                                    setShowAddDegatModal(false);
                                    setNewDegat({ intitule: '', description: '' });
                                    setNewDegatFiles([]);
                                    setActionError(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {actionError && (
                            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {actionError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="intitule" className="block text-sm font-medium text-gray-700 mb-1">
                                    Intitulé *
                                </label>
                                <input
                                    type="text"
                                    id="intitule"
                                    value={newDegat.intitule}
                                    onChange={(e) => setNewDegat({ ...newDegat, intitule: e.target.value })}
                                    placeholder="Ex: Pare-chocs avant endommagé"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="descriptionDegat" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="descriptionDegat"
                                    value={newDegat.description}
                                    onChange={(e) => setNewDegat({ ...newDegat, description: e.target.value })}
                                    placeholder="Décrivez le dégât en détail..."
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="degatImages" className="block text-sm font-medium text-gray-700 mb-1">
                                    Photos du dégât
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                                    <input
                                        type="file"
                                        id="degatImages"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <label htmlFor="degatImages" className="cursor-pointer">
                                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">
                                            Cliquez pour sélectionner des images
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            JPG, PNG, WebP, etc.
                                        </p>
                                    </label>
                                </div>
                                {newDegatFiles.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">
                                            {newDegatFiles.length} fichier(s) sélectionné(s)
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {newDegatFiles.map((file, index) => (
                                                <div key={index} className="relative">
                                                    <img 
                                                        src={URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setNewDegatFiles(files => files.filter((_, i) => i !== index))}
                                                        className="absolute -top-1 -right-1 p-0.5 bg-red-600 text-white rounded-full hover:bg-red-700"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowAddDegatModal(false);
                                    setNewDegat({ intitule: '', description: '' });
                                    setNewDegatFiles([]);
                                    setActionError(null);
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleAddDegat}
                                disabled={addingDegat || !newDegat.intitule.trim()}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {addingDegat ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Ajout...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Ajouter
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal d'ajout d'images à un dégât existant */}
            {showAddImagesModal && selectedDegatForImages && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Ajouter des photos à "{selectedDegatForImages.intitule}"
                            </h3>
                            <button 
                                onClick={() => {
                                    setShowAddImagesModal(false);
                                    setSelectedDegatForImages(null);
                                    setImagesToAdd([]);
                                    setActionError(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {actionError && (
                            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {actionError}
                            </div>
                        )}

                        <div>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                                <input
                                    type="file"
                                    id="addImagesInput"
                                    multiple
                                    accept="image/*"
                                    onChange={handleAddImagesFileSelect}
                                    className="hidden"
                                />
                                <label htmlFor="addImagesInput" className="cursor-pointer">
                                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600">
                                        Cliquez pour sélectionner des images
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        JPG, PNG, WebP, etc.
                                    </p>
                                </label>
                            </div>
                            {imagesToAdd.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-600 mb-2">
                                        {imagesToAdd.length} fichier(s) sélectionné(s)
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {imagesToAdd.map((file, index) => (
                                            <div key={index} className="relative">
                                                <img 
                                                    src={URL.createObjectURL(file)}
                                                    alt={file.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setImagesToAdd(files => files.filter((_, i) => i !== index))}
                                                    className="absolute -top-1 -right-1 p-0.5 bg-red-600 text-white rounded-full hover:bg-red-700"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowAddImagesModal(false);
                                    setSelectedDegatForImages(null);
                                    setImagesToAdd([]);
                                    setActionError(null);
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleAddImagesToDegat}
                                disabled={addingImages || imagesToAdd.length === 0}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {addingImages ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Upload...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Ajouter les photos
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
