package com.holistics.events.service

import com.holistics.events.dto.AuthResponse
import com.holistics.events.dto.LoginRequest
import com.holistics.events.dto.RegisterRequest
import com.holistics.events.dto.UserResponse
import com.holistics.events.entity.Role
import com.holistics.events.entity.User
import com.holistics.events.exception.ConflictException
import com.holistics.events.repository.UserRepository
import com.holistics.events.security.JwtService
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
) {

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByEmail(request.email.lowercase())) {
            throw ConflictException("An account with this email already exists")
        }
        val user = User(
            name = request.name.trim(),
            email = request.email.lowercase().trim(),
            passwordHash = passwordEncoder.encode(request.password),
            role = Role.USER,
        )
        val saved = userRepository.save(user)
        return buildAuthResponse(saved)
    }

    @Transactional(readOnly = true)
    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByEmail(request.email.lowercase().trim())
            ?: throw BadCredentialsException("Invalid email or password")
        if (!passwordEncoder.matches(request.password, user.passwordHash)) {
            throw BadCredentialsException("Invalid email or password")
        }
        return buildAuthResponse(user)
    }

    private fun buildAuthResponse(user: User): AuthResponse {
        val token = jwtService.generateToken(user.email, user.role.name, user.id!!)
        return AuthResponse(token = token, user = UserResponse.from(user))
    }
}
