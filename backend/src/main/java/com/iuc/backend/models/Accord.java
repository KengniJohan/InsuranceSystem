package com.iuc.backend.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.iuc.backend.models.enums.StatutAccord;

@Entity
@Table(name = "accord")
public class Accord {

    @Id
    @Column(name = "IDaccord", length = 50)
    private String id;

    @Column(name = "numero_accord")
    private String numeroAccord;

    @Column(name = "date_emission")
    private LocalDate dateEmission;

    @Column(name = "statut")
    @Enumerated(EnumType.STRING)
    private StatutAccord statut;
    

    @Column(name = "montant_valide")
    private Long montantValide;

    @Column(columnDefinition = "TEXT")
    private String conditions;

    @Column(name = "franchise")
    private Long franchise;

    @Column(name = "prise_en_charge")
    private Long priseEnCharge;

    @ManyToOne
    @JoinColumn(name = "IDdevis", nullable = false)
    private Devis devis;

    // --- Constructeurs ---
    public Accord() {}

    public Accord(String id) {
        this.id = id;
    }

    // --- Getters / Setters ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNumeroAccord() { return numeroAccord; }
    public void setNumeroAccord(String numeroAccord) { this.numeroAccord = numeroAccord; }

    public LocalDate getDateEmission() { return dateEmission; }
    public void setDateEmission(LocalDate dateEmission) { this.dateEmission = dateEmission; }

    public StatutAccord getStatut() { return statut; }
    public void setStatutAccord(StatutAccord statut) { this.statut = statut; }

    public Long getMontantValide() { return montantValide; }
    public void setMontantValide(Long montantValide) { this.montantValide = montantValide; }

    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }

    public Long getFranchise() { return franchise; }
    public void setFranchise(Long franchise) { this.franchise = franchise; }

    public Long getPriseEnCharge() { return priseEnCharge; }
    public void setPriseEnCharge(Long priseEnCharge) { this.priseEnCharge = priseEnCharge; }

    public Devis getDevis() { return devis; }
    public void setDevis(Devis devis) { this.devis = devis; }
}
