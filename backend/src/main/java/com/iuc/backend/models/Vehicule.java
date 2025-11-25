package com.iuc.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Vehicule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long IDVehicule;

    @ManyToOne
    @JoinColumn(name = "IDclient")
    private Client client;

    private String marque;
    private String immatriculation;
    private String modele;
    private String numChassis;
    private LocalDate anneeVehicule;
    
	public Long getIDVehicule() {
		return IDVehicule;
	}
	public void setIDVehicule(Long iDVehicule) {
		IDVehicule = iDVehicule;
	}
	public Client getClient() {
		return client;
	}
	public void setClient(Client client) {
		this.client = client;
	}
	public String getMarque() {
		return marque;
	}
	public void setMarque(String marque) {
		this.marque = marque;
	}
	public String getImmatriculation() {
		return immatriculation;
	}
	public void setImmatriculation(String immatriculation) {
		this.immatriculation = immatriculation;
	}
	public String getModele() {
		return modele;
	}
	public void setModele(String modele) {
		this.modele = modele;
	}
	public String getNumChassis() {
		return numChassis;
	}
	public void setNumChassis(String numChassis) {
		this.numChassis = numChassis;
	}
	public LocalDate getAnneeVehicule() {
		return anneeVehicule;
	}
	public void setAnneeVehicule(LocalDate anneeVehicule) {
		this.anneeVehicule = anneeVehicule;
	}
    
}