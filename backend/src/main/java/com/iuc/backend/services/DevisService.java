package com.iuc.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.iuc.backend.models.*;
import com.iuc.backend.services.repositories.DevisRepository;   

import java.util.List;
import java.util.Optional;

@Service
public class DevisService {

    @Autowired
    private DevisRepository devisRepository;

    // Créer ou mettre à jour un devis
    public Devis saveDevis(Devis devis) {
        return devisRepository.save(devis);
    }

    // Récupérer un devis par son ID
    public Optional<Devis> getDevisById(String id) {
        return devisRepository.findById(id);
    }

    // Récupérer tous les devis
    public List<Devis> getAllDevis() {
        return devisRepository.findAll();
    }

    // Supprimer un devis
    public void deleteDevis(String id) {
        devisRepository.deleteById(id);
    }
}
