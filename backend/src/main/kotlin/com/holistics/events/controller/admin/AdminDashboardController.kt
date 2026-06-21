package com.holistics.events.controller.admin

import com.holistics.events.dto.DashboardStats
import com.holistics.events.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/admin/dashboard")
class AdminDashboardController(
    private val userService: UserService,
) {

    @GetMapping("/stats")
    fun stats(): DashboardStats = userService.dashboardStats()
}
