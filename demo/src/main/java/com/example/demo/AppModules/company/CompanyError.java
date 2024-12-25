
package com.example.demo.AppModules.company;

import com.example.demo.Error.ErrorMessage;

import lombok.Getter;

@Getter
public enum CompanyError implements ErrorMessage{
    
    COMPANY_NOT_FOUND(2001, "Company not found"),
    COMPANY_ALREADY_EXISTS(2002, "Company already exists"),
    COMPANY_NAME_ALREADY_EXISTS(2003, "Company name already exists"), 
    COMPANY_EMAIL_ALREADY_EXISTS(2004, "Company email already exists");

    private final int code;
    private final String message;

    CompanyError(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
