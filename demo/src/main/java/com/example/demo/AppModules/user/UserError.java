
package com.example.demo.AppModules.user;

import com.example.demo.Error.ErrorMessage;

public enum UserError implements ErrorMessage{
    
    USER_NOT_FOUND(1001, "User not found"),
    USER_ALREADY_EXISTS(1002, "User already exists");

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
