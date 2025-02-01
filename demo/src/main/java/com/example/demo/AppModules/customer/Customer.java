package com.example.demo.AppModules.customer;

import com.example.demo.AppModules.user.User;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

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
    //both with @ PostLocat after owner is created
    private String userEmail;
    private String userPassword;

    //no setter no builder default always
    @Column(updatable = false)
    private LocalDateTime createdDateTime = LocalDateTime.now();
    private LocalDateTime modifiedDateTime = LocalDateTime.now();

    //constractors
    public Customer(int id, String firstName, String lastName, User user, String userEmail, String userPassword) {
    }
    public Customer(int id, String firstName, String lastName, User user, String userEmail, String userPassword, LocalDateTime createdDateTime, LocalDateTime modifiedDateTime) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.user = user;
        this.userEmail = userEmail;
        this.userPassword = userPassword;
        this.createdDateTime = createdDateTime;
        this.modifiedDateTime = modifiedDateTime;
    }

    //After entity is loaded
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
    public static CustomerBuilder builder() {
        return new CustomerBuilder();
    }

    public static class CustomerBuilder {
        private int id;
        private String firstName;
        private String lastName;
        private User user;
        private String userEmail;
        private String userPassword;
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
            Customer customer = new Customer(id, firstName, lastName, user, userEmail, userPassword, createdDateTime, modifiedDateTime);
            //to set userEmail and userPassword
            customer.postLoad();
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
        return "Customer{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", user=" + user +
                ", userEmail='" + userEmail + '\'' +
                ", userPassword='" + userPassword + '\'' +
                '}';
    }
}
