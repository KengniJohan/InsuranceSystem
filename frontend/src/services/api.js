// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Services pour les devis
export const devisService = {
  // Récupérer tous les devis
  getAllDevis: () => api.get('/devis'),
  
  // Récupérer un devis par ID
  getDevisById: (id) => api.get(`/devis/${id}`),
  
  // Mettre à jour un devis
  updateDevis: (id, devisData) => api.put(`/devis/${id}`, devisData),
  
  // Créer un devis
  createDevis: (devisData) => api.post('/devis', devisData),
  
  // Supprimer un devis
  deleteDevis: (id) => api.delete(`/devis/${id}`),
};

// Services pour les accords
export const accordService = {
  // Récupérer tous les accords
  getAllAccords: () => api.get('/accords'),
  
  // Récupérer un accord par ID
  getAccordById: (id) => api.get(`/accords/${id}`),
  
  // Créer un accord
  createAccord: (accordData) => api.post('/accords', accordData),
  
  // Mettre à jour un accord
  updateAccord: (id, accordData) => api.put(`/accords/${id}`, accordData),
  
  // Supprimer un accord
  deleteAccord: (id) => api.delete(`/accords/${id}`),
};

// Services pour les sinistres
export const sinistreService = {
  // Récupérer tous les sinistres
  getAllSinistres: () => api.get('/sinistres'),
  
  // Récupérer un sinistre par ID
  getSinistreById: (id) => api.get(`/sinistres/${id}`),
  
  // Récupérer les détails complets d'un sinistre (avec dégâts et images)
  getSinistreDetails: (id) => api.get(`/sinistres/${id}/details`),
  
  // Mettre à jour un sinistre
  updateSinistre: (id, data) => api.put(`/sinistres/${id}`, data),
  
  // Créer un sinistre (via FormData pour les images)
  createSinistre: (formData) => api.post('/sinistres', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Ajouter un dégât à un sinistre (sans images)
  addDegat: (sinistreId, degat) => api.post(`/sinistres/${sinistreId}/degats`, degat),
  
  // Ajouter un dégât avec images à un sinistre
  addDegatWithImages: (sinistreId, degat, files) => {
    const formData = new FormData();
    formData.append('degat', new Blob([JSON.stringify(degat)], { type: 'application/json' }));
    if (files && files.length > 0) {
      files.forEach(file => formData.append('files', file));
    }
    return api.post(`/sinistres/${sinistreId}/degats/with-images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Ajouter des images à un dégât existant
  addImagesToDegat: (sinistreId, degatId, files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return api.post(`/sinistres/${sinistreId}/degats/${degatId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Supprimer une image d'un dégât
  removeImageFromDegat: (sinistreId, degatId, imageId) => 
    api.delete(`/sinistres/${sinistreId}/degats/${degatId}/images/${imageId}`),
  
  // Supprimer un dégât d'un sinistre (uniquement si statut OUVERT)
  removeDegat: (sinistreId, degatId) => api.delete(`/sinistres/${sinistreId}/degats/${degatId}`),
  
  // URL pour récupérer une image
  getImageUrl: (imageId) => `${API_BASE_URL}/sinistres/images/${imageId}`,
};

// Services pour les véhicules
export const vehiculeService = {
  // Récupérer les véhicules avec infos propriétaire
  getVehiculesJoin: () => api.get('/vehicule/join'),
};

// Services pour les statistiques
export const statsService = {
  // Récupérer les statistiques globales
  getStats: () => api.get('/stats'),
};

export default api;
