package com.billim.global.exception

import com.billim.domain.common.api.dto.ApiResponse
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.context.request.WebRequest
import java.time.LocalDateTime

/**
 * 전역 예외 처리 핸들러
 * 모든 Controller에서 발생하는 예외를 일관되게 처리
 */
@RestControllerAdvice
class GlobalExceptionHandler {
    private val logger = LoggerFactory.getLogger(this::class.java)

    /**
     * 유효성 검증 실패 처리 (MethodArgumentNotValidException)
     * Request Body의 @Valid 검증 실패 시 발생
     */
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(
        e: MethodArgumentNotValidException,
        request: WebRequest
    ): ResponseEntity<ApiResponse<Map<String, String>>> {
        logger.warn("Validation error: {}", e.message)

        val errors = e.bindingResult.fieldErrors
            .groupBy { it.field }
            .mapValues { (_, errors) -> errors.map { it.defaultMessage ?: "Invalid value" }.first() }

        return ResponseEntity(
            ApiResponse.error("유효성 검증 실패", errors),
            HttpStatus.BAD_REQUEST
        )
    }

    /**
     * 엔티티를 찾을 수 없을 때 처리
     */
    @ExceptionHandler(EntityNotFoundException::class)
    fun handleEntityNotFoundException(
        e: EntityNotFoundException,
        request: WebRequest
    ): ResponseEntity<ApiResponse<Map<String, Any>>> {
        logger.warn("Entity not found: resourceId={}", e.resourceId)

        val errorData = mutableMapOf<String, Any>()
        if (e.resourceId != null) {
            errorData["resourceId"] = e.resourceId
        }
        errorData["path"] = request.getDescription(false).replace("uri=", "")

        return ResponseEntity(
            ApiResponse.error(e.message ?: "요청한 리소스를 찾을 수 없습니다", errorData),
            HttpStatus.NOT_FOUND
        )
    }

    /**
     * 잘못된 요청 처리 (IllegalArgumentException)
     */
    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgumentException(
        e: IllegalArgumentException,
        request: WebRequest
    ): ResponseEntity<ApiResponse<Map<String, Any>>> {
        logger.warn("Illegal argument: {}", e.message)

        val errorData = mapOf(
            "message" to (e.message ?: "Invalid argument"),
            "path" to request.getDescription(false).replace("uri=", "")
        )

        return ResponseEntity(
            ApiResponse.error("잘못된 요청", errorData),
            HttpStatus.BAD_REQUEST
        )
    }

    /**
     * 사용자 정의 비즈니스 로직 예외 처리
     */
    @ExceptionHandler(BusinessException::class)
    fun handleBusinessException(
        e: BusinessException,
        request: WebRequest
    ): ResponseEntity<ApiResponse<Map<String, Any>>> {
        logger.warn("Business exception: {}", e.message)

        val errorData = mapOf(
            "message" to (e.message ?: "Business logic error"),
            "path" to request.getDescription(false).replace("uri=", "")
        )

        return ResponseEntity(
            ApiResponse.error(e.message ?: "요청 처리 중 오류가 발생했습니다", errorData),
            HttpStatus.BAD_REQUEST
        )
    }

    /**
     * 예상치 못한 일반 예외 처리
     */
    @ExceptionHandler(Exception::class)
    fun handleGeneralException(
        e: Exception,
        request: WebRequest
    ): ResponseEntity<ApiResponse<Map<String, Any>>> {
        logger.error("Unexpected error occurred", e)

        val errorData = mapOf(
            "timestamp" to LocalDateTime.now(),
            "path" to request.getDescription(false).replace("uri=", ""),
            "error" to (e.javaClass.simpleName)
        )

        return ResponseEntity(
            ApiResponse.error("서버 오류가 발생했습니다", errorData),
            HttpStatus.INTERNAL_SERVER_ERROR
        )
    }
}
