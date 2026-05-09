package com.vaultsecure;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class VaultSecureApplication {
    public static void main(String[] args) {
        SpringApplication.run(VaultSecureApplication.class, args);
    }
}
