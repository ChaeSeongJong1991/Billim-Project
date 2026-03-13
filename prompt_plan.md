# Billim Project - 구현 계획

## 현재 상태
- Auth, Building, Room, Tenant, Contract, Payment 도메인 기본 구조 완성
- Spring Batch (월별 청구, 계약 만료) 구현됨
- Frontend 랜딩 + 로그인 + 관리자 페이지 레이아웃 완성

---

## Phase 1: 기반 안정화
- [ ] Backend 테스트 코드 작성 (Service, Controller 단위 테스트)
- [ ] API 응답 형식 통일 (공통 Response DTO)
- [ ] 예외 처리 글로벌 핸들러 (`@ControllerAdvice`)
- [ ] API 문서화 (Swagger/SpringDoc)

## Phase 2: 핵심 기능 완성
- [ ] 건물-호실-임차인-계약 CRUD 프론트엔드 연동
- [ ] 납부 관리 UI 완성 (장부 페이지)
- [ ] 대시보드 통계 API + UI 구현
- [ ] 호실 상태 자동 변경 (계약 생성 시 입주, 만료 시 공실)

## Phase 3: 사용자 경험 개선
- [ ] 검색 및 필터링 (건물, 임차인, 계약)
- [ ] 페이지네이션 적용
- [ ] 납부 알림 (Firebase Push Notification)
- [ ] 모바일 반응형 UI 개선

## Phase 4: 운영 준비
- [ ] 환경별 설정 분리 (dev/staging/prod)
- [ ] CI/CD 파이프라인 구축
- [ ] 로깅 및 모니터링
- [ ] 보안 점검 (OWASP Top 10)

---

## 의존성
- Phase 2는 Phase 1의 예외 처리 완료 후 진행 권장
- Phase 3의 알림 기능은 Phase 2의 CRUD 완성 필요
- Phase 4는 Phase 2 완료 후 병렬 진행 가능
