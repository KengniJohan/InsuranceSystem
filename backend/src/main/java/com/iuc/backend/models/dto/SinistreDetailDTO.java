package com.iuc.backend.models.dto;

import java.util.List;

public class SinistreDetailDTO {
    public Long id;
    public String numero;
    public String date;
    public String statut;
    public String description;
    public ClientSummaryDTO client;
    public VehiculeSummaryDTO vehicule;
    public List<DegatDTO> degats;
}
