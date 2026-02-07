package com.iuc.backend.models.dto;

import java.time.LocalDate;
import java.util.List;

public class DevisDTO {
    private String id;
    private String statut;
    private LocalDate dateDevis;
    private Long montant;
    private Long franchise;
    private SinistreSummaryDTO sinistre;
    private List<ReparationDTO> reparations;

    // Constructeurs
    public DevisDTO() {}

    // Getters et Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public LocalDate getDateDevis() { return dateDevis; }
    public void setDateDevis(LocalDate dateDevis) { this.dateDevis = dateDevis; }

    public Long getMontant() { return montant; }
    public void setMontant(Long montant) { this.montant = montant; }

    public Long getFranchise() { return franchise; }
    public void setFranchise(Long franchise) { this.franchise = franchise; }

    public SinistreSummaryDTO getSinistre() { return sinistre; }
    public void setSinistre(SinistreSummaryDTO sinistre) { this.sinistre = sinistre; }

    public List<ReparationDTO> getReparations() { return reparations; }
    public void setReparations(List<ReparationDTO> reparations) { this.reparations = reparations; }

    // DTO imbriqué pour sinistre
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

    // DTO pour réparation
    public static class ReparationDTO {
        private String id;
        private String nom;
        private String categorie;
        private Long prix;
        private Boolean selected;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getNom() { return nom; }
        public void setNom(String nom) { this.nom = nom; }

        public String getCategorie() { return categorie; }
        public void setCategorie(String categorie) { this.categorie = categorie; }

        public Long getPrix() { return prix; }
        public void setPrix(Long prix) { this.prix = prix; }

        public Boolean getSelected() { return selected; }
        public void setSelected(Boolean selected) { this.selected = selected; }
    }
}
