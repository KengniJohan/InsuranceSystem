package com.iuc.backend.models.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JoinVehicule {


    private String immatriculation;
    private String marque;
    private String modele;
    private String nomProprietaire;
    private String prenomProprietaire;    
}
