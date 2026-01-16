package com.iuc.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.iuc.backend.models.dto.JoinVehicule;
import com.iuc.backend.services.VehiculeService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping(value = "/vehicule")
@RequiredArgsConstructor
public class VehiculeController {
     
    private final VehiculeService vehiculeService;

    @GetMapping(value = "/join")
    ResponseEntity<List<JoinVehicule>> getVehiculeJoinWithClien(){
        List<JoinVehicule> listVehiculesJoin = vehiculeService.getJoinVehicule(); 
        return ResponseEntity.accepted().body(listVehiculesJoin);
    }
}
