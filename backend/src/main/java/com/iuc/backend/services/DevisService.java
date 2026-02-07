package com.iuc.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.iuc.backend.models.*;
import com.iuc.backend.models.dto.DevisDTO;
import com.iuc.backend.models.dto.ClientSummaryDTO;
import com.iuc.backend.models.dto.VehiculeSummaryDTO;
import com.iuc.backend.models.enums.StatutAccord;
import com.iuc.backend.models.enums.StatutDevis;
import com.iuc.backend.repositories.DevisRepository;
import com.iuc.backend.repositories.AccordRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class DevisService {

    @Autowired
    private DevisRepository devisRepository;

    @Autowired
    private AccordRepository accordRepository;

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

    // Récupérer tous les devis en DTO
    public List<DevisDTO> getAllDevisDTO() {
        return devisRepository.findAll().stream()
            .map(this::toDevisDTO)
            .collect(Collectors.toList());
    }

    // Convertir Devis en DevisDTO
    public DevisDTO toDevisDTO(Devis devis) {
        DevisDTO dto = new DevisDTO();
        dto.setId(devis.getId());
        dto.setStatut(devis.getStatut() != null ? devis.getStatut().name() : null);
        dto.setDateDevis(devis.getDateDevis());
        dto.setMontant(devis.getMontant());
        dto.setFranchise(devis.getFranchise());

        // Mapper le sinistre
        if (devis.getSinistre() != null) {
            Sinistre sinistre = devis.getSinistre();
            DevisDTO.SinistreSummaryDTO sinistreDTO = new DevisDTO.SinistreSummaryDTO();
            sinistreDTO.setId(sinistre.getIDsinistre());
            sinistreDTO.setNumero(sinistre.getNumero_sinistre());

            // Mapper le client (ClientSummaryDTO uses public fields)
            if (sinistre.getAssure() != null && sinistre.getAssure().getPersonne() != null) {
                ClientSummaryDTO clientDTO = new ClientSummaryDTO();
                clientDTO.id = sinistre.getAssure().getIDclient();
                clientDTO.nom = sinistre.getAssure().getPersonne().getNom();
                clientDTO.prenom = sinistre.getAssure().getPersonne().getPrenom();
                sinistreDTO.setClient(clientDTO);
            }

            // Mapper le véhicule (VehiculeSummaryDTO uses public fields)
            if (sinistre.getVehicule() != null) {
                VehiculeSummaryDTO vehiculeDTO = new VehiculeSummaryDTO();
                vehiculeDTO.id = sinistre.getVehicule().getIDVehicule();
                vehiculeDTO.marque = sinistre.getVehicule().getMarque();
                vehiculeDTO.modele = sinistre.getVehicule().getModele();
                vehiculeDTO.immatriculation = sinistre.getVehicule().getImmatriculation();
                sinistreDTO.setVehicule(vehiculeDTO);
            }

            dto.setSinistre(sinistreDTO);
        }

        // Mapper les réparations
        if (devis.getReparations() != null) {
            dto.setReparations(devis.getReparations().stream().map(rep -> {
                DevisDTO.ReparationDTO repDTO = new DevisDTO.ReparationDTO();
                repDTO.setId(rep.getIdReparation());
                repDTO.setNom(rep.getNom());
                repDTO.setCategorie(rep.getCategorie());
                repDTO.setPrix(rep.getPrix());
                repDTO.setSelected(rep.getSelected());
                return repDTO;
            }).collect(Collectors.toList()));
        }

        return dto;
    }

    // Compter par statut
    public long countByStatut(com.iuc.backend.models.enums.StatutDevis statut) {
        return devisRepository.findAll().stream()
            .filter(d -> d.getStatut() == statut)
            .count();
    }

    /**
     * Compte les devis par statut effectif (en tenant compte des accords associés).
     * Un devis avec un accord Accepte est considéré comme Valide.
     * Un devis avec un accord Refuse est considéré comme Rejete.
     */
    public long countByEffectiveStatut(StatutDevis statut) {
        List<Devis> allDevis = devisRepository.findAll();
        List<Accord> allAccords = accordRepository.findAll();

        return allDevis.stream()
            .filter(devis -> {
                // Chercher un accord pour ce devis
                Optional<Accord> accordOpt = allAccords.stream()
                    .filter(a -> a.getDevis() != null && a.getDevis().getId().equals(devis.getId()))
                    .findFirst();

                StatutDevis effectiveStatus;
                if (accordOpt.isPresent()) {
                    Accord accord = accordOpt.get();
                    if (accord.getStatut() == StatutAccord.Accepte) {
                        effectiveStatus = StatutDevis.Valide;
                    } else if (accord.getStatut() == StatutAccord.Refuse) {
                        effectiveStatus = StatutDevis.Rejete;
                    } else {
                        effectiveStatus = devis.getStatut();
                    }
                } else {
                    effectiveStatus = devis.getStatut();
                }

                return effectiveStatus == statut;
            })
            .count();
    }
}
