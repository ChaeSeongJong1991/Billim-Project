package com.billim.global.exception

/**
 * 요청한 엔티티를 찾을 수 없을 때 발생하는 예외
 *
 * @param resourceId 찾지 못한 리소스의 ID
 * @param message 에러 메시지
 */
class EntityNotFoundException(
    val resourceId: Any? = null,
    message: String = "Entity not found"
) : RuntimeException(message)
