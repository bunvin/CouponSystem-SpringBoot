package com.example.demo.Security;

public class LoginRequest {

    private String email;
    private String password;
    private String userType; 
    
    public LoginRequest() {
    }
    
    public LoginRequest(String email, String password, String userType) {
        this.email = email;
        this.password = password;
        this.userType = userType;

    }
    
    // Getters
    public String getEmail() {
        return email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public String getUserType() {
        return userType;
    }

    // Setters
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public void setUserType(String userType) {
        this.userType = userType;
    }


    
    // Builder pattern implementation
    public static LoginRequestBuilder builder() {
        return new LoginRequestBuilder();
    }
    
    public static class LoginRequestBuilder {
        private String email;
        private String password;
        private String userType;
        
        LoginRequestBuilder() {
        }
        
        public LoginRequestBuilder email(String email) {
            this.email = email;
            return this;
        }
        
        public LoginRequestBuilder password(String password) {
            this.password = password;
            return this;
        }
        
        public LoginRequestBuilder userType(String userType) {
            this.userType = userType;
            return this;
        }
        public LoginRequest build() {
            return new LoginRequest(email, password, userType);
        }
    }
}
