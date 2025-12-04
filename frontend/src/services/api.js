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

export default api;