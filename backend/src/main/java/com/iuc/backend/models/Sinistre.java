package com.iuc.backend.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import com.iuc.backend.models.enums.StatutSinistre;

@Entity
@Data
public class Sinistre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long IDsinistre;

    private String numero_sinistre;
    private LocalDateTime date_sinistre;

    private String description;

    @Enumerated(EnumType.STRING)
    private StatutSinistre statut_sinistre;

    @ManyToOne
    @JoinColumn(name = "IDassure")
    private Client assure;

    @ManyToOne
    @JoinColumn(name = "IDVehicule")
    private Vehicule vehicule;

    @OneToMany(mappedBy = "sinistre")
    private List<Degat> degats;

	public Long getIDsinistre() {
		return IDsinistre;
	}

	public void setIDsinistre(Long iDsinistre) {
		IDsinistre = iDsinistre;
	}

	public String getNumero_sinistre() {
		return numero_sinistre;
	}

	public void setNumero_sinistre(String numero_sinistre) {
		this.numero_sinistre = numero_sinistre;
	}

	public LocalDateTime getDate_sinistre() {
		return date_sinistre;
	}

	public void setDate_sinistre(LocalDateTime date_sinistre) {
		this.date_sinistre = date_sinistre;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public StatutSinistre getStatut_sinistre() {
		return statut_sinistre;
	}

	public void setStatut_sinistre(StatutSinistre statut_sinistre) {
		this.statut_sinistre = statut_sinistre;
	}

	public Client getAssure() {
		return assure;
	}

	public void setAssure(Client assure) {
		this.assure = assure;
	}

	public Vehicule getVehicule() {
		return vehicule;
	}

	public void setVehicule(Vehicule vehicule) {
		this.vehicule = vehicule;
	}

	public List<Degat> getDegats() {
		return degats;
	}

	public void setDegats(List<Degat> degats) {
		this.degats = degats;
	}
    
    

    
}
