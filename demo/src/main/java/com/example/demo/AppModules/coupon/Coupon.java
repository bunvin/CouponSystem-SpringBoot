package com.example.demo.AppModules.coupon;

import com.example.demo.AppModules.company.Company;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false)
    private int id;

    @ManyToOne(cascade = CascadeType.ALL)//delete coupon with company
    @JoinColumn(name="companyId", updatable = false)
    private Company company;

    @Enumerated(EnumType.STRING)
    private Category category;

    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private int amount;
    private double price;
    private String image;

    //no setter no builder default always
    @Column(updatable = false)
    private LocalDateTime createdDateTime = LocalDateTime.now();
    private LocalDateTime modifiedDateTime = LocalDateTime.now();

    //constractors
    public Coupon() {
    }

    public Coupon(int id, Company company, Category category, String title, String description, LocalDate startDate, LocalDate endDate, int amount, double price, String image, LocalDateTime createdDateTime, LocalDateTime modifiedDateTime) {
        this.id = id;
        this.company = company;
        this.category = category;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.amount = amount;
        this.price = price;
        this.image = image;
        this.createdDateTime = createdDateTime;
        this.modifiedDateTime = modifiedDateTime;
    }

    //before every update threw repo
    @PreUpdate
    public void updateModifiedDateTime() {
        this.modifiedDateTime = LocalDateTime.now();
    }

    //builder
    public static CouponBuilder builder() {
        return new CouponBuilder();
    }

    public static class CouponBuilder {
        private int id;
        private Company company;
        private Category category;
        private String title;
        private String description;
        private LocalDate startDate;
        private LocalDate endDate;
        private int amount;
        private double price;
        private String image;
        private LocalDateTime createdDateTime = LocalDateTime.now(); // default value
        private LocalDateTime modifiedDateTime = LocalDateTime.now(); // default value

        //before every update threw repo
        @PreUpdate
        public void updateModifiedDateTime() {
            this.modifiedDateTime = LocalDateTime.now();
        }

        // Builder methods for each field
        public CouponBuilder id(int id) {
            this.id = id;
            return this;
        }

        public CouponBuilder company(Company company) {
            this.company = company;
            return this;
        }

        public CouponBuilder category(Category category) {
            this.category = category;
            return this;
        }

        public CouponBuilder title(String title) {
            this.title = title;
            return this;
        }

        public CouponBuilder description(String description) {
            this.description = description;
            return this;
        }

        public CouponBuilder startDate(LocalDate startDate) {
            this.startDate = startDate;
            return this;
        }

        public CouponBuilder endDate(LocalDate endDate) {
            this.endDate = endDate;
            return this;
        }

        public CouponBuilder amount(int amount) {
            this.amount = amount;
            return this;
        }

        public CouponBuilder price(double price) {
            this.price = price;
            return this;
        }

        public CouponBuilder image(String image) {
            this.image = image;
            return this;
        }

        // Build method to create Coupon instance
        public Coupon build() {
            return new Coupon(id, company, category, title, description, startDate, endDate,
                    amount, price, image, createdDateTime, modifiedDateTime);
        }
    }
    //getter setter toString
    public void setId(int id) {
        this.id = id;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public int getId() {
        return id;
    }

    public Company getCompany() {
        return company;
    }

    public Category getCategory() {
        return category;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public int getAmount() {
        return amount;
    }

    public double getPrice() {
        return price;
    }

    public String getImage() {
        return image;
    }

    public LocalDateTime getCreatedDateTime() {
        return createdDateTime;
    }

    public LocalDateTime getModifiedDateTime() {
        return modifiedDateTime;
    }

    @Override
    public String toString() {
        return "Coupon{" +
                "id=" + id +
                ", company=" + company.getId()+
                ", category=" + category +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", amount=" + amount +
                ", price=" + price +
                ", image='" + image + '\'' +
                '}';
    }
}
