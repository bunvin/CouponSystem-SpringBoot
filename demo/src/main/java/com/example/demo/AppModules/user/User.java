package com.example.demo.AppModules.user;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String email;
    private String password;
    //many to one?
    @Column(updatable = false)
    @Setter(AccessLevel.NONE)
    private int userType;
    @Column(updatable = false)
    @Setter(AccessLevel.NONE)
    @Builder.Default
    private LocalDateTime createdDateTime = LocalDateTime.now();
    @Builder.Default
    @Setter(AccessLevel.NONE)
    private LocalDateTime modifiedDateTime = LocalDateTime.now();
}
