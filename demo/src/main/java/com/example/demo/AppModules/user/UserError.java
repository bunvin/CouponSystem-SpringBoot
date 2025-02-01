
package com.example.demo.AppModules.user;

import com.example.demo.Error.ErrorMessage;

public enum UserError implements ErrorMessage{
    
    USER_NOT_FOUND(1001, "User not found"),
    USER_ALREADY_EXISTS(1002, "User already exists"),
    USER_NOT_ADMIN(1003, "Invalid admin, user's email or password mis-match admin account"),
    USER_EMAIL_NOT_UPDATABLE(1004, "User email can not be updated"),
    USER_INVALID(1005, "invalid email or password");

    private final int code;
    private final String message;

    UserError(int code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public int getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
