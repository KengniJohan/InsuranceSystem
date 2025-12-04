package com.iuc.backend.services.repositories;

import com.iuc.backend.models.Accord;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AccordRepository extends JpaRepository<Accord, String> {
}