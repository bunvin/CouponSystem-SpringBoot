package com.example.demo.Testing;

import org.springframework.boot.CommandLineRunner;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;

@EnableScheduling //allows the scheduled dailyJob to run
@Component
public class Test implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {

    }
}
