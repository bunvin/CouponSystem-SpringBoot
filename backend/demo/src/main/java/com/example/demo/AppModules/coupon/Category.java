package com.example.demo.AppModules.coupon;

import java.util.concurrent.ThreadLocalRandom;

public enum Category {
    FOOD("food"),
    ELECTRICITY("electricity"),
    RESTAURANT("resturant"),
    VACATION("vacation");

    private final String category;

    Category(String category) {
        this.category = category;
    }

    public static Category randomCategory() {
        return Category.values()[ThreadLocalRandom.current()
                .nextInt(Category.values().length)];
    }

    @Override
    public String toString() {
        return "Category='" + category+"'";
    }
}
