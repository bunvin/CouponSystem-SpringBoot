package com.example.demo.testing;

import java.time.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import com.example.demo.AppModules.company.Company;
import com.example.demo.AppModules.coupon.Category;
import com.example.demo.AppModules.coupon.Coupon;
import com.example.demo.AppModules.customer.Customer;
import com.example.demo.AppModules.user.User;
import com.example.demo.AppModules.user.UserServiceImp;
import com.example.demo.AppModules.user.UserType;
import com.example.demo.Error.AppException;

public class FactoryUtils {
    //Companies
    public static List<Company> randomCompanies(int num, UserServiceImp userServiceImp) throws AppException {
        List<Company> newCompanies = new ArrayList<>();

        String[] storeNames = {"The Fin & Scale", "Oceanic Treasures", "Fishy Finds", "The Fish Bowl", "Splash of Aqua"
                , "Deep Blue Market", "Coral Cove Aquatics", "The Fish Tank", "Fresh Catch Emporium", "Tide & Tail Aquatics"};

        for (int i = 0; i < num; i++) {
            String randomStoreName = storeNames[ThreadLocalRandom.current().nextInt(storeNames.length)];
            String randomStoreNameTrimed = randomStoreName.replaceAll("\\s+", "");
            int randomNumber = ThreadLocalRandom.current().nextInt(9, 999);

            User user = User.builder()
                    .email(randomStoreNameTrimed + (i+1) + "@gmail.com")
                    .password("1234" + randomNumber)
                    .userType(UserType.COMPANY)
                    .build();
            user = userServiceImp.addUser(user);

            Company company = Company.builder()
                    .name(randomStoreName + (i + 1))
                    .user(user)
                    .build();
            newCompanies.add(company);
        }
        return newCompanies;
    }

     public static List<Customer> randomCustomers(int num, UserServiceImp userServiceImp) throws AppException {
         List<Customer> newCustomers = new ArrayList<>();

         String[] firstNames = {"Liam", "Emma", "Noah", "Ava", "Ethan", "Sophia", "James", "Mia", "Oliver", "Isabella"};
         String[] lastNames = {"Cohen", "Levy", "Mizrahi", "Goldstein", "Shapiro", "Rosenberg", "Kaplan", "Weiss",
                 "Friedman", "Katz"};

         for (int i = 0; i < num; i++) {
             String randomFirstName = firstNames[ThreadLocalRandom.current().nextInt(firstNames.length)];
             String randomLastName = lastNames[ThreadLocalRandom.current().nextInt(firstNames.length)];
             int randomNumber = ThreadLocalRandom.current().nextInt(0,10);

             User user = User.builder()
                     .email(randomFirstName +"."+randomLastName+ (i + 1) + "@gmail.com")
                     .password("1234" + randomNumber)
                     .userType(UserType.CUSTOMER)
                     .build();
             user = userServiceImp.addUser(user);

             Customer customer = Customer.builder()
                     .firstName(randomFirstName)
                     .lastName(randomLastName)
                     .user(user)
                     .build();
             newCustomers.add(customer);
         }

         return newCustomers;
     }

     public static List<Coupon> randomCoupons(int num, Company company) {
         List<Coupon> newCoupons = new ArrayList<>();
         String title= "Coupon";
         String[] percentage = {"10%","20%","30%","40%","50%","60%","70%","80%"};

         for (int i = 0; i < num; i++) {
             LocalDate start = randomDateAfterToday();
             LocalDate end = randomEndDateAfterStart(start);
             Coupon coupon = Coupon.builder()
                     .company(company)
                     .category(Category.randomCategory())
                     .title(title+(i+1)+" " +percentage[ThreadLocalRandom.current().nextInt(percentage.length)])
                     .description("the best coupon for you !")
                     .startDate(start)
                     .endDate(end)
                     .amount(ThreadLocalRandom.current().nextInt(5,16))
                     .price(ThreadLocalRandom.current().nextInt(10,30))
                     .image("CouponImage.png")
                     .build();

             newCoupons.add(coupon);
         }
         return newCoupons;
     }


    public static LocalDate randomDateAfterToday() {
        LocalDate now = LocalDate.now();
        return now.plusDays(ThreadLocalRandom.current().nextInt(0,21));
    }

    public static LocalDate randomEndDateAfterStart(LocalDate startDate) {
        return startDate.plusDays(ThreadLocalRandom.current().nextInt(1,21));
    }

    public static LocalDate randomExpiredDate() {
        LocalDate now = LocalDate.now();
        return now.minusDays(ThreadLocalRandom.current().nextInt(0,21));
    }


}
