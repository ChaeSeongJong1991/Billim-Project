# 접근성(A11y) 가이드

**프로젝트**: Billim - 지능형 유지보수 요청 시스템
**기준**: WCAG 2.1 Level AA
**작성일**: 2026-03-15

---

## 목차

1. [개요](#개요)
2. [색상 대비 가이드](#색상-대비-가이드)
3. [ARIA 라벨 및 시맨틱](#aria-라벨-및-시맨틱)
4. [키보드 네비게이션](#키보드-네비게이션)
5. [포커스 관리](#포커스-관리)
6. [폼 접근성](#폼-접근성)
7. [이미지 및 대체 텍스트](#이미지-및-대체-텍스트)
8. [동적 콘텐츠](#동적-콘텐츠)
9. [색상 블라인드 지원](#색상-블라인드-지원)
10. [텍스트 크기 및 가독성](#텍스트-크기-및-가독성)
11. [모달 및 다이얼로그](#모달-및-다이얼로그)
12. [자동화 검증 도구](#자동화-검증-도구)
13. [컴포넌트별 구현 예시](#컴포넌트별-구현-예시)
14. [테스트 체크리스트](#테스트-체크리스트)

---

## 개요

### 목표
Billim 플랫폼의 모든 사용자(시각 장애인, 청각 장애인, 운동능력 제한, 인지 장애)가 동등한 경험을 할 수 있는 UI/UX 제공.

### 준수 기준
- **WCAG 2.1 Level AA** (웹 접근성 국제 표준)
- 한국 웹 접근성 법규 (장애인차별금지법)
- 접근성 표준: ARIA 1.2, HTML5 시맨틱

### 원칙
- **Perceivable**: 모든 콘텐츠를 인지할 수 있어야 함
- **Operable**: 키보드/보조 기기로 조작 가능
- **Understandable**: 명확하고 이해하기 쉬운 정보
- **Robust**: 보조 기기와의 호환성

---

## 색상 대비 가이드

### WCAG 2.1 색상 대비 기준

| 콘텐츠 | 최소 대비 | 권장 대비 | 기준 |
|--------|---------|--------|------|
| 본문 텍스트 (14px 이상) | 4.5:1 | 7:1 | Level AA |
| 큰 텍스트 (18px 이상, 굵음) | 3:1 | 4.5:1 | Level AA |
| UI 컴포넌트 & 그래픽 | 3:1 | 4.5:1 | Level AA |

### 검증된 색상 조합 (UI-PLAN.md 기반)

#### Primary Interactions
```
문제: #2563EB (Blue-600) 텍스트 + #FFFFFF (White) 배경
대비: 5.6:1 ✓ PASS (WCAG AA)

문제: #F97316 (Orange-500) 텍스트 + #FFFFFF (White) 배경
대비: 4.6:1 ✓ PASS (WCAG AA)
```

#### 상태 배지
```
🟡 NEW (#3B82F6) + White: 5.6:1 ✓
🔵 IN_PROGRESS (#3B82F6) + White: 5.6:1 ✓
🟢 COMPLETED (#10B981) + White: 5.7:1 ✓
⚫ CANCELLED (#EF4444) + White: 4.0:1 ✗ FAIL → 배경 어둡게

우선순위:
🔴 HIGH (#EF4444) + White: 4.0:1 ✗ FAIL → #C2185B 사용
🟠 MEDIUM (#F59E0B) + White: 3.7:1 ✗ FAIL → #D97706 사용
🟢 LOW (#10B981) + White: 5.7:1 ✓
```

#### 배경 & 텍스트
```
Background (#F8FAFC) + Text Primary (#1E293B): 18:1 ✓ EXCELLENT
Background (#F8FAFC) + Text Secondary (#64748B): 8:5:1 ✓ GOOD
```

### 색상 대비 검증 방법

```bash
# Contrast Ratio 확인 (WebAIM)
# https://webaim.org/resources/contrastchecker/

# 설정 값:
- Foreground Color: #2563EB
- Background Color: #FFFFFF
- Result: 5.6:1 ✓ WCAG AAA
```

### 개발 체크리스트
- [ ] 모든 텍스트가 최소 4.5:1 대비 (14px 이상)
- [ ] 모든 큰 텍스트가 최소 3:1 대비 (18px+, 굵음)
- [ ] UI 컴포넌트 경계가 최소 3:1 대비
- [ ] 상태 정보가 색상만으로 표현되지 않음 (아이콘 병행)
- [ ] 포커스 인디케이터가 최소 3:1 대비

---

## ARIA 라벨 및 시맨틱

### ARIA Labels

#### 1. Icon-Only 버튼
```tsx
// ✓ 올바른 예
<button aria-label="새 민원 접수">
  <PlusIcon />
</button>

// ✗ 잘못된 예
<button>
  <PlusIcon />  {/* 접근성 불가 */}
</button>
```

#### 2. Icon-Only 링크
```tsx
// ✓ 올바른 예
<a href="/settings" aria-label="설정">
  <SettingsIcon />
</a>

// ✗ 잘못된 예
<Link href="/settings">⚙️</Link>
```

#### 3. 폼 필드
```tsx
// ✓ 올바른 예
<label htmlFor="work-title">제목 *</label>
<input id="work-title" required aria-required="true" />

// ✓ 대체 방법 (자동 라벨)
<input aria-label="민원 제목" required aria-required="true" />
```

#### 4. 복잡한 설명
```tsx
// ✓ 올바른 예
<div id="form-help">최대 100자, 필수 입력</div>
<input
  aria-describedby="form-help"
  aria-required="true"
/>

// 다중 설명
<div id="help">최대 100자</div>
<div id="error">제목을 입력하세요</div>
<input
  aria-describedby="help error"
  aria-invalid="true"
/>
```

#### 5. 동적 콘텐츠 (라이브 리전)
```tsx
// ✓ 올바른 예
<div
  aria-live="polite"
  aria-atomic="true"
  role="status"
>
  민원이 성공적으로 제출되었습니다.
</div>

// 급하면 aria-live="assertive" 사용
<div
  aria-live="assertive"
  role="alert"
>
  시스템 오류가 발생했습니다!
</div>
```

### 시맨틱 HTML

```tsx
// ✓ 올바른 구조
<header>
  <h1>내 민원</h1>
  <nav aria-label="주요 네비게이션">
    <a href="/dashboard">대시보드</a>
    <a href="/list">목록</a>
  </nav>
</header>

<main>
  <article>
    <h2>민원 #1</h2>
    <section>
      <h3>기본 정보</h3>
      {/* 콘텐츠 */}
    </section>
  </article>
</main>

<aside aria-label="관련 정보">
  {/* 보조 콘텐츠 */}
</aside>

<footer>
  <p>&copy; 2026 Billim</p>
</footer>
```

### Role 속성

```tsx
// 커스텀 컴포넌트에 role 추가
<div
  role="tablist"
  aria-label="필터"
>
  <button
    role="tab"
    aria-selected="true"
    aria-controls="panel-1"
  >
    전체
  </button>
  <button
    role="tab"
    aria-selected="false"
    aria-controls="panel-2"
  >
    진행중
  </button>
</div>

<div id="panel-1" role="tabpanel" aria-labelledby="tab-1">
  {/* 콘텐츠 */}
</div>
```

---

## 키보드 네비게이션

### Tab 순서 (Tabindex)

#### 원칙
1. **자동 Tab 순서 준수**: `tabindex="0"` 또는 기본값 사용
2. **양수 tabindex 피하기**: 혼란 유발
3. **tabindex="-1"**: 프로그래매틱하게만 접근 가능

```tsx
// ✓ 올바른 예
<input />                    {/* tabindex: auto (0) */}
<button>저장</button>         {/* tabindex: auto (0) */}
<button tabindex="-1">숨김</button> {/* 프로그래매틱 접근만 */}

// ✗ 잘못된 예
<button tabindex="5">저장</button>  {/* 순서 예측 불가 */}
<input tabindex="10" />             {/* 순서 예측 불가 */}
```

#### Tab 순서 검증
```
1. 임차인 대시보드
   ① Header (알림 버튼) → ② 새 민원 버튼 → ③ 민원 카드 1
   → ④ 상세보기 링크 → ⑤ 민원 카드 2 → ⑥ 상세보기 링크 → ...

2. 민원 폼
   ① 제목 입력 → ② 카테고리 라디오 1~5
   → ③ 설명 입력 → ④ 우선순위 라디오 1~3
   → ⑤ 이미지 업로드 → ⑥ 사진 1 삭제 → ⑦ 사진 2 삭제 → ...
   → ⑧ 제출 버튼 → ⑨ 임시저장 버튼

3. 모달 (Focus Trap)
   모달 닫기 → 모달 콘텐츠 → 모달 다시 닫기 (순환)
```

### Escape 키 처리

```tsx
// ✓ 모달에서 Escape 감지
<Dialog open={isOpen}>
  <DialogContent
    onKeyDown={(e) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }}
  >
    {/* 콘텐츠 */}
  </DialogContent>
</Dialog>

// React Query Devtools 패턴
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      onClose()
    }
  }
  document.addEventListener("keydown", handleKeyDown)
  return () => document.removeEventListener("keydown", handleKeyDown)
}, [isOpen])
```

### 키보드 단축키

```tsx
// 선택적: 파워 유저를 위한 단축키
const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: 새 민원
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault()
        navigateTo("/workorder/create")
      }
      // Ctrl/Cmd + L: 민원 목록
      if ((e.ctrlKey || e.metaKey) && e.key === "l") {
        e.preventDefault()
        navigateTo("/workorder/list")
      }
      // Ctrl/Cmd + ?: 단축키 헬프
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "?") {
        e.preventDefault()
        setShowHelp(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])
}
```

---

## 포커스 관리

### 포커스 스타일

#### 기본 설정 (Tailwind)
```css
/* tailwind.config.ts */
module.exports = {
  theme: {
    extend: {
      outline: {
        a11y: "2px solid #2563EB",
      },
    },
  },
}
```

#### 컴포넌트 적용
```tsx
// ✓ 올바른 예
<button
  className="focus:outline-a11y focus:outline-offset-2"
>
  저장
</button>

// ✓ 대체: focus-visible (더 정교함)
<button
  className="focus-visible:outline-a11y focus-visible:outline-offset-2"
>
  저장
</button>

// ✗ 잘못된 예 (outline 제거)
<button
  className="focus:outline-none"  // 위험!
>
  저장
</button>
```

### 포커스 복원 (SPA에서)

```tsx
// 페이지 네비게이션 후 포커스 복원
const useRestoreFocus = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    ref.current?.focus()
  }, [ref])
}

// 사용 예
export default function WorkOrderList() {
  const mainRef = useRef<HTMLMainElement>(null)
  useRestoreFocus(mainRef)

  return (
    <main ref={mainRef} tabIndex={-1}>
      <h1>내 민원</h1>
    </main>
  )
}
```

### Skip Link (선택사항)

```tsx
// ✓ 페이지 상단에 고정
<a
  href="#main"
  className="absolute -top-full left-0 focus:top-0 focus:z-50
             bg-blue-600 text-white px-4 py-2"
>
  주 콘텐츠로 바로가기
</a>

<nav>{/* 네비게이션 */}</nav>

<main id="main" tabIndex={-1}>
  {/* 메인 콘텐츠 */}
</main>
```

---

## 폼 접근성

### 입력 필드

```tsx
// ✓ 올바른 예
<div className="form-group">
  <label htmlFor="title" className="text-sm font-medium">
    제목 <span aria-label="필수">*</span>
  </label>
  <input
    id="title"
    name="title"
    type="text"
    required
    aria-required="true"
    aria-invalid={errors.title ? "true" : "false"}
    aria-describedby="title-error title-help"
    placeholder="예) 화장실 누수"
  />
  <div id="title-help" className="text-xs text-gray-500">
    최대 100자
  </div>
  {errors.title && (
    <div id="title-error" className="text-red-600 text-sm" role="alert">
      {errors.title}
    </div>
  )}
</div>

// ✗ 잘못된 예
<div>
  제목 *
  <input placeholder="..." />  {/* label이 없음 */}
</div>
```

### 라디오 & 체크박스

```tsx
// ✓ Fieldset 구조
<fieldset>
  <legend className="text-sm font-medium">카테고리 (필수)</legend>
  <div role="group" aria-labelledby="category-group">
    <label>
      <input
        type="radio"
        name="category"
        value="LEAK"
        required
        aria-required="true"
      />
      누수
    </label>
    <label>
      <input
        type="radio"
        name="category"
        value="APPLIANCE"
        required
        aria-required="true"
      />
      가전
    </label>
  </div>
</fieldset>

// ✓ 선택 인디케이터 명확화
<label className="flex items-center">
  <input
    type="checkbox"
    className="w-4 h-4 border-2 border-gray-300
               focus:outline-a11y"
  />
  <span className="ml-2">모든 호실 선택</span>
</label>
```

### Select & Dropdown

```tsx
// ✓ Native Select (가장 접근성 좋음)
<label htmlFor="category-select">카테고리</label>
<select
  id="category-select"
  aria-label="카테고리 선택"
  required
  aria-required="true"
>
  <option value="">선택하세요</option>
  <option value="LEAK">누수</option>
  <option value="APPLIANCE">가전</option>
</select>

// ✓ 커스텀 Combobox (복잡한 경우)
<Combobox
  aria-label="업체 선택"
  aria-describedby="contractor-help"
  options={contractors}
  onChange={onSelect}
/>
<div id="contractor-help">
  입력 후 아래 화살표로 제안 보기
</div>
```

### 폼 그룹

```tsx
// ✓ 관련 필드 그룹화
<fieldset>
  <legend>기본 정보</legend>
  <FormInput label="건물명" name="building" />
  <FormInput label="호실" name="unit" />
  <FormInput label="세대주" name="tenantName" />
</fieldset>

<fieldset>
  <legend>추가 정보</legend>
  <FormInput label="연락처" name="phone" type="tel" />
  <FormInput label="이메일" name="email" type="email" />
</fieldset>
```

---

## 이미지 및 대체 텍스트

### Alt 속성

```tsx
// ✓ 의미있는 이미지
<img
  src="/buildings/gwanako-apt.jpg"
  alt="관악아파트 외관 사진"
/>

// ✗ 불필요한 텍스트
<img
  src="/buildings/gwanako-apt.jpg"
  alt="이미지"  // 너무 일반적
/>

// ✓ 장식 이미지
<img
  src="/icon-checkmark.svg"
  alt=""  {/* 빈 alt */}
  aria-hidden="true"
/>

// ✓ 복잡한 이미지 (차트)
<figure>
  <img
    src="/chart-distribution.png"
    alt="카테고리별 민원 분포"
  />
  <figcaption>
    누수 32건(40%), 가전 12건(15%), 배관 16건(20%),
    전기 8건(10%), 기타 12건(15%)
  </figcaption>
</figure>
```

### 배경 이미지

```tsx
// ✓ role과 함께
<div
  role="img"
  aria-label="관악아파트 로비"
  style={{backgroundImage: "url(...)"}}
/>

// ✓ 배경 이미지 + 텍스트 (텍스트가 대체 역할)
<div
  className="bg-cover"
  style={{backgroundImage: "url(...)"}}
>
  <h1>관악아파트 입주 안내</h1>
</div>
```

### 아이콘

```tsx
// ✓ 의미있는 아이콘 + 라벨
<button aria-label="설정">
  <SettingsIcon />
</button>

// ✓ 텍스트와 함께
<span className="flex items-center gap-2">
  <CheckIcon aria-hidden="true" />
  완료됨
</span>

// ✗ 아이콘만 (접근성 불가)
<button>
  <MenuIcon />  {/* 무엇을 하는 버튼? */}
</button>
```

---

## 동적 콘텐츠

### Live Regions

```tsx
// ✓ 실시간 업데이트 알림
<div
  aria-live="polite"
  aria-atomic="true"
  role="status"
  className="sr-only"  {/* 시각적으로 숨김 */}
>
  {notification}
</div>

// ✓ 급하면 assertive
<div
  aria-live="assertive"
  role="alert"
>
  ⚠️ 시스템 오류
</div>

// 사용 예
const [notification, setNotification] = useState("")

const submitForm = async () => {
  try {
    await api.submit(data)
    setNotification("민원이 성공적으로 제출되었습니다.")
  } catch (error) {
    setNotification(`오류: ${error.message}`)
  }
}
```

### 무한 스크롤

```tsx
// ✓ aria-busy로 로딩 상태 전달
<div aria-busy={isLoadingMore} aria-label="민원 목록">
  {workOrders.map(item => (
    <WorkOrderCard key={item.id} {...item} />
  ))}
</div>

// ✓ 로드 완료 알림
useEffect(() => {
  if (newItemsLoaded) {
    announceToScreenReader(`${newItemsLoaded}개의 새 민원이 로드되었습니다`)
  }
}, [newItemsLoaded])
```

### 페이지네이션

```tsx
// ✓ 명확한 버튼
<nav aria-label="페이지네이션">
  <button disabled={page === 1}>이전</button>
  <span aria-current="page">페이지 {page}</span>
  <button disabled={page === totalPages}>다음</button>
</nav>

// ✓ 페이지 변경 시 포커스 복원
const handlePageChange = (newPage) => {
  setPage(newPage)
  mainRef.current?.focus()  // 포커스 이동
  window.scrollTo(0, 0)
}
```

---

## 색상 블라인드 지원

### 원칙
**색상만으로 정보 전달 금지** - 항상 아이콘, 텍스트, 패턴 병행

### 구현 예시

```tsx
// ✓ 올바른 예 (아이콘 + 색상 + 텍스트)
<div className="flex items-center gap-2">
  <span className="text-red-600">🔴</span>
  <span>높음</span>
</div>

// ✗ 잘못된 예 (색상만)
<div className="bg-red-600 w-4 h-4" />  {/* 무엇? */}

// ✓ 상태 배지
<StatusBadge
  status="IN_PROGRESS"
  icon={<PlayIcon />}  {/* 아이콘 추가 */}
/>

// ✓ 차트 (패턴 추가)
<BarChart
  data={categoryData}
  colors={["#3B82F6", "#10B981", "#F59E0B"]}
  patterns={["solid", "stripe", "dot"]}  {/* 패턴 구분 */}
/>
```

### 색상 팔레트 확인 (Color Blind 시뮬레이션)

```bash
# Deuteranopia (적록색약) 검사
# https://www.color-blindness.com/coblis-color-blindness-simulator/

# 설정 값:
- 원본 Blue #2563EB → Deuteranopia에서 인지 가능 ✓
- 원본 Green #10B981 → Deuteranopia에서 인지 가능 ✓
- 원본 Red #EF4444 → 주황색처럼 보임 → 아이콘 추가 필수
```

---

## 텍스트 크기 및 가독성

### 최소 글꼴 크기

| 콘텐츠 | 최소 크기 | 권장 크기 | 라인 높이 |
|--------|---------|---------|----------|
| 본문 | 14px | 16px | 1.5 |
| 캡션 | 12px | 14px | 1.4 |
| 제목 | 18px | 20px+ | 1.2 |
| 라벨 | 12px | 14px | 1.4 |

### 줄 간격 & 문자 간격

```css
/* ✓ 가독성 좋음 */
body {
  line-height: 1.5;
  letter-spacing: 0.5px;
}

h1, h2, h3 {
  line-height: 1.2;
}

/* 사용자가 줄 간격 확대 가능 */
/* 최대 200% 줄 간격, 200% 문자 간격에서도 깨지지 않아야 함 */
```

### 텍스트 리사이징

```tsx
// ✓ CSS에서 px 대신 rem/em 사용
<div className="text-base">  {/* 16px */}
  기본 텍스트
</div>

<h1 className="text-4xl">  {/* 2.25rem */}
  제목
</h1>

// ✓ 사용자 확대(200%)에서도 동작
/* ✗ 절대값 지양 */
.text {
  font-size: 16px;  // 이렇게 하면 안 됨
}

/* ✓ 상대값 사용 */
.text {
  font-size: 1rem;  // 사용자 설정 따름
}
```

### 가독성 점검

```tsx
// ✓ 명확한 언어
"민원이 성공적으로 제출되었습니다."

// ✗ 애매한 언어
"시스템에 전송되었습니다."  // 무엇이? 성공했나?

// ✓ 짧은 문장
"건물: 관악아파트 (서울시 강남구)"

// ✗ 긴 문장
"건물이란 우리가 관리하고 있는 서울시 강남구에 위치한 관악아파트라는 명칭의 부동산입니다."
```

---

## 모달 및 다이얼로그

### Focus Trap

```tsx
// ✓ 열려있을 때만 포커스 제한
<Dialog
  open={isOpen}
  onOpenChange={setIsOpen}
>
  <DialogContent>
    <DialogHeader>
      <DialogTitle id="dialog-title">
        새 민원 접수
      </DialogTitle>
    </DialogHeader>

    <div role="document" aria-labelledby="dialog-title">
      {/* 폼 콘텐츠 */}
      <input ref={firstFocusableRef} />
      {/* ... 중간 요소 ... */}
      <button ref={lastFocusableRef}>닫기</button>
    </div>
  </DialogContent>
</Dialog>

// 포커스 트랩 구현
useEffect(() => {
  if (!isOpen) return

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return

    const focusableElements = dialogRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements?.[0] as HTMLElement
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement?.focus()
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement?.focus()
    }
  }

  document.addEventListener("keydown", handleKeyDown)
  return () => document.removeEventListener("keydown", handleKeyDown)
}, [isOpen])
```

### 모달 배경

```tsx
// ✓ 배경 비활성화
<Dialog open={isOpen}>
  <DialogOverlay className="fixed inset-0 bg-black/50" />
  <DialogContent
    className="relative z-50"
    role="alertdialog"  {/* 경고면 alertdialog */}
  >
    {/* 콘텐츠 */}
  </DialogContent>
</Dialog>

// ✓ 배경 스크롤 제거
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }
}, [isOpen])
```

---

## 자동화 검증 도구

### 1. axe DevTools (Chrome Extension)

**설치**:
```
Chrome Web Store → "axe DevTools" 검색 → 설치
```

**사용법**:
1. 테스트 페이지 접속
2. axe DevTools 아이콘 클릭
3. "Scan ALL OF MY PAGE" 클릭
4. 결과 분석

**체크 항목**:
- ✓ 색상 대비
- ✓ 텍스트 라벨
- ✓ ARIA 속성
- ✓ 키보드 내비게이션

---

### 2. Lighthouse (Chrome DevTools)

**사용법**:
1. Chrome DevTools 열기 (F12)
2. "Lighthouse" 탭
3. "Accessibility" 선택
4. "Analyze page load" 클릭

**체크 항목**:
- Background and foreground colors
- Form labels
- ARIA attributes
- Page structure (headings)

**목표**: 90점 이상

---

### 3. WAVE (Chrome Extension)

**설치**:
```
Chrome Web Store → "WAVE" 검색 → 설치
```

**기능**:
- 시각적 피드백으로 이슈 표시
- 색상 대비 자동 계산
- 구조 개요

---

### 4. 수동 검증

#### 키보드 전용 테스트
```bash
1. 마우스/트랙패드 분리
2. Tab 키로만 네비게이션
3. Enter/Space로 버튼 활성화
4. 화살표 키로 라디오/선택 컨트롤

검증 항목:
- [ ] Tab 순서가 논리적인가?
- [ ] 모든 인터랙티브 요소에 접근 가능한가?
- [ ] 포커스가 명확히 표시되는가?
- [ ] Escape로 모달 닫을 수 있는가?
```

#### 스크린 리더 테스트 (NVDA / JAWS / VoiceOver)

```bash
# macOS (VoiceOver)
1. Cmd + F5로 VoiceOver 활성화
2. VO + U로 로터 열기
3. Headings, Links, Form Controls 탐색

# Windows (NVDA)
1. nvda-2024.1.exe 다운로드 및 설치
2. NVDA 시작
3. 테스트 페이지에서 H, K, F로 네비게이션
```

---

## 컴포넌트별 구현 예시

### Button 컴포넌트

```tsx
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  isDisabled?: boolean
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      isDisabled = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={isDisabled || isLoading}
        className={cn(
          // 기본 스타일
          "inline-flex items-center justify-center gap-2",
          "font-medium rounded-md transition-colors",
          // 포커스 (WCAG AA: 2px outline)
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          "focus-visible:outline-blue-600",
          // 크기
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-4 py-2 text-base",
          size === "lg" && "px-6 py-3 text-lg",
          // 변형 & 대비 (WCAG AA: 4.5:1)
          variant === "primary" &&
            "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
          variant === "secondary" &&
            "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400",
          variant === "danger" &&
            "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
          // 비활성화
          (isDisabled || isLoading) && "opacity-50 cursor-not-allowed",
          className
        )}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <Spinner size="sm" aria-hidden="true" />}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
```

### FormInput 컴포넌트

```tsx
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, required, id, className, ...props }, ref) => {
    const inputId = id || `input-${Math.random()}`
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-help`

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-900">
            {label}
            {required && (
              <span aria-label="필수 입력" className="text-red-600 ml-1">
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            // 기본 스타일
            "w-full px-3 py-2 border rounded-md",
            "text-base bg-white",
            // 정상 상태
            "border-gray-300",
            "focus-visible:outline-2 focus-visible:outline-offset-0",
            "focus-visible:outline-blue-600",
            // 에러 상태
            error && "border-red-600",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-required={required}
          aria-describedby={[
            error && errorId,
            helperText && helperId,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {helperText && (
          <div id={helperId} className="text-xs text-gray-500">
            {helperText}
          </div>
        )}
        {error && (
          <div
            id={errorId}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </div>
        )}
      </div>
    )
  }
)

FormInput.displayName = "FormInput"
```

### StatusBadge 컴포넌트

```tsx
type Status = "NEW" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
type Priority = "LOW" | "MEDIUM" | "HIGH"

const statusConfig: Record<Status, { icon: React.ReactNode; label: string; bgColor: string; textColor: string }> = {
  NEW: {
    icon: "📋",
    label: "접수",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
  },
  IN_PROGRESS: {
    icon: "⏳",
    label: "진행중",
    bgColor: "bg-amber-100",
    textColor: "text-amber-800",
  },
  COMPLETED: {
    icon: "✅",
    label: "완료",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  CANCELLED: {
    icon: "❌",
    label: "취소됨",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
  },
}

interface StatusBadgeProps {
  status: Status | Priority
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "solid"
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  variant = "default",
}) => {
  const config = statusConfig[status as Status]

  if (!config) return null

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        // 크기
        size === "sm" && "px-2 py-1 text-xs",
        size === "md" && "px-3 py-1.5 text-sm",
        size === "lg" && "px-4 py-2 text-base",
        // 변형
        variant === "default" && `${config.bgColor} ${config.textColor}`,
        variant === "outline" && `border-2 ${config.textColor} border-current`,
        variant === "solid" && "bg-white border-2 border-current",
      )}
      aria-label={config.label}
    >
      <span aria-hidden="true">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}
```

---

## 테스트 체크리스트

### 개발 중 체크리스트

- [ ] **색상 대비**
  - [ ] 본문 텍스트가 최소 4.5:1 대비
  - [ ] 큰 텍스트가 최소 3:1 대비
  - [ ] UI 컴포넌트 경계가 최소 3:1 대비
  - [ ] 포커스 인디케이터가 최소 3:1 대비
  - [ ] 상태 정보가 색상 + 다른 수단 (아이콘, 텍스트)

- [ ] **ARIA & 시맨틱**
  - [ ] 모든 폼 필드에 label 또는 aria-label
  - [ ] 버튼에 접근 가능한 텍스트 또는 aria-label
  - [ ] 폼 에러에 aria-invalid="true"
  - [ ] 로딩 상태에 aria-busy
  - [ ] 동적 콘텐츠에 aria-live
  - [ ] 시맨틱 HTML (header, nav, main, footer, article, section)

- [ ] **키보드 네비게이션**
  - [ ] Tab 키로 모든 인터랙티브 요소 접근 가능
  - [ ] Tab 순서가 논리적 (시각적 순서와 일치)
  - [ ] Escape로 모달/팝업 닫기 가능
  - [ ] 화살표 키로 라디오/선택 컨트롤 조작 가능
  - [ ] 포커스가 명확히 표시됨 (2px outline 최소)

- [ ] **이미지 & 미디어**
  - [ ] 모든 의미있는 이미지에 alt 속성
  - [ ] 장식 이미지에 alt="" + aria-hidden="true"
  - [ ] 복잡한 이미지에 figcaption 또는 aria-describedby
  - [ ] 배경 이미지에 role="img" + aria-label

- [ ] **폼 접근성**
  - [ ] 모든 input에 label (htmlFor 연결 또는 aria-label)
  - [ ] 필수 필드에 aria-required="true"
  - [ ] 에러 메시지에 aria-describedby 연결
  - [ ] 라디오/체크박스에 fieldset + legend
  - [ ] Select에 적절한 레이블

- [ ] **가독성**
  - [ ] 본문 텍스트가 최소 14px (권장 16px)
  - [ ] 줄 간격이 1.5 이상
  - [ ] 문자 간격이 0.5px 이상
  - [ ] 텍스트가 200% 확대될 때도 깨지지 않음
  - [ ] 언어가 명확하고 간결함

- [ ] **포커스 및 상호작용**
  - [ ] Focus trap이 모달에 있음
  - [ ] 포커스 복원이 페이지 전환 시 작동
  - [ ] 비활성화 버튼이 tab 순서에서 제외됨 (tabindex="-1")
  - [ ] Skip link (선택사항)

---

### 배포 전 검증 체크리스트

- [ ] **axe DevTools 검사**
  - [ ] 0개 Critical 이슈
  - [ ] 0개 Serious 이슈
  - [ ] Warning은 무시 가능

- [ ] **Lighthouse 검사**
  - [ ] Accessibility 점수 90점 이상

- [ ] **WAVE 검사**
  - [ ] 에러 0개
  - [ ] 대비 문제 0개

- [ ] **수동 키보드 테스트**
  - [ ] Tab으로 모든 요소 접근 가능
  - [ ] Escape로 모달 닫힘
  - [ ] 포커스가 명확히 표시됨

- [ ] **스크린 리더 테스트** (NVDA 또는 VoiceOver)
  - [ ] 페이지 구조가 논리적 (h1 → h2 → h3)
  - [ ] 폼 필드에 라벨이 읽힘
  - [ ] 버튼 목적이 명확함
  - [ ] 에러 메시지가 읽힘

- [ ] **색상 블라인드 시뮬레이션**
  - [ ] Deuteranopia (적록색약) 모드에서 색상 구분 가능
  - [ ] Protanopia (적색약) 모드에서 색상 구분 가능
  - [ ] 아이콘 + 텍스트+ 색상으로 정보 전달

---

## 참고 자료

### 공식 문서
- [WCAG 2.1 Guide](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### 도구
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WAVE](https://wave.webaim.org/)
- [Color Blind Simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 테스트
- [NVDA (Windows)](https://www.nvaccess.org/)
- [JAWS (Windows)](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (macOS)](https://www.apple.com/accessibility/voiceover/)

---

## 버전 관리

| 버전 | 날짜 | 변경 사항 |
|------|------|---------|
| 1.0 | 2026-03-15 | 초안 작성 (WCAG 2.1 Level AA) |

---

**마지막 수정**: 2026-03-15
**담당자**: Billim 개발팀
