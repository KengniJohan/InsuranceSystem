package com.iuc.backend.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.iuc.backend.models.enums.StatutDevis;


@Entity
@Table(name = "devis")
public class Devis {

    @Id
    @Column(name = "IDdevis", length = 50)
    private String id;

    @Column(name = "statut", length = 50)
    //private String statut;
    @Enumerated(EnumType.STRING)
    private StatutDevis statut;

    @Column(name = "date_devis")
    private LocalDate dateDevis;

    @Column(name = "montant")
    private Long montant;

    @Column(name = "franchise")
    private Long franchise;

    @ManyToOne
    @JoinColumn(name = "IDsinistre", nullable = false)
    private Sinistre sinistre;

    @OneToMany(mappedBy = "devis", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Reparation> reparations = new ArrayList<>();

    // ----- Constructeurs -----
    public Devis() {}

    public Devis(String id) {
        this.id = id;
    }

    // ----- Getters / Setters -----

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public StatutDevis getStatut() {
        return statut;
    }

    public void setStatutDevis(StatutDevis statut) {
        this.statut = statut;
    }

    public LocalDate getDateDevis() {
        return dateDevis;
    }

    public void setDateDevis(LocalDate dateDevis) {
        this.dateDevis = dateDevis;
    }

    public Long getMontant() {
        return montant;
    }

    public void setMontant(Long montant) {
        this.montant = montant;
    }

    public Long getFranchise() {
        return franchise;
    }

    public void setFranchise(Long franchise) {
        this.franchise = franchise;
    }

    public Sinistre getSinistre() {
        return sinistre;
    }

    public void setSinistre(Sinistre sinistre) {
        this.sinistre = sinistre;
    }

    public List<Reparation> getReparations() {
    return reparations;
}

    public void setReparations(List<Reparation> reparations) {
    this.reparations = reparations;
}

    public void addReparation(Reparation reparation) {
    reparations.add(reparation);
    reparation.setDevis(this);
}

    public void removeReparation(Reparation reparation) {
    reparations.remove(reparation);
    reparation.setDevis(null);
}
}