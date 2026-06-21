package com.holistics.events.controller

import com.holistics.events.dto.CategoryResponse
import com.holistics.events.service.CategoryService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/categories")
class CategoryController(
    private val categoryService: CategoryService,
) {

    @GetMapping
    fun list(): List<CategoryResponse> = categoryService.findAll()
}
