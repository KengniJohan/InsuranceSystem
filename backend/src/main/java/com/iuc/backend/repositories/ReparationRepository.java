package com.iuc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.iuc.backend.models.Reparation;

@Repository
public interface ReparationRepository extends JpaRepository<Reparation, String> {}
