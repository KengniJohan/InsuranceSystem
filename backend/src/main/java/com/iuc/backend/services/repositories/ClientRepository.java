package com.iuc.backend.services.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.iuc.backend.models.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {}
