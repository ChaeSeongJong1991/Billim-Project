# Work Order System - API & DTO 설계 완료 보고서

**작업 완료일**: 2026-03-15
**담당자**: Claude (AI Agent)
**상태**: 완료

---

## 🎯 작업 목표

1. UI 기획서의 페이지 구조 분석
2. REST API 엔드포인트 설계 (WorkOrder, Vendor, MaintenanceGuide)
3. DTO 클래스 정의 (Request/Response)
4. HTTP 상태코드 및 에러 처리 정의
5. API 명세 문서 작성 (OpenAPI/Swagger)

---

## 📋 산출물 (Deliverables)

### 1. API 명세 문서
**파일**: `/Users/castlebell/Developer/Billim-Project/.claude/API-SPEC.md`

- **총 11개 엔드포인트** 설계
- **RESTful 설계 원칙** 준수
- **인증/권한 정보** 포함
- **에러 응답 포맷** 정의
- **데이터 모델** 설명

### 2. DTO 클래스 (3개 파일)

#### 2.1 WorkOrder DTO
**파일**: `/Users/castlebell/Developer/Billim-Project/beckend/src/main/kotlin/com/billim/domain/workorder/api/dto/WorkOrderDtos.kt`

**클래스 수**: 10개

| 클래스명 | 타입 | 설명 |
|---------|------|------|
| WorkOrderCreateRequest | Request | 민원 생성 요청 |
| WorkOrderStatusUpdateRequest | Request | 상태 변경 요청 |
| WorkOrderResponse | Response | 민원 목록 응답 |
| WorkOrderDetailResponse | Response | 민원 상세 응답 |
| WorkOrderListResponse | Response | 페이지네이션된 목록 응답 |
| WorkOrderStatusUpdateResponse | Response | 상태 변경 응답 |
| WorkOrderImageResponse | Response | 이미지 정보 |
| WorkOrderImageUploadResponse | Response | 이미지 업로드 응답 |
| WorkOrderTimelineResponse | Response | 타임라인 로그 |
| VendorAssignmentResponse | Response | 업체 배정 정보 |

**필드 검증**:
- title: 1-100자 (필수)
- description: 1-1000자 (필수)
- category: LEAK, APPLIANCE, PLUMBING, ELECTRIC, OTHER (필수)
- priority: LOW, MEDIUM, HIGH (필수)
- images: 최대 5개 (선택)

#### 2.2 Vendor DTO
**파일**: `/Users/castlebell/Developer/Billim-Project/beckend/src/main/kotlin/com/billim/domain/vendor/api/dto/VendorDtos.kt`

**클래스 수**: 11개

| 클래스명 | 타입 | 설명 |
|---------|------|------|
| VendorCreateRequest | Request | 업체 등록 요청 |
| VendorUpdateRequest | Request | 업체 수정 요청 |
| VendorAssignWorkOrderRequest | Request | 민원 배정 요청 |
| VendorResponse | Response | 업체 목록 응답 |
| VendorDetailResponse | Response | 업체 상세 응답 |
| VendorListResponse | Response | 페이지네이션된 목록 |
| VendorCreateResponse | Response | 업체 생성 응답 |
| VendorAssignmentResponse | Response | 배정 결과 응답 |
| VendorAssignedWorkOrderResponse | Response | 배정된 민원 |
| VendorAssignedWorkOrderListResponse | Response | 배정 민원 목록 |
| PagedResponse | Response | 제네릭 페이지네이션 |

**필드 검증**:
- name: 1-100자 (필수)
- phone: 정규식 `^\d{2,3}-\d{3,4}-\d{4}$` (필수)
- email: 유효한 이메일 형식 (필수)
- contactPerson: 1-50자 (필수)
- categories: 최소 1개 이상 (필수)

#### 2.3 MaintenanceGuide DTO
**파일**: `/Users/castlebell/Developer/Billim-Project/beckend/src/main/kotlin/com/billim/domain/maintenance/api/dto/MaintenanceGuideDtos.kt`

**클래스 수**: 10개

| 클래스명 | 타입 | 설명 |
|---------|------|------|
| MaintenanceGuideCreateRequest | Request | 가이드 생성 요청 |
| MaintenanceGuideUpdateRequest | Request | 가이드 수정 요청 |
| MaintenanceGuideExecuteRequest | Request | 가이드 실행 기록 요청 |
| MaintenanceGuideResponse | Response | 가이드 목록 응답 |
| MaintenanceGuideDetailResponse | Response | 가이드 상세 응답 |
| MaintenanceGuideListResponse | Response | 페이지네이션된 목록 |
| MaintenanceGuideCreateResponse | Response | 가이드 생성 응답 |
| AffectedRoomResponse | Response | 영향받는 호실 정보 |
| MaintenanceExecutionResponse | Response | 정비 실행 이력 |
| MaintenanceStatsResponse | Response | 정비 통계 |

