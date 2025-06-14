package com.example.demo.AppModules.coupon;

import com.example.demo.AppModules.company.Company;
import com.example.demo.AppModules.company.CompanyServiceImp;
import com.example.demo.AppModules.customer.Customer;
import com.example.demo.AppModules.customer.CustomerServiceImp;
import com.example.demo.AppModules.customerCoupon.CustomerCoupon;
import com.example.demo.AppModules.customerCoupon.CustomerCouponService;
import com.example.demo.Error.AppException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @Transactional
    @Override
    public Coupon addCoupon(Coupon coupon) throws AppException {
        Company company = coupon.getCompany();
        System.out.println("coupon's company: " +company);

        //make sure Company is attached (after exception: Hibernate detached entity on company)
        if (company.getId() != 0) {
            company = companyServiceImp.getSingleCompany(company.getId());
        }
        coupon.setCompany(company);

        //validation - not same title in company
        if(this.couponRepository.existsByTitleAndCompanyId(
                coupon.getTitle(), coupon.getCompany().getId())){
            throw new AppException(CouponError.COUPON_NAME_TAKEN);
        }
        if(this.couponRepository.existsById(coupon.getId())){
            throw new AppException(CouponError.COUPON_ALREADY_EXIST);
        }
        return this.couponRepository.save(coupon);
    }

    @Transactional
    @Override
    public void updateCoupon(Coupon coupon, int couponId) throws AppException {
        //updatable = false:  id, company
        Coupon dbCoupon = this.getSingleCoupon(couponId);

        if(coupon.getCompany().equals(dbCoupon.getCompany())){ //equals compare id's
            coupon.setId(couponId);
            this.couponRepository.save(coupon);
            System.out.println("Coupon is updated");
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
    public List<Coupon> getAllCouponsByCompanyId(int companyId) throws AppException {
        return this.couponRepository.findAllByCompanyId(companyId);
    }

    @Override
    public List<Coupon> getAllCouponsByCompanyIdAndCategory(int companyId, Category category) {
        return this.couponRepository.findAllByCompanyIdAndCategory(companyId, category);
    }

    @Override
    public List<Coupon> getAllCouponsByCustomerId(int customerId) throws AppException {
        List<CustomerCoupon> purchasedList = this.customerCouponService.getAllByCustomerId(customerId);
        return purchasedList.stream()
                .map(CustomerCoupon::getCoupon)
                .toList();
    }

    @Override
    public List<Coupon> getAllCouponsByCustomerIdAndMaxPrice(int customerId, double maxPrice) {
        List<CustomerCoupon> purchasedList = this.customerCouponService.getAllByCustomerId(customerId);
        return purchasedList.stream()
                .map(CustomerCoupon::getCoupon)
                .filter(coupon -> coupon.getPrice() <= maxPrice)
                .toList();
    }

    @Override
    public List<Coupon> getAllCouponsByCategory(Category category) throws AppException {
        return this.couponRepository.findAllByCategory(category);
    }

    @Override
    public List<Coupon> getAllCouponsByCustomerIdAndCategory(int customerId, Category category) throws AppException {
        List<Coupon> customerCoupons = this.getAllCouponsByCustomerId(customerId);
        return customerCoupons.stream()
                .filter(coupon -> coupon.getCategory() == category)
                .toList();
    }

    @Transactional
    @Override
    public CustomerCoupon addCouponPurchase(int couponId, int customerId) throws AppException {
        Coupon coupon = this.getSingleCoupon(couponId);
        //check amount
        if(coupon.getAmount()<1){
            throw new AppException(CouponError.COUPON_AMOUNT_FINISHED);
        }
        //check expiration
        if(coupon.getEndDate().isBefore(LocalDate.now())){
            throw new AppException((CouponError.COUPON_EXPIRED));
        }
        //check if customer purchased before
        if(this.customerCouponService.existPurchase(customerId,couponId)){
            throw new AppException(CouponError.COUPON_ALREADY_PURCHASED_BY_CUSTOMER);
        }
        Customer customer = this.customerServiceImp.getSingleCustomer(customerId);
        coupon.setAmount(coupon.getAmount()-1);
        return customerCouponService.addPurchase(coupon, customer);
    }

    @Override
    public void deleteCouponPurchase(int couponId, int customerId) throws AppException {
        this.customerCouponService.deletePurchase(customerId,couponId); // exception if not found
    }

    @Transactional
    @Override
    public void deleteAllExpiredCoupons() {
        this.couponRepository.deleteExpiredCouponsCustomerCoupons();
        this.couponRepository.deleteExpiredCoupons();
    }
}
