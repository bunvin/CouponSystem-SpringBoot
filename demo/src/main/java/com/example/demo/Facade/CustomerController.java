package com.example.demo.Facade;

import com.example.demo.AppModules.coupon.Category;
import com.example.demo.AppModules.coupon.Coupon;
import com.example.demo.Error.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {
    @Autowired
    private CustomerFacade customerFacade;

    @PostMapping()



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
}
