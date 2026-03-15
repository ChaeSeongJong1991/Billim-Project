# Work Order System API 명세서

**프로젝트**: Billim - 지능형 유지보수 요청 시스템
**작성일**: 2026-03-15
**API 버전**: v1
**Base URL**: `/api/v1`

---

## 목차

1. [개요](#개요)
2. [HTTP 상태코드](#http-상태코드)
3. [Work Order API](#work-order-api)
4. [Vendor API](#vendor-api)
5. [Preventive Maintenance Guide API](#preventive-maintenance-guide-api)
6. [Work Order Image API](#work-order-image-api)
7. [데이터 모델](#데이터-모델)

---

## 개요

이 API는 Billim 플랫폼의 유지보수 요청(Work Order) 시스템을 지원합니다.

### 사용자 역할 (User Roles)
- **TENANT**: 임차인 (민원 작성, 상세 조회)
- **ADMIN**: 관리자 (전체 민원 관리, 업체 배정, 상태 변경)
- **VENDOR**: 협력 업체 (배정받은 민원 조회, 상태 업데이트)
- **LANDLORD**: 건물주 (건물별 민원 조회)

### 인증 (Authentication)
- 모든 엔드포인트는 JWT 토큰이 필요합니다
- Header: `Authorization: Bearer {jwt-token}`

---

## HTTP 상태코드

| 코드 | 의미 | 사용 사례 |
|------|------|---------|
| **200** | OK | 조회/수정 성공 |
| **201** | Created | 생성 성공 (POST) |
| **204** | No Content | 삭제 성공 |
| **400** | Bad Request | 잘못된 요청 (검증 오류) |
| **401** | Unauthorized | 인증 실패 |
| **403** | Forbidden | 권한 부족 |
| **404** | Not Found | 리소스 없음 |
| **409** | Conflict | 상태 충돌 (예: 완료된 민원 재배정) |
| **500** | Internal Server Error | 서버 오류 |

---

## Work Order API

### 민원 생성 (Create Work Order)

```http
POST /api/v1/work-orders
Content-Type: application/json
Authorization: Bearer {jwt-token}
```

#### 요청 (Request)

```json
{
  "roomId": 1,
  "title": "화장실 누수",
  "description": "화장실에서 물이 계속 흐르고 있습니다",
  "category": "PLUMBING",
  "priority": "HIGH",
  "images": []
}
```

**필드 설명**:
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| roomId | Long | O | 호실 ID |
| title | String | O | 민원 제목 (최대 100자) |
| description | String | O | 상세 설명 (최대 1000자) |
| category | String | O | 카테고리: LEAK, APPLIANCE, PLUMBING, ELECTRIC, OTHER |
| priority | String | O | 우선순위: LOW, MEDIUM, HIGH |
| images | Array | X | 이미지 URL 배열 (최대 5개) |

#### 응답 (Response)

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "id": 1,
  "roomId": 1,
  "buildingName": "우리아파트",
  "roomNumber": "201호",
  "tenantName": "김철수",
  "title": "화장실 누수",
  "description": "화장실에서 물이 계속 흐르고 있습니다",
  "category": "PLUMBING",
  "priority": "HIGH",
  "status": "NEW",
  "createdAt": "2026-03-15T10:30:00Z",
  "images": [],
  "vendorId": null
}
```

---

### 민원 목록 조회 (List Work Orders)

```http
GET /api/v1/work-orders
Authorization: Bearer {jwt-token}
```

#### 쿼리 파라미터 (Query Parameters)

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|-------|------|
| status | String | - | 상태 필터: NEW, IN_PROGRESS, COMPLETED, CANCELLED |
| priority | String | - | 우선순위 필터: LOW, MEDIUM, HIGH |
| category | String | - | 카테고리 필터 |
| buildingId | Long | - | 건물 ID 필터 (ADMIN/LANDLORD) |
| vendorId | Long | - | 업체 ID 필터 (ADMIN) |
| page | Integer | 0 | 페이지 (0부터 시작) |
| size | Integer | 20 | 페이지 크기 (최대 100) |
| sort | String | createdAt,desc | 정렬: createdAt, priority, status |

#### 응답 (Response)

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "content": [
    {
      "id": 1,
      "roomId": 1,
      "buildingName": "우리아파트",
      "roomNumber": "201호",
      "tenantName": "김철수",
      "title": "화장실 누수",
      "category": "PLUMBING",
      "priority": "HIGH",
      "status": "IN_PROGRESS",
      "createdAt": "2026-03-15T10:30:00Z",
      "updatedAt": "2026-03-15T14:00:00Z",
      "vendorName": "한수도 수리소",
      "daysElapsed": 2
    }
  ],
  "totalElements": 15,
  "totalPages": 1,
  "currentPage": 0,
  "pageSize": 20,
  "hasNext": false
}
```

---

### 민원 상세 조회 (Get Work Order Detail)

```http
GET /api/v1/work-orders/{id}
Authorization: Bearer {jwt-token}
```

#### 응답 (Response)

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "id": 1,
  "roomId": 1,
  "buildingName": "우리아파트",
  "buildingAddress": "서울시 강남구 테헤란로 123",
  "roomNumber": "201호",
  "tenantName": "김철수",
  "tenantPhone": "010-1234-5678",
  "title": "화장실 누수",
  "description": "화장실에서 물이 계속 흐르고 있습니다. 바닥이 젖어있고 냄새가 납니다.",
  "category": "PLUMBING",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "createdAt": "2026-03-12T14:30:00Z",
  "updatedAt": "2026-03-14T10:00:00Z",
  "images": [
    {
      "id": 1,
      "url": "https://...",
      "uploadedAt": "2026-03-12T14:35:00Z"
    }
  ],
  "vendor": {
    "id": 1,
    "name": "한수도 수리소",
    "phone": "02-1234-5678",
    "email": "hansudo@example.com",
    "rating": 4.8,
    "reviewCount": 24,
    "assignedAt": "2026-03-13T15:30:00Z"
  },
  "timeline": [
    {
      "id": 1,
      "timestamp": "2026-03-14T10:00:00Z",
      "eventType": "VENDOR_ASSIGNED",
      "description": "업체 배정됨 - 한수도 수리소",
      "actor": "admin"
    },
    {
      "id": 2,
      "timestamp": "2026-03-13T15:30:00Z",
      "eventType": "STATUS_CHANGED",
      "description": "상태 변경: 접수 → 진행중",
      "actor": "admin"
    },
    {
      "id": 3,
      "timestamp": "2026-03-12T14:30:00Z",
      "eventType": "CREATED",
      "description": "민원 접수됨",
      "actor": "tenant"
    }
  ],
  "progressPercentage": 66
}
```

---

### 민원 상태 변경 (Update Work Order Status)

```http
PATCH /api/v1/work-orders/{id}/status
Content-Type: application/json
Authorization: Bearer {jwt-token}
```

#### 요청 (Request)

```json
{
  "status": "COMPLETED",
  "note": "수리 완료되었습니다"
}
```

**필드 설명**:
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| status | String | O | NEW, IN_PROGRESS, COMPLETED, CANCELLED |
| note | String | X | 상태 변경 메모 |

#### 응답 (Response)

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "id": 1,
  "status": "COMPLETED",
  "updatedAt": "2026-03-15T16:00:00Z",
  "progressPercentage": 100
}
```

#### 에러 응답

```json
{
  "code": "INVALID_STATUS_TRANSITION",
  "message": "완료된 민원은 상태를 변경할 수 없습니다",
  "timestamp": "2026-03-15T16:00:00Z"
}
```

---

### 민원 삭제 (Delete Work Order)

```http
DELETE /api/v1/work-orders/{id}
Authorization: Bearer {jwt-token}
```

#### 응답 (Response)

```http
HTTP/1.1 204 No Content
```

---

## Vendor API

### 업체 목록 조회 (List Vendors)

```http
GET /api/v1/vendors
Authorization: Bearer {jwt-token}
```

#### 쿼리 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| category | String | 카테고리 필터: LEAK, APPLIANCE, PLUMBING, ELECTRIC |
| status | String | 상태 필터: ACTIVE, INACTIVE |
| page | Integer | 페이지 (0부터 시작) |
| size | Integer | 페이지 크기 (기본 20) |

#### 응답 (Response)

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "content": [
    {
      "id": 1,
      "name": "한수도 수리소",
      "phone": "02-1234-5678",
      "email": "hansudo@example.com",
      "rating": 4.8,
      "reviewCount": 24,
      "completedCount": 32,
      "categories": ["PLUMBING", "LEAK"],
      "status": "ACTIVE",
      "averageCompletionTime": 2.2
    }
  ],
  "totalElements": 10,
  "totalPages": 1,
  "currentPage": 0,
  "pageSize": 20
}
```

---

### 업체에 민원 배정 (Assign Work Order to Vendor)

```http
POST /api/v1/vendors/{vendorId}/assignments
Content-Type: application/json
Authorization: Bearer {jwt-token}
```

#### 요청 (Request)

```json
{
  "workOrderId": 1
}
```

#### 응답 (Response)

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "assignmentId": 1,
  "workOrderId": 1,
  "vendorId": 1,
  "vendorName": "한수도 수리소",
  "assignedAt": "2026-03-15T16:00:00Z"
}
```

---

### 업체의 배정 민원 조회 (Get Vendor's Assigned Work Orders)

```http
GET /api/v1/vendors/{vendorId}/assignments
Authorization: Bearer {jwt-token}
```

#### 쿼리 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| status | String | 상태 필터 |
| page | Integer | 페이지 |
| size | Integer | 페이지 크기 |

#### 응답 (Response)

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "content": [
    {
      "workOrderId": 1,
      "title": "화장실 누수",
      "buildingName": "우리아파트",
      "roomNumber": "201호",
      "priority": "HIGH",
      "status": "IN_PROGRESS",
      "assignedAt": "2026-03-14T10:00:00Z",
      "daysElapsed": 1
    }
  ],
  "totalElements": 5,
  "totalPages": 1,
  "currentPage": 0
}
```

---

## Preventive Maintenance Guide API

### 예방 정비 가이드 목록 (List Maintenance Guides)

```http
GET /api/v1/maintenance-guides
Authorization: Bearer {jwt-token}
```

#### 쿼리 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| category | String | 카테고리 필터 |
| buildingId | Long | 건물 ID (선택) |
| page | Integer | 페이지 |
| size | Integer | 페이지 크기 |

#### 응답 (Response)

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "content": [
    {
      "id": 1,
      "title": "냉매 충전 (에어컨)",
      "category": "APPLIANCE",
      "intervalMonths": 24,
      "description": "에어컨 냉매는 2년마다 충전이 필요합니다",
      "lastExecutedAt": "2024-03-15",
      "nextScheduledAt": "2026-03-15",
      "isOverdue": true,
      "affectedRoomCount": 5,
      "affectedRooms": [
        {
          "id": 1,
          "roomNumber": "201호",
          "lastExecutedAt": "2024-03-15"
        }
      ]
    }
  ],
  "totalElements": 12,
  "totalPages": 1,
  "currentPage": 0
}
```

---

### 예방 정비 가이드 생성 (Create Maintenance Guide)

```http
POST /api/v1/maintenance-guides
Content-Type: application/json
Authorization: Bearer {jwt-token}
```

#### 요청 (Request)

```json
{
  "title": "냉매 충전 (에어컨)",
  "category": "APPLIANCE",
  "intervalMonths": 24,
  "description": "에어컨 냉매는 2년마다 충전이 필요합니다",
  "baseExecutionDate": "2024-03-15",
  "affectedRoomIds": [1, 2, 3, 4, 5]
}
```

#### 응답 (Response)

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "id": 1,
  "title": "냉매 충전 (에어컨)",
  "category": "APPLIANCE",
  "intervalMonths": 24,
  "nextScheduledAt": "2026-03-15",
  "createdAt": "2026-03-15T16:00:00Z"
}
```

---

## Work Order Image API

### 민원 이미지 업로드 (Upload Work Order Images)

```http
POST /api/v1/work-orders/{id}/images
Content-Type: multipart/form-data
Authorization: Bearer {jwt-token}
```

#### 요청 (Request)

```
form-data:
  - images: [File1, File2, ...] (최대 5개, 각 파일 최대 10MB)
```

#### 응답 (Response)

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "workOrderId": 1,
  "images": [
    {
      "id": 1,
      "url": "https://storage.example.com/work-orders/1/image-1.jpg",
      "uploadedAt": "2026-03-15T16:00:00Z"
    },
    {
      "id": 2,
      "url": "https://storage.example.com/work-orders/1/image-2.jpg",
      "uploadedAt": "2026-03-15T16:00:01Z"
    }
  ]
}
```

---

## 데이터 모델

### WorkOrder 엔티티

```kotlin
data class WorkOrder(
    val id: Long,
    val roomId: Long,
    val buildingId: Long,
    val tenantId: Long,
    val title: String,
    val description: String,
    val category: WorkOrderCategory,
    val priority: WorkOrderPriority,
    val status: WorkOrderStatus,
    val vendorId: Long?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val completedAt: LocalDateTime?
)
```

### WorkOrderCategory (Enum)

```
LEAK         - 누수
APPLIANCE    - 가전
PLUMBING     - 배관
ELECTRIC     - 전기
OTHER        - 기타
```

### WorkOrderPriority (Enum)

```
LOW          - 낮음
MEDIUM       - 중간
HIGH         - 높음
```

### WorkOrderStatus (Enum)

```
NEW          - 접수
IN_PROGRESS  - 진행중
COMPLETED    - 완료
CANCELLED    - 취소
```

### Vendor 엔티티

```kotlin
data class Vendor(
    val id: Long,
    val name: String,
    val phone: String,
    val email: String,
    val status: VendorStatus,
    val rating: Double,
    val reviewCount: Int,
    val completedCount: Int,
    val categories: List<String>,
    val averageCompletionTime: Double,
    val createdAt: LocalDateTime
)
```

### VendorStatus (Enum)

```
ACTIVE       - 활성
INACTIVE     - 비활성
```

### MaintenanceGuide 엔티티

```kotlin
data class MaintenanceGuide(
    val id: Long,
    val title: String,
    val category: String,
    val intervalMonths: Int,
    val description: String,
    val baseExecutionDate: LocalDate,
    val nextScheduledDate: LocalDate,
    val createdAt: LocalDateTime,
    val affectedRoomIds: List<Long>
)
```

---

## 에러 응답 포맷

모든 에러 응답은 다음 포맷을 따릅니다:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "timestamp": "2026-03-15T16:00:00Z",
  "path": "/api/v1/work-orders/1",
  "errors": [
    {
      "field": "title",
      "message": "제목은 필수입니다"
    }
  ]
}
```

### 공통 에러 코드

| 코드 | HTTP 상태 | 설명 |
|------|----------|------|
| UNAUTHORIZED | 401 | 인증 실패 |
| FORBIDDEN | 403 | 권한 부족 |
| NOT_FOUND | 404 | 리소스 없음 |
| VALIDATION_ERROR | 400 | 검증 오류 |
| INVALID_STATUS_TRANSITION | 409 | 잘못된 상태 전이 |
| WORK_ORDER_NOT_FOUND | 404 | 민원을 찾을 수 없음 |
| VENDOR_NOT_FOUND | 404 | 업체를 찾을 수 없음 |
| ALREADY_ASSIGNED | 409 | 이미 배정된 민원 |
| INTERNAL_SERVER_ERROR | 500 | 서버 오류 |

---

## 엔드포인트 요약

| 메서드 | 경로 | 설명 | 권한 |
|--------|------|------|------|
| POST | `/api/v1/work-orders` | 민원 생성 | TENANT, ADMIN |
| GET | `/api/v1/work-orders` | 민원 목록 | TENANT, ADMIN, VENDOR |
| GET | `/api/v1/work-orders/{id}` | 민원 상세 | TENANT, ADMIN, VENDOR |
| PATCH | `/api/v1/work-orders/{id}/status` | 상태 변경 | ADMIN, VENDOR |
| DELETE | `/api/v1/work-orders/{id}` | 민원 삭제 | ADMIN |
| POST | `/api/v1/work-orders/{id}/images` | 이미지 업로드 | TENANT, ADMIN |
| GET | `/api/v1/vendors` | 업체 목록 | ADMIN |
| POST | `/api/v1/vendors/{vendorId}/assignments` | 민원 배정 | ADMIN |
| GET | `/api/v1/vendors/{vendorId}/assignments` | 배정 민원 | VENDOR, ADMIN |
| GET | `/api/v1/maintenance-guides` | 정비 가이드 목록 | ADMIN |
| POST | `/api/v1/maintenance-guides` | 정비 가이드 생성 | ADMIN |
