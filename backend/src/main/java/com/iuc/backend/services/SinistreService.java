package com.iuc.backend.services;

import com.iuc.backend.models.*;
import com.iuc.backend.models.dto.*;
import com.iuc.backend.models.enums.StatutSinistre;
import com.iuc.backend.repositories.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class SinistreService {

	private final SinistreRepository repo;

	SinistreService(SinistreRepository repo) {
		this.repo = repo;
	}

	public List<SinistreDTO> listAll() {
		return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
	}

	public Optional<SinistreDTO> findById(Long id) {
		return repo.findById(id).map(this::toDTO);
	}

	public Optional<SinistreDetailDTO> findDetailById(Long id) {
		return repo.findById(id).map(this::toDetailDTO);
	}

	public Optional<Sinistre> findEntityById(Long id) {
		return repo.findById(id);
	}

	public Sinistre addSinistre(Sinistre si){
		return this.repo.save(si);
	}

	public Sinistre updateSinistre(Sinistre si){
		return this.repo.save(si);
	}

	public Optional<SinistreDetailDTO> updateSinistrePartial(Long id, SinistreUpdateDTO updateDTO) {
		return repo.findById(id).map(sinistre -> {
			if (updateDTO.description != null) {
				sinistre.setDescription(updateDTO.description);
			}
			if (updateDTO.statut != null) {
				try {
					sinistre.setStatut_sinistre(StatutSinistre.valueOf(updateDTO.statut));
				} catch (IllegalArgumentException e) {
					// Ignorer si statut invalide
				}
			}
			repo.save(sinistre);
			return toDetailDTO(sinistre);
		});
	}

	/**
	 * Vérifie si un sinistre est modifiable (statut OUVERT uniquement)
	 */
	public boolean isSinistreModifiable(Long sinistreId) {
		return repo.findById(sinistreId)
				.map(s -> s.getStatut_sinistre() == StatutSinistre.Ouvert)
				.orElse(false);
	}

	/**
	 * Ajoute un dégât à un sinistre (uniquement si statut OUVERT)
	 */
	@Transactional
	public Optional<DegatDTO> addDegatToSinistre(Long sinistreId, DegatCreateDTO degatDTO) {
		return addDegatToSinistreWithImages(sinistreId, degatDTO, null);
	}

	/**
	 * Ajoute un dégât avec images à un sinistre (uniquement si statut OUVERT)
	 */
	@Transactional
	public Optional<DegatDTO> addDegatToSinistreWithImages(Long sinistreId, DegatCreateDTO degatDTO, List<MultipartFile> files) {
		return repo.findById(sinistreId).flatMap(sinistre -> {
			// Vérifier que le sinistre est au statut OUVERT
			if (sinistre.getStatut_sinistre() != StatutSinistre.Ouvert) {
				return Optional.empty();
			}

			Degat degat = new Degat();
			degat.setIntitule(degatDTO.intitule);
			degat.setDescription(degatDTO.description);
			degat.setSinistre(sinistre);

			// Ajouter les images si présentes
			if (files != null && !files.isEmpty()) {
				List<Image> images = new ArrayList<>();
				for (MultipartFile file : files) {
					try {
						Image img = new Image();
						img.setDegat(degat);
						img.setFileName(file.getOriginalFilename());
						img.setContentType(file.getContentType());
						img.setData(file.getBytes());
						images.add(img);
					} catch (IOException e) {
						// Log error but continue
					}
				}
				degat.setPhotos_degats(images);
			}

			if (sinistre.getDegats() == null) {
				sinistre.setDegats(new ArrayList<>());
			}
			sinistre.getDegats().add(degat);
			repo.save(sinistre);

			// Retourner le DTO du dégât créé
			return Optional.of(toDegatDTO(degat));
		});
	}

	/**
	 * Ajoute des images à un dégât existant (uniquement si sinistre OUVERT)
	 */
	@Transactional
	public Optional<DegatDTO> addImagesToDegat(Long sinistreId, Long degatId, List<MultipartFile> files) {
		return repo.findById(sinistreId).flatMap(sinistre -> {
			if (sinistre.getStatut_sinistre() != StatutSinistre.Ouvert) {
				return Optional.empty();
			}

			if (sinistre.getDegats() == null) {
				return Optional.empty();
			}

			Optional<Degat> degatOpt = sinistre.getDegats().stream()
					.filter(d -> d.getIDdegat().equals(degatId))
					.findFirst();

			if (degatOpt.isEmpty()) {
				return Optional.empty();
			}

			Degat degat = degatOpt.get();
			if (degat.getPhotos_degats() == null) {
				degat.setPhotos_degats(new ArrayList<>());
			}

			for (MultipartFile file : files) {
				try {
					Image img = new Image();
					img.setDegat(degat);
					img.setFileName(file.getOriginalFilename());
					img.setContentType(file.getContentType());
					img.setData(file.getBytes());
					degat.getPhotos_degats().add(img);
				} catch (IOException e) {
					// Log error but continue
				}
			}

			repo.save(sinistre);
			return Optional.of(toDegatDTO(degat));
		});
	}

	/**
	 * Supprime une image d'un dégât (uniquement si sinistre OUVERT)
	 */
	@Transactional
	public boolean removeImageFromDegat(Long sinistreId, Long degatId, Long imageId) {
		Optional<Sinistre> sinistreOpt = repo.findById(sinistreId);
		if (sinistreOpt.isEmpty()) {
			return false;
		}

		Sinistre sinistre = sinistreOpt.get();
		if (sinistre.getStatut_sinistre() != StatutSinistre.Ouvert) {
			return false;
		}

		if (sinistre.getDegats() == null) {
			return false;
		}

		Optional<Degat> degatOpt = sinistre.getDegats().stream()
				.filter(d -> d.getIDdegat().equals(degatId))
				.findFirst();

		if (degatOpt.isEmpty() || degatOpt.get().getPhotos_degats() == null) {
			return false;
		}

		Degat degat = degatOpt.get();
		boolean removed = degat.getPhotos_degats().removeIf(img -> img.getId().equals(imageId));
		if (removed) {
			repo.save(sinistre);
		}
		return removed;
	}

	private DegatDTO toDegatDTO(Degat degat) {
		DegatDTO dto = new DegatDTO();
		dto.id = degat.getIDdegat();
		dto.intitule = degat.getIntitule();
		dto.description = degat.getDescription();
		dto.images = new ArrayList<>();
		if (degat.getPhotos_degats() != null) {
			for (Image img : degat.getPhotos_degats()) {
				ImageDTO imgDTO = new ImageDTO();
				imgDTO.id = img.getId();
				imgDTO.fileName = img.getFileName();
				imgDTO.contentType = img.getContentType();
				imgDTO.url = "/sinistres/images/" + img.getId();
				dto.images.add(imgDTO);
			}
		}
		return dto;
	}

	/**
	 * Supprime un dégât d'un sinistre (uniquement si statut OUVERT)
	 */
	@Transactional
	public boolean removeDegatFromSinistre(Long sinistreId, Long degatId) {
		Optional<Sinistre> sinistreOpt = repo.findById(sinistreId);
		if (sinistreOpt.isEmpty()) {
			return false;
		}

		Sinistre sinistre = sinistreOpt.get();

		// Vérifier que le sinistre est au statut OUVERT
		if (sinistre.getStatut_sinistre() != StatutSinistre.Ouvert) {
			return false;
		}

		// Chercher et supprimer le dégât
		if (sinistre.getDegats() != null) {
			boolean removed = sinistre.getDegats().removeIf(d -> d.getIDdegat().equals(degatId));
			if (removed) {
				repo.save(sinistre);
				return true;
			}
		}
		return false;
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

	private SinistreDetailDTO toDetailDTO(Sinistre s) {
		SinistreDetailDTO dto = new SinistreDetailDTO();
		dto.id = s.getIDsinistre();
		dto.numero = s.getNumero_sinistre();
		dto.date = s.getDate_sinistre() != null ? s.getDate_sinistre().toString() : null;
		dto.statut = s.getStatut_sinistre().name();
		dto.description = s.getDescription();

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
			v.modele = s.getVehicule().getModele();
			dto.vehicule = v;
		}

		// Dégâts
		dto.degats = new ArrayList<>();
		if (s.getDegats() != null) {
			for (Degat degat : s.getDegats()) {
				DegatDTO degatDTO = new DegatDTO();
				degatDTO.id = degat.getIDdegat();
				degatDTO.intitule = degat.getIntitule();
				degatDTO.description = degat.getDescription();
				degatDTO.images = new ArrayList<>();

				if (degat.getPhotos_degats() != null) {
					for (Image img : degat.getPhotos_degats()) {
						ImageDTO imgDTO = new ImageDTO();
						imgDTO.id = img.getId();
						imgDTO.fileName = img.getFileName();
						imgDTO.contentType = img.getContentType();
						imgDTO.url = "/sinistres/images/" + img.getId();
						degatDTO.images.add(imgDTO);
					}
				}
				dto.degats.add(degatDTO);
			}
		}

		return dto;
	}

	// Compter par statut
	public long countByStatut(StatutSinistre statut) {
		return repo.findAll().stream()
			.filter(s -> s.getStatut_sinistre() == statut)
			.count();
	}

	public long countTotal() {
		return repo.count();
	}
}
