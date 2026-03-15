# 접근성(A11y) 검증 체크리스트

**프로젝트**: Billim - 지능형 유지보수 요청 시스템
**기준**: WCAG 2.1 Level AA
**상태**: 배포 전 필수 검증

---

## 1️⃣ 개발 중 체크리스트

### 색상 대비 (Contrast Ratio)
- [ ] 모든 본문 텍스트가 최소 **4.5:1** 대비 (14px 이상)
- [ ] 모든 큰 텍스트가 최소 **3:1** 대비 (18px+, 굵음)
- [ ] UI 컴포넌트 경계가 최소 **3:1** 대비
- [ ] 포커스 인디케이터가 최소 **3:1** 대비
- [ ] 상태 정보가 **색상 + 다른 수단** (아이콘, 텍스트)으로 표현
  - [ ] 상태 배지: 아이콘 + 색상 + 텍스트 (예: 🔴 높음)
  - [ ] 차트: 색상 + 패턴 또는 레이블
  - [ ] 경고: 색상 + 아이콘 + 텍스트

**검증 방법**:
```bash
# WebAIM Contrast Checker 사용
# https://webaim.org/resources/contrastchecker/

# 색상 예시:
- #2563EB (Blue-600) + White: 5.6:1 ✓
- #EF4444 (Red-600) + White: 4.0:1 ✗ (→ #C2185B 사용)
- #10B981 (Green-600) + White: 5.7:1 ✓
```

---

### ARIA & 시맨틱 HTML
- [ ] 모든 폼 필드에 `<label>` 또는 `aria-label` 있음
- [ ] 아이콘 버튼에 `aria-label` 있음
  - [ ] 예: `<button aria-label="설정"><SettingsIcon /></button>`
- [ ] 필수 필드에 `aria-required="true"`
- [ ] 폼 에러에 `aria-invalid="true"`
- [ ] 에러 메시지에 `aria-describedby` 연결
- [ ] 로딩 상태에 `aria-busy="true"`
- [ ] 동적 콘텐츠에 `aria-live` 지역
  - [ ] 일반: `aria-live="polite"` + `role="status"`
  - [ ] 긴급: `aria-live="assertive"` + `role="alert"`
- [ ] 시맨틱 HTML 사용:
  - [ ] `<header>`, `<nav>`, `<main>`, `<footer>` 사용
  - [ ] 제목: `<h1>` → `<h2>` → `<h3>` (순서 유지)
  - [ ] 목록: `<ul>/<ol>/<li>` 사용 (div 대신)
  - [ ] 섹션: `<section>`, `<article>` 사용
  - [ ] 보조 콘텐츠: `<aside aria-label="...">`

---

### 키보드 네비게이션
- [ ] **Tab 순서가 논리적**:
  - [ ] Tab 순서가 시각적 순서와 일치
  - [ ] 모든 인터랙티브 요소에 Tab으로 접근 가능
  - [ ] 양수 `tabindex` 없음 (혼란 유발)
- [ ] **Tab 움직임**:
  - [ ] Header 네비게이션 → 메인 콘텐츠 → Footer
  - [ ] 폼 필드: 위 → 아래 순서
  - [ ] 모달: 포커스 트랩 (마지막 요소 → 첫 요소로 순환)
- [ ] **Escape 키**:
  - [ ] 모달/팝업에서 Escape로 닫힘
  - [ ] 메뉴에서 Escape로 닫힘
- [ ] **화살표 키**:
  - [ ] 라디오 버튼: 위/아래 또는 좌/우로 선택
  - [ ] 탭 인터페이스: 좌/우로 전환
  - [ ] Select/Dropdown: 위/아래로 이동

**테스트 방법**:
```bash
# 1. 마우스 분리
# 2. Tab 키로만 네비게이션
# 3. 모든 버튼/링크/입력에 접근 가능한지 확인
# 4. 포커스 표시가 명확한지 확인
```

---

