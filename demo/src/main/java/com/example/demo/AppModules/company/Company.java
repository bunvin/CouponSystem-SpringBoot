package com.example.demo.AppModules.company;

import com.example.demo.AppModules.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Company {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false)
    int id;

    @ManyToOne
    User user;

    @Column(updatable = false)
    String name;

    String userEmail = this.getUser().getEmail();
    @Builder.Default
    private LocalDateTime createdDateTime = LocalDateTime.now();
    @Builder.Default
    @Setter(AccessLevel.NONE)
    private LocalDateTime modifiedDateTime = LocalDateTime.now();

}
