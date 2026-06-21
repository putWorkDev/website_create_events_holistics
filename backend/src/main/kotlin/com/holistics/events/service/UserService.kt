package com.holistics.events.service

import com.holistics.events.dto.DashboardStats
import com.holistics.events.dto.UserResponse
import com.holistics.events.entity.Role
import com.holistics.events.exception.BadRequestException
import com.holistics.events.exception.ResourceNotFoundException
import com.holistics.events.repository.AttendeeRepository
import com.holistics.events.repository.CategoryRepository
import com.holistics.events.repository.EventRepository
import com.holistics.events.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
class UserService(
    private val userRepository: UserRepository,
    private val eventRepository: EventRepository,
    private val categoryRepository: CategoryRepository,
    private val attendeeRepository: AttendeeRepository,
) {

    @Transactional(readOnly = true)
    fun findAll(): List<UserResponse> =
        userRepository.findAll()
            .sortedByDescending { it.createdAt }
            .map { UserResponse.from(it) }

    @Transactional
    fun updateRole(id: Long, role: Role): UserResponse {
        val user = userRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("User not found: $id") }
        if (user.role == Role.ADMIN && role != Role.ADMIN && userRepository.countByRole(Role.ADMIN) <= 1) {
            throw BadRequestException("Cannot demote the last remaining admin")
        }
        user.role = role
        return UserResponse.from(userRepository.save(user))
    }

    @Transactional(readOnly = true)
    fun dashboardStats(): DashboardStats {
        val allEvents = eventRepository.findAll()
        val now = Instant.now()
        return DashboardStats(
            totalEvents = allEvents.size.toLong(),
            publishedEvents = allEvents.count { it.published }.toLong(),
            totalCategories = categoryRepository.count(),
            totalUsers = userRepository.count(),
            totalAttendees = attendeeRepository.count(),
            upcomingEvents = allEvents.count { it.startTime.isAfter(now) }.toLong(),
        )
    }
}
