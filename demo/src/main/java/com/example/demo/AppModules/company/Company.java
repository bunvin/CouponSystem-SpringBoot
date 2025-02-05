package com.example.demo.AppModules.company;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import com.example.demo.AppModules.coupon.Coupon;
import com.example.demo.AppModules.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PreUpdate;

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

    @Column(updatable = false)
    private LocalDateTime createdDateTime = LocalDateTime.now();
    private LocalDateTime modifiedDateTime = LocalDateTime.now();

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Coupon> coupons;

    //Constractor
    public Company() {
    }

    public Company(int id, String name, User user) {
        this.id = id;
        this.name = name;
        this.user = user;
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

    @Override
    public boolean equals(Object obj) {
        if (obj == null || getClass() != obj.getClass()) return false;  // Check if same class
        Company company = (Company) obj;
        // Check ID for equality
        return id == company.id;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(id);
    }

}
