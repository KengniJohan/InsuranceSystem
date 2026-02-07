package com.iuc.backend.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.iuc.backend.models.Client;
import com.iuc.backend.models.Degat;
import com.iuc.backend.models.Image;
import com.iuc.backend.models.Sinistre;
import com.iuc.backend.models.Vehicule;
import com.iuc.backend.models.dto.SinistreDTO;
import com.iuc.backend.models.dto.SinistreDetailDTO;
import com.iuc.backend.models.dto.SinistreRespone;
import com.iuc.backend.models.dto.SinistreUpdateDTO;
import com.iuc.backend.models.dto.DegatCreateDTO;
import com.iuc.backend.models.enums.StatutSinistre;
import com.iuc.backend.repositories.ImageRepository;
import com.iuc.backend.services.SinistreService;
import com.iuc.backend.services.VehiculeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.*;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/sinistres")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@SuppressWarnings("null")
public class SinistreController {

	private final SinistreService service;
	private final VehiculeService vehiculeService;
	private final ImageRepository imageRepository;


	@PostMapping
    public ResponseEntity<?> saveSinistre(
            @RequestPart("sinistre") SinistreRespone sinistreRespone,
            @RequestPart("files") List<MultipartFile> files
    ) throws IOException {


		String vehicule_id = sinistreRespone.getId_vehicule();
		Vehicule vehiculeTemp = vehiculeService.getVehiculeWithMaricule(vehicule_id);
        long timestamp = Long.parseLong(sinistreRespone.getDate_sinistre());
		LocalDateTime dateTime = Instant.ofEpochMilli(timestamp).atZone(ZoneId.systemDefault()).toLocalDateTime();
		Client clienTemp = vehiculeTemp.getClient();


        Sinistre sinistre = new Sinistre();
        sinistre.setDescription(sinistreRespone.getDescription());
        sinistre.setDate_sinistre(dateTime);
		sinistre.setVehicule(vehiculeTemp);
        sinistre.setAssure(clienTemp);
		sinistre.setStatut_sinistre(StatutSinistre.Ouvert);
		
        List<Degat> degats = new ArrayList<>();
        int fileIndex = 0;

      
        for (Degat d : sinistreRespone.getDegats()) {

            Degat degat = new Degat();
            degat.setIntitule(d.getIntitule());
            degat.setDescription(d.getDescription());
            degat.setSinistre(sinistre);

            List<Image> images = new ArrayList<>();

           
            for (int i = 0; i < d.getPhotos_degats().size(); i++) {

                MultipartFile file = files.get(fileIndex);
				String filename = file.getOriginalFilename();
				String extension = findContentType(filename);

                Image img = new Image();
                img.setDegat(degat);
                img.setData(file.getBytes());
				img.setFileName(filename);
				img.setContentType(extension);
                images.add(img);
				fileIndex++;
            }

			
            degat.setPhotos_degats(images);

            degats.add(degat);
        }

		//degatService.addDegats(degats);
        sinistre.setDegats(degats);


        

		Random random = new Random();
        int nombreAleatoire = random.nextInt(1001);
		String number = String.format("%04d", nombreAleatoire);
		Date date = new Date();
		ZonedDateTime zone = date.toInstant().atZone(ZoneId.systemDefault());
		int annee = zone.getYear();

		String numeroSIN = "SIN-" + annee + "-" + number;
		sinistre.setNumero_sinistre(numeroSIN);

		//Sinistre sinistreWithNumber = service.updateSinistre(sinistre);
		
		Sinistre si = service.addSinistre(sinistre);
        return ResponseEntity.ok(si.getNumero_sinistre());
    }


	public String findContentType(String filename){
		String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();

		Map<String, String> contentType = new java.util.HashMap<>();
		// Formats courants
		contentType.put("jpg", "image/jpeg");
		contentType.put("jpeg", "image/jpeg");
		contentType.put("png", "image/png");
		contentType.put("gif", "image/gif");
		contentType.put("webp", "image/webp");
		// Formats additionnels
		contentType.put("bmp", "image/bmp");
		contentType.put("svg", "image/svg+xml");
		contentType.put("ico", "image/x-icon");
		contentType.put("tiff", "image/tiff");
		contentType.put("tif", "image/tiff");
		contentType.put("heic", "image/heic");
		contentType.put("heif", "image/heif");
		contentType.put("avif", "image/avif");
		contentType.put("jfif", "image/jpeg");
		contentType.put("pjpeg", "image/jpeg");
		contentType.put("pjp", "image/jpeg");
		
		return contentType.getOrDefault(extension, "application/octet-stream");
	}

