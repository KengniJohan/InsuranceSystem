package com.iuc.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Degat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long IDdegat;

    private String intitule;
    private String images;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "IDsinistre")
    private Sinistre sinistre;
    
    @OneToMany(mappedBy = "degat", cascade = CascadeType.ALL)
    private List<Image> photos_degats;

	public Long getIDdegat() {
		return IDdegat;
	}

	public void setIDdegat(Long iDdegat) {
		IDdegat = iDdegat;
	}

	public String getIntitule() {
		return intitule;
	}

	public void setIntitule(String intitule) {
		this.intitule = intitule;
	}

	public String getImages() {
		return images;
	}

	public void setImages(String images) {
		this.images = images;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Sinistre getSinistre() {
		return sinistre;
	}

	public void setSinistre(Sinistre sinistre) {
		this.sinistre = sinistre;
	}

	public List<Image> getPhotos_degats() {
		return photos_degats;
	}

	public void setPhotos_degats(List<Image> photos_degats) {
		this.photos_degats = photos_degats;
	}
}