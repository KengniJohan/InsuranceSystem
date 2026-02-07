package com.iuc.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.iuc.backend.models.dto.StatsDTO;
import com.iuc.backend.models.enums.*;
import com.iuc.backend.services.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/stats")
public class StatsController {

    @Autowired
    private SinistreService sinistreService;

    @Autowired
    private DevisService devisService;

    @Autowired
    private AccordService accordService;

    @GetMapping
    public StatsDTO getStats() {
        StatsDTO stats = new StatsDTO();

        // Statistiques sinistres
        stats.setSinistresOuverts(sinistreService.countByStatut(StatutSinistre.Ouvert));
        stats.setSinistresEnCours(sinistreService.countByStatut(StatutSinistre.EnCours));
        stats.setSinistresClotures(sinistreService.countByStatut(StatutSinistre.Cloture));
        stats.setTotalSinistres(sinistreService.countTotal());

        // Statistiques devis (avec statut effectif basé sur les accords)
        stats.setDevisEnAttente(devisService.countByEffectiveStatut(StatutDevis.Enattente));
        stats.setDevisValides(devisService.countByEffectiveStatut(StatutDevis.Valide));
        stats.setDevisRejetes(devisService.countByEffectiveStatut(StatutDevis.Rejete));
        stats.setTotalDevis(stats.getDevisEnAttente() + stats.getDevisValides() + stats.getDevisRejetes());

        // Statistiques accords
        stats.setAccordsAcceptes(accordService.countByStatut(StatutAccord.Accepte));
        stats.setAccordsRefuses(accordService.countByStatut(StatutAccord.Refuse));
        stats.setTotalAccords(stats.getAccordsAcceptes() + stats.getAccordsRefuses());

        return stats;
    }
}