	@Operation(summary = "Lister tous les sinistres", description = "Retourne la liste de tous les sinistres avec informations résumées des entités liées.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès"),
			@ApiResponse(responseCode = "500", description = "Erreur interne du serveur") })
	@GetMapping
	public List<SinistreDTO> getAllSinistres() {
		return service.listAll();
	}

	@Operation(summary = "Récupérer un sinistre par ID", description = "Retourne les détails d'un sinistre spécifique.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Sinistre trouvé"),
			@ApiResponse(responseCode = "404", description = "Sinistre non trouvé") })
	@GetMapping("/{id}")
	public ResponseEntity<SinistreDTO> getSinistreById(@PathVariable Long id) {
		return service.findById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@Operation(summary = "Récupérer les détails complets d'un sinistre", description = "Retourne le sinistre avec ses dégâts et images.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Sinistre trouvé"),
			@ApiResponse(responseCode = "404", description = "Sinistre non trouvé") })
	@GetMapping("/{id}/details")
	public ResponseEntity<SinistreDetailDTO> getSinistreDetails(@PathVariable Long id) {
		return service.findDetailById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@Operation(summary = "Modifier un sinistre", description = "Met à jour la description et/ou le statut d'un sinistre.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Sinistre mis à jour"),
			@ApiResponse(responseCode = "404", description = "Sinistre non trouvé") })
	@PutMapping("/{id}")
	public ResponseEntity<SinistreDetailDTO> updateSinistre(@PathVariable Long id, @RequestBody SinistreUpdateDTO updateDTO) {
		return service.updateSinistrePartial(id, updateDTO)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@Operation(summary = "Récupérer une image", description = "Retourne le contenu binaire d'une image de dégât.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Image trouvée"),
			@ApiResponse(responseCode = "404", description = "Image non trouvée") })
	@GetMapping("/images/{imageId}")
	public ResponseEntity<byte[]> getImage(@PathVariable Long imageId) {
		Optional<Image> imageOpt = imageRepository.findById(imageId);
		if (imageOpt.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		Image image = imageOpt.get();
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + image.getFileName() + "\"")
				.contentType(MediaType.parseMediaType(image.getContentType() != null ? image.getContentType() : "application/octet-stream"))
				.body(image.getData());
	}

	@Operation(summary = "Ajouter un dégât à un sinistre", description = "Ajoute un nouveau dégât à un sinistre existant. Uniquement possible si le sinistre est au statut OUVERT.")
	@ApiResponses({ 
		@ApiResponse(responseCode = "200", description = "Dégât ajouté avec succès"),
		@ApiResponse(responseCode = "400", description = "Sinistre non modifiable (statut différent de OUVERT)"),
		@ApiResponse(responseCode = "404", description = "Sinistre non trouvé") 
	})
	@PostMapping("/{id}/degats")
	public ResponseEntity<?> addDegat(@PathVariable Long id, @RequestBody DegatCreateDTO degatDTO) {
		// Vérifier si le sinistre existe et est modifiable
		if (!service.isSinistreModifiable(id)) {
			Optional<Sinistre> sinistre = service.findEntityById(id);
			if (sinistre.isEmpty()) {
				return ResponseEntity.notFound().build();
			}
			return ResponseEntity.badRequest()
					.body(Map.of("error", "Le sinistre doit être au statut OUVERT pour ajouter des dégâts."));
		}

		return service.addDegatToSinistre(id, degatDTO)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.badRequest().build());
	}

	@Operation(summary = "Ajouter un dégât avec images", description = "Ajoute un nouveau dégât avec ses images à un sinistre. Uniquement possible si le sinistre est au statut OUVERT.")
	@ApiResponses({ 
		@ApiResponse(responseCode = "200", description = "Dégât ajouté avec succès"),
		@ApiResponse(responseCode = "400", description = "Sinistre non modifiable"),
		@ApiResponse(responseCode = "404", description = "Sinistre non trouvé") 
	})
	@PostMapping(value = "/{id}/degats/with-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> addDegatWithImages(
			@PathVariable Long id,
			@RequestPart("degat") DegatCreateDTO degatDTO,
			@RequestPart(value = "files", required = false) List<MultipartFile> files) {
		
		if (!service.isSinistreModifiable(id)) {
			Optional<Sinistre> sinistre = service.findEntityById(id);
			if (sinistre.isEmpty()) {
				return ResponseEntity.notFound().build();
			}
			return ResponseEntity.badRequest()
					.body(Map.of("error", "Le sinistre doit être au statut OUVERT pour ajouter des dégâts."));
		}

		return service.addDegatToSinistreWithImages(id, degatDTO, files)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.badRequest().build());
	}

	@Operation(summary = "Ajouter des images à un dégât", description = "Ajoute des images à un dégât existant. Uniquement possible si le sinistre est au statut OUVERT.")
	@ApiResponses({ 
		@ApiResponse(responseCode = "200", description = "Images ajoutées avec succès"),
		@ApiResponse(responseCode = "400", description = "Sinistre non modifiable"),
		@ApiResponse(responseCode = "404", description = "Sinistre ou dégât non trouvé") 
	})
	@PostMapping(value = "/{id}/degats/{degatId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> addImagesToDegat(
			@PathVariable Long id,
			@PathVariable Long degatId,
			@RequestPart("files") List<MultipartFile> files) {
		
		if (!service.isSinistreModifiable(id)) {
			Optional<Sinistre> sinistre = service.findEntityById(id);
			if (sinistre.isEmpty()) {
				return ResponseEntity.notFound().build();
			}
			return ResponseEntity.badRequest()
					.body(Map.of("error", "Le sinistre doit être au statut OUVERT pour ajouter des images."));
		}

		return service.addImagesToDegat(id, degatId, files)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@Operation(summary = "Supprimer une image d'un dégât", description = "Supprime une image d'un dégât. Uniquement possible si le sinistre est au statut OUVERT.")
	@ApiResponses({ 
		@ApiResponse(responseCode = "204", description = "Image supprimée avec succès"),
		@ApiResponse(responseCode = "400", description = "Sinistre non modifiable"),
		@ApiResponse(responseCode = "404", description = "Image non trouvée") 
	})
	@DeleteMapping("/{id}/degats/{degatId}/images/{imageId}")
	public ResponseEntity<?> removeImageFromDegat(
			@PathVariable Long id,
			@PathVariable Long degatId,
			@PathVariable Long imageId) {
		
		Optional<Sinistre> sinistre = service.findEntityById(id);
		if (sinistre.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		if (!service.isSinistreModifiable(id)) {
			return ResponseEntity.badRequest()
					.body(Map.of("error", "Le sinistre doit être au statut OUVERT pour supprimer des images."));
		}

		boolean removed = service.removeImageFromDegat(id, degatId, imageId);
		if (removed) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.notFound().build();
	}

	@Operation(summary = "Supprimer un dégât d'un sinistre", description = "Supprime un dégât existant d'un sinistre. Uniquement possible si le sinistre est au statut OUVERT.")
	@ApiResponses({ 
		@ApiResponse(responseCode = "204", description = "Dégât supprimé avec succès"),
		@ApiResponse(responseCode = "400", description = "Sinistre non modifiable (statut différent de OUVERT)"),
		@ApiResponse(responseCode = "404", description = "Sinistre ou dégât non trouvé") 
	})
	@DeleteMapping("/{id}/degats/{degatId}")
	public ResponseEntity<?> removeDegat(@PathVariable Long id, @PathVariable Long degatId) {
		// Vérifier si le sinistre existe
		Optional<Sinistre> sinistre = service.findEntityById(id);
		if (sinistre.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		// Vérifier si modifiable
		if (!service.isSinistreModifiable(id)) {
			return ResponseEntity.badRequest()
					.body(Map.of("error", "Le sinistre doit être au statut OUVERT pour supprimer des dégâts."));
		}

		boolean removed = service.removeDegatFromSinistre(id, degatId);
		if (removed) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.notFound().build();
	}
}