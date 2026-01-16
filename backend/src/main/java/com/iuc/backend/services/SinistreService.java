package com.iuc.backend.services;

import com.iuc.backend.models.*;
import com.iuc.backend.models.dto.*;
import com.iuc.backend.repositories.*;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SinistreService {

	private final SinistreRepository repo;

	SinistreService(SinistreRepository repo) {
		this.repo = repo;
	}

	public List<SinistreDTO> listAll() {
		return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
	}

	public Sinistre addSinistre(Sinistre si){
		return this.repo.save(si);
	}

	public Sinistre updateSinistre(Sinistre si){
		return this.repo.save(si);
	}

	private SinistreDTO toDTO(Sinistre s) {
		SinistreDTO dto = new SinistreDTO();
		dto.id = s.getIDsinistre();
		dto.numero = s.getNumero_sinistre();
		dto.date = s.getDate_sinistre() != null ? s.getDate_sinistre().toString() : null;
		dto.statut = s.getStatut_sinistre().name();

// Client summary
		if (s.getAssure() != null && s.getAssure().getPersonne() != null) {
			ClientSummaryDTO c = new ClientSummaryDTO();
			c.id = s.getAssure().getIDclient();
			c.nom = s.getAssure().getPersonne().getNom();
			c.prenom = s.getAssure().getPersonne().getPrenom();
			dto.client = c;
		}

// Vehicule summary
		if (s.getVehicule() != null) {
			VehiculeSummaryDTO v = new VehiculeSummaryDTO();
			v.id = s.getVehicule().getIDVehicule();
			v.marque = s.getVehicule().getMarque();
			v.immatriculation = s.getVehicule().getImmatriculation();
			dto.vehicule = v;
		}

		return dto;
	}
}
