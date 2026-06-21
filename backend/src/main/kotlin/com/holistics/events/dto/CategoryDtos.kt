package com.holistics.events.dto

import com.holistics.events.entity.Category
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CategoryResponse(
    val id: Long,
    val name: String,
    val slug: String,
    val description: String?,
    val color: String,
    val eventCount: Long? = null,
) {
    companion object {
        fun from(category: Category, eventCount: Long? = null) = CategoryResponse(
            id = category.id!!,
            name = category.name,
            slug = category.slug,
            description = category.description,
            color = category.color,
            eventCount = eventCount,
        )
    }
}

data class CategoryRequest(
    @field:NotBlank
    @field:Size(max = 100)
    val name: String,

    @field:Size(max = 500)
    val description: String? = null,

    @field:NotBlank
    val color: String = "#16a34a",
)
