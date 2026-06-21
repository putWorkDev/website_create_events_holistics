package com.holistics.events.dto

import org.springframework.data.domain.Page

data class PagedResponse<T>(
    val content: List<T>,
    val page: Int,
    val size: Int,
    val totalElements: Long,
    val totalPages: Int,
    val first: Boolean,
    val last: Boolean,
) {
    companion object {
        fun <S, T> of(page: Page<S>, mapper: (S) -> T) = PagedResponse(
            content = page.content.map(mapper),
            page = page.number,
            size = page.size,
            totalElements = page.totalElements,
            totalPages = page.totalPages,
            first = page.isFirst,
            last = page.isLast,
        )
    }
}

data class DashboardStats(
    val totalEvents: Long,
    val publishedEvents: Long,
    val totalCategories: Long,
    val totalUsers: Long,
    val totalAttendees: Long,
    val upcomingEvents: Long,
)

data class MessageResponse(
    val message: String,
)
