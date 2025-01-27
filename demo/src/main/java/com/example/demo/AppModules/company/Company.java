package com.example.demo.AppModules.company;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import org.springframework.context.annotation.Lazy;

import com.example.demo.AppModules.user.User;

@Entity
public class Company  implements Serializable  {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false)
    private int id;

    @Column(updatable = false)
    String name;

    @Column(updatable = false)
    private User owner;
    //both PostLocat
    private String ownerEmail;
    private String ownerPassword;

    private LocalDateTime createdDateTime = LocalDateTime.now();

    private LocalDateTime modifiedDateTime = LocalDateTime.now();

    //constractor
    public Company() {
    }

    public Company(int id, String name, User owner, LocalDateTime createdDateTime, LocalDateTime modifiedDateTime) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.createdDateTime = createdDateTime;
        this.modifiedDateTime = modifiedDateTime;
    }

    //builder
    public static CompanyBuilder builder() {
        return new CompanyBuilder();
    }

    public static class CompanyBuilder {

        private int id;
        private String name;
        private User owner;
        private LocalDateTime createdDateTime = LocalDateTime.now(); // default value
        private LocalDateTime modifiedDateTime = LocalDateTime.now(); // default value

        public CompanyBuilder id(int id) {
            this.id = id;
            return this;
        }

        public CompanyBuilder name(String name) {
            this.name = name;
            return this;
        }

        public CompanyBuilder user(User owner) {
            this.owner = owner;
            return this;
        }


        public Company build() {
            return new Company(id, name, owner, createdDateTime, modifiedDateTime);
        }
    }


    //getter setter


    public String getOwnerEmail() {
        return ownerEmail;
    }

    public String getOwnerPassword() {
        return ownerPassword;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public User getOwner() {
        return owner;
    }

    public LocalDateTime getCreatedDateTime() {
        return createdDateTime;
    }

    public LocalDateTime getModifiedDateTime() {
        return modifiedDateTime;
    }

    public void setUser(User owner) {
        this.owner = owner;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Company{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", user=" + owner +
                ", createdDateTime=" + createdDateTime +
                ", modifiedDateTime=" + modifiedDateTime +
                '}';
    }

    @PostLoad
    public void postLoad() {
        // Initialize ownerEmail and ownerPassword after entity is loaded
        if (owner != null) {
            this.ownerEmail = owner.getEmail();
            this.ownerPassword = owner.getPassword();
        }
    }
}
