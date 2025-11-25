// Configuration des statuts
export const STATUS = {
  pending: { label: 'En attente', color: '#FDE047', bg: '#FEF9C3' },
  approved: { label: 'Approuvé', color: '#22C55E', bg: '#D1FAE5' },
  rejected: { label: 'Refusé', color: '#e52121ff', bg: '#f610105d' },
};

export const AGREEMENT_STATUS = {
  Accepter: { label: 'Accepté', color: '#22C55E', bg: '#D1FAE5' },
  Refuser: { label: 'Refusé', color: '#EF4444', bg: '#FEE2E2' },
};

// Fonction utilitaire pour générer un numéro d'accord
export const generateNumeroAccord = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `AGRE-${year}${month}${day}-${random}`;
};

// Fonction utilitaire pour formater la date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR');
};

// Fonction pour formater les montants en FCFA
export const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
};