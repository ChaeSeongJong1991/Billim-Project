# Billim Project

## 개요
건물/호실 임대 관리 플랫폼. 임대인이 건물, 호실, 임차인, 계약, 납부를 관리하고 월별 청구 및 계약 만료를 자동 처리한다.

## 기술 스택

### Backend (`beckend/`)
- **Language**: Kotlin 1.9 (JDK 21)
- **Framework**: Spring Boot 3.4.0
- **ORM**: Spring Data JPA
- **Database**: MySQL 8.0 (Docker)
- **Cache**: Redis (Docker)
- **Security**: Spring Security + JWT (JJWT 0.12)
- **Batch**: Spring Batch (월별 청구, 계약 만료)
- **Firebase**: firebase-admin (푸시 알림 등)
- **Build**: Gradle Kotlin DSL

### Frontend (`frontend/`)
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: Radix UI + Tailwind CSS v4 + shadcn/ui 패턴
- **State**: Zustand
- **Data Fetching**: TanStack React Query + Axios
- **Auth**: Firebase Client SDK

## 빌드 & 실행

```bash
# 인프라 (MySQL + Redis)
cd beckend && docker-compose up -d

# Backend
cd beckend && ./gradlew bootRun

# Frontend
cd frontend && npm install && npm run dev
```

## 테스트

```bash
# Backend
cd beckend && ./gradlew test

# Frontend
cd frontend && npm run lint
```

## 디렉토리 구조

```
beckend/src/main/kotlin/com/billim/
├── BillimApplication.kt
├── batch/                    # Spring Batch (스케줄러 + Tasklet)
│   ├── BatchScheduler.kt
│   └── tasklet/
├── domain/                   # 도메인별 패키지 (DDD-lite)
│   ├── building/             # 건물 + 호실
│   ├── contract/             # 계약
│   ├── payment/              # 납부
│   ├── tenant/               # 임차인
│   └── user/                 # 사용자 + 인증
└── global/                   # 공통 설정
    ├── config/               # Security, JPA, Batch, Firebase
    ├── security/jwt/         # JWT 필터, 프로바이더
    └── common/               # BaseEntity

frontend/src/
├── app/                      # Next.js App Router 페이지
│   ├── admin/                # 관리자 페이지 (dashboard, units, ledger, maintenance, settings)
│   ├── buildings/[id]/       # 건물 상세
│   ├── login/                # 로그인
│   └── context/              # React Context (Modal)
├── components/               # UI 컴포넌트
│   ├── landing/              # 랜딩 페이지 컴포넌트
│   └── ui/                   # shadcn/ui 기반 공통 컴포넌트
├── hooks/                    # Custom Hooks (useBuildings, useRooms, useTenants, usePayments)
├── lib/                      # 유틸리티 (axios, firebase, utils)
└── store/                    # Zustand store (useAuthStore)
```

## 코딩 컨벤션

### Backend (Kotlin)
- **패키지 구조**: `domain/{도메인명}/{layer}` (api, application, domain, infra)
- **Controller DTO**: `{Domain}Dtos.kt` 파일에 Request/Response DTO 모음
- **엔티티**: JPA Entity는 `domain/` 하위, BaseEntity 상속
- **설정**: `global/config/` 하위에 Config 클래스
- **네이밍**: Controller → Service → Repository 계층 구조

### Frontend (TypeScript)
- **페이지**: `app/` 디렉토리에 App Router 규칙 따름
- **컴포넌트**: `components/ui/` (공통), `components/landing/` (도메인별)
- **훅**: `hooks/use{Domain}.ts` 패턴 (React Query 래핑)
- **상태**: Zustand store는 `store/use{Name}Store.ts`
- **스타일**: Tailwind CSS 유틸리티 클래스 사용, cn() 헬퍼로 조건부 클래스

## 주의사항
- `beckend/` 디렉토리명 오타 (backend → beckend) 이미 확정된 상태, 변경하지 말 것
- `.env` 파일과 `serviceAccountKey.json`은 절대 커밋하지 말 것
- `beckend/data/` 는 Docker volume 데이터로 gitignore 대상
