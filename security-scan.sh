#!/bin/bash

# Security Scanner for TodoList Application
# Scans both TypeScript/React frontend and Java backend for OWASP Top 10 vulnerabilities

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_ISSUES=0
CRITICAL_ISSUES=0
HIGH_ISSUES=0
MEDIUM_ISSUES=0
LOW_ISSUES=0

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         TodoList Security Scanner - OWASP Top 10               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print section headers
print_section() {
    echo ""
    echo -e "${BLUE}▶ $1${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_section "Checking Prerequisites"

if ! command_exists node; then
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi

if ! command_exists mvn && [ -d "todolist-backend" ]; then
    echo -e "${YELLOW}⚠ Maven not found - skipping Java backend checks${NC}"
    SKIP_MAVEN=true
fi

if ! command_exists semgrep; then
    echo -e "${YELLOW}⚠ Semgrep not found - install with: pip install semgrep${NC}"
    echo -e "${YELLOW}  Continuing without Semgrep...${NC}"
    SKIP_SEMGREP=true
fi

echo -e "${GREEN}✓ Prerequisites checked${NC}"

# 1. ESLint Security Scan (TypeScript/React Frontend)
print_section "1. ESLint Security Scan (Frontend)"
cd todolist-frontend

if npm run lint > /tmp/eslint-output.txt 2>&1; then
    echo -e "${GREEN}✓ No ESLint security issues found${NC}"
else
    ESLINT_ISSUES=$(grep -c "error" /tmp/eslint-output.txt || echo "0")
    ESLINT_WARNINGS=$(grep -c "warning" /tmp/eslint-output.txt || echo "0")

    if [ "$ESLINT_ISSUES" -gt 0 ]; then
        echo -e "${RED}✗ Found $ESLINT_ISSUES ESLint errors${NC}"
        CRITICAL_ISSUES=$((CRITICAL_ISSUES + ESLINT_ISSUES))
        cat /tmp/eslint-output.txt
    fi

    if [ "$ESLINT_WARNINGS" -gt 0 ]; then
        echo -e "${YELLOW}⚠ Found $ESLINT_WARNINGS ESLint warnings${NC}"
        MEDIUM_ISSUES=$((MEDIUM_ISSUES + ESLINT_WARNINGS))
    fi
fi

cd ..

# 2. Semgrep Security Scan (Both Frontend and Backend)
if [ "$SKIP_SEMGREP" != "true" ]; then
    print_section "2. Semgrep OWASP Top 10 Scan"

    # Run Semgrep with custom rules
    if semgrep --config .semgrep.yml --json --output /tmp/semgrep-results.json . 2>/dev/null; then
        SEMGREP_ISSUES=$(jq '.results | length' /tmp/semgrep-results.json)

        if [ "$SEMGREP_ISSUES" -eq 0 ]; then
            echo -e "${GREEN}✓ No Semgrep security issues found${NC}"
        else
            echo -e "${YELLOW}⚠ Found $SEMGREP_ISSUES Semgrep findings${NC}"

            # Count by severity
            SEMGREP_ERRORS=$(jq '[.results[] | select(.extra.severity == "ERROR")] | length' /tmp/semgrep-results.json)
            SEMGREP_WARNINGS=$(jq '[.results[] | select(.extra.severity == "WARNING")] | length' /tmp/semgrep-results.json)

            HIGH_ISSUES=$((HIGH_ISSUES + SEMGREP_ERRORS))
            MEDIUM_ISSUES=$((MEDIUM_ISSUES + SEMGREP_WARNINGS))

            # Show detailed results
            semgrep --config .semgrep.yml .
        fi
    fi

    # Run Semgrep with community rules for additional coverage
    print_section "2b. Semgrep Community Rules Scan"
    if semgrep --config "p/owasp-top-ten" --config "p/security-audit" --json --output /tmp/semgrep-community.json . 2>/dev/null; then
        COMMUNITY_ISSUES=$(jq '.results | length' /tmp/semgrep-community.json)

        if [ "$COMMUNITY_ISSUES" -eq 0 ]; then
            echo -e "${GREEN}✓ No additional issues from community rules${NC}"
        else
            echo -e "${YELLOW}⚠ Found $COMMUNITY_ISSUES additional findings from community rules${NC}"
            HIGH_ISSUES=$((HIGH_ISSUES + COMMUNITY_ISSUES))
            semgrep --config "p/owasp-top-ten" --config "p/security-audit" .
        fi
    fi
fi

# 3. NPM Audit (Frontend Dependencies)
print_section "3. NPM Audit (Frontend Dependencies)"
cd todolist-frontend

if npm audit --json > /tmp/npm-audit.json 2>&1; then
    echo -e "${GREEN}✓ No vulnerable npm dependencies found${NC}"
else
    # Parse npm audit results
    CRITICAL_DEPS=$(jq '.metadata.vulnerabilities.critical // 0' /tmp/npm-audit.json)
    HIGH_DEPS=$(jq '.metadata.vulnerabilities.high // 0' /tmp/npm-audit.json)
    MODERATE_DEPS=$(jq '.metadata.vulnerabilities.moderate // 0' /tmp/npm-audit.json)
    LOW_DEPS=$(jq '.metadata.vulnerabilities.low // 0' /tmp/npm-audit.json)

    echo -e "${YELLOW}⚠ Vulnerable dependencies found:${NC}"
    echo "   Critical: $CRITICAL_DEPS"
    echo "   High: $HIGH_DEPS"
    echo "   Moderate: $MODERATE_DEPS"
    echo "   Low: $LOW_DEPS"

    CRITICAL_ISSUES=$((CRITICAL_ISSUES + CRITICAL_DEPS))
    HIGH_ISSUES=$((HIGH_ISSUES + HIGH_DEPS))
    MEDIUM_ISSUES=$((MEDIUM_ISSUES + MODERATE_DEPS))
    LOW_ISSUES=$((LOW_ISSUES + LOW_DEPS))

    npm audit
fi

cd ..

# 4. Maven Security Check (Backend Dependencies)
if [ "$SKIP_MAVEN" != "true" ] && [ -d "todolist-backend" ]; then
    print_section "4. Maven Dependency Security Check"
    cd todolist-backend

    # Check for vulnerable dependencies
    if mvn dependency:tree -DoutputFile=/tmp/maven-deps.txt > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Maven dependency tree generated${NC}"

        # Run OWASP Dependency Check if available
        if mvn org.owasp:dependency-check-maven:check > /tmp/maven-security.txt 2>&1; then
            echo -e "${GREEN}✓ OWASP Dependency Check completed${NC}"

            # Parse results if available
            if [ -f "target/dependency-check-report.html" ]; then
                echo "   Report available at: todolist-backend/target/dependency-check-report.html"
            fi
        else
            echo -e "${YELLOW}⚠ OWASP Dependency Check not configured${NC}"
            echo "   Add to pom.xml: org.owasp:dependency-check-maven"
        fi
    fi

    cd ..
fi

# 5. Check for common security misconfigurations
print_section "5. Configuration Security Check"

# Check for exposed secrets in config files
if grep -r "password\|secret\|key\|token" --include="*.properties" --include="*.yml" --include="*.yaml" --include=".env" . 2>/dev/null | grep -v "TODO\|example\|sample" > /tmp/secrets-check.txt; then
    SECRET_COUNT=$(wc -l < /tmp/secrets-check.txt)
    echo -e "${YELLOW}⚠ Found $SECRET_COUNT potential secrets in configuration files${NC}"
    MEDIUM_ISSUES=$((MEDIUM_ISSUES + SECRET_COUNT))
    head -n 10 /tmp/secrets-check.txt
    if [ "$SECRET_COUNT" -gt 10 ]; then
        echo "   ... and $((SECRET_COUNT - 10)) more"
    fi
else
    echo -e "${GREEN}✓ No obvious secrets found in configuration files${NC}"
fi

# 6. Check for debug/development settings
if grep -r "debug.*true\|development.*true\|NODE_ENV.*development" --include="*.properties" --include="*.yml" --include="*.yaml" --include="*.env" . 2>/dev/null > /tmp/debug-check.txt; then
    DEBUG_COUNT=$(wc -l < /tmp/debug-check.txt)
    echo -e "${YELLOW}⚠ Found $DEBUG_COUNT debug/development settings${NC}"
    LOW_ISSUES=$((LOW_ISSUES + DEBUG_COUNT))
else
    echo -e "${GREEN}✓ No debug settings found${NC}"
fi

# Calculate total issues
TOTAL_ISSUES=$((CRITICAL_ISSUES + HIGH_ISSUES + MEDIUM_ISSUES + LOW_ISSUES))

# Print Summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                     Security Scan Summary                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$TOTAL_ISSUES" -eq 0 ]; then
    echo -e "${GREEN}✓ No security issues found! 🎉${NC}"
    echo ""
    exit 0
else
    echo -e "${YELLOW}Total Issues Found: $TOTAL_ISSUES${NC}"
    echo ""

    if [ "$CRITICAL_ISSUES" -gt 0 ]; then
        echo -e "${RED}  Critical: $CRITICAL_ISSUES${NC}"
    fi

    if [ "$HIGH_ISSUES" -gt 0 ]; then
        echo -e "${RED}  High:     $HIGH_ISSUES${NC}"
    fi

    if [ "$MEDIUM_ISSUES" -gt 0 ]; then
        echo -e "${YELLOW}  Medium:   $MEDIUM_ISSUES${NC}"
    fi

    if [ "$LOW_ISSUES" -gt 0 ]; then
        echo -e "${YELLOW}  Low:      $LOW_ISSUES${NC}"
    fi

    echo ""

    # Exit with error if critical or high issues found
    if [ "$CRITICAL_ISSUES" -gt 0 ] || [ "$HIGH_ISSUES" -gt 0 ]; then
        echo -e "${RED}❌ Security scan failed: Critical or High severity issues found${NC}"
        echo -e "${YELLOW}Please fix these issues before committing.${NC}"
        echo ""
        exit 1
    else
        echo -e "${YELLOW}⚠ Security scan passed with warnings${NC}"
        echo -e "${YELLOW}Consider fixing medium and low severity issues.${NC}"
        echo ""
        exit 0
    fi
fi