### 포커스 상태
- [ ] 모든 포커스 인디케이터가 **최소 2px outline** 사용
- [ ] 포커스 색상이 배경과 **최소 3:1 대비** (권장: #2563EB)
- [ ] Outline이 **offset 2px 이상** (요소와 분리)
- [ ] Focus trap이 **모달/다이얼로그에 구현**됨
- [ ] 포커스가 **페이지 전환 후 복원**됨 (SPA)
- [ ] 비활성화된 버튼이 **Tab 순서에서 제외** (`tabindex="-1"`)

**CSS 예시**:
```css
button {
  focus-visible: outline-2 outline-offset-2 outline-blue-600;
}

/* 모달 포커스 트랩 */
.modal:focus {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
}
```

---

### 폼 접근성
- [ ] 모든 `<input>`에 `<label htmlFor="id">` 연결됨
- [ ] 라디오/체크박스에 `<fieldset>` + `<legend>` 있음
- [ ] `<select>` 요소에 레이블 있음
- [ ] 필수 필드에 `aria-required="true"` + 시각적 표시 (`*`)
- [ ] 에러 메시지:
  - [ ] `aria-invalid="true"` 설정
  - [ ] `aria-describedby="error-id"` 연결
  - [ ] `role="alert"` 설정 (자동 읽힘)
- [ ] Helper text가 `aria-describedby` 연결됨
- [ ] 폼 그룹이 `<fieldset>` 으로 명확히 구분됨

**폼 구조 예시**:
```tsx
<form>
  <fieldset>
    <legend>기본 정보</legend>
    <FormInput
      label="제목"
      id="title"
      required
      aria-required="true"
      aria-describedby="title-help"
    />
    <div id="title-help">최대 100자</div>
  </fieldset>

  <fieldset>
    <legend>카테고리</legend>
    <label>
      <input type="radio" name="category" value="LEAK" required />
      누수
    </label>
  </fieldset>
</form>
```

---

### 이미지 및 대체 텍스트
- [ ] 모든 **의미있는 이미지**에 `alt` 속성
  - [ ] Alt 텍스트가 **구체적** ("이미지" X, "관악아파트 로비" O)
  - [ ] Alt 텍스트가 **간결** (150자 이내)
- [ ] **장식 이미지**에 `alt=""` + `aria-hidden="true"`
- [ ] **복잡한 이미지** (차트, 다이어그램)에:
  - [ ] `alt` 속성 + `<figcaption>` 또는
  - [ ] `aria-describedby` 연결
- [ ] **배경 이미지**에 `role="img"` + `aria-label`
- [ ] **아이콘**에:
  - [ ] 텍스트가 없으면 `aria-label`
  - [ ] 텍스트가 있으면 `aria-hidden="true"`

**예시**:
```tsx
// ✓ 의미있는 이미지
<img
  src="/buildings/gwanako-apt.jpg"
  alt="관악아파트 외관 사진"
/>

// ✓ 장식 이미지
<img
  src="/icon-checkmark.svg"
  alt=""
  aria-hidden="true"
/>

// ✓ 복잡한 이미지
<figure>
  <img src="/chart.png" alt="카테고리별 민원 분포" />
  <figcaption>누수 32건(40%), 가전 12건(15%)...</figcaption>
</figure>
```

---

### 색상 블라인드 지원
- [ ] **색상만으로 정보 전달 금지**
- [ ] **아이콘 + 텍스트 + 색상**으로 정보 표현
- [ ] 상태 배지: 아이콘 필수
  - [ ] 예: 🔴 높음, 🟠 중간, 🟢 낮음
- [ ] 차트: 색상 + 패턴 또는 레이블
- [ ] 경고 메시지: 색상 + 아이콘 + 텍스트

**색상 블라인드 타입별 테스트**:
```bash
# Coblis 시뮬레이터: https://www.color-blindness.com/coblis-color-blindness-simulator/

- Protanopia (적색약): 빨강 ↔ 파랑 구분 어려움
- Deuteranopia (적록색약): 빨강 ↔ 초록 구분 어려움
- Tritanopia (청황색약): 파랑 ↔ 노랑 구분 어려움

확인 항목:
- [ ] Deuteranopia 모드에서도 색상 구분 가능
- [ ] 모든 상태가 아이콘으로도 표현됨
```

---

### 텍스트 크기 및 가독성
- [ ] 본문 텍스트: **최소 14px** (권장 16px)
- [ ] 작은 텍스트: 최소 12px
- [ ] 줄 간격: **1.5 이상** (line-height)
- [ ] 문자 간격: **0.5px 이상** (letter-spacing)
- [ ] 텍스트가 **200% 확대**될 때도 깨지지 않음
- [ ] 폰트가 **가독성 좋음** (sans-serif 권장)
- [ ] 언어가 **명확하고 간결**함
  - [ ] 긴 문장 피하기 (20단어 이내 권장)
  - [ ] 전문 용어 설명하기
  - [ ] 적극적 목소리 사용 ("~되었다" → "~했다")

**CSS 예시**:
```css
/* px 대신 rem 사용 (사용자 설정 따름) */
body {
  font-size: 1rem;      /* 16px */
  line-height: 1.5;
  letter-spacing: 0.5px;
}

h1 {
  font-size: 2rem;      /* 32px */
  line-height: 1.2;
}
```

---

## 2️⃣ 자동화 검증 (배포 전 필수)

### axe DevTools (Chrome Extension)

**설치**: Chrome Web Store → "axe DevTools" 검색 → 설치

**테스트 단계**:
1. 테스트 페이지 접속
2. axe DevTools 아이콘 클릭
3. "Scan ALL OF MY PAGE" 클릭
4. 결과 분석

**합격 기준**:
- [ ] **Critical**: 0개
- [ ] **Serious**: 0개
- [ ] **Moderate**: 가능하면 0개
- [ ] **Minor**: 무시 가능

**점검 항목**:
- [ ] 색상 대비
- [ ] 이미지 Alt 텍스트
- [ ] 폼 라벨
- [ ] ARIA 속성
- [ ] 키보드 접근성

---

### Lighthouse Accessibility (Chrome DevTools)

**사용 방법**:
1. Chrome DevTools 열기 (F12)
2. "Lighthouse" 탭 클릭
3. "Accessibility" 선택
4. "Analyze page load" 클릭

**합격 기준**:
- [ ] Accessibility 점수 **90점 이상**

**평가 항목**:
- [ ] Background and foreground colors
- [ ] Form input labels
- [ ] ARIA attributes
- [ ] Page structure (headings)
- [ ] Keyboard navigation
- [ ] Image alt text

---

### WAVE (Chrome Extension)

**설치**: Chrome Web Store → "WAVE" 검색 → 설치

**기능**:
- 시각적으로 이슈 표시
- 색상 대비 자동 계산
- 페이지 구조 개요

**합격 기준**:
- [ ] 에러: 0개
- [ ] 대비 문제: 0개
- [ ] 경고: 검토 필요 (대부분 무시 가능)

---

## 3️⃣ 수동 검증 (배포 전 필수)

### 키보드 네비게이션 테스트

**설정**:
```bash
1. 마우스/트랙패드 분리 (또는 사용하지 않음)
2. 키보드만 사용해 전체 플로우 테스트
```

**테스트 항목**:
- [ ] **Tab 키**: 모든 인터랙티브 요소 접근 가능
- [ ] **Shift+Tab**: 역방향 이동 가능
- [ ] **Enter**: 버튼/링크 활성화
- [ ] **Space**: 체크박스/라디오 선택
- [ ] **Escape**: 모달/메뉴 닫힘
- [ ] **화살표 키**: 라디오/선택 컨트롤 조작
- [ ] **포커스 표시**: 명확히 보임

**테스트 시나리오**:
1. 임차인 대시보드
   - [ ] 헤더 → 민원 카드 → 버튼 순서 논리적
2. 민원 폼
   - [ ] 모든 입력 필드 접근 가능
   - [ ] Tab 순서가 위 → 아래로 진행
3. 모달
   - [ ] Escape로 닫힘
   - [ ] 포커스가 트랩됨 (모달 내에서만)

---

### 스크린 리더 테스트

#### macOS (VoiceOver)

```bash
# 활성화
Cmd + F5

# 기본 조작
- VO(Ctrl+Option) + U: 로터 (Headings, Links 등)
- VO + Right Arrow: 다음 요소
- VO + Left Arrow: 이전 요소
- VO + Space: 활성화

# 테스트
- [ ] 페이지 구조 (h1 → h2 → h3)
- [ ] 폼 필드에 라벨 읽힘
- [ ] 버튼 목적 명확
- [ ] 에러 메시지 읽힘
```

#### Windows (NVDA)

```bash
# 설치
https://www.nvaccess.org/ → Download → nvda-2024.1.exe

# 기본 조작
- H: 다음 제목
- K: 다음 링크
- F: 다음 폼 필드
- B: 다음 버튼
- T: 다음 테이블
- N: 다음 상태 메시지

# 테스트
- [ ] 제목이 명확 (h1, h2, h3 구조)
- [ ] 링크 텍스트가 명확 ("더보기" X, "민원 #1 상세보기" O)
- [ ] 폼 필드에 라벨 있음
- [ ] 버튼 용도 명확
- [ ] 테이블에 헤더 있음
```

---

### 색상 블라인드 시뮬레이션

**Coblis 사용**:
1. https://www.color-blindness.com/coblis-color-blindness-simulator/ 접속
2. 사이트 URL 입력
3. "Upload" 클릭
4. Deuteranopia/Protanopia 모드에서 색상 구분 가능한지 확인

**테스트 항목**:
- [ ] 상태 배지 구분 가능 (아이콘 + 텍스트)
- [ ] 경고 메시지 명확
- [ ] 차트 데이터 읽을 수 있음 (레이블 필요)
- [ ] 버튼 상태 구분 가능

---

### 텍스트 확대 테스트

```bash
# 1. 브라우저 확대: Ctrl++ (또는 Cmd++)
# 2. 200% 확대 시 확인:

- [ ] 레이아웃 깨지지 않음
- [ ] 텍스트 겹치지 않음
- [ ] 가로 스크롤 필요 최소화
- [ ] 모든 콘텐츠 접근 가능

# 3. 복구: Ctrl+0 (또는 Cmd+0)
```

---

## 4️⃣ 배포 전 최종 체크리스트

**코드 리뷰**:
- [ ] ARIA 라벨 검증
- [ ] 색상 대비 검증
- [ ] 이미지 Alt 텍스트 검증
- [ ] 포커스 스타일 검증
- [ ] 시맨틱 HTML 검증

**자동화 검증**:
- [ ] axe DevTools: Critical/Serious 0개
- [ ] Lighthouse: Accessibility 90점 이상
- [ ] WAVE: 에러 0개

**수동 검증**:
- [ ] 키보드 네비게이션 완료
- [ ] 스크린 리더 테스트 완료 (VoiceOver 또는 NVDA)
- [ ] 색상 블라인드 시뮬레이션 완료
- [ ] 텍스트 200% 확대 테스트 완료

**배포 승인**:
- [ ] 모든 체크리스트 항목 완료
- [ ] 접근성 이슈 0개 (Critical/Serious)
- [ ] 문서 업데이트 (변경사항 기록)

---

## 5️⃣ 페이지별 검증 목록

### 임차인 페이지

#### 대시보드 (`/tenant/workorder`)
- [ ] 제목 구조 (h1 → h2)
- [ ] 통계 카드: 숫자 + 라벨 명확
- [ ] 최근 민원 카드: 상태 배지 (아이콘 + 색상 + 텍스트)
- [ ] "새 민원 접수" 버튼: aria-label

#### 민원 접수 (`/tenant/workorder/create`)
- [ ] 모든 필드에 라벨
- [ ] 필수 필드에 `*` + `aria-required="true"`
- [ ] 이미지 업로드 영역: 드래그 안내 텍스트
- [ ] 에러 메시지: `aria-invalid="true"` + `role="alert"`

#### 민원 목록 (`/tenant/workorder/list`)
- [ ] 필터 칩: 현재 선택 명확 (aria-current 또는 aria-selected)
- [ ] 정렬 드롭다운: 레이블
- [ ] 민원 카드: 상태 구분 가능 (아이콘 + 색상)
- [ ] 무한 스크롤: 로딩 상태 `aria-busy`

#### 민원 상세 (`/tenant/workorder/[id]`)
- [ ] 진행률 바: 텍스트 설명 ("66% 완료")
- [ ] 정보 카드: 제목-값 구조 명확
- [ ] 타임라인: 항목 순서 논리적
- [ ] 이미지 갤러리: Alt 텍스트 + 확대 모달 포커스 트랩

---

### 관리자 페이지

#### 대시보드 (`/admin/dashboard`)
- [ ] KPI 카드: 숫자 + 라벨 명확
- [ ] 카테고리 차트: 색상 + 숫자 레이블
- [ ] 테이블: 헤더 `<th>`, 셀 `<td>`

#### 민원 관리 (`/admin/maintenance/workorders`)
- [ ] Kanban 보드: 컬럼별 접근 가능
- [ ] 드래그 카드: 드래그 완료 후 상태 변경 알림 (aria-live)
- [ ] 필터/정렬: 모든 컨트롤 키보드 접근 가능

#### 협력 업체 관리 (`/admin/maintenance/contractors`)
- [ ] 검색 입력: 라벨 + 힌트 텍스트
- [ ] 테이블: 페이지네이션 버튼 명확
- [ ] 상태 배지: 활성/비활성 구분 가능

---

## 6️⃣ 문제 해결 가이드

### 문제: 색상 대비 실패

**원인**: 텍스트 색상과 배경색의 대비가 최소값 미만

**해결**:
1. WebAIM Contrast Checker로 현재 대비 확인
2. 색상 조정 (텍스트 어두워지거나 배경 밝아짐)
3. 재검증

```css
/* ✗ 실패: 회색 텍스트 + 흰 배경 = 2.5:1 */
color: #999999;

/* ✓ 성공: 어두운 회색 + 흰 배경 = 5.0:1 */
color: #555555;
```

---

### 문제: 버튼에 라벨 없음

**원인**: 아이콘만 있는 버튼에 `aria-label` 없음

**해결**:
```tsx
// ✗ 잘못된 예
<button><SettingsIcon /></button>

// ✓ 올바른 예
<button aria-label="설정"><SettingsIcon /></button>
```

---

### 문제: 포커스가 보이지 않음

**원인**: 기본 outline이 제거됨

**해결**:
```css
/* ✗ 피해야 할 코드 */
button { outline: none; }

/* ✓ 올바른 코드 */
button {
  focus-visible: outline-2 outline-offset-2 outline-blue-600;
}
```

---

### 문제: 폼 에러가 읽히지 않음

**원인**: 에러 메시지가 폼 필드와 연결되지 않음

**해결**:
```tsx
// ✗ 잘못된 예
<input />
<div className="error">필수 입력</div>

// ✓ 올바른 예
<input
  aria-invalid="true"
  aria-describedby="error-id"
/>
<div id="error-id" role="alert">필수 입력</div>
```

---

## 참고 자료

### 공식 문서
- [WCAG 2.1 Guideline](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### 검증 도구
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WAVE](https://wave.webaim.org/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coblis Color Blindness Simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/)

### 스크린 리더
- [NVDA (Windows)](https://www.nvaccess.org/)
- [JAWS (Windows, Commercial)](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (macOS, Built-in)](https://www.apple.com/accessibility/voiceover/)

### 추가 자료
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)
- [Deque Systems](https://www.deque.com/)

---

## 진행 상황 추적

| 날짜 | 검증자 | 페이지 | 상태 | 비고 |
|------|--------|--------|------|------|
| 2026-03-15 | | | 예정 | 문서 초안 작성 |
| | | | | |
| | | | | |

---

**문서 작성**: 2026-03-15
**최종 수정**: 2026-03-15
**버전**: 1.0
