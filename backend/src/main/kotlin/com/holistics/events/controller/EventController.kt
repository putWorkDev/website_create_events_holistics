package com.holistics.events.controller

import com.holistics.events.dto.EventResponse
import com.holistics.events.dto.MessageResponse
import com.holistics.events.dto.PagedResponse
import com.holistics.events.dto.RsvpRequest
import com.holistics.events.service.EventService
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/events")
class EventController(
    private val eventService: EventService,
) {

    @GetMapping
    fun list(
        @RequestParam(required = false) categoryId: Long?,
        @RequestParam(required = false) search: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "9") size: Int,
    ): PagedResponse<EventResponse> = eventService.listPublic(categoryId, search, page, size)

    @GetMapping("/{slug}")
    fun getBySlug(@PathVariable slug: String): EventResponse = eventService.getBySlug(slug)

    @PostMapping("/{slug}/rsvp")
    fun rsvp(
        @PathVariable slug: String,
        @Valid @RequestBody request: RsvpRequest,
    ): MessageResponse = eventService.rsvp(slug, request)
}
