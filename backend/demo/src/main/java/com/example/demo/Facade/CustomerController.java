package com.example.demo.Facade;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<List<Coupon>> getAllCoupons() throws AppException {
        List<Coupon> coupons = customerFacade.getAllCoupons();
        return ResponseEntity.status(HttpStatus.OK).body(coupons);
    }

    @GetMapping("/coupons/{id}")
    public ResponseEntity<List<Coupon>> getAllCustomerCoupons() throws AppException {
        List<Coupon> coupons = customerFacade.getAllCustomerCoupons(); //customer that is logged in
        return ResponseEntity.status(HttpStatus.OK).body(coupons);
    }

    @GetMapping("/coupons/category/{category}")
    public ResponseEntity<List<Coupon>> getAllCustomerCouponsByCategory(@PathVariable Category category) throws AppException {
        List<Coupon> coupons = customerFacade.getAllCustomerCouponsByCategory(category);
        return ResponseEntity.status(HttpStatus.OK).body(coupons);
    }

    @GetMapping("/coupons/max-price/{maxPrice}")
    public ResponseEntity<List<Coupon>> getAllCustomerCouponsByMaxPrice(@PathVariable double maxPrice) throws AppException {
        List<Coupon> coupons = customerFacade.getAllCustomerCouponsByMaxPrice(maxPrice);
        return ResponseEntity.status(HttpStatus.OK).body(coupons);
    }

    @PostMapping("/coupons/{couponId}/customer/{customerId}")
    public ResponseEntity<Void> addCouponPurchases(@PathVariable int couponId, @PathVariable int customerId) throws AppException {
        customerFacade.addCouponPurchases(couponId, customerId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/coupons/{couponId}/customer/{customerId}")
    public ResponseEntity<Void> deleteCouponPurchases(@PathVariable int couponId, @PathVariable int customerId) throws AppException {
        customerFacade.deleteCouponPurchases(couponId, customerId);
        return ResponseEntity.ok().build();
    }

}
