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

## gstack

Use the `/browse` skill from gstack for **all web browsing**. Never use `mcp__claude-in-chrome__*` tools.

### Available gstack skills

| Skill | Purpose |
|-------|---------|
| `/browse` | Headless browser — navigate URLs, interact with elements, verify UI |
| `/qa` | Systematically QA test a web app and fix bugs found |
| `/qa-only` | Report-only QA — produces structured report without fixing |
| `/review` | Pre-landing PR review (SQL safety, LLM trust boundary, diffs) |
| `/ship` | Ship workflow — merge base, run tests, bump VERSION, update CHANGELOG |
| `/land-and-deploy` | Merge PR, wait for CI/deploy, verify production health |
| `/canary` | Post-deploy canary monitoring for errors and regressions |
| `/benchmark` | Performance regression detection — baselines for load times |
| `/setup-deploy` | Configure deployment settings for `/land-and-deploy` |
| `/setup-browser-cookies` | Import cookies from real browser into headless session |
| `/investigate` | Systematic debugging with root cause investigation |
| `/autoplan` | Auto-review pipeline — CEO, design, and eng review |
| `/plan-ceo-review` | CEO/founder-mode plan review |
| `/plan-design-review` | Designer's eye plan review |
| `/plan-eng-review` | Eng manager-mode plan review |
| `/design-consultation` | Research landscape and propose complete design system |
| `/design-review` | Visual QA — find inconsistency, spacing, hierarchy issues |
| `/document-release` | Post-ship documentation update |
| `/retro` | Weekly engineering retrospective |
| `/office-hours` | YC Office Hours — startup or product mode |
| `/cso` | Chief Security Officer — OWASP audit, STRIDE threat modeling |
| `/careful` | Safety guardrails for destructive commands |
| `/guard` | Full safety mode — destructive warnings + directory-scoped edits |
| `/freeze` | Restrict file edits to a specific directory |
| `/unfreeze` | Clear the freeze boundary |
| `/codex` | OpenAI Codex CLI wrapper — code review, diff review |
| `/gstack-upgrade` | Upgrade gstack to the latest version |

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.

## 주의사항
- `beckend/` 디렉토리명 오타 (backend → beckend) 이미 확정된 상태, 변경하지 말 것
- `.env` 파일과 `serviceAccountKey.json`은 절대 커밋하지 말 것
- `beckend/data/` 는 Docker volume 데이터로 gitignore 대상
