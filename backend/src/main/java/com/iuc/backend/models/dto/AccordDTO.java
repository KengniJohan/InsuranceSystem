package com.iuc.backend.models.dto;

import java.time.LocalDate;

public class AccordDTO {
    private String id;
    private String numeroAccord;
    private LocalDate dateEmission;
    private String statut;
    private Long montantValide;
    private String conditions;
    private Long franchise;
    private Long priseEnCharge;
    private DevisSummaryDTO devis;

    // Constructeurs
    public AccordDTO() {}

    // Getters et Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNumeroAccord() { return numeroAccord; }
    public void setNumeroAccord(String numeroAccord) { this.numeroAccord = numeroAccord; }

    public LocalDate getDateEmission() { return dateEmission; }
    public void setDateEmission(LocalDate dateEmission) { this.dateEmission = dateEmission; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public Long getMontantValide() { return montantValide; }
    public void setMontantValide(Long montantValide) { this.montantValide = montantValide; }

    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }

    public Long getFranchise() { return franchise; }
    public void setFranchise(Long franchise) { this.franchise = franchise; }

    public Long getPriseEnCharge() { return priseEnCharge; }
    public void setPriseEnCharge(Long priseEnCharge) { this.priseEnCharge = priseEnCharge; }

    public DevisSummaryDTO getDevis() { return devis; }
    public void setDevis(DevisSummaryDTO devis) { this.devis = devis; }

    // DTO imbriqué pour devis
    public static class DevisSummaryDTO {
        private String id;
        private Long montant;
        private SinistreSummaryDTO sinistre;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public Long getMontant() { return montant; }
        public void setMontant(Long montant) { this.montant = montant; }

        public SinistreSummaryDTO getSinistre() { return sinistre; }
        public void setSinistre(SinistreSummaryDTO sinistre) { this.sinistre = sinistre; }
    }

    // DTO pour le sinistre dans l'accord
    public static class SinistreSummaryDTO {
        private Long id;
        private String numero;
        private ClientSummaryDTO client;
        private VehiculeSummaryDTO vehicule;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getNumero() { return numero; }
        public void setNumero(String numero) { this.numero = numero; }

        public ClientSummaryDTO getClient() { return client; }
        public void setClient(ClientSummaryDTO client) { this.client = client; }

        public VehiculeSummaryDTO getVehicule() { return vehicule; }
        public void setVehicule(VehiculeSummaryDTO vehicule) { this.vehicule = vehicule; }
    }

    // DTO pour client
    public static class ClientSummaryDTO {
        private Long id;
        private String nom;
        private String prenom;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getNom() { return nom; }
        public void setNom(String nom) { this.nom = nom; }

        public String getPrenom() { return prenom; }
        public void setPrenom(String prenom) { this.prenom = prenom; }
    }

    // DTO pour véhicule
    public static class VehiculeSummaryDTO {
        private Long id;
        private String marque;
        private String modele;
        private String immatriculation;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getMarque() { return marque; }
        public void setMarque(String marque) { this.marque = marque; }

        public String getModele() { return modele; }
        public void setModele(String modele) { this.modele = modele; }

        public String getImmatriculation() { return immatriculation; }
        public void setImmatriculation(String immatriculation) { this.immatriculation = immatriculation; }
    }
}
