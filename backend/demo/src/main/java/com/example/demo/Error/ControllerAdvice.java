package com.example.demo.Error;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

public class ControllerAdvice {
    @ExceptionHandler(value = {AppException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)

    public Error handleError(AppException e) {
        return new Error(e.getErrorMessage().getCode(), e.getErrorMessage().getMessage());
    }

}