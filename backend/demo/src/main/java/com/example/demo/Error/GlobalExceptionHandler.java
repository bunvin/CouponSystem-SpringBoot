package com.example.demo.Error;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = {AppException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public Error handleAppException(AppException e) {
        System.out.println("GlobalExceptionHandler caught AppException: " + e.getMessage());
        return new Error(e.getErrorMessage().getCode(), e.getErrorMessage().getMessage());
    }

    @ExceptionHandler(value = {Exception.class})
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public Error handleGenericException(Exception e) {
        System.out.println("GlobalExceptionHandler caught generic Exception: " + e.getMessage());
        return new Error(500, "An unexpected error occurred: " + e.getMessage());
    }
}


//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.ResponseBody;
//import org.springframework.web.bind.annotation.ResponseStatus;
//import org.springframework.http.HttpStatus;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//
//@ControllerAdvice
//public class GlobalExceptionHandler {
//    @ExceptionHandler(value = {AppException.class})
//    @ResponseStatus(HttpStatus.BAD_REQUEST)
//    @ResponseBody
//    public Error handleError(AppException e) {
//        return new Error(e.getErrorMessage().getCode(), e.getErrorMessage().getMessage());
//    }
//
//}