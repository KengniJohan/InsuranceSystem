package com.iuc.backend.models.dto;

public class StatsDTO {
    private long sinistresEnCours;
    private long sinistresOuverts;
    private long sinistresClotures;
    private long totalSinistres;
    
    private long devisEnAttente;
    private long devisValides;
    private long devisRejetes;
    private long totalDevis;
    
    private long accordsAcceptes;
    private long accordsRefuses;
    private long totalAccords;

    // Constructeurs
    public StatsDTO() {}

    // Getters et Setters
    public long getSinistresEnCours() { return sinistresEnCours; }
    public void setSinistresEnCours(long sinistresEnCours) { this.sinistresEnCours = sinistresEnCours; }

    public long getSinistresOuverts() { return sinistresOuverts; }
    public void setSinistresOuverts(long sinistresOuverts) { this.sinistresOuverts = sinistresOuverts; }

    public long getSinistresClotures() { return sinistresClotures; }
    public void setSinistresClotures(long sinistresClotures) { this.sinistresClotures = sinistresClotures; }

    public long getTotalSinistres() { return totalSinistres; }
    public void setTotalSinistres(long totalSinistres) { this.totalSinistres = totalSinistres; }

    public long getDevisEnAttente() { return devisEnAttente; }
    public void setDevisEnAttente(long devisEnAttente) { this.devisEnAttente = devisEnAttente; }

    public long getDevisValides() { return devisValides; }
    public void setDevisValides(long devisValides) { this.devisValides = devisValides; }

    public long getDevisRejetes() { return devisRejetes; }
    public void setDevisRejetes(long devisRejetes) { this.devisRejetes = devisRejetes; }

    public long getTotalDevis() { return totalDevis; }
    public void setTotalDevis(long totalDevis) { this.totalDevis = totalDevis; }

    public long getAccordsAcceptes() { return accordsAcceptes; }
    public void setAccordsAcceptes(long accordsAcceptes) { this.accordsAcceptes = accordsAcceptes; }

    public long getAccordsRefuses() { return accordsRefuses; }
    public void setAccordsRefuses(long accordsRefuses) { this.accordsRefuses = accordsRefuses; }

    public long getTotalAccords() { return totalAccords; }
    public void setTotalAccords(long totalAccords) { this.totalAccords = totalAccords; }
}
