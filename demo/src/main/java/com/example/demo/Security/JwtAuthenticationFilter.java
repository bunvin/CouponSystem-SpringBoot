package com.example.demo.Security;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.AppModules.user.User;
import com.example.demo.Error.AppException;



@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Debug logging remains the same
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        System.out.println("JwtAuthenticationFilter processing request: " + method + " " + requestURI);

        // Skip authentication for login endpoint - remains the same
        if (requestURI.equals("/api/auth/login") || requestURI.startsWith("/api/auth/")) {
            System.out.println("Skipping JWT authentication for auth endpoint");
            filterChain.doFilter(request, response);
            return;
        }

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                System.out.println("Error extracting username from token: " + e.getMessage());
                filterChain.doFilter(request, response);
                return;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                // Get UserDetails from UserDetailsService (not User)
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Validate token against UserDetails (not User)
                if (jwtUtil.validateToken(jwt, userDetails)) {
                    // Create authentication with UserDetails (not User)
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (UsernameNotFoundException e) {
                System.out.println("User not found: " + e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }
}




