package com.billim.domain.image.api

import com.billim.domain.common.api.dto.ImageUploadResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/v1/images")
class ImageUploadController {

    /**
     * POST /api/v1/images/upload
     * 이미지 업로드
     */
    @PostMapping("/upload")
    fun uploadImage(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestParam("file") file: MultipartFile,
        @RequestParam(required = false, name = "work_order_id") workOrderId: Long?
    ): ResponseEntity<ImageUploadResponse> {
        // 서비스 호출: imageService.upload(userDetails.username, file, workOrderId)
        val response = ImageUploadResponse(
            id = 1L,
            imageUrl = "https://example.com/images/1.jpg"
        )
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    /**
     * DELETE /api/v1/images/{id}
     * 이미지 삭제
     */
    @DeleteMapping("/{id}")
    fun deleteImage(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PathVariable id: Long
    ): ResponseEntity<Unit> {
        // 서비스 호출: imageService.delete(userDetails.username, id)
        return ResponseEntity.noContent().build()
    }
}
