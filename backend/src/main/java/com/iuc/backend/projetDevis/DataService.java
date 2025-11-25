package com.iuc.backend.projetDevis;

import com.iuc.backend.projetDevis.model.Accord;
import com.iuc.backend.projetDevis.model.Devis;
import com.iuc.backend.projetDevis.model.Devis.Quote;
import com.iuc.backend.projetDevis.repository.Devisrepository;
import com.iuc.backend.projetDevis.repository.Accordrepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataService {

    private final Devisrepository quoteRepository;
    private final Accordrepository agreementRepository;

    public DataService(Devisrepository quoteRepository, Accordrepository agreementRepository) {
        this.quoteRepository = quoteRepository;
        this.agreementRepository = agreementRepository;
    }

    public List<Devis> getQuotes() {
        return quoteRepository.findAll();
    }

    public List<Accord> getAgreements() {
        return agreementRepository.findAll();
    }

    public Devis saveQuote(Devis quote) {
        return quoteRepository.save(quote);
    }

    public Accord saveAgreement(Accord agreement) {
        return agreementRepository.save(agreement);
    }
}
