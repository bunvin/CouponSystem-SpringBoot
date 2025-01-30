package com.example.demo.AppModules.coupon;

import com.example.demo.AppModules.company.CompanyServiceImp;
import com.example.demo.AppModules.customer.Customer;
import com.example.demo.AppModules.customer.CustomerServiceImp;
import com.example.demo.AppModules.customerCoupon.CustomerCoupon;
import com.example.demo.AppModules.customerCoupon.CustomerCouponService;
import com.example.demo.Error.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CouponServiceImp implements CouponService{
    @Autowired
    private CouponRepository couponRepository;
    @Autowired
    private CompanyServiceImp companyServiceImp;
    @Autowired
    private CustomerServiceImp customerServiceImp;
    @Autowired
    private CustomerCouponService customerCouponService;

    @Override
    public Coupon addCoupon(Coupon coupon) throws AppException {
        //not same title in company
        if(this.couponRepository.existsByCouponTitleAndCompanyId(
                coupon.getTitle(), coupon.getCompany().getId())){
            throw new AppException(CouponError.COUPON_NAME_TAKEN);
        }
        if(this.couponRepository.existsById(coupon.getId())){
            throw new AppException(CouponError.COUPON_ALREADY_EXIST);
        }
        return this.couponRepository.save(coupon);
    }

    @Override
    public void updateCoupon(Coupon coupon, int couponId) throws AppException {
        //updatable = false:  id, company
        Coupon dbCoupon = this.getSingleCoupon(couponId);
        if(coupon.getCompany().equals(dbCoupon.getCompany())){
            coupon.setId(couponId);
            this.couponRepository.save(coupon);
        }else{
            throw new AppException(CouponError.COUPON_COMPANY_UNUPDATABLE);
        }
    }

    @Override
    public void deleteCoupon(int couponId) throws AppException {
        Coupon toDelete = this.getSingleCoupon(couponId);
        this.couponRepository.deleteById(couponId);
    }

    @Override
    public Coupon getSingleCoupon(int couponId) throws AppException {
        return this.couponRepository.findById(couponId)
                .orElseThrow(() -> new AppException(CouponError.COUPON_NOT_FOUND));
    }

    @Override
    public List<Coupon> getAllCoupons() {
        return this.couponRepository.findAll();
    }

    @Override
    public List<Coupon> getAllCouponsByCompanyId(int companyID) throws AppException {
        return this.couponRepository.findAllByCompanyId(companyID);
    }


    @Override
    public CustomerCoupon addCouponPurchase(int customerId, int couponId) throws AppException {
        Coupon coupon = this.getSingleCoupon(couponId);
        if(coupon.getAmount()<1){
            throw new AppException(CouponError.COUPON_AMOUNT_FINISHED);
        }
        Customer customer = this.customerServiceImp.getSingleCustomer(customerId);
        coupon.setAmount(coupon.getAmount()-1);
        return customerCouponService.addPurchase(customer,coupon);
    }

    @Override
    public void deleteCouponPurchase(int customerId, int couponId) throws AppException {
        this.customerCouponService.deletePurchase(customerId,couponId); // not found exception
    }
}
