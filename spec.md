# Billim Project - 기능 명세

## Feature 1: 사용자 인증 (Auth)
### 요구사항
1. Firebase 기반 소셜 로그인 (Google 등)
2. JWT 토큰 발급 및 검증
3. Spring Security 연동

### API 명세
- `POST /api/auth/login` - 로그인 (Firebase 토큰 → JWT 발급)
- `POST /api/auth/signup` - 회원가입

### 데이터 모델
- `User`: id, email, name, role, firebaseUid

---

## Feature 2: 건물 관리 (Building)
### 요구사항
1. 건물 CRUD (이름, 주소 등)
2. 건물별 호실 목록 조회

### API 명세
- `GET /api/buildings` - 건물 목록
- `POST /api/buildings` - 건물 등록
- `GET /api/buildings/{id}` - 건물 상세
- `PUT /api/buildings/{id}` - 건물 수정
- `DELETE /api/buildings/{id}` - 건물 삭제

### 데이터 모델
- `Building`: id, name, address, ownerId

---

## Feature 3: 호실 관리 (Room)
### 요구사항
1. 건물 하위 호실 CRUD
2. 호실 상태 관리 (공실/입주)

### API 명세
- `GET /api/rooms?buildingId={id}` - 호실 목록
- `POST /api/rooms` - 호실 등록
- `PUT /api/rooms/{id}` - 호실 수정
- `DELETE /api/rooms/{id}` - 호실 삭제

### 데이터 모델
- `Room`: id, buildingId, roomNumber, floor, area, monthlyRent, deposit, status

---

## Feature 4: 임차인 관리 (Tenant)
### 요구사항
1. 임차인 정보 CRUD
2. 임차인-호실 연결

### API 명세
- `GET /api/tenants` - 임차인 목록
- `POST /api/tenants` - 임차인 등록
- `PUT /api/tenants/{id}` - 임차인 수정
- `DELETE /api/tenants/{id}` - 임차인 삭제

### 데이터 모델
- `Tenant`: id, name, phone, email

---

## Feature 5: 계약 관리 (Contract)
### 요구사항
1. 임차인-호실 간 계약 CRUD
2. 계약 기간, 보증금, 월세 관리
3. 계약 만료 자동 알림 (Batch)

### API 명세
- `GET /api/contracts` - 계약 목록
- `POST /api/contracts` - 계약 등록
- `PUT /api/contracts/{id}` - 계약 수정

### 데이터 모델
- `Contract`: id, roomId, tenantId, startDate, endDate, deposit, monthlyRent, status

---

## Feature 6: 납부 관리 (Payment)
### 요구사항
1. 월별 납부 내역 관리
2. 납부 상태 추적 (미납/완납/연체)
3. 월별 자동 청구 생성 (Batch)

### API 명세
- `GET /api/payments` - 납부 목록
- `POST /api/payments` - 납부 등록
- `PUT /api/payments/{id}` - 납부 수정

### 데이터 모델
- `Payment`: id, contractId, amount, dueDate, paidDate, status

---

## Feature 7: Spring Batch 자동화
### 요구사항
1. 월별 청구 자동 생성 (MonthlyBillingTasklet)
2. 계약 만료 알림 (ContractExpiryTasklet)

### 스케줄
- BatchScheduler에서 cron 기반 실행

---

## Feature 8: 프론트엔드 UI
### 페이지 구성
1. **랜딩 페이지** (`/`) - Hero, 기능 소개, Footer
2. **로그인** (`/login`) - Firebase 소셜 로그인
3. **건물 상세** (`/buildings/[id]`) - 호실 목록
4. **관리자 대시보드** (`/admin/dashboard`) - 통계 요약
5. **호실 관리** (`/admin/units`) - 호실 CRUD
6. **원장(장부)** (`/admin/ledger`) - 납부 내역
7. **유지보수** (`/admin/maintenance`) - 관리 기능
8. **설정** (`/admin/settings`) - 시스템 설정
