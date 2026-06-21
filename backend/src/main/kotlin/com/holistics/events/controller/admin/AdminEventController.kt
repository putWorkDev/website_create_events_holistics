package com.holistics.events.controller.admin

import com.holistics.events.dto.EventRequest
import com.holistics.events.dto.EventResponse
import com.holistics.events.service.EventService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/admin/events")
class AdminEventController(
    private val eventService: EventService,
) {

    @GetMapping
    fun list(): List<EventResponse> = eventService.listAll()

    @GetMapping("/{id}")
    fun get(@PathVariable id: Long): EventResponse = eventService.getById(id)

    @PostMapping
    fun create(@Valid @RequestBody request: EventRequest): ResponseEntity<EventResponse> =
        ResponseEntity.status(HttpStatus.CREATED).body(eventService.create(request))

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @Valid @RequestBody request: EventRequest): EventResponse =
        eventService.update(id, request)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        eventService.delete(id)
        return ResponseEntity.noContent().build()
    }
}
