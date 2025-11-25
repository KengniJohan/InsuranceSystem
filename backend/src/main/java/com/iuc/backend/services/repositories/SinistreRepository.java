package com.iuc.backend.services.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.iuc.backend.models.Sinistre;


public interface SinistreRepository extends JpaRepository<Sinistre, Long> {}
