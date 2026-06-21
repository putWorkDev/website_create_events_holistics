package com.holistics.events.service

import com.holistics.events.dto.EventRequest
import com.holistics.events.dto.EventResponse
import com.holistics.events.dto.MessageResponse
import com.holistics.events.dto.PagedResponse
import com.holistics.events.dto.RsvpRequest
import com.holistics.events.entity.Attendee
import com.holistics.events.entity.AttendeeStatus
import com.holistics.events.entity.Event
import com.holistics.events.exception.BadRequestException
import com.holistics.events.exception.ConflictException
import com.holistics.events.exception.ResourceNotFoundException
import com.holistics.events.repository.AttendeeRepository
import com.holistics.events.repository.CategoryRepository
import com.holistics.events.repository.EventRepository
import com.holistics.events.repository.UserRepository
import com.holistics.events.util.Slugs
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class EventService(
    private val eventRepository: EventRepository,
    private val categoryRepository: CategoryRepository,
    private val attendeeRepository: AttendeeRepository,
    private val userRepository: UserRepository,
) {

    @Transactional(readOnly = true)
    fun listPublic(
        categoryId: Long?,
        search: String?,
        page: Int,
        size: Int,
    ): PagedResponse<EventResponse> {
        val pageable = PageRequest.of(
            page.coerceAtLeast(0),
            size.coerceIn(1, 50),
            Sort.by(Sort.Direction.ASC, "startTime"),
        )
        val result = eventRepository.search(categoryId, search?.trim()?.ifBlank { null }, pageable)
        return PagedResponse.of(result) { event ->
            EventResponse.from(event, attendeeRepository.countByEventId(event.id!!))
        }
    }

    @Transactional(readOnly = true)
    fun getBySlug(slug: String): EventResponse {
        val event = eventRepository.findBySlug(slug)
            ?: throw ResourceNotFoundException("Event not found: $slug")
        return EventResponse.from(event, attendeeRepository.countByEventId(event.id!!))
    }

    @Transactional(readOnly = true)
    fun listAll(): List<EventResponse> =
        eventRepository.findAll(Sort.by(Sort.Direction.DESC, "startTime"))
            .map { EventResponse.from(it, attendeeRepository.countByEventId(it.id!!)) }

    @Transactional(readOnly = true)
    fun getById(id: Long): EventResponse {
        val event = findEntity(id)
        return EventResponse.from(event, attendeeRepository.countByEventId(event.id!!))
    }

    @Transactional
    fun create(request: EventRequest): EventResponse {
        validateDates(request)
        val category = categoryRepository.findById(request.categoryId)
            .orElseThrow { ResourceNotFoundException("Category not found: ${request.categoryId}") }
        val event = Event(
            title = request.title.trim(),
            slug = uniqueSlug(request.title),
            summary = request.summary?.trim(),
            description = request.description.trim(),
            location = request.location.trim(),
            imageUrl = request.imageUrl?.trim()?.ifBlank { null },
            startTime = request.startTime,
            endTime = request.endTime,
            capacity = request.capacity,
            price = request.price,
            published = request.published,
            category = category,
            createdBy = currentUser(),
        )
        return EventResponse.from(eventRepository.save(event), 0)
    }

    @Transactional
    fun update(id: Long, request: EventRequest): EventResponse {
        validateDates(request)
        val event = findEntity(id)
        val category = categoryRepository.findById(request.categoryId)
            .orElseThrow { ResourceNotFoundException("Category not found: ${request.categoryId}") }
        if (event.title != request.title.trim()) {
            event.slug = uniqueSlug(request.title)
        }
        event.title = request.title.trim()
        event.summary = request.summary?.trim()
        event.description = request.description.trim()
        event.location = request.location.trim()
        event.imageUrl = request.imageUrl?.trim()?.ifBlank { null }
        event.startTime = request.startTime
        event.endTime = request.endTime
        event.capacity = request.capacity
        event.price = request.price
        event.published = request.published
        event.category = category
        val saved = eventRepository.save(event)
        return EventResponse.from(saved, attendeeRepository.countByEventId(saved.id!!))
    }

    @Transactional
    fun delete(id: Long) {
        val event = findEntity(id)
        eventRepository.delete(event)
    }

    @Transactional
    fun rsvp(slug: String, request: RsvpRequest): MessageResponse {
        val event = eventRepository.findBySlug(slug)
            ?: throw ResourceNotFoundException("Event not found: $slug")
        val email = request.email.lowercase().trim()
        if (attendeeRepository.existsByEventIdAndEmail(event.id!!, email)) {
            throw ConflictException("You have already RSVP'd to this event")
        }
        if (event.capacity > 0 && attendeeRepository.countByEventId(event.id!!) >= event.capacity) {
            throw ConflictException("This event is fully booked")
        }
        val attendee = Attendee(
            event = event,
            user = userRepository.findByEmail(email),
            name = request.name.trim(),
            email = email,
            status = AttendeeStatus.GOING,
        )
        attendeeRepository.save(attendee)
        return MessageResponse("You're going to ${event.title}! See you there.")
    }

    private fun validateDates(request: EventRequest) {
        if (!request.endTime.isAfter(request.startTime)) {
            throw BadRequestException("End time must be after start time")
        }
    }

    private fun findEntity(id: Long): Event =
        eventRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Event not found: $id") }

    private fun uniqueSlug(title: String): String {
        val base = Slugs.slugify(title)
        var candidate = base
        var counter = 2
        while (eventRepository.existsBySlug(candidate)) {
            candidate = "$base-$counter"
            counter++
        }
        return candidate
    }

    private fun currentUser() =
        (SecurityContextHolder.getContext().authentication?.name)
            ?.let { userRepository.findByEmail(it) }
}
