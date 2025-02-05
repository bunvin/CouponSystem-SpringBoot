package com.example.demo.testing;

import com.example.demo.AppModules.company.Company;
import com.example.demo.AppModules.coupon.Category;
import com.example.demo.AppModules.coupon.Coupon;
import com.example.demo.AppModules.customer.Customer;
import com.example.demo.AppModules.user.User;
import com.example.demo.AppModules.user.UserServiceImp;
import com.example.demo.AppModules.user.UserType;
import com.example.demo.Facade.AdminFacade;
import com.example.demo.Facade.ClientFacade;
import com.example.demo.Facade.CompanyFacade;
import com.example.demo.Facade.CustomerFacade;
import com.example.demo.logInManager.LoginManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@EnableScheduling //allows the scheduled dailyJob to run
@Component
public class Test implements CommandLineRunner {
    @Autowired
    LoginManager loginManager;
    @Autowired
    UserServiceImp userServiceImp;

    @Value("${adminEmail}")
    String adminEmail;
    @Value("${adminPassword}")
    String adminPassword;

    @Override
    public void run(String... args) throws Exception {

        //adding admin user
        User adminUser = User.builder()
                .userType(UserType.ADMIN)
                .email(adminEmail)
                .password(adminPassword)
                .build();

        userServiceImp.addUser(adminUser);

        System.out.println("########## ADMIN FACADE ##########");

        ClientFacade admin = loginManager.login(adminEmail, adminPassword);

        AdminFacade adminFacade;
        adminFacade = (AdminFacade) admin; // casting from ClientFacade into AdminFacade

        System.out.println("Admin adding 5 new companies");
        System.out.println("    used: addCompany");
        //create 5 random companies
        List<Company> newCompanies = FactoryUtils.randomCompanies(5, userServiceImp);
        for (Company company : newCompanies) {
            Company newCompany = adminFacade.addCompany(company);
            System.out.print("new company added >> named: " + company.getName() + ", User:" + company.getCompanyUser());
        }
        System.out.println("##########");
        System.out.println("Admin update not possible, User, Name and Id are updatable=false");

        System.out.println("##########");
        System.out.println("##All Companies##");
        //print all companies
        //getAllCompanies
        List<Company> allCompanies = adminFacade.getAllCompanies();
        for (Company company : allCompanies) {
            System.out.print(company);
        }

        System.out.println("##########");
        System.out.println("Admin delete company");
        System.out.println("    used: deleteCompany");

        System.out.println("Companies in db: " + allCompanies.size());
        adminFacade.deleteCompany(2);
        System.out.println("Deleted, id = 2");
        allCompanies = adminFacade.getAllCompanies();
        System.out.println("Companies in db: " + allCompanies.size());

        for (Company company : allCompanies) {
            System.out.print(company + "\n");
        }
        System.out.println("##########");
        System.out.println("Admin adding 10 new customers");
        System.out.println("    used: addCustomer, getCustomerByEmail");
        List<Customer> newCustomers = FactoryUtils.randomCustomers(10, userServiceImp);
        for (Customer customer : newCustomers) {
            Customer newCustomer = adminFacade.addCustomer(customer);
            System.out.print(newCustomer);
        }
        System.out.println("##########");
        System.out.println("Admin update 2 customers (id = 1,2)");
        System.out.println("    used: updateCustomer, getCustomerById, getAllCustomers");
        List<Customer> newCustomersForUpdate = FactoryUtils.randomCustomers(2, userServiceImp);
        for (int i = 1; i < 3; i++) {
            Customer customer = newCustomersForUpdate.get(i - 1);
            Customer customerDb = adminFacade.getCustomerById(i);
            System.out.print(customer);
        }
        System.out.println("##########");
        List<Customer> allCustomers = adminFacade.getAllCustomers();
        System.out.println("Admin delete customer");
        System.out.println("    used: deleteCustomer");
        System.out.println("Customers in db: " + allCustomers.size());
        adminFacade.deleteCustomer(2);
        System.out.println("Deleted, id = 2");
        allCustomers = adminFacade.getAllCustomers();
        System.out.println("Customers in db: " + allCustomers.size());

        for (Customer customer : allCustomers) {
            System.out.print(customer + "\n");
        }

        System.out.println("");
        System.out.println("########## COMPANY FACADE ##########");

        CompanyFacade companyFacade;
        Company company = adminFacade.getCompanyById(3);

        ClientFacade companyLogin = loginManager.login(company.getCompanyUser().getEmail(), company.getCompanyUser().getPassword());

        //Casting ClientFacade into CompanyFacade
        companyFacade = (CompanyFacade) companyLogin;
        companyFacade.setUserLoginAndCompany(company.getCompanyUser());//not happening automatically

        companyFacade.getCompanyDetails();

        System.out.println("CompanyId = 3 added 8 new coupons");
        System.out.println("    used: addCoupon, getAllCompanyCoupons");

        List<Coupon> newCouponsCompanyId1 = FactoryUtils.randomCoupons(8, company);
        for (Coupon coupon : newCouponsCompanyId1) {
            System.out.println(coupon.getCompany() + " " + coupon.getTitle());
        }
        System.out.println("...ADDING COUPONS...");
        for (Coupon coupon : newCouponsCompanyId1) {
            System.out.println("Company: " + coupon.getCompany());
            companyFacade.addCoupon(coupon);
        }

        System.out.println("#Print all company 3 coupons");
        List<Coupon> allCompanyCoupons = companyFacade.getAllCompanyCoupons();
        for (Coupon coupon : allCompanyCoupons) {
            System.out.println(coupon);
        }

        System.out.println("##########");
        System.out.println("updated couponId = 3");
        System.out.println("    used: updateCoupon, getSingleCoupon");

        //updateCoupon
        Coupon updatedCoupon = companyFacade.getSingleCoupon(3);
        updatedCoupon.setTitle("Updated title");
        System.out.println("UPDATED coupon: " + updatedCoupon);
        companyFacade.updateCoupon(updatedCoupon, 3);

        allCompanyCoupons = companyFacade.getAllCompanyCoupons();
        for (Coupon coupon : allCompanyCoupons) {
            System.out.println(coupon);
        }

        //deleteCoupon
        System.out.println("##########");
        System.out.println("deleted couponId = 3");
        System.out.println("    used: deleteCouponById");
        System.out.println("Company Coupons size= " + allCompanyCoupons.size());
        companyFacade.deleteCoupon(3);
        allCompanyCoupons = companyFacade.getAllCompanyCoupons();
        System.out.println("Company Coupons size= " + allCompanyCoupons.size());
        System.out.println("#ALL COMPANY COUPONS#");
        for (Coupon coupon : allCompanyCoupons) {
            System.out.println(coupon);
        }

        System.out.println("");
        companyFacade.getCompanyDetails();

        System.out.println("Coupons count by category");
        System.out.println("    used: getCompanyCategoryCoupons");
        System.out.println("Food: " + companyFacade.getAllCompanyCouponsByCategory(Category.FOOD).size());
        System.out.println("Electricity: " + companyFacade.getAllCompanyCouponsByCategory(Category.ELECTRICITY).size());
        System.out.println("Restaurant: " + companyFacade.getAllCompanyCouponsByCategory(Category.RESTAURANT).size());
        System.out.println("Vacation: " + companyFacade.getAllCompanyCouponsByCategory(Category.VACATION).size());

        System.out.println("##########");
        System.out.println("All coupons priced up to 20$ "); //in factoryUtils price 10-30
        System.out.println("    used: getCompanyCouponsMaxPrice");
        List<Coupon> upTo20 = companyFacade.getAllCompanyCouponsUpToMaxPrice(20.0);
        for (Coupon coupon : upTo20) {
            System.out.println(coupon);
        }

        System.out.println("########## CUSTOMER FACADE ##########");

        CustomerFacade customerFacade;
        Customer customerDb =
                adminFacade.getCustomerById(allCustomers.get(ThreadLocalRandom.current()
                                .nextInt(allCustomers.size()))
                        .getId());
        System.out.println("customerDb: " + customerDb);

        ClientFacade customer = loginManager.login(customerDb.getUser().getEmail(), customerDb.getUser().getPassword());

        //casting into CustomerFacade from ClientFacade
        customerFacade = (CustomerFacade) customer;
        customerFacade.setUserLoginAndCustomer(customerDb.getUser()); //making sure login is not null

        customerFacade.getCustomerDerails();

        System.out.println("Customer purchase 5 coupons");
        System.out.println("    used: purchaseCoupon, getCustomerCoupons");

        //random pick 5 coupons out of all coupons
        //need Admin access
        List<Coupon> allCoupons = adminFacade.getAllCoupons();
        List<Coupon> pickedCoupons = new ArrayList<>();
        boolean wasPurchased = false;

        while (pickedCoupons.size() < 5) {
            Coupon randomCoupon = allCoupons.get(ThreadLocalRandom.current().nextInt(allCoupons.size()));
            //check if coupon was picked
            for (Coupon coupon : pickedCoupons) {
                if (randomCoupon.getId() == coupon.getId()) {
                    wasPurchased = true;
                    break;
                }
            }
            if (wasPurchased) {
                wasPurchased = false;
            } else {
                customerFacade.addCouponPurchases(randomCoupon.getId());
                pickedCoupons.add(randomCoupon);
            }
        }

        //show
        List<Coupon> allCustomerCoupons = customerFacade.getAllCustomerCoupons();
        for (Coupon coupon : allCustomerCoupons) {
            System.out.println(coupon);
        }

        System.out.println("##########");
        System.out.println("Customer coupons count by category");
        System.out.println("    used: getCustomerCouponsByCategory");
        System.out.println("Food: " + customerFacade.getAllCustomerCouponsByCategory(Category.FOOD).size());
        System.out.println("Electricity: " + customerFacade.getAllCustomerCouponsByCategory(Category.ELECTRICITY).size());
        System.out.println("Restaurant: " + customerFacade.getAllCustomerCouponsByCategory(Category.RESTAURANT).size());
        System.out.println("Vacation: " + customerFacade.getAllCustomerCouponsByCategory(Category.VACATION).size());

        System.out.println("##########");
        System.out.println("Customer coupons up to 20$");
        System.out.println("    used: getCustomerCouponsByMaxPrice"); //not working
        List<Coupon> upTo20USD = customerFacade.getAllCustomerCouponsByMaxPrice(20.0);
        for (Coupon coupon : upTo20USD) {
            System.out.println(coupon);
        }

        customerFacade.getCustomerDerails();

        System.out.println("3 coupon end date updated to Expired");
        //random pick 5 coupons out of all coupons
        //change to expired endDate
        allCoupons = adminFacade.getAllCoupons();
        pickedCoupons = new ArrayList<>();
        wasPurchased = false;

        while (pickedCoupons.size() < 3) {
            Coupon randomCoupon = allCoupons.get(ThreadLocalRandom.current().nextInt(allCoupons.size()));
            //check if coupon was picked
            for (Coupon coupon : pickedCoupons) {
                if (randomCoupon.getId() == coupon.getId()) {
                    wasPurchased = true;
                    break;
                }
            }
            if (wasPurchased) {
                wasPurchased = false;
            } else {
                pickedCoupons.add(randomCoupon);
                randomCoupon.setEndDate(FactoryUtils.randomExpiredDate());
                companyFacade.updateCoupon(randomCoupon, randomCoupon.getId());
                System.out.println(randomCoupon.getEndDate());
            }
        }

        allCoupons = adminFacade.getAllCoupons();
        System.out.println("All coupons before job");
        for (Coupon coupon : allCoupons) {
            System.out.println(coupon);
        }

    }
}
