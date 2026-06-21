package com.holistics.events.repository

import com.holistics.events.entity.Attendee
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AttendeeRepository : JpaRepository<Attendee, Long> {
    fun countByEventId(eventId: Long): Long
    fun existsByEventIdAndEmail(eventId: Long, email: String): Boolean
    fun findByEventId(eventId: Long): List<Attendee>
}
