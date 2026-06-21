package com.holistics.events.controller

import com.holistics.events.dto.AuthResponse
import com.holistics.events.dto.LoginRequest
import com.holistics.events.dto.RegisterRequest
import com.holistics.events.dto.UserResponse
import com.holistics.events.repository.UserRepository
import com.holistics.events.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
    private val userRepository: UserRepository,
) {

    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<AuthResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request))

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): AuthResponse =
        authService.login(request)

    @GetMapping("/me")
    fun me(@AuthenticationPrincipal principal: UserDetails): UserResponse {
        val user = userRepository.findByEmail(principal.username)
            ?: throw IllegalStateException("Authenticated user not found")
        return UserResponse.from(user)
    }
}
