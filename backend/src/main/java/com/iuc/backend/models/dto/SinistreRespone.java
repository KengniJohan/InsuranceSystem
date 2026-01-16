package com.iuc.backend.models.dto;

import java.util.List;

import com.iuc.backend.models.Degat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RequiredArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SinistreRespone {
    

    private String description;
    private String date_sinistre;
    private String id_vehicule;
    private String id_policier;
    private List<Degat> degats;

    
}
