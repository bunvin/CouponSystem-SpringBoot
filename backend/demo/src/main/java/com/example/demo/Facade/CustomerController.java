package com.example.demo.Facade;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.AppModules.coupon.Category;
import com.example.demo.AppModules.coupon.Coupon;
import com.example.demo.Error.AppException;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {
    @Autowired
    private CustomerFacade customerFacade;


    @GetMapping("/coupons")
    public ResponseEntity<List<Coupon>> getAllCustomerCoupons() throws AppException {
        List<Coupon> coupons = customerFacade.getAllCustomerCoupons();
        return ResponseEntity.status(HttpStatus.OK).body(coupons);
    }

    @GetMapping("/coupons/{category}")
    public ResponseEntity<List<Coupon>> getAllCustomerCouponsByCategory(@PathVariable Category category) throws AppException {
        List<Coupon> coupons = customerFacade.getAllCustomerCouponsByCategory(category);
        return ResponseEntity.status(HttpStatus.OK).body(coupons);
    }

    @GetMapping("/coupons/{maxPrice}")
    public ResponseEntity<List<Coupon>> getAllCustomerCouponsByMaxPrice(@PathVariable double maxPrice) throws AppException {
        List<Coupon> coupons = customerFacade.getAllCustomerCouponsByMaxPrice(maxPrice);
        return ResponseEntity.status(HttpStatus.OK).body(coupons);
    }

    @PostMapping("/coupons/{id}")
    public ResponseEntity<Void> addCouponPurchases(@PathVariable int id) throws AppException {
        customerFacade.addCouponPurchases(id);
        return ResponseEntity.ok().build();
    }

}
