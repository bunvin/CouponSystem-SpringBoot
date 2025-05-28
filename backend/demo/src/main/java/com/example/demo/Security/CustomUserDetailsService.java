package com.example.demo.Security;

import com.example.demo.AppModules.user.User;
import com.example.demo.AppModules.user.UserServiceImp;
import com.example.demo.Error.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserServiceImp userService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        try {
            User user = userService.getUserByEmail(email);
            if (user != null) {
                return new UserDetailsImpl(user);
            }
        } catch (AppException e) {
            throw new UsernameNotFoundException("User not found", e);
        }

        throw new UsernameNotFoundException("User email not found");
    }
}