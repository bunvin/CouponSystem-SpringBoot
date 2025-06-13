package com.example.demo.AppModules.customer;

import com.example.demo.AppModules.coupon.Coupon;
import com.example.demo.AppModules.customerCoupon.CustomerCoupon;
import com.example.demo.AppModules.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Customer implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false)
    private int id;

    String firstName;
    String lastName;

    @OneToOne
    @JoinColumn(name="user_id", updatable = false)
    private User user;

    //no setter no builder default always
    @Column(updatable = false)
    private LocalDateTime createdDateTime = LocalDateTime.now();
    private LocalDateTime modifiedDateTime = LocalDateTime.now();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CustomerCoupon> purchases;

    //constractors

    public Customer() {
    }

    public Customer(int id, String firstName, String lastName, User user, LocalDateTime createdDateTime, LocalDateTime modifiedDateTime) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.user = user;
        this.createdDateTime = createdDateTime;
        this.modifiedDateTime = modifiedDateTime;
    }

    //before every update threw repo
    @PreUpdate
    public void updateModifiedDateTime() {
        this.modifiedDateTime = LocalDateTime.now();
    }

    //builder
    public static CustomerBuilder builder() {
        return new CustomerBuilder();
    }

    public static class CustomerBuilder {
        private int id;
        private String firstName;
        private String lastName;
        private User user;
        private LocalDateTime createdDateTime = LocalDateTime.now(); // default value
        private LocalDateTime modifiedDateTime = LocalDateTime.now(); // default

        // Builder methods to set each field
        public CustomerBuilder id(int id) {
            this.id = id;
            return this;
        }

        public CustomerBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public CustomerBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public CustomerBuilder user(User user) {
            this.user = user;
            return this;
        }

        // Build method to create Customer instance
        public Customer build() {
            Customer customer = new Customer(id, firstName, lastName, user, createdDateTime, modifiedDateTime);
            return customer;
        }
    }

    //getter setter toString

    public void setId(int id) {
        this.id = id;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public User getUser() {
        return user;
    }

    @JsonIgnore
    public List<CustomerCoupon> getPurchases() {
        return purchases;
    }

    @JsonIgnore
    public void setPurchases(List<CustomerCoupon> purchases) {
        this.purchases = purchases;
    }


    public LocalDateTime getCreatedDateTime() {
        return createdDateTime;
    }

    public LocalDateTime getModifiedDateTime() {
        return modifiedDateTime;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", user=" + user +
                ", userEmail='" + user.getEmail() + '\'' +
                ", userPassword='" + user.getPassword() + '\'' +
                '}';
    }
}
