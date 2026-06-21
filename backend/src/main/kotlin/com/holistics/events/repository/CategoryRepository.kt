package com.holistics.events.repository

import com.holistics.events.entity.Category
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CategoryRepository : JpaRepository<Category, Long> {
    fun findBySlug(slug: String): Category?
    fun existsBySlug(slug: String): Boolean
    fun existsByName(name: String): Boolean
}
