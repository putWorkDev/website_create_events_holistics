package com.holistics.events.repository

import com.holistics.events.entity.Role
import com.holistics.events.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String): User?
    fun existsByEmail(email: String): Boolean
    fun countByRole(role: Role): Long
}
