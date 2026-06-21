package com.holistics.events.service

import com.holistics.events.dto.CategoryRequest
import com.holistics.events.dto.CategoryResponse
import com.holistics.events.entity.Category
import com.holistics.events.exception.ConflictException
import com.holistics.events.exception.ResourceNotFoundException
import com.holistics.events.repository.CategoryRepository
import com.holistics.events.repository.EventRepository
import com.holistics.events.util.Slugs
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val eventRepository: EventRepository,
) {

    @Transactional(readOnly = true)
    fun findAll(): List<CategoryResponse> =
        categoryRepository.findAll()
            .sortedBy { it.name.lowercase() }
            .map { CategoryResponse.from(it, eventRepository.countByCategoryId(it.id!!)) }

    @Transactional(readOnly = true)
    fun findById(id: Long): Category =
        categoryRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Category not found: $id") }

    @Transactional
    fun create(request: CategoryRequest): CategoryResponse {
        if (categoryRepository.existsByName(request.name.trim())) {
            throw ConflictException("A category with this name already exists")
        }
        val slug = uniqueSlug(request.name)
        val category = Category(
            name = request.name.trim(),
            slug = slug,
            description = request.description?.trim(),
            color = request.color,
        )
        return CategoryResponse.from(categoryRepository.save(category), 0)
    }

    @Transactional
    fun update(id: Long, request: CategoryRequest): CategoryResponse {
        val category = findById(id)
        if (category.name != request.name.trim() && categoryRepository.existsByName(request.name.trim())) {
            throw ConflictException("A category with this name already exists")
        }
        if (category.name != request.name.trim()) {
            category.slug = uniqueSlug(request.name)
        }
        category.name = request.name.trim()
        category.description = request.description?.trim()
        category.color = request.color
        val saved = categoryRepository.save(category)
        return CategoryResponse.from(saved, eventRepository.countByCategoryId(saved.id!!))
    }

    @Transactional
    fun delete(id: Long) {
        val category = findById(id)
        if (eventRepository.countByCategoryId(id) > 0) {
            throw ConflictException("Cannot delete a category that still has events")
        }
        categoryRepository.delete(category)
    }

    private fun uniqueSlug(name: String): String {
        val base = Slugs.slugify(name)
        var candidate = base
        var counter = 2
        while (categoryRepository.existsBySlug(candidate)) {
            candidate = "$base-$counter"
            counter++
        }
        return candidate
    }
}
