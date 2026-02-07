package com.iuc.backend.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import com.iuc.backend.models.*;
import com.iuc.backend.models.dto.AccordDTO;
import com.iuc.backend.models.enums.StatutAccord;
import com.iuc.backend.models.enums.StatutDevis;
import com.iuc.backend.repositories.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@SuppressWarnings("null")
public class AccordService {

    @Autowired
    private AccordRepository accordRepository;

    @Autowired
    private DevisRepository devisRepository;

    // Créer ou mettre à jour un accord ET mettre à jour le statut du devis associé
    @Transactional
    public Accord saveAccord(Accord accord) {
        // Sauvegarder l'accord
        Accord savedAccord = accordRepository.save(accord);
        
        // Mettre à jour le statut du devis associé en fonction du statut de l'accord
        if (accord.getDevis() != null && accord.getStatut() != null) {
            Devis devis = accord.getDevis();
            
            // Récupérer le devis depuis la base pour s'assurer qu'il est managé
            Optional<Devis> devisOpt = devisRepository.findById(devis.getId());
            if (devisOpt.isPresent()) {
                Devis devisToUpdate = devisOpt.get();
                
                // Mapper le statut de l'accord vers le statut du devis
                if (accord.getStatut() == StatutAccord.Accepte) {
                    devisToUpdate.setStatutDevis(StatutDevis.Valide);
                } else if (accord.getStatut() == StatutAccord.Refuse) {
                    devisToUpdate.setStatutDevis(StatutDevis.Rejete);
                }
                
                devisRepository.save(devisToUpdate);
            }
        }
        
        return savedAccord;
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

    // Récupérer tous les accords en DTO
    public List<AccordDTO> getAllAccordsDTO() {
        return accordRepository.findAll().stream()
            .map(this::toAccordDTO)
            .collect(Collectors.toList());
    }

    // Convertir Accord en AccordDTO
    public AccordDTO toAccordDTO(Accord accord) {
        AccordDTO dto = new AccordDTO();
        dto.setId(accord.getId());
        dto.setNumeroAccord(accord.getNumeroAccord());
        dto.setDateEmission(accord.getDateEmission());
        dto.setStatut(accord.getStatut() != null ? accord.getStatut().name() : null);
        dto.setMontantValide(accord.getMontantValide());
        dto.setConditions(accord.getConditions());
        dto.setFranchise(accord.getFranchise());
        dto.setPriseEnCharge(accord.getPriseEnCharge());

        // Mapper le devis
        if (accord.getDevis() != null) {
            Devis devis = accord.getDevis();
            AccordDTO.DevisSummaryDTO devisDTO = new AccordDTO.DevisSummaryDTO();
            devisDTO.setId(devis.getId());
            devisDTO.setMontant(devis.getMontant());

            // Mapper le sinistre du devis
            if (devis.getSinistre() != null) {
                Sinistre sinistre = devis.getSinistre();
                AccordDTO.SinistreSummaryDTO sinistreDTO = new AccordDTO.SinistreSummaryDTO();
                sinistreDTO.setId(sinistre.getIDsinistre());
                sinistreDTO.setNumero(sinistre.getNumero_sinistre());

                // Mapper le client
                if (sinistre.getAssure() != null && sinistre.getAssure().getPersonne() != null) {
                    AccordDTO.ClientSummaryDTO clientDTO = new AccordDTO.ClientSummaryDTO();
                    clientDTO.setId(sinistre.getAssure().getIDclient());
                    clientDTO.setNom(sinistre.getAssure().getPersonne().getNom());
                    clientDTO.setPrenom(sinistre.getAssure().getPersonne().getPrenom());
                    sinistreDTO.setClient(clientDTO);
                }

                // Mapper le véhicule
                if (sinistre.getVehicule() != null) {
                    AccordDTO.VehiculeSummaryDTO vehiculeDTO = new AccordDTO.VehiculeSummaryDTO();
                    vehiculeDTO.setId(sinistre.getVehicule().getIDVehicule());
                    vehiculeDTO.setMarque(sinistre.getVehicule().getMarque());
                    vehiculeDTO.setModele(sinistre.getVehicule().getModele());
                    vehiculeDTO.setImmatriculation(sinistre.getVehicule().getImmatriculation());
                    sinistreDTO.setVehicule(vehiculeDTO);
                }

                devisDTO.setSinistre(sinistreDTO);
            }

            dto.setDevis(devisDTO);
        }

        return dto;
    }

    // Compter par statut
    public long countByStatut(com.iuc.backend.models.enums.StatutAccord statut) {
        return accordRepository.findAll().stream()
            .filter(a -> a.getStatut() == statut)
            .count();
    }
}