package com.example.demo.AppModules;

import java.time.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import com.example.demo.AppModules.company.Company;
import com.example.demo.AppModules.user.User;

public class FactoryUtils {
    //Companies
    public static List<Company> randomCompanies(int num) {
        List<Company> newCompanies = new ArrayList<>();

        String[] storeNames = {"The Fin & Scale", "Oceanic Treasures", "Fishy Finds", "The Fish Bowl", "Splash of Aqua"
                , "Deep Blue Market", "Coral Cove Aquatics", "The Fish Tank", "Fresh Catch Emporium", "Tide & Tail Aquatics"};

        for (int i = 0; i < num; i++) {
            String randomStoreName = storeNames[ThreadLocalRandom.current().nextInt(storeNames.length)];
            String randomStoreNameTrimed = randomStoreName.replaceAll("\\s+", "");
            int randomNumber = ThreadLocalRandom.current().nextInt(9, 999);

            User user = User.builder()
                    .email(randomStoreNameTrimed + (i + 1) + "@gmail.com")
                    .password("1234" + randomNumber)
                    .build();

            Company company = Company.builder()
                    .name(randomStoreName + (i + 1))
                    .user(user)
                    .build();
            newCompanies.add(company);
        }
        return newCompanies;
    }

    // public static List<Customer> randomCustomers(int num) {
    //     List<Customer> newCustomers = new ArrayList<>();

    //     String[] firstNames = {"Liam", "Emma", "Noah", "Ava", "Ethan", "Sophia", "James", "Mia", "Oliver", "Isabella"};
    //     String[] lastNames = {"Cohen", "Levy", "Mizrahi", "Goldstein", "Shapiro", "Rosenberg", "Kaplan", "Weiss",
    //             "Friedman", "Katz"};

    //     for (int i = 0; i < num; i++) {
    //         String randomFirstName = firstNames[ThreadLocalRandom.current().nextInt(firstNames.length)];
    //         String randomLastName = lastNames[ThreadLocalRandom.current().nextInt(firstNames.length)];

    //         Customer customer = Customer.builder()
    //                 .firstName(randomFirstName)
    //                 .lastName(randomLastName)
    //                 .email(randomFirstName + randomLastName + (i + 1) + "@gmail.com")
    //                 .password(Integer.toString(ThreadLocalRandom.current().nextInt(9999, 99999))
    //                 );

    //         newCustomers.add(customer);
    //     }

    //     return newCustomers;
    // }

    // public static List<Coupon> randomCoupons(int num, int companyId) {
    //     List<Coupon> newCoupons = new ArrayList<>();
    //     String title= "Coupon";
    //     String[] percentage = {"10%","20%","30%","40%","50%","60%","70%","80%"};

    //     for (int i = 0; i < num; i++) {
    //         Date start = randomDate();
    //         Date end = randomEnd(start);
    //         Coupon coupon = Coupon.builder()
    //                 .companyID(companyId)
    //                 .category(Category.randomCategory())
    //                 .title(title+(i+1)+" " +percentage[ThreadLocalRandom.current().nextInt(percentage.length)])
    //                 .description("the best coupon for you !")
    //                 .startDate(start)
    //                 .endDate(end)
    //                 .amount(ThreadLocalRandom.current().nextInt(5,16))
    //                 .price(ThreadLocalRandom.current().nextInt(10,30))
    //                 .image("CouponImage.png");

    //         newCoupons.add(coupon);
    //     }
    //     return newCoupons;
    // }

    //DATES
    //random start date- 3 weeks back
    //random end date- 3 weeks forward
    //random start and end date

    public static Date randomExpiredDate() {
        LocalDate now = LocalDate.now();
        LocalDate randomDate = now.minusDays(ThreadLocalRandom.current().nextInt(0,21));
        LocalDateTime randomDateTime = randomDate.atStartOfDay();

        return Date.from(randomDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    public static Date randomDate() {
        LocalDate now = LocalDate.now();
        LocalDate randomDate = now.plusDays(ThreadLocalRandom.current().nextInt(0,21));
        LocalDateTime randomDateTime = randomDate.atStartOfDay();

        return Date.from(randomDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    public static Date randomEnd(Date startDate) {
        //Date to LocalDate
        Instant instant = startDate.toInstant();
        ZonedDateTime zonedDateTime = instant.atZone(ZoneId.systemDefault());
        LocalDate start = zonedDateTime.toLocalDate();

        LocalDate randomEnd = start.plusDays(ThreadLocalRandom.current().nextInt(0,21));
        LocalDateTime randomEndTime = randomEnd.atStartOfDay();

        return Date.from(randomEndTime.atZone(ZoneId.systemDefault()).toInstant());
    }


}
