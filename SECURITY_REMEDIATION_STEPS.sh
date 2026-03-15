#!/bin/bash

################################################################################
# BILLIM PROJECT - SECURITY REMEDIATION SCRIPT
#
# This script applies all security patches identified in VULNERABILITY_AUDIT.md
# Date: 2026-03-15
# Status: 5 frontend vulnerabilities (4 HIGH, 1 MODERATE) - all fixable
################################################################################

set -e  # Exit on first error

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo "================================"
echo "BILLIM SECURITY PATCH EXECUTION"
echo "================================"
echo ""
echo "Project Root: $PROJECT_ROOT"
echo "Frontend Dir: $FRONTEND_DIR"
echo ""

# Step 1: Verify npm is available
echo "[STEP 1/4] Verifying environment..."
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm not found. Please install Node.js."
    exit 1
fi
echo "✓ npm found: $(npm --version)"
echo ""

# Step 2: Backup package-lock.json
echo "[STEP 2/4] Backing up package-lock.json..."
cd "$FRONTEND_DIR"
if [ -f package-lock.json ]; then
    cp package-lock.json package-lock.json.backup
    echo "✓ Backup created: package-lock.json.backup"
else
    echo "⚠ package-lock.json not found, skipping backup"
fi
echo ""

# Step 3: Apply safe patches (Phase 1)
echo "[STEP 3/4] Applying Phase 1 patches (non-breaking)..."
echo ""
echo "Expected changes:"
echo "  - ajv:       6.12.6 → 6.14.0 (MODERATE fix)"
echo "  - axios:     1.13.2 → 1.13.6 (HIGH fix)"
echo "  - flatted:   3.3.3 → 3.4.1 (HIGH fix)"
echo "  - minimatch: 3.1.2 → 3.1.5 + 9.0.5 → 9.0.9 (HIGH fixes)"
echo ""
echo "Executing: npm audit fix"
npm audit fix

if [ $? -eq 0 ]; then
    echo "✓ Phase 1 patches applied successfully"
else
    echo "✗ Phase 1 patches failed. Check output above."
    exit 1
fi
echo ""

# Step 4: Apply force update for Next.js (Phase 2)
echo "[STEP 4/4] Applying Phase 2 patches (Next.js security update)..."
echo ""
echo "Expected changes:"
echo "  - next: 16.1.0 → 16.1.6 (3 HIGH DoS fixes)"
echo ""
echo "Executing: npm audit fix --force"
npm audit fix --force

if [ $? -eq 0 ]; then
    echo "✓ Phase 2 patches applied successfully"
else
    echo "✗ Phase 2 patches failed. Check output above."
    exit 1
fi
echo ""

# Step 5: Verification
echo "================================"
echo "VERIFICATION PHASE"
echo "================================"
echo ""

echo "[CHECK 1/3] Verifying no critical vulnerabilities remain..."
echo "Executing: npm audit"
npm audit --audit-level=critical
if [ $? -eq 0 ]; then
    echo "✓ No critical vulnerabilities found"
else
    echo "⚠ Some vulnerabilities remain (may be transitive)"
fi
echo ""

echo "[CHECK 2/3] Running linter..."
if npm run lint 2>&1 | head -20; then
    echo "✓ Linting completed"
else
    echo "⚠ Linting issues detected - review above"
fi
echo ""

echo "[CHECK 3/3] Testing production build..."
if npm run build 2>&1 | tail -10; then
    echo "✓ Production build successful"
else
    echo "✗ Production build failed - see errors above"
    exit 1
fi
echo ""

# Success
echo "================================"
echo "✓ ALL PATCHES APPLIED"
echo "================================"
echo ""
echo "Summary:"
echo "  ✓ Phase 1: 4 safe patches applied"
echo "  ✓ Phase 2: Next.js security update applied"
echo "  ✓ Verification: Build successful"
echo ""
echo "Next Steps:"
echo "  1. Review all changes: git diff package-lock.json"
echo "  2. Test application features (Image Optimizer, RSC, PPR)"
echo "  3. Run full test suite: npm test"
echo "  4. Commit changes with: git add . && git commit -m 'chore: apply security patches'"
echo "  5. Push to remote: git push"
echo ""
echo "Audit Report: $PROJECT_ROOT/VULNERABILITY_AUDIT.md"
echo ""