**필드 검증**:
- title: 1-150자 (필수)
- intervalMonths: 최소 1개월 이상 (필수)
- category: WorkOrderCategory (필수)
- baseExecutionDate: LocalDate (필수)
- affectedRoomIds: 최대 500개 (선택)

---

## 📊 엔드포인트 요약

### Work Order API (6개)

| 메서드 | 경로 | 설명 | 상태코드 |
|--------|------|------|---------|
| POST | `/api/v1/work-orders` | 민원 생성 | 201 |
| GET | `/api/v1/work-orders` | 목록 조회 (페이지네이션) | 200 |
| GET | `/api/v1/work-orders/{id}` | 상세 조회 | 200 |
| PATCH | `/api/v1/work-orders/{id}/status` | 상태 변경 | 200 |
| POST | `/api/v1/work-orders/{id}/images` | 이미지 업로드 | 201 |
| DELETE | `/api/v1/work-orders/{id}` | 민원 삭제 | 204 |

**권한 매트릭스**:
```
CREATE:  TENANT(자신), ADMIN
READ:    TENANT(자신), ADMIN, VENDOR(배정된 것만)
UPDATE:  ADMIN, VENDOR(자신)
DELETE:  ADMIN
```

### Vendor API (3개)

| 메서드 | 경로 | 설명 | 상태코드 |
|--------|------|------|---------|
| GET | `/api/v1/vendors` | 업체 목록 | 200 |
| POST | `/api/v1/vendors/{vendorId}/assignments` | 민원 배정 | 201 |
| GET | `/api/v1/vendors/{vendorId}/assignments` | 배정 민원 조회 | 200 |

**권한 매트릭스**:
```
LIST:    ADMIN, LANDLORD
ASSIGN:  ADMIN
GET_ASSIGNED: VENDOR(자신), ADMIN
```

### Maintenance Guide API (2개)

| 메서드 | 경로 | 설명 | 상태코드 |
|--------|------|------|---------|
| GET | `/api/v1/maintenance-guides` | 가이드 목록 | 200 |
| POST | `/api/v1/maintenance-guides` | 가이드 생성 | 201 |

**권한**: ADMIN만 접근 가능

---

## 🔍 검증 규칙 (Validation)

### 요청 검증 (Request Validation)

#### WorkOrder
- title: `@NotBlank`, `@Size(1-100)`
- description: `@NotBlank`, `@Size(1-1000)`
- category: `@NotNull`
- priority: `@NotNull`
- images: `@Size(max=5)` (URL 배열)

#### Vendor
- name: `@NotBlank`, `@Size(1-100)`
- phone: `@Pattern(정규식)` - 예: 02-1234-5678
- email: `@Email`
- categories: `@Size(min=1)`

#### MaintenanceGuide
- title: `@NotBlank`, `@Size(1-150)`
- intervalMonths: `@Min(1)`
- baseExecutionDate: `@NotNull`
- affectedRoomIds: `@Size(max=500)`

### 응답 검증 (Response Validation)

모든 응답은 다음 필드를 포함:
- `id`: Long (PK)
- `createdAt`: LocalDateTime (생성일)
- `updatedAt`: LocalDateTime (수정일)

---

## 🎨 상태 및 열거형 (Enums)

### WorkOrderCategory
```kotlin
LEAK, APPLIANCE, PLUMBING, ELECTRIC, OTHER
```

### WorkOrderPriority
```kotlin
LOW, MEDIUM, HIGH
```

### WorkOrderStatus
```kotlin
NEW, IN_PROGRESS, COMPLETED, CANCELLED
```

### VendorStatus
```kotlin
ACTIVE, INACTIVE
```

---

## 📈 페이지네이션 (Pagination)

모든 LIST 엔드포인트는 페이지네이션을 지원합니다:

**요청 쿼리 파라미터**:
```
GET /api/v1/work-orders?page=0&size=20&sort=createdAt,desc
```

**응답 포맷**:
```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 5,
  "currentPage": 0,
  "pageSize": 20,
  "hasNext": true
}
```

---

## ⚠️ 에러 응답 포맷

### 공통 에러 응답

