package com.iuc.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.iuc.backend.models.Degat;
import com.iuc.backend.repositories.DegatRepositoory;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class DegatService {

    private final DegatRepositoory degatRepositoory;


    public void addDegat(Degat degat){
        this.degatRepositoory.save(degat);
        System.out.println("----------**---------------dddddddddddddqqqqqqqqqqqqsdsqd87sqd----------");
    }

    public void addDegats(List<Degat> degats){
        this.degatRepositoory.saveAll(degats);
        System.out.println("----------**---------------dddddddddddddqqqqqqqqqqqqsdsqd87sqd----------");

    }

}
