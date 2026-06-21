package com.holistics.events.dto

import com.holistics.events.entity.Event
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.PositiveOrZero
import jakarta.validation.constraints.Size
import java.math.BigDecimal
import java.time.Instant

data class EventResponse(
    val id: Long,
    val title: String,
    val slug: String,
    val summary: String?,
    val description: String,
    val location: String,
    val imageUrl: String?,
    val startTime: Instant,
    val endTime: Instant,
    val capacity: Int,
    val price: BigDecimal,
    val published: Boolean,
    val category: CategoryResponse,
    val attendeeCount: Long,
    val spotsLeft: Int?,
) {
    companion object {
        fun from(event: Event, attendeeCount: Long = 0) = EventResponse(
            id = event.id!!,
            title = event.title,
            slug = event.slug,
            summary = event.summary,
            description = event.description,
            location = event.location,
            imageUrl = event.imageUrl,
            startTime = event.startTime,
            endTime = event.endTime,
            capacity = event.capacity,
            price = event.price,
            published = event.published,
            category = CategoryResponse.from(event.category),
            attendeeCount = attendeeCount,
            spotsLeft = if (event.capacity > 0) (event.capacity - attendeeCount.toInt()).coerceAtLeast(0) else null,
        )
    }
}

data class EventRequest(
    @field:NotBlank
    @field:Size(max = 180)
    val title: String,

    @field:Size(max = 300)
    val summary: String? = null,

    @field:NotBlank
    val description: String,

    @field:NotBlank
    @field:Size(max = 255)
    val location: String,

    @field:Size(max = 500)
    val imageUrl: String? = null,

    @field:NotNull
    val startTime: Instant,

    @field:NotNull
    val endTime: Instant,

    @field:PositiveOrZero
    val capacity: Int = 0,

    @field:PositiveOrZero
    val price: BigDecimal = BigDecimal.ZERO,

    val published: Boolean = true,

    @field:NotNull
    @field:Min(1)
    val categoryId: Long,
)

data class RsvpRequest(
    @field:NotBlank
    @field:Size(max = 120)
    val name: String,

    @field:NotBlank
    val email: String,
)
