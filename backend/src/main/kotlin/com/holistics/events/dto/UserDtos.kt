package com.holistics.events.dto

import com.holistics.events.entity.Role
import com.holistics.events.entity.User
import jakarta.validation.constraints.NotNull
import java.time.Instant

data class UserResponse(
    val id: Long,
    val name: String,
    val email: String,
    val role: Role,
    val createdAt: Instant,
) {
    companion object {
        fun from(user: User) = UserResponse(
            id = user.id!!,
            name = user.name,
            email = user.email,
            role = user.role,
            createdAt = user.createdAt,
        )
    }
}

data class UpdateUserRoleRequest(
    @field:NotNull
    val role: Role,
)
