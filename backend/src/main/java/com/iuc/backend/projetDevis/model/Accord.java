package com.iuc.backend.projetDevis.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Accord")
public class Accord {
    private String id;
    private String devisId;
    private long montantValide;
    private String conditions;
    private String numeroAccord;
    private String dateEmission;
    private String statut;
    private String vehicule;
    private String client;
    private String garage;
    private long franchise;
    private long priseEnCharge;
    private String referenceSinistre;
}
