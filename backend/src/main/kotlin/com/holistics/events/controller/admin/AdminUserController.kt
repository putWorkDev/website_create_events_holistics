package com.holistics.events.controller.admin

import com.holistics.events.dto.UpdateUserRoleRequest
import com.holistics.events.dto.UserResponse
import com.holistics.events.service.UserService
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/admin/users")
class AdminUserController(
    private val userService: UserService,
) {

    @GetMapping
    fun list(): List<UserResponse> = userService.findAll()

    @PatchMapping("/{id}/role")
    fun updateRole(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateUserRoleRequest,
    ): UserResponse = userService.updateRole(id, request.role)
}
