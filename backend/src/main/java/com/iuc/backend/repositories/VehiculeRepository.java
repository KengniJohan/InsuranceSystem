package com.iuc.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.iuc.backend.models.Vehicule;
import com.iuc.backend.models.dto.JoinVehicule;

public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {


    Optional<Vehicule> findByIDVehicule(Long iDVehicule);

    @Query(
        value = """
            SELECT v.immatriculation, v.marque, v.modele, p.nom, p.prenom  FROM Vehicule v 
            INNER JOIN Client c ON v.idclient = c.idclient
            INNER JOIN Personne p ON c.idclient = p.idpersonne 
            """,
        nativeQuery = true
    ) 
    List<JoinVehicule> findByJoinColumnVehicule(); 


    Optional<Vehicule> findByImmatriculation(String immatriculation);
}
