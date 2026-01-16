package com.iuc.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.iuc.backend.models.Vehicule;
import com.iuc.backend.models.dto.JoinVehicule;
import com.iuc.backend.repositories.VehiculeRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class VehiculeService {
    private final VehiculeRepository vehiculeRepository;

    public Vehicule getVehicule(Long id){
        Optional<Vehicule> vehicule = this.vehiculeRepository.findByIDVehicule(id);
        if(vehicule.isPresent()){
            return vehicule.get();
        }
        throw new RuntimeException("Client with this id");
    }

    public Vehicule getVehiculeWithMaricule(String immatriculation){
        Optional<Vehicule> vehicule = this.vehiculeRepository.findByImmatriculation(immatriculation);
        if(vehicule.isPresent()){
            return vehicule.get();
        }
        throw new RuntimeException("Client with this id");
    }
    public List<JoinVehicule> getJoinVehicule(){
        return this.vehiculeRepository.findByJoinColumnVehicule();
    }
    
}
