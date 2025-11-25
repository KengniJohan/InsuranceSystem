package com.iuc.backend.projetDevis.repository;

import com.iuc.backend.projetDevis.model.Devis;

import org.springframework.data.jpa.repository.JpaRepository;

public interface Devisrepository extends JpaRepository<Devis, String> {
}

