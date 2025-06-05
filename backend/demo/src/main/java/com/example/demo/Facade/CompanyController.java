package com.example.demo.Facade;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.AppModules.coupon.Category;
import com.example.demo.AppModules.coupon.Coupon;
import com.example.demo.Error.AppException;

@RestController
@RequestMapping("/api/company")
@CrossOrigin(origins = "http://localhost:3000")
public class CompanyController {
    @Autowired
    private CompanyFacade companyFacade;


    @GetMapping("/coupons")
    public ResponseEntity<List<Coupon>> getAllCompanyCoupons() throws AppException {
        List<Coupon> coupons = companyFacade.getAllCompanyCoupons();
        return ResponseEntity.status(HttpStatus.OK).body(coupons);
    }

    @GetMapping("/coupons/category/{category}")
    public ResponseEntity<List<Coupon>> getAllCompanyCouponsByCategory(@PathVariable Category category) throws AppException {
        List<Coupon> coupons = companyFacade.getAllCompanyCouponsByCategory(category);
        return ResponseEntity.status(HttpStatus.OK).body(coupons);
    }

    @GetMapping("/coupons/max-price/{maxPrice}")
    public ResponseEntity<List<Coupon>> getAllCompanyCoupons(@PathVariable double maxPrice) throws AppException {
        List<Coupon> coupons = companyFacade.getAllCompanyCouponsUpToMaxPrice(maxPrice);
        return ResponseEntity.status(HttpStatus.OK).body(coupons);
    }

    @PostMapping("/coupons")
    public ResponseEntity<Coupon> addCoupon(@RequestBody Coupon coupon) throws AppException {
        Coupon newCoupon = companyFacade.addCoupon(coupon);
        return ResponseEntity.status(HttpStatus.OK).body(newCoupon);
    }

    @GetMapping("/coupons/{id}")
    public ResponseEntity<Coupon> getSingleCoupon(@PathVariable int id) throws AppException {
        Coupon coupon = companyFacade.getSingleCoupon(id);
        return ResponseEntity.status(HttpStatus.OK).body(coupon);
    }

    @PostMapping("/coupons/{id}")
    public ResponseEntity<Void> updateCoupon(@RequestBody Coupon coupon, @PathVariable int id) throws AppException {
        companyFacade.updateCoupon(coupon, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable int id) throws AppException {
        companyFacade.deleteCoupon(id);
        return ResponseEntity.ok().build();
    }



}
