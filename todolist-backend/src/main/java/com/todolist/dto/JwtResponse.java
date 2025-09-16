package com.todolist.dto;

public class JwtResponse {
    private String accessToken;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;

    public JwtResponse(String accessToken, Long id, String username, String email) {
        this.accessToken = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return type;
    }

    public void setTokenType(String tokenType) {
        this.type = tokenType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}