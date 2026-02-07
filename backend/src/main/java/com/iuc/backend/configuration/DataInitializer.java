package com.iuc.backend.configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.iuc.backend.models.*;
import com.iuc.backend.models.enums.*;
import com.iuc.backend.repositories.*;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            PersonneRepository personneRepo,
            ClientRepository clientRepo,
            VehiculeRepository vehiculeRepo,
            SinistreRepository sinistreRepo,
            DegatRepositoory degatRepo,
            DevisRepository devisRepo,
            ReparationRepository reparationRepo,
            AccordRepository accordRepo
    ) {
        return args -> {
            // Vérifier si les données existent déjà
            if (clientRepo.count() > 0) {
                log.info("Base de données déjà initialisée. Aucune donnée ajoutée.");
                return;
            }

            log.info("Initialisation des données de référence...");

            // ========== PERSONNES ET CLIENTS ==========
            
            // Client 1 - Jean Dupont
            Personne personne1 = new Personne();
            personne1.setNom("Dupont");
            personne1.setPrenom("Jean");
            personne1.setTelephone("697123456");
            personne1.setEmail("jean.dupont@email.cm");
            personne1.setAdresse("Douala, Bonapriso");
            personne1 = personneRepo.save(personne1);

            Client client1 = new Client();
            client1.setPersonne(personne1);
            client1 = clientRepo.save(client1);

            // Client 2 - Marie Kamga
            Personne personne2 = new Personne();
            personne2.setNom("Kamga");
            personne2.setPrenom("Marie");
            personne2.setTelephone("677654321");
            personne2.setEmail("marie.kamga@email.cm");
            personne2.setAdresse("Yaoundé, Bastos");
            personne2 = personneRepo.save(personne2);

            Client client2 = new Client();
            client2.setPersonne(personne2);
            client2 = clientRepo.save(client2);

            // Client 3 - Paul Nkounga
            Personne personne3 = new Personne();
            personne3.setNom("Nkounga");
            personne3.setPrenom("Paul");
            personne3.setTelephone("699887766");
            personne3.setEmail("paul.nkounga@email.cm");
            personne3.setAdresse("Douala, Akwa");
            personne3 = personneRepo.save(personne3);

            Client client3 = new Client();
            client3.setPersonne(personne3);
            client3 = clientRepo.save(client3);

            log.info("3 clients créés.");

            // ========== VEHICULES ==========
            
            // Véhicule 1 - Toyota Corolla de Jean Dupont
            Vehicule vehicule1 = new Vehicule();
            vehicule1.setClient(client1);
            vehicule1.setMarque("Toyota");
            vehicule1.setModele("Corolla");
            vehicule1.setImmatriculation("LT-1234-AB");
            vehicule1.setNumChassis("JTDBR32E860123456");
            vehicule1.setAnneeVehicule("2022");
            vehicule1 = vehiculeRepo.save(vehicule1);

            // Véhicule 2 - Peugeot 308 de Marie Kamga
            Vehicule vehicule2 = new Vehicule();
            vehicule2.setClient(client2);
            vehicule2.setMarque("Peugeot");
            vehicule2.setModele("308");
            vehicule2.setImmatriculation("CE-5678-CD");
            vehicule2.setNumChassis("VF3LBHGZ9ES654321");
            vehicule2.setAnneeVehicule("2021");
            vehicule2 = vehiculeRepo.save(vehicule2);

            // Véhicule 3 - Mercedes C200 de Paul Nkounga
            Vehicule vehicule3 = new Vehicule();
            vehicule3.setClient(client3);
            vehicule3.setMarque("Mercedes");
            vehicule3.setModele("C200");
            vehicule3.setImmatriculation("LT-9999-EF");
            vehicule3.setNumChassis("WDD2040401R789012");
            vehicule3.setAnneeVehicule("2023");
            vehicule3 = vehiculeRepo.save(vehicule3);

            // Véhicule 4 - Honda Civic de Jean Dupont (2ème véhicule)
            Vehicule vehicule4 = new Vehicule();
            vehicule4.setClient(client1);
            vehicule4.setMarque("Honda");
            vehicule4.setModele("Civic");
            vehicule4.setImmatriculation("LT-4567-GH");
            vehicule4.setNumChassis("2HGFA16578H345678");
            vehicule4.setAnneeVehicule("2020");
            vehicule4 = vehiculeRepo.save(vehicule4);

            log.info("4 véhicules créés.");

            // ========== SINISTRES ==========
            
            // Sinistre 1 - Collision sur Toyota Corolla (En cours)
            Sinistre sinistre1 = new Sinistre();
            sinistre1.setNumero_sinistre("SIN-2026-0001");
            sinistre1.setDate_sinistre(LocalDateTime.of(2026, 1, 15, 14, 30));
            sinistre1.setDescription("Collision avec un autre véhicule au carrefour de Bonapriso. Dégâts sur l'avant du véhicule.");
            sinistre1.setStatut_sinistre(StatutSinistre.EnCours);
            sinistre1.setAssure(client1);
            sinistre1.setVehicule(vehicule1);
            sinistre1 = sinistreRepo.save(sinistre1);

            // Dégâts du sinistre 1
            Degat degat1_1 = new Degat();
            degat1_1.setIntitule("Pare-chocs avant endommagé");
            degat1_1.setDescription("Pare-chocs avant écrasé suite à l'impact frontal");
            degat1_1.setSinistre(sinistre1);
            degatRepo.save(degat1_1);

            Degat degat1_2 = new Degat();
            degat1_2.setIntitule("Capot bosselé");
            degat1_2.setDescription("Capot présentant plusieurs bosses et déformations");
            degat1_2.setSinistre(sinistre1);
            degatRepo.save(degat1_2);

            Degat degat1_3 = new Degat();
            degat1_3.setIntitule("Phare avant gauche cassé");
            degat1_3.setDescription("Optique du phare gauche brisée");
            degat1_3.setSinistre(sinistre1);
            degatRepo.save(degat1_3);

            // Sinistre 2 - Vandalisme sur Peugeot 308 (Ouvert)
            Sinistre sinistre2 = new Sinistre();
            sinistre2.setNumero_sinistre("SIN-2026-0002");
            sinistre2.setDate_sinistre(LocalDateTime.of(2026, 1, 28, 8, 0));
            sinistre2.setDescription("Véhicule vandalisé pendant la nuit. Vitres brisées et rétroviseurs arrachés.");
            sinistre2.setStatut_sinistre(StatutSinistre.Ouvert);
            sinistre2.setAssure(client2);
            sinistre2.setVehicule(vehicule2);
            sinistre2 = sinistreRepo.save(sinistre2);

            Degat degat2_1 = new Degat();
            degat2_1.setIntitule("Vitre conducteur brisée");
            degat2_1.setDescription("Vitre latérale côté conducteur entièrement cassée");
            degat2_1.setSinistre(sinistre2);
            degatRepo.save(degat2_1);

            Degat degat2_2 = new Degat();
            degat2_2.setIntitule("Rétroviseur gauche arraché");
            degat2_2.setDescription("Rétroviseur extérieur gauche arraché de la portière");
            degat2_2.setSinistre(sinistre2);
            degatRepo.save(degat2_2);

            // Sinistre 3 - Accident sur Mercedes (Cloturé avec accord)
            Sinistre sinistre3 = new Sinistre();
            sinistre3.setNumero_sinistre("SIN-2026-0003");
            sinistre3.setDate_sinistre(LocalDateTime.of(2026, 1, 5, 18, 45));
            sinistre3.setDescription("Accrochage léger sur le parking du supermarché. Rayures sur le côté droit.");
            sinistre3.setStatut_sinistre(StatutSinistre.Cloture);
            sinistre3.setAssure(client3);
            sinistre3.setVehicule(vehicule3);
            sinistre3 = sinistreRepo.save(sinistre3);

            Degat degat3_1 = new Degat();
            degat3_1.setIntitule("Rayures portière droite");
            degat3_1.setDescription("Rayures profondes sur toute la longueur de la portière arrière droite");
            degat3_1.setSinistre(sinistre3);
            degatRepo.save(degat3_1);

            log.info("3 sinistres créés avec leurs dégâts.");

            // ========== DEVIS ==========
            
            // Devis 1 - Pour sinistre 1 (En attente)
            Devis devis1 = new Devis();
            devis1.setId("DEV-2026-0001");
            devis1.setDateDevis(LocalDate.of(2026, 1, 18));
            devis1.setStatutDevis(StatutDevis.Enattente);
            devis1.setMontant(850000L);
            devis1.setFranchise(50000L);
            devis1.setSinistre(sinistre1);
            devis1 = devisRepo.save(devis1);

            // Réparations du devis 1
            List<Reparation> reparations1 = new ArrayList<>();
            
            Reparation rep1_1 = new Reparation();
            rep1_1.setIdReparation("REP-001");
            rep1_1.setNom("Remplacement pare-chocs avant");
            rep1_1.setCategorie("Carrosserie");
            rep1_1.setPrix(350000L);
            rep1_1.setSelected(true);
            rep1_1.setDevis(devis1);
            reparations1.add(rep1_1);

            Reparation rep1_2 = new Reparation();
            rep1_2.setIdReparation("REP-002");
            rep1_2.setNom("Débosselage capot");
            rep1_2.setCategorie("Carrosserie");
            rep1_2.setPrix(200000L);
            rep1_2.setSelected(true);
            rep1_2.setDevis(devis1);
            reparations1.add(rep1_2);

            Reparation rep1_3 = new Reparation();
            rep1_3.setIdReparation("REP-003");
            rep1_3.setNom("Remplacement phare avant gauche");
            rep1_3.setCategorie("Électricité");
            rep1_3.setPrix(180000L);
            rep1_3.setSelected(true);
            rep1_3.setDevis(devis1);
            reparations1.add(rep1_3);

            Reparation rep1_4 = new Reparation();
            rep1_4.setIdReparation("REP-004");
            rep1_4.setNom("Peinture complète avant");
            rep1_4.setCategorie("Peinture");
            rep1_4.setPrix(120000L);
            rep1_4.setSelected(false);
            rep1_4.setDevis(devis1);
            reparations1.add(rep1_4);

            reparationRepo.saveAll(reparations1);

            // Devis 2 - Pour sinistre 2 (En attente)
            Devis devis2 = new Devis();
            devis2.setId("DEV-2026-0002");
            devis2.setDateDevis(LocalDate.of(2026, 1, 30));
            devis2.setStatutDevis(StatutDevis.Enattente);
            devis2.setMontant(280000L);
            devis2.setFranchise(30000L);
            devis2.setSinistre(sinistre2);
            devis2 = devisRepo.save(devis2);

            List<Reparation> reparations2 = new ArrayList<>();

            Reparation rep2_1 = new Reparation();
            rep2_1.setIdReparation("REP-005");
            rep2_1.setNom("Remplacement vitre conducteur");
            rep2_1.setCategorie("Vitrage");
            rep2_1.setPrix(150000L);
            rep2_1.setSelected(true);
            rep2_1.setDevis(devis2);
            reparations2.add(rep2_1);

            Reparation rep2_2 = new Reparation();
            rep2_2.setIdReparation("REP-006");
            rep2_2.setNom("Remplacement rétroviseur gauche");
            rep2_2.setCategorie("Carrosserie");
            rep2_2.setPrix(130000L);
            rep2_2.setSelected(true);
            rep2_2.setDevis(devis2);
            reparations2.add(rep2_2);

            reparationRepo.saveAll(reparations2);

            // Devis 3 - Pour sinistre 3 (Validé)
            Devis devis3 = new Devis();
            devis3.setId("DEV-2026-0003");
            devis3.setDateDevis(LocalDate.of(2026, 1, 8));
            devis3.setStatutDevis(StatutDevis.Valide);
            devis3.setMontant(450000L);
            devis3.setFranchise(45000L);
            devis3.setSinistre(sinistre3);
            devis3 = devisRepo.save(devis3);

            List<Reparation> reparations3 = new ArrayList<>();

            Reparation rep3_1 = new Reparation();
            rep3_1.setIdReparation("REP-007");
            rep3_1.setNom("Réparation portière droite");
            rep3_1.setCategorie("Carrosserie");
            rep3_1.setPrix(250000L);
            rep3_1.setSelected(true);
            rep3_1.setDevis(devis3);
            reparations3.add(rep3_1);

            Reparation rep3_2 = new Reparation();
            rep3_2.setIdReparation("REP-008");
            rep3_2.setNom("Peinture portière");
            rep3_2.setCategorie("Peinture");
            rep3_2.setPrix(200000L);
            rep3_2.setSelected(true);
            rep3_2.setDevis(devis3);
            reparations3.add(rep3_2);

            reparationRepo.saveAll(reparations3);

            log.info("3 devis créés avec leurs réparations.");

            // ========== ACCORDS ==========
            
            // Accord pour le devis 3 (Accepté)
            Accord accord1 = new Accord();
            accord1.setId("ACC-2026-0001");
            accord1.setNumeroAccord("AGRE-20260110-0001");
            accord1.setDateEmission(LocalDate.of(2026, 1, 10));
            accord1.setStatutAccord(StatutAccord.Accepte);
            accord1.setMontantValide(450000L);
            accord1.setFranchise(45000L);
            accord1.setPriseEnCharge(405000L);
            accord1.setConditions("Prise en charge des réparations suivantes: Réparation portière droite, Peinture portière. Prise en charge dans la limite des plafonds de garantie du contrat.");
            accord1.setDevis(devis3);
            accordRepo.save(accord1);

            log.info("1 accord créé.");

            log.info("=========================================");
            log.info("Initialisation terminée avec succès !");
            log.info("- 3 clients");
            log.info("- 4 véhicules");
            log.info("- 3 sinistres avec dégâts");
            log.info("- 3 devis avec réparations");
            log.info("- 1 accord");
            log.info("=========================================");
        };
    }
}
