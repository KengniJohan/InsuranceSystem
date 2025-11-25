package com.iuc.backend.projetDevis;

import com.iuc.backend.projetDevis.model.Accord;
import com.iuc.backend.projetDevis.model.Devis;
import com.iuc.backend.projetDevis.DataService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
public class ApiController {
     private final DataService service;

    public ApiController(DataService service) {
        this.service = service;
    }

    @GetMapping("/api/Devis")
    public List<Devis> getQuotes() {
        return service.getQuotes();
    }

    @GetMapping("/api/agreements")
    public List<Accord> getAgreements() {
        return service.getAgreements();
    }
}
