package com.example.demo.Security;

public class TokenResponse {
    private String token;
    
    public TokenResponse() {
    }
    
    public TokenResponse(String token) {
        this.token = token;
    }
    
    // Getter
    public String getToken() {
        return token;
    }
    
    // Setter
    public void setToken(String token) {
        this.token = token;
    }
    
    // toString method
    @Override
    public String toString() {
        return "TokenResponse{" +
                "token='" + token + '\'' +
                '}';
    }
    
    // Builder pattern implementation
    public static TokenResponseBuilder builder() {
        return new TokenResponseBuilder();
    }
    
    public static class TokenResponseBuilder {
        private String token;
        
        TokenResponseBuilder() {
        }
        
        public TokenResponseBuilder token(String token) {
            this.token = token;
            return this;
        }
        
        public TokenResponse build() {
            return new TokenResponse(token);
        }
    }
}
