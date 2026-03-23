-- Work Order Domain Migration
-- Created: 2026-03-15

-- ============================================================
-- 1. work_orders 테이블
-- 민원/작업요청 기본 정보
-- ============================================================
CREATE TABLE IF NOT EXISTS work_orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL COMMENT '민원 제목',
    description LONGTEXT NOT NULL COMMENT '민원 상세 설명',
    category VARCHAR(50) NOT NULL COMMENT '카테고리 (LEAKAGE, APPLIANCE, PLUMBING, ELECTRICAL, OTHER)',
    status VARCHAR(50) NOT NULL DEFAULT 'NEW' COMMENT '상태 (NEW, IN_PROGRESS, COMPLETED, CANCELLED)',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM' COMMENT '우선순위 (LOW, MEDIUM, HIGH)',
    assigned_vendor_id BIGINT COMMENT '배정된 업체 ID',
    image_count INT NOT NULL DEFAULT 0 COMMENT '첨부 사진 개수',
    completed_at DATETIME COMMENT '완료 일시',
    cancelled_at DATETIME COMMENT '취소 일시',
    cancel_reason VARCHAR(500) COMMENT '취소 사유',
    created_at DATETIME NOT NULL COMMENT '생성 일시',
    updated_at DATETIME NOT NULL COMMENT '수정 일시',

    CONSTRAINT fk_work_orders_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT,
    CONSTRAINT fk_work_orders_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE RESTRICT,
    CONSTRAINT fk_work_orders_vendor FOREIGN KEY (assigned_vendor_id) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_room_id (room_id),
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_assigned_vendor_id (assigned_vendor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='민원/작업요청';

-- ============================================================
-- 2. work_order_images 테이블
-- 민원 첨부 사진
-- ============================================================
CREATE TABLE IF NOT EXISTS work_order_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    work_order_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL COMMENT 'S3/Cloud Storage URL',
    thumbnail_url VARCHAR(500) COMMENT '썸네일 이미지 URL',
    display_order INT NOT NULL DEFAULT 0 COMMENT '표시 순서',
    created_at DATETIME NOT NULL COMMENT '생성 일시',
    updated_at DATETIME NOT NULL COMMENT '수정 일시',

    CONSTRAINT fk_work_order_images FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,

    INDEX idx_work_order_id (work_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='민원 첨부 사진';

-- ============================================================
-- 3. work_order_timelines 테이블
-- 민원 상태 변경 이력
-- ============================================================
CREATE TABLE IF NOT EXISTS work_order_timelines (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    work_order_id BIGINT NOT NULL,
    event_type VARCHAR(50) NOT NULL COMMENT '이벤트 타입 (CREATED, STATUS_CHANGED, VENDOR_ASSIGNED, VENDOR_UNASSIGNED, COMMENT_ADDED)',
    actor_id BIGINT NOT NULL COMMENT '이벤트 발생자 ID',
    actor_type VARCHAR(50) NOT NULL COMMENT '발생자 타입 (TENANT, ADMIN, VENDOR)',
    description TEXT NOT NULL COMMENT '이벤트 설명',
    metadata JSON COMMENT '추가 메타데이터',
    created_at DATETIME NOT NULL COMMENT '생성 일시',
    updated_at DATETIME NOT NULL COMMENT '수정 일시',

    CONSTRAINT fk_work_order_timelines FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_work_order_timelines_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE RESTRICT,

    INDEX idx_work_order_id (work_order_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='민원 상태 변경 이력';

-- ============================================================
-- 4. work_order_categories 테이블
-- 민원 카테고리 관리
-- ============================================================
CREATE TABLE IF NOT EXISTS work_order_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '카테고리명',
    description TEXT COMMENT '카테고리 설명',
    display_order INT NOT NULL DEFAULT 0 COMMENT '표시 순서',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '활성 여부',
    created_at DATETIME NOT NULL COMMENT '생성 일시',
    updated_at DATETIME NOT NULL COMMENT '수정 일시',

    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='민원 카테고리';

-- ============================================================
-- 5. vendor_assignments 테이블
-- 업체 배정 기록
-- ============================================================
CREATE TABLE IF NOT EXISTS vendor_assignments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    work_order_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    assigned_at DATETIME NOT NULL COMMENT '배정 일시',
    unassigned_at DATETIME COMMENT '배정 해제 일시',
    notes TEXT COMMENT '배정 시 메모',
    created_at DATETIME NOT NULL COMMENT '생성 일시',
    updated_at DATETIME NOT NULL COMMENT '수정 일시',

    CONSTRAINT fk_vendor_assignments_work_order FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_vendor_assignments_vendor FOREIGN KEY (vendor_id) REFERENCES users(id) ON DELETE RESTRICT,

    INDEX idx_work_order_id (work_order_id),
    INDEX idx_vendor_id (vendor_id),
    INDEX idx_assigned_at (assigned_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='업체 배정 기록';

-- ============================================================
-- 6. preventive_maintenance_guides 테이블
-- 예방 정비 가이드
-- ============================================================
CREATE TABLE IF NOT EXISTS preventive_maintenance_guides (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL COMMENT '항목명',
    description LONGTEXT COMMENT '설명',
    category VARCHAR(50) NOT NULL COMMENT '카테고리',
    interval_months INT NOT NULL COMMENT '정비 주기 (개월)',
    last_maintenance_date DATE COMMENT '마지막 시행 날짜',
    next_maintenance_date DATE NOT NULL COMMENT '다음 예정 날짜',
    created_by_id BIGINT NOT NULL COMMENT '가이드 생성자 (관리자)',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '활성 여부',
    created_at DATETIME NOT NULL COMMENT '생성 일시',
    updated_at DATETIME NOT NULL COMMENT '수정 일시',

    CONSTRAINT fk_preventive_maintenance_guides_creator FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE RESTRICT,

    INDEX idx_category (category),
    INDEX idx_next_maintenance_date (next_maintenance_date),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='예방 정비 가이드';

-- ============================================================
-- 초기 데이터 삽입
-- ============================================================

-- 기본 카테고리 추가
INSERT INTO work_order_categories (name, description, display_order, is_active, created_at, updated_at)
VALUES
    ('누수', '물이 새거나 고여있는 현상', 1, TRUE, NOW(), NOW()),
    ('가전', '냉장고, 에어컨 등 가전 제품 고장', 2, TRUE, NOW(), NOW()),
    ('배관', '수도관, 하수관 등 배관 문제', 3, TRUE, NOW(), NOW()),
    ('전기', '형광등, 전기 콘센트 등 전기 관련 문제', 4, TRUE, NOW(), NOW()),
    ('기타', '위 카테고리에 해당하지 않는 기타 요청', 5, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================
-- 인덱싱 및 성능 최적화
-- ============================================================

-- 복합 인덱스: room + status (자주 함께 조회)
ALTER TABLE work_orders ADD INDEX idx_room_status (room_id, status);

-- 복합 인덱스: tenant + created_at (임차인의 민원 조회)
ALTER TABLE work_orders ADD INDEX idx_tenant_created (tenant_id, created_at DESC);

-- 복합 인덱스: status + created_at (상태별 최신 조회)
ALTER TABLE work_orders ADD INDEX idx_status_created (status, created_at DESC);

-- 복합 인덱스: assigned_vendor + status (업체의 진행중 민원)
ALTER TABLE work_orders ADD INDEX idx_vendor_status (assigned_vendor_id, status);
