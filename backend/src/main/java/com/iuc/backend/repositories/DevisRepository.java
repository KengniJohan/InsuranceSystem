package com.iuc.backend.repositories;

import com.iuc.backend.models.Devis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DevisRepository extends JpaRepository<Devis, String> {}