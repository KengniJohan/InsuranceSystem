package com.iuc.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.iuc.backend.models.Degat;

@Repository
public interface DegatRepository extends JpaRepository<Degat, Long> {
}
