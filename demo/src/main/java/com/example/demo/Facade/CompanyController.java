package com.example.demo.Facade;

import com.example.demo.AppModules.company.Company;
import com.example.demo.AppModules.coupon.Category;
import com.example.demo.AppModules.coupon.Coupon;
import com.example.demo.Error.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company")
public class CompanyController {
    @Autowired
    private CompanyFacade companyFacade;


    @GetMapping("/coupons")
    public ResponseEntity<List<Coupon>> getAllCompanyCoupons() throws AppException {
        List<Coupon> coupons = companyFacade.getAllCompanyCoupons();
        return ResponseEntity.status(HttpStatus.OK).body(coupons);
    }

    @GetMapping("/coupons/{category}")
    public ResponseEntity<List<Coupon>> getAllCompanyCoupons(@PathVariable Category category) throws AppException {
        List<Coupon> coupons = companyFacade.getAllCompanyCouponsByCategory(category);
        return ResponseEntity.status(HttpStatus.OK).body(coupons);
    }

    @GetMapping("/coupons/{maxPrice}")
    public ResponseEntity<List<Coupon>> getAllCompanyCoupons(@PathVariable double maxPrice) throws AppException {
        List<Coupon> coupons = companyFacade.getAllCompanyCouponsUpToMaxPrice(maxPrice);
        return ResponseEntity.status(HttpStatus.OK).body(coupons);
    }

    @GetMapping("/coupons/{id}")
    public ResponseEntity<Coupon> getSingleCoupon(@PathVariable int id) throws AppException {
        Coupon coupon = companyFacade.getSingleCoupon(id);
        return ResponseEntity.status(HttpStatus.OK).body(coupon);
    }

    @PostMapping("/coupon")
    public ResponseEntity<Coupon> addCoupon(@RequestBody Coupon coupon) throws AppException {
        Coupon newCoupon = companyFacade.addCoupon(coupon);
        return ResponseEntity.status(HttpStatus.OK).body(newCoupon);
    }

    @PostMapping("coupon/{id}")
    public ResponseEntity<Void> updateCoupon(@RequestBody Coupon coupon, @PathVariable int id) throws AppException {
        companyFacade.updateCoupon(coupon, id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("coupon/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable int id) throws AppException {
        companyFacade.deleteCoupon(id);
        return ResponseEntity.ok().build();
    }



}
