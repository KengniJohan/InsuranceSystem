package com.iuc.backend.projetDevis.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Reparation")
public class Reparation {
    private String id;
    private String name;
    private String category;
    private long price;
    private boolean selected;

    // getters et setters
}
