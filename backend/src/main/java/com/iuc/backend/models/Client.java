package com.iuc.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long IDclient;

    @OneToOne
    @JoinColumn(name = "IDpersonne")
    private Personne personne;

    @OneToMany(mappedBy = "client")
	@JsonIgnore
    private List<Vehicule> vehicules;

    @OneToMany(mappedBy = "assure")
	@JsonIgnore
    private List<Sinistre> sinistres;

	public Long getIDclient() {
		return IDclient;
	}

	public void setIDclient(Long iDclient) {
		IDclient = iDclient;
	}

	public Personne getPersonne() {
		return personne;
	}

	public void setPersonne(Personne personne) {
		this.personne = personne;
	}

	public List<Vehicule> getVehicules() {
		return vehicules;
	}

	public void setVehicules(List<Vehicule> vehicules) {
		this.vehicules = vehicules;
	}

	public List<Sinistre> getSinistres() {
		return sinistres;
	}

	public void setSinistres(List<Sinistre> sinistres) {
		this.sinistres = sinistres;
	}
    
}