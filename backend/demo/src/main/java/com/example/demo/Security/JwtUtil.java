package com.example.demo.Security;

import com.example.demo.AppModules.user.UserError;
import com.example.demo.AppModules.user.UserServiceImp;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Lazy;

import com.example.demo.AppModules.company.Company;
import com.example.demo.AppModules.customer.Customer;
import com.example.demo.AppModules.user.User;
import com.example.demo.AppModules.user.UserType;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import com.example.demo.Error.AppException;

@Component
public class JwtUtil {

    @Autowired
    @Lazy
    UserServiceImp userService;

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(UserDetails userDetails) throws AppException {
        // Extract the User object from UserDetails
        User user = null;
        if (userDetails instanceof UserDetailsImpl) {
            user = ((UserDetailsImpl) userDetails).getUser();
        } else {
            throw new AppException(UserError.USER_INVALID);
        }

        Map<String, Object> claims = new HashMap<>();

        // build claims
        if (user != null) {
            // general / user
            claims.put("userType", user.getUserType().name());
            claims.put("userId", user.getId());

            // Type-specific information
            if (user.getUserType() == UserType.COMPANY) {
                Company company = userService.getCompanyByUserId(user.getId());
                claims.put("companyId", company.getId());
                claims.put("companyName", company.getName());
            } else if (user.getUserType() == UserType.CUSTOMER) {
                Customer customer = userService.getCustomerByUserId(user.getId());
                claims.put("customerId", customer.getId());
                claims.put("firstName", customer.getFirstName());
                claims.put("lastName", customer.getLastName());
            }
        }

        return createToken(claims, userDetails.getUsername());
    }

    public String generateToken(User user) throws AppException {
        Map<String, Object> claims = new HashMap<>();
        // build claims
        if (user != null) {
            // general / user
            claims.put("userType", user.getUserType().name());
            claims.put("userId", user.getId());
            // Type-specific information
            if (user.getUserType() == UserType.COMPANY) {
                Company company = userService.getCompanyByUserId(user.getId());
                claims.put("companyId", company.getId());
                claims.put("companyName", company.getName());
            } else if (user.getUserType() == UserType.CUSTOMER) {
                Customer customer = userService.getCustomerByUserId(user.getId());
                claims.put("customerId", customer.getId());
                claims.put("firstName", customer.getFirstName());
                claims.put("lastName", customer.getLastName());
            }
        }
        return createToken(claims, user.getEmail()); //no user without UserName (Email)
    }


// Custom claims extraction methods 
    public String extractUserType(String token) {
        return extractClaim(token, claims -> claims.get("userType", String.class));
    }

    public Integer extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Integer.class));
    }

    public Long extractCompanyId(String token) {
        return extractClaim(token, claims -> claims.get("companyId", Long.class));
    }

    public String extractCompanyName(String token) {
        return extractClaim(token, claims -> claims.get("companyName", String.class));
    }

    public Long extractCustomerId(String token) {
        return extractClaim(token, claims -> claims.get("customerId", Long.class));
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}
