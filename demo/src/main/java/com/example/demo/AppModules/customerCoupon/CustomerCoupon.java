package com.example.demo.AppModules.customerCoupon;

import com.example.demo.AppModules.company.Company;
import com.example.demo.AppModules.coupon.Coupon;
import com.example.demo.AppModules.customer.Customer;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class CustomerCoupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false)
    private int id;

    @ManyToOne(cascade = CascadeType.ALL)//delete purchase with customer
    @JoinColumn(name="customerId")
    Customer customer;

    @ManyToOne(cascade = CascadeType.ALL)//delete purchase with coupon
    @JoinColumn(name= "couponId")
    Coupon coupon;

    @Column(updatable = false)
    private LocalDateTime createdDateTime = LocalDateTime.now();
    private LocalDateTime modifiedDateTime = LocalDateTime.now();


    //constractor
    public CustomerCoupon() {
    }

    public CustomerCoupon(int id, Customer customer, Coupon coupon, LocalDateTime createdDateTime, LocalDateTime modifiedDateTime) {
        this.id = id;
        this.customer = customer;
        this.coupon = coupon;
        this.createdDateTime = createdDateTime;
        this.modifiedDateTime = modifiedDateTime;
    }

    //before every update threw repo
    @PreUpdate
    public void updateModifiedDateTime() {
        this.modifiedDateTime = LocalDateTime.now();
    }

    //getter setter

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Coupon getCoupon() {
        return coupon;
    }

    public void setCoupon(Coupon coupon) {
        this.coupon = coupon;
    }

    public LocalDateTime getCreatedDateTime() {
        return createdDateTime;
    }

    public void setCreatedDateTime(LocalDateTime createdDateTime) {
        this.createdDateTime = createdDateTime;
    }

    public LocalDateTime getModifiedDateTime() {
        return modifiedDateTime;
    }

    public void setModifiedDateTime(LocalDateTime modifiedDateTime) {
        this.modifiedDateTime = modifiedDateTime;
    }

    @Override
    public String toString() {
        return "CustomerCoupon{" +
                "id=" + id +
                ", customer=" + customer.getId() +
                ", coupon=" + coupon.getId() +
                '}';
    }
}
