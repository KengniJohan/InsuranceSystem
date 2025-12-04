package com.iuc.backend.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.iuc.backend.models.*;
import org.springframework.stereotype.Service;
import java.util.Optional;


import com.iuc.backend.services.repositories.*;

@Service
public class AccordService {

    @Autowired
    private AccordRepository accordRepository;

    // Créer ou mettre à jour un accord
    public Accord saveAccord(Accord accord) {
        return accordRepository.save(accord);
    }

    // Récupérer un accord par son ID
    public Optional<Accord> getAccordById(String id) {
        return accordRepository.findById(id);
    }

    // Récupérer tous les accords
    public List<Accord> getAllAccords() {
        return accordRepository.findAll();
    }

    // Supprimer un accord
    public void deleteAccord(String id) {
        accordRepository.deleteById(id);
    }
}