package com.billim.global.exception

/**
 * 비즈니스 로직 예외
 * 비즈니스 규칙 위반이나 유효하지 않은 작업에서 발생
 *
 * @param message 에러 메시지
 */
class BusinessException(
    message: String = "Business logic error"
) : RuntimeException(message)
