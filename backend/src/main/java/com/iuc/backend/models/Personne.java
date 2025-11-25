package com.iuc.backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Personne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long IDpersonne;

    private String nom;
    private String prenom;
    private String telephone;
    private String email;
    private String adresse;

    @OneToOne(mappedBy = "personne")
    private Client client;

	public Long getIDpersonne() {
		return IDpersonne;
	}

	public void setIDpersonne(Long iDpersonne) {
		IDpersonne = iDpersonne;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getPrenom() {
		return prenom;
	}

	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAdresse() {
		return adresse;
	}

	public void setAdresse(String adresse) {
		this.adresse = adresse;
	}

	public Client getClient() {
		return client;
	}

	public void setClient(Client client) {
		this.client = client;
	}
    
}
