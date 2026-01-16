package com.iuc.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.iuc.backend.models.Client;
import com.iuc.backend.models.Degat;
import com.iuc.backend.models.Image;
import com.iuc.backend.models.Sinistre;
import com.iuc.backend.models.Vehicule;
import com.iuc.backend.models.dto.SinistreDTO;
import com.iuc.backend.models.dto.SinistreRespone;
import com.iuc.backend.models.enums.StatutSinistre;
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
import java.util.Random;

@RestController
@RequestMapping("/sinistres")
@RequiredArgsConstructor
public class SinistreController {

	private final SinistreService service;
	private final VehiculeService vehiculeService;


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

		Map<String, String> contentType = Map.of(
			"jpg", "image/jpeg",
			"jpeg", "image/jpeg",
			"png", "image/png",
			"gif", "image/gif",
			"webp", "image/webp"
		);
		return contentType.getOrDefault(extension, "application/octet-stream");
	}

	@Operation(summary = "Lister tous les sinistres", description = "Retourne la liste de tous les sinistres avec informations résumées des entités liées.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès"),
			@ApiResponse(responseCode = "500", description = "Erreur interne du serveur") })
	@GetMapping
	public List<SinistreDTO> getAllSinistres() {
		return service.listAll();
	}
}