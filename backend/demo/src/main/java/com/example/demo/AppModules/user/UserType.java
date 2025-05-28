package com.example.demo.AppModules.user;

public enum UserType {
    ADMIN("admin"),
    COMPANY("company"),
    CUSTOMER("customer");
    
    private final String type;
    
    UserType(String type) {
        this.type = type;
    }
    
    public String getType() {
        return this.type;
    }
        
}