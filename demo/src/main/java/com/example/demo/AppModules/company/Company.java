package com.example.demo.AppModules.company;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import org.springframework.context.annotation.Lazy;

import com.example.demo.AppModules.user.User;

@Entity
public class Company implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false)
    private int id;

    @Column(updatable = false)
    String name;

    @OneToOne
    @JoinColumn(name = "user_id", updatable = false)
    private User user;
    //both with @ PostLocat after user is created
    private String userEmail;
    private String userPassword;

    //no setter no builder default always
    @Column(updatable = false)
    private LocalDateTime createdDateTime = LocalDateTime.now();
    private LocalDateTime modifiedDateTime = LocalDateTime.now();

    //Constractor
    public Company() {
    }

    public Company(int id, String name, User user) {
        this.id = id;
        this.name = name;
        this.user = user;
    }

    //After entity with user is loaded, save user and password
    @PostLoad
    public void postLoad() {
        if (user != null) {
            this.userEmail = user.getEmail();
            this.userPassword = user.getPassword();
        }
    }

    //before every update threw repo
    @PreUpdate
    public void updateModifiedDateTime() {
        this.modifiedDateTime = LocalDateTime.now();
    }

    //builder
    public static CompanyBuilder builder() {
        return new CompanyBuilder();
    }

    public static class CompanyBuilder {
        private int id;
        private String name;
        private User user;
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

        public CompanyBuilder user(User user) {
            this.user = user;
            return this;
        }

        public Company build() {
            return new Company(id, name, user);
        }
    }

    //getter setter
    public void setName(String name) {
        this.name = name;
    }

    public void setCompanyUser(User user) {
        this.user = user;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public User getCompanyUser() {
        return user;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public LocalDateTime getCreatedDateTime() {
        return createdDateTime;
    }

    public LocalDateTime getModifiedDateTime() {
        return modifiedDateTime;
    }

    @Override
    public String toString() {
        return "Company{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", user=" + user +
                '}';
    }


}
