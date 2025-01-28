package com.example.demo.AppModules.customerCoupon;

import com.example.demo.AppModules.coupon.Coupon;
import com.example.demo.AppModules.customer.Customer;
import com.example.demo.AppModules.customer.CustomerService;
import com.example.demo.Error.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerCouponService {
    @Autowired
    private CustomerCouponRepository customerCouponRepository;
    CustomerCoupon addPurchase(Customer customer, Coupon coupon) throws AppException {
        if(this.customerCouponRepository.existByCustomerIdAndCouponId(
                customer.getId(), coupon.getId())){
            throw new AppException(CustomerCouponError.CUSTOMER_COUPON_ALREADY_EXIST);
        }
        CustomerCoupon newPurchase = new CustomerCoupon();
        newPurchase.setCoupon(coupon);
        newPurchase.setCustomer(customer);
        return this.customerCouponRepository.save(newPurchase);
    };

    void deletePurchase(int customerId, int couponId) throws AppException {
        CustomerCoupon purchaseToDelete = this.customerCouponRepository.findByCustomerIdAndCouponId(customerId, couponId);
        if(purchaseToDelete == null){
            throw new AppException(CustomerCouponError.CUSTOMER_COUPON_NOT_FOUND);
        }
        this.customerCouponRepository.deleteById(purchaseToDelete.getId());
    };

    List<CustomerCoupon> getAllByCustomerId(int customerId){
        return this.customerCouponRepository.findAllByCustomerId(customerId);
    }

    List<CustomerCoupon> getAllByCouponId(int couponId){
        return this.customerCouponRepository.findAllByCouponId(couponId);
    }


}
