package com.iuc.backend.controllers;

import org.springframework.web.bind.annotation.*;

import com.iuc.backend.models.dto.SinistreDTO;
import com.iuc.backend.services.SinistreService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.*;

import java.util.List;

@RestController
@RequestMapping("/api/sinistres")
public class SinistreController {

	private final SinistreService service;

	SinistreController(SinistreService service) {
		this.service = service;
	}

	@GetMapping
	@Operation(summary = "Lister tous les sinistres", description = "Retourne la liste de tous les sinistres avec informations résumées des entités liées.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès"),
			@ApiResponse(responseCode = "500", description = "Erreur interne du serveur") })
	public List<SinistreDTO> getAllSinistres() {
		return service.listAll();
	}
}