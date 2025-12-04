package com.iuc.backend.models;


import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "reparation")
public class Reparation {

    @Id
    @Column(name = "IDreparation", length = 50)
    private String idReparation;

    @Column(name = "nom", length = 255)
    private String nom;

    @Column(name = "categorie", length = 255)
    private String categorie;

    @Column(name = "prix")
    private Long prix;

    @Column(name = "selected")
    private Boolean selected;

    @ManyToOne
@JoinColumn(name = "IDdevis", referencedColumnName = "IDdevis")
@JsonBackReference
    private Devis devis;

    // ---- Constructeurs ----
    public Reparation() {}

    public Reparation(String idReparation, String nom, String categorie, Long prix, Boolean selected, Devis devis) {
        this.idReparation = idReparation;
        this.nom = nom;
        this.categorie = categorie;
        this.prix = prix;
        this.selected = selected;
        this.devis = devis;
    }

    // ---- Getters & Setters ----
    public String getIdReparation() {
        return idReparation;
    }

    public void setIdReparation(String idReparation) {
        this.idReparation = idReparation;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public Long getPrix() {
        return prix;
    }

    public void setPrix(Long prix) {
        this.prix = prix;
    }

    public Boolean getSelected() {
        return selected;
    }

    public void setSelected(Boolean selected) {
        this.selected = selected;
    }

    public Devis getDevis() {
        return devis;
    }

    public void setDevis(Devis devis) {
        this.devis = devis;
    }
}

