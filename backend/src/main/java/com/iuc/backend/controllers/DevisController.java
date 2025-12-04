package com.iuc.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.iuc.backend.models.*;
import com.iuc.backend.services.DevisService;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/devis")
public class DevisController {

    @Autowired
    private DevisService devisService;

    // Créer un devis
    @PostMapping
    public Devis createDevis(@RequestBody Devis devis) {
        return devisService.saveDevis(devis);
    }

    // Récupérer tous les devis
    @GetMapping
    public List<Devis> getAllDevis() {
        return devisService.getAllDevis();
    }

    // Récupérer un devis par ID
    @GetMapping("/{id}")
    public Optional<Devis> getDevisById(@PathVariable String id) {
        return devisService.getDevisById(id);
    }

    // Supprimer un devis
    @DeleteMapping("/{id}")
    public void deleteDevis(@PathVariable String id) {
        devisService.deleteDevis(id);
    }
    @PutMapping("/{id}")
    public Devis updateDevis(@PathVariable String id, @RequestBody Devis devis) {
        System.out.println("==== PUT /devis ====");
    System.out.println("ID = " + id);
    System.out.println("Body = " + devis);
    System.out.println("Sinistre = " + (devis.getSinistre() != null ? devis.getSinistre().getIDsinistre() : "null"));
    devis.setId(id);
    return devisService.saveDevis(devis);
}
}
