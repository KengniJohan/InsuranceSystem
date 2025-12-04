package com.iuc.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.iuc.backend.models.*;
import com.iuc.backend.services.AccordService;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/accords")
public class AccordController {

    @Autowired
    private AccordService accordService;

    // Créer un accord
    @PostMapping
    public Accord createAccord(@RequestBody Accord accord) {
        return accordService.saveAccord(accord);
    }

    // Récupérer tous les accords
    @GetMapping
    public List<Accord> getAllAccords() {
        return accordService.getAllAccords();
    }

    // Récupérer un accord par ID
    @GetMapping("/{id}")
    public Optional<Accord> getAccordById(@PathVariable String id) {
        return accordService.getAccordById(id);
    }

    // Supprimer un accord
    @DeleteMapping("/{id}")
    public void deleteAccord(@PathVariable String id) {
        accordService.deleteAccord(id);
    }
    @PutMapping("/{id}")
public Accord updateAccord(@PathVariable String id, @RequestBody Accord accord) {
    accord.setId(id);
    return accordService.saveAccord(accord);
}

}

