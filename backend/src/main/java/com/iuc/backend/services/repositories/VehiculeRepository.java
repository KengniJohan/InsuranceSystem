package com.iuc.backend.services.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.iuc.backend.models.Vehicule;

public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {}