```json
{
  "code": "ERROR_CODE",
  "message": "사용자 친화적 메시지",
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

### HTTP 상태코드 매핑

| 상황 | 상태코드 | 에러코드 |
|------|---------|---------|
| 인증 실패 | 401 | UNAUTHORIZED |
| 권한 부족 | 403 | FORBIDDEN |
| 리소스 없음 | 404 | NOT_FOUND |
| 검증 오류 | 400 | VALIDATION_ERROR |
| 상태 충돌 | 409 | INVALID_STATUS_TRANSITION |
| 중복 배정 | 409 | ALREADY_ASSIGNED |
| 서버 오류 | 500 | INTERNAL_SERVER_ERROR |

---

## 🔐 보안 고려사항

### 인증 (Authentication)
- 모든 엔드포인트: JWT Bearer Token 필수
- Header: `Authorization: Bearer {jwt-token}`

### 권한 (Authorization)
- 역할별 접근 제어 (RBAC)
- 테넌트: 자신의 민원만 조회/생성 가능
- 관리자: 모든 민원 조회/수정/삭제 가능
- 업체: 배정받은 민원만 조회 가능

### 데이터 보호
- 비즈니스 로직에서 권한 검증 필수
- 민감한 정보(전화번호, 이메일) 응답에 포함
- 파일 업로드: 형식 및 크기 검증 (예: JPG/PNG, 최대 10MB)

---

## 🏗️ 구현 로드맵

### Phase 1: Core API (필수)
- [x] API 명세 설계
- [x] DTO 클래스 정의
- [ ] Domain Entity 구현 (WorkOrder, Vendor, MaintenanceGuide)
- [ ] Repository 인터페이스 작성
- [ ] Service 레이어 구현
- [ ] Controller 구현

### Phase 2: Advanced Features (선택)
- [ ] 파일 업로드/다운로드
- [ ] 푸시 알림 통합
- [ ] 통계/분석 API
- [ ] 배치 작업 (자동 정비 스케줄링)

---

## 📝 사용 예시

### 민원 생성 예시

**요청**:
```bash
curl -X POST http://localhost:8080/api/v1/work-orders \
  -H "Authorization: Bearer {jwt-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": 1,
    "title": "화장실 누수",
    "description": "화장실에서 물이 계속 흐르고 있습니다",
    "category": "PLUMBING",
    "priority": "HIGH"
  }'
```

**응답** (201 Created):
```json
{
  "id": 1,
  "roomId": 1,
  "buildingName": "우리아파트",
  "roomNumber": "201호",
  "tenantName": "김철수",
  "title": "화장실 누수",
  "category": "PLUMBING",
  "priority": "HIGH",
  "status": "NEW",
  "createdAt": "2026-03-15T10:30:00Z",
  "images": [],
  "vendorId": null
}
```

### 민원 목록 조회 예시

**요청**:
```bash
curl -X GET "http://localhost:8080/api/v1/work-orders?status=IN_PROGRESS&page=0&size=10" \
  -H "Authorization: Bearer {jwt-token}"
```

**응답** (200 OK):
```json
{
  "content": [
    {
      "id": 1,
      "title": "화장실 누수",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "daysElapsed": 2,
      "vendorName": "한수도 수리소"
    }
  ],
  "totalElements": 15,
  "totalPages": 2,
  "currentPage": 0,
  "pageSize": 10,
  "hasNext": true
}
```

---

## 📚 참고자료

### 기존 프로젝트 구조
- Payment Domain: 참조할 수 있는 기존 도메인 (유사한 구조 사용)
- DDD-lite 패턴: domain/{도메인명}/{layer}

### 기술 스택
- Kotlin 1.9, Spring Boot 3.4.0, Spring Data JPA
- MySQL 8.0, Redis (캐시)
- Spring Security, JWT (JJWT 0.12)

---

## ✅ 체크리스트

### API 명세
- [x] 11개 엔드포인트 설계
- [x] HTTP 메서드 정의 (POST, GET, PATCH, DELETE)
- [x] 쿼리 파라미터 및 경로 파라미터 정의
- [x] 요청/응답 JSON 스키마 정의
- [x] HTTP 상태코드 매핑
- [x] 에러 응답 포맷 정의
- [x] 권한 및 역할 정의

### DTO 클래스 (31개)
- [x] WorkOrder DTO (10개)
- [x] Vendor DTO (11개)
- [x] MaintenanceGuide DTO (10개)
- [x] 필드 검증 어노테이션 추가
- [x] 제네릭 페이지네이션 응답
- [x] Enum 타입 정의

### 문서
- [x] API 명세서 (OpenAPI 형식)
- [x] DTO 정의서
- [x] 사용 예시
- [x] 에러 코드 정의

---

## 📞 다음 단계

1. **Domain Entity 구현**: WorkOrder, Vendor, MaintenanceGuide 엔티티 작성
2. **Repository 인터페이스**: Spring Data JPA 리포지토리 정의
3. **Service 레이어**: 비즈니스 로직 구현 (검증, 권한, 상태 전이)
4. **Controller 구현**: REST 엔드포인트 구현
5. **테스트 작성**: Unit/Integration 테스트
6. **문서화**: Swagger/Springdoc 통합

---

**작성자**: Claude AI Agent
**완료일**: 2026-03-15
**상태**: ✅ 완료
