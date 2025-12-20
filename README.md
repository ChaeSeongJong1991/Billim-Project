# Billim Project

## 프로젝트 소개
Billim 프로젝트는 Spring Boot 기반의 백엔드와 Next.js 기반의 프론트엔드로 구성된 웹 애플리케이션입니다.

## 기술 스택 (Tech Stack)

### Backend (`beckend`)
- **Language**: Kotlin (JDK 21)
- **Framework**: Spring Boot 3.4.0
- **Database**: MySQL 8.0, Redis (Docker Compose 사용)
- **Security**: Spring Security, JWT (JJWT)
- **Build Tool**: Gradle (Kotlin DSL)
- **Testing**: JUnit 5

### Frontend (`frontend`)
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Radix UI
- **State Management**: Zustand
- **Icons**: Lucide React, React Icons

## 시작하기 (Getting Started)

### 1. 인프라 실행 (Database & Cache)
Docker Compose를 사용하여 MySQL과 Redis를 실행합니다.
```bash
cd beckend
docker-compose up -d
```

### 2. 백엔드 실행 (Backend)
```bash
cd beckend
./gradlew bootRun
```
*참고: 백엔드 빌드를 위해서는 JDK 21이 필요합니다.*

### 3. 프론트엔드 실행 (Frontend)
```bash
cd frontend
npm install
npm run dev
```

## 폴더 구조 (Directory Structure)
- `beckend/`: Spring Boot 백엔드 소스 코드
- `frontend/`: Next.js 프론트엔드 소스 코드
- `beckend/data/`: MySQL 및 Redis 데이터 저장소 (Docker volume)
