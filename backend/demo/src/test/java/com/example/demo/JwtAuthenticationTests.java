package com.example.demo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import com.example.demo.AppModules.company.Company;
import com.example.demo.AppModules.customer.Customer;
import com.example.demo.AppModules.user.User;
import com.example.demo.AppModules.user.UserType;
import com.example.demo.Security.LoginRequest;
import com.example.demo.Security.TokenResponse;

import static org.junit.jupiter.api.Assertions.*;

import java.util.UUID;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(OrderAnnotation.class)
public class JwtAuthenticationTests {

    @LocalServerPort // This is the correct annotation for the random port
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    // Test data
    private static String adminToken;
    @Value("${adminEmail}")
    private String ADMIN_EMAIL;
    @Value("${adminPassword}")
    private String ADMIN_PASSWORD;
    private static final String TEST_COMPANY_EMAIL = "company_" + UUID.randomUUID().toString().substring(0, 8) + "@test.com";
    private static final String TEST_CUSTOMER_EMAIL = "customer_" + UUID.randomUUID().toString().substring(0, 8) + "@test.com";
    private static final String TEST_PASSWORD = "password123";
    private static int companyId = 0;
    private static int customerId = 0;
    
    private String baseUrl() {
        return "http://localhost:" + port;
    }

    @BeforeEach
    public void setup() {
        // Only login as admin once if we don't have the token yet
        if (adminToken == null) {
            // Login as admin to get JWT token
            LoginRequest loginRequest = new LoginRequest();
            loginRequest.setEmail(ADMIN_EMAIL);
            loginRequest.setPassword(ADMIN_PASSWORD);
            loginRequest.setUserType("ADMIN");

            ResponseEntity<TokenResponse> loginResponse = restTemplate.postForEntity(
                    baseUrl() + "/api/auth/login", 
                    loginRequest, 
                    TokenResponse.class);

            if (loginResponse.getStatusCode() == HttpStatus.OK) {
                adminToken = loginResponse.getBody().getToken();
                System.out.println("Admin logged in successfully: " + adminToken);
            } else {
                fail("Failed to login as admin: " + loginResponse.getStatusCode());
            }
        }
    }

    @Test
    @Order(1)
    public void testCreateCompanyUser() {
        // Create headers with admin JWT token
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(adminToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create a user for the company
        User companyUser = new User();
        companyUser.setEmail(TEST_COMPANY_EMAIL);
        companyUser.setPassword(TEST_PASSWORD);
        companyUser.setUserType(UserType.COMPANY);

        // Create a company
        Company company = new Company();
        company.setName("Test Company " + UUID.randomUUID().toString().substring(0, 8));
        company.setCompanyUser(companyUser);

        // Make request
        HttpEntity<Company> request = new HttpEntity<>(company, headers);
        ResponseEntity<Company> response = restTemplate.postForEntity(
                baseUrl() + "/api/admin/companies", 
                request, 
                Company.class);

        // Verify company creation
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getId());
        companyId = response.getBody().getId();
        System.out.println("Created company with ID: " + companyId);
    }

    @Test
    @Order(2)
    public void testCreateCustomerUser() {
        // Create headers with admin JWT token
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(adminToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create a user for the customer
        User customerUser = new User();
        customerUser.setEmail(TEST_CUSTOMER_EMAIL);
        customerUser.setPassword(TEST_PASSWORD);
        customerUser.setUserType(UserType.CUSTOMER);

        // Create a customer
        Customer customer = new Customer();
        customer.setFirstName("Test");
        customer.setLastName("Customer");
        customer.setUser(customerUser);

        // Make request
        HttpEntity<Customer> request = new HttpEntity<>(customer, headers);
        ResponseEntity<Customer> response = restTemplate.postForEntity(
                baseUrl() + "/api/admin/customers", 
                request, 
                Customer.class);

        // Verify customer creation
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getId());
        customerId = response.getBody().getId();
        System.out.println("Created customer with ID: " + customerId);
    }

    @Test
    @Order(3)
    public void testCompanyLogin() {
        // Create login request for company
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TEST_COMPANY_EMAIL);
        loginRequest.setPassword(TEST_PASSWORD);
        loginRequest.setUserType("COMPANY");

        // Make login request
        ResponseEntity<TokenResponse> response = restTemplate.postForEntity(
                baseUrl() + "/api/auth/login", 
                loginRequest, 
                TokenResponse.class);

        // Verify login success
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getToken());
        String companyToken = response.getBody().getToken();
        System.out.println("Company logged in successfully");

        // Test accessing company resources with token
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(companyToken);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<Company> companyResponse = restTemplate.exchange(
                baseUrl() + "/api/companies/profile", 
                HttpMethod.GET, 
                entity, 
                Company.class);

        assertEquals(HttpStatus.OK, companyResponse.getStatusCode());
        assertNotNull(companyResponse.getBody());
        assertEquals(companyId, companyResponse.getBody().getId());
    }

    @Test
    @Order(4)
    public void testCustomerLogin() {
        // Create login request for customer
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TEST_CUSTOMER_EMAIL);
        loginRequest.setPassword(TEST_PASSWORD);
        loginRequest.setUserType("CUSTOMER");

        // Make login request
        ResponseEntity<TokenResponse> response = restTemplate.postForEntity(
                baseUrl() + "/api/auth/login", 
                loginRequest, 
                TokenResponse.class);

        // Verify login success
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getToken());
        String customerToken = response.getBody().getToken();
        System.out.println("Customer logged in successfully");

        // Test accessing customer resources with token
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(customerToken);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<Customer> customerResponse = restTemplate.exchange(
                baseUrl() + "/api/customers/profile", 
                HttpMethod.GET, 
                entity, 
                Customer.class);

        assertEquals(HttpStatus.OK, customerResponse.getStatusCode());
        assertNotNull(customerResponse.getBody());
        assertEquals(customerId, customerResponse.getBody().getId());
    }

    @Test
    @Order(5)
    public void testInvalidLogin() {
        // Create login request with wrong password
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(TEST_COMPANY_EMAIL);
        loginRequest.setPassword("wrong_password");
        loginRequest.setUserType("COMPANY");

        // Make login request
        ResponseEntity<Object> response = restTemplate.postForEntity(
                baseUrl() + "/api/auth/login", 
                loginRequest, 
                Object.class);

        // Verify login failure
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());

        // Test with wrong user type
        loginRequest.setPassword(TEST_PASSWORD);
        loginRequest.setUserType("CUSTOMER"); // Wrong user type for this email

        response = restTemplate.postForEntity(
                baseUrl() + "/api/auth/login", 
                loginRequest, 
                Object.class);

        // Verify login failure
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    @Order(6)
    public void testUnauthorizedAccess() {
        // Try to access admin resources without token
        ResponseEntity<Object> response = restTemplate.getForEntity(
                baseUrl() + "/api/admin/companies", 
                Object.class);

        // Verify unauthorized access
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
}