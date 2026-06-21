package com.holistics.events.repository

import com.holistics.events.entity.Event
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface EventRepository : JpaRepository<Event, Long> {

    fun findBySlug(slug: String): Event?

    fun existsBySlug(slug: String): Boolean

    fun countByCategoryId(categoryId: Long): Long

    @Query(
        """
        SELECT e FROM Event e
        WHERE e.published = true
          AND (:categoryId IS NULL OR e.category.id = :categoryId)
          AND (
                :search IS NULL OR :search = ''
                OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(e.summary) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(e.location) LIKE LOWER(CONCAT('%', :search, '%'))
          )
        """,
    )
    fun search(
        @Param("categoryId") categoryId: Long?,
        @Param("search") search: String?,
        pageable: Pageable,
    ): Page<Event>
}
