package com.example.demo.AppModules.customerCoupon;

import com.example.demo.AppModules.company.Company;
import com.example.demo.AppModules.coupon.Coupon;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class customerCoupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false)
    private int id;

    @ManyToOne(cascade = CascadeType.ALL)//delete purchase with company
    @JoinColumn(name="companyId")
    Company company;

    @ManyToOne(cascade = CascadeType.ALL)//delete purchase with coupon
    @JoinColumn(name= "couponId")
    Coupon coupon;

    @Column(updatable = false)
    private LocalDateTime createdDateTime = LocalDateTime.now();
    private LocalDateTime modifiedDateTime = LocalDateTime.now();


    //constractor
    public customerCoupon() {
    }

    public customerCoupon(int id, Company company, Coupon coupon) {
        this.id = id;
        this.company = company;
        this.coupon = coupon;
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

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
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
        return "customerCoupon{" +
                "id=" + id +
                ", company=" + company +
                ", coupon=" + coupon +
                '}';
    }
}
