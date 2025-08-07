package com.riverad.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Email(message = "邮箱格式不正确")
    @NotBlank(message = "邮箱不能为空")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "密码不能为空")
    @Size(min = 60, max = 60, message = "密码哈希长度必须为60位")
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Size(max = 100, message = "名字长度不能超过100字符")
    @Column(name = "first_name")
    private String firstName;

    @Size(max = 100, message = "姓氏长度不能超过100字符")
    @Column(name = "last_name")
    private String lastName;

    @Column(name = "preferred_language", length = 5)
    private String preferredLanguage = "en";

    @Column(name = "preferred_currency", length = 3)
    private String preferredCurrency = "USD";

    @Column(name = "timezone", length = 50)
    private String timezone = "UTC";

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "email_verified")
    private Boolean emailVerified = false;

    // Constructors
    public User() {}

    public User(String email, String passwordHash, String firstName, String lastName) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPreferredLanguage() {
        return preferredLanguage;
    }

    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }

    public String getPreferredCurrency() {
        return preferredCurrency;
    }

    public void setPreferredCurrency(String preferredCurrency) {
        this.preferredCurrency = preferredCurrency;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getFullName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        } else if (firstName != null) {
            return firstName;
        } else if (lastName != null) {
            return lastName;
        }
        return email; // fallback to email
    }
}