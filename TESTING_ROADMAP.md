# Testing Roadmap - Portfolio Project

> **Last Updated:** 2025-01-11
> **Current Coverage:** 103/106 tests passing (97%)
> **Branch:** `feat/testing-infrastructure`

---

## Table of Contents

1. [Current Test Coverage](#current-test-coverage)
2. [Critical Priority Tests (Week 1)](#critical-priority-tests-week-1)
3. [High Priority Tests (Week 2)](#high-priority-tests-week-2)
4. [Medium Priority Tests (Week 3-4)](#medium-priority-tests-week-3-4)
5. [Low Priority Tests (Backlog)](#low-priority-tests-backlog)
6. [Testing Strategy Guidelines](#testing-strategy-guidelines)
7. [Quick Reference](#quick-reference)

---

## Current Test Coverage

### ✅ What We Have

| Type        | File                              | Tests         | Status  |
| ----------- | --------------------------------- | ------------- | ------- |
| Unit        | `cloudflare.test.ts`              | 6             | ✅      |
| Unit        | `ratelimit.test.ts`               | 12            | ✅      |
| Unit        | `contact-form-validation.test.ts` | 16            | ✅      |
| Integration | `mail.test.ts`                    | 9             | ✅      |
| Integration | `discord.test.ts`                 | 14            | ✅      |
| Component   | `button.test.tsx`                 | 20            | ✅      |
| E2E         | `contact-form.spec.ts`            | 8 (3 skipped) | ✅      |
| E2E         | `navigation.spec.ts`              | 21            | ✅      |
| **Total**   |                                   | **103**       | **97%** |

### ❌ What We're Missing

- **Server Actions:** Contact form submission logic
- **Workers:** Discord notification processing
- **Utilities:** Date formatting, class merging, color conversion
- **Components:** 40+ components (forms, galleries, navigation, etc.)
- **Pages:** Home, About, Projects listing, Project detail
- **Error Handling:** Error boundaries, 404 pages
- **Image Processing:** Email screenshot generation

---

## Critical Priority Tests (Week 1)

### Day 1: Server Actions & Middleware

#### 1.1 Contact Form Server Action

**File:** `tests/integration/actions/contact-form-action.test.ts`
**Source:** `src/app/contact/_components/action.ts`

```typescript
describe('sendEmailAction', () => {
  // ✅ Test cases to implement:

  // Rate Limiting
  test('should enforce 5 requests per hour limit')
  test('should return error when rate limit exceeded')
  test('should reset rate limit after 1 hour')

  // Turnstile Verification
  test('should verify valid Turnstile token')
  test('should reject invalid Turnstile token')
  test('should handle Turnstile API errors')

  // Honeypot Protection
  test('should detect bot via honeypot field')
  test('should log bot detection to Sentry')
  test('should allow submission when honeypot empty')

  // Email Sending
  test('should send email with valid data')
  test('should handle email service failures')
  test('should log email errors to Sentry')

  // Discord Queue
  test('should add job to Discord queue on success')
  test('should include form data in queue job')

  // Error Handling
  test('should return PublicError for user-facing errors')
  test('should handle unexpected errors gracefully')
})
```

**Estimated Time:** 4-5 hours
**Dependencies:** Existing mocks (Redis, Resend, Discord, Turnstile)
**Priority:** 🔴 CRITICAL

---

#### 1.2 Safe Action Middleware

**File:** `tests/unit/lib/safe-action.test.ts`
**Source:** `src/lib/safe-action.ts`

```typescript
describe('unauthenticatedAction', () => {
  // ✅ Test cases to implement:

  // Error Handling
  test('should return formatted PublicError')
  test('should return generic error in production')
  test('should return detailed error in development')

  // Sentry Integration
  test('should capture exceptions to Sentry')
  test('should create Sentry span for action')
  test('should set span status on error')

  // Logging
  test('should log action start')
  test('should log action completion')
  test('should log execution time')

  // Performance
  test('should measure action execution time')
  test('should attach timing to Sentry span')
})
```

**Estimated Time:** 2-3 hours
**Dependencies:** Mock Sentry
**Priority:** 🔴 CRITICAL

---

### Day 2: Discord Worker

#### 2.1 Discord Worker Job Processing

**File:** `tests/integration/workers/discord-worker.test.ts`
**Source:** `src/lib/workers/discord-worker.tsx`

```typescript
describe('Discord Worker', () => {
  // ✅ Test cases to implement:

  // Job Processing
  test('should process contact form job successfully')
  test('should render email template with form data')
  test('should generate snapshot with timeout protection')

  // Snapshot Handling
  test('should attach image when snapshot succeeds')
  test('should fall back to text-only when snapshot fails')
  test('should handle browser launch failures')
  test('should handle screenshot timeout')

  // Discord Sending
  test('should send webhook with embed and attachment')
  test('should send text-only embed when no image')
  test('should handle webhook errors')

  // Error Recovery
  test('should log errors to Sentry')
  test('should mark job as failed on error')
  test('should emit completed event on success')
  test('should emit failed event on error')

  // Data Handling
  test('should format form data correctly')
  test('should create Discord embed with all fields')
  test('should convert hex color to decimal')
})
```

**Estimated Time:** 5-6 hours
**Dependencies:** Mock Puppeteer, mock Discord webhook, mock Resend
**Priority:** 🔴 CRITICAL

---

### Day 3: Contact Form Component

#### 3.1 Contact Form Component Tests

**File:** `tests/component/contact/contact-form.test.tsx`
**Source:** `src/app/contact/_components/contact-form.tsx`

```typescript
describe('ContactForm', () => {
  // ✅ Test cases to implement:

  // Rendering
  test('should render all form fields')
  test('should render Turnstile widget')
  test('should render submit button')
  test('should render honeypot field (hidden)')

  // Validation
  test('should show error for empty name')
  test('should show error for short name (< 3 chars)')
  test('should show error for invalid email')
  test('should show error for empty message')
  test('should clear errors when user types')

  // Turnstile Integration
  test('should update turnstileToken on verification')
  test('should show error when turnstile not completed')
  test('should toggle theme on Turnstile widget')

  // Form Submission
  test('should disable submit button during submission')
  test('should show "Sending..." text when pending')
  test('should show toast on success')
  test('should show toast on error')
  test('should reset form on successful submission')

  // Honeypot
  test('should not show honeypot field to users')
  test('should include honeypot in form data')

  // Animations
  test('should animate submit button icon')
  test('should rotate icon during submission')
})
```

**Estimated Time:** 4-5 hours
**Dependencies:** Mock next-safe-action, mock Turnstile
**Priority:** 🔴 CRITICAL

---

### Day 4-5: Utility Functions & Email Processing

#### 4.1 Core Utilities

**File:** `tests/unit/utils/utils.test.ts`
**Source:** `src/lib/utils/index.ts`

```typescript
describe('Utility Functions', () => {
  describe('cn', () => {
    test('should merge class names')
    test('should handle conditional classes')
    test('should merge Tailwind classes correctly')
    test('should handle undefined/null values')
  })

  describe('formatDate', () => {
    test('should format date with default format')
    test('should format date with custom format')
    test('should handle different locales')
    test('should handle invalid dates')
  })

  describe('hexToDecimal', () => {
    test('should convert hex color to decimal')
    test('should handle 3-digit hex codes')
    test('should handle 6-digit hex codes')
    test('should handle hex with # prefix')
    test('should handle invalid hex codes')
  })
})
```

**Estimated Time:** 2 hours
**Priority:** 🟠 HIGH

---

#### 4.2 Email Snapshot Generation

**File:** `tests/integration/mail/email-snapshot.test.ts`
**Source:** `src/lib/mail/snapshot/index.ts`

```typescript
describe('emailHtmlToImage', () => {
  // ✅ Test cases to implement:

  // Browser Management
  test('should create browser successfully')
  test('should retry browser creation on failure')
  test('should close browser after screenshot')
  test('should close browser on error')

  // Page Management
  test('should create new page')
  test('should retry page creation on failure')
  test('should set viewport size')
  test('should load HTML content')

  // Screenshot Generation
  test('should capture screenshot as buffer')
  test('should apply timeout protection')
  test('should handle screenshot timeout')

  // Error Handling
  test('should throw on browser launch failure')
  test('should throw on screenshot failure')
  test('should cleanup resources on error')

  // Sentry Integration
  test('should create Sentry span')
  test('should track performance')

  describe('testBrowser', () => {
    test('should validate browser functionality')
    test('should detect broken browser')
  })
})
```

**Estimated Time:** 4-5 hours
**Dependencies:** Mock Puppeteer
**Priority:** 🟠 HIGH

---

#### 4.3 Email Rendering

**File:** `tests/unit/mail/email-render.test.ts`
**Source:** `src/lib/mail/render/index.tsx`

```typescript
describe('renderContactFormEmail', () => {
  test('should render email with all form data')
  test('should omit turnstileToken from email')
  test('should omit verify field from email')
  test('should format email HTML correctly')
  test('should handle missing optional fields')
})
```

**Estimated Time:** 1-2 hours
**Priority:** 🟠 HIGH

---

## High Priority Tests (Week 2)

### Day 6: UI Components - Forms

#### 6.1 Form Components

**File:** `tests/component/ui/input.test.tsx`

```typescript
describe('Input', () => {
  test('should render input field')
  test('should apply error styles when aria-invalid')
  test('should handle disabled state')
  test('should forward ref correctly')
  test('should accept className prop')
})
```

**File:** `tests/component/ui/textarea.test.tsx`

```typescript
describe('Textarea', () => {
  test('should render textarea field')
  test('should apply error styles when aria-invalid')
  test('should handle disabled state')
  test('should resize correctly')
})
```

**File:** `tests/component/ui/label.test.tsx`

```typescript
describe('Label', () => {
  test('should render label text')
  test('should apply error styles with text-destructive')
  test('should handle htmlFor attribute')
})
```

**Estimated Time:** 3-4 hours
**Priority:** 🟠 HIGH

---

### Day 7: Navigation Components

#### 7.1 Navbar Component

**File:** `tests/component/layout/navbar.test.tsx`
**Source:** `src/components/layout/navbar.tsx`

```typescript
describe('Navbar', () => {
  // Desktop Navigation
  test('should render logo/brand')
  test('should render all nav items')
  test('should highlight active route')
  test('should render GitHub link')
  test('should render theme toggle')

  // Scroll Behavior
  test('should apply backdrop blur on scroll')
  test('should add shadow on scroll')
  test('should be transparent at top')

  // Mobile Navigation
  test('should hide desktop nav on mobile')
  test('should show mobile toggle on mobile')
  test('should toggle mobile menu')

  // Animations
  test('should animate on mount')
  test('should animate nav items')
  test('should show active indicator')

  // Sentry Integration
  test('should track navigation clicks')
})
```

**Estimated Time:** 4-5 hours
**Priority:** 🟠 HIGH

---

#### 7.2 Footer Component

**File:** `tests/component/layout/footer.test.tsx`

```typescript
describe('Footer', () => {
  test('should render footer content')
  test('should render social links')
  test('should render copyright year')
  test('should render all navigation links')
})
```

**Estimated Time:** 1-2 hours
**Priority:** 🟠 HIGH

---

### Day 8: Project Pages E2E

#### 8.1 Projects Listing Page

**File:** `tests/e2e/projects-listing.spec.ts`

```typescript
describe('Projects Listing Page', () => {
  // Page Load
  test('should load projects page')
  test('should display page title')
  test('should display project count')

  // Featured Projects
  test('should display featured projects section')
  test('should show featured badge')
  test('should render project cards')

  // In Progress Projects
  test('should display in-progress section')
  test('should show in-progress badge')

  // Project Cards
  test('should display project title')
  test('should display project description')
  test('should display project technologies')
  test('should navigate to project detail on click')

  // Empty States
  test('should show empty state when no projects')
})
```

**Estimated Time:** 3-4 hours
**Priority:** 🟠 HIGH

---

#### 8.2 Project Detail Page

**File:** `tests/e2e/project-detail.spec.ts`

```typescript
describe('Project Detail Page', () => {
  // Valid Project
  test('should load project detail page')
  test('should display project title')
  test('should display project description')
  test('should display technology badges')
  test('should display project gallery')
  test('should navigate gallery images')
  test('should display project features')
  test('should display related projects')

  // Invalid Project
  test('should show 404 for invalid slug')
  test('should redirect to projects page')

  // Related Projects
  test('should hide related section when none')
  test('should filter out current project')
  test('should limit to 3 related projects')
})
```

**Estimated Time:** 4-5 hours
**Priority:** 🟠 HIGH

---

### Day 9-10: Metadata & SEO

#### 9.1 Metadata Configuration

**File:** `tests/unit/lib/metadata-config.test.ts`
**Source:** `src/lib/metadata-config.ts`

```typescript
describe('generateMetadata', () => {
  test('should generate page title')
  test('should generate description')
  test('should generate OpenGraph metadata')
  test('should generate Twitter metadata')
  test('should generate canonical URL')
  test('should handle dynamic parameters')
  test('should construct correct image URLs')
  test('should handle missing parameters')
})
```

**Estimated Time:** 2-3 hours
**Priority:** 🟠 HIGH

---

## Medium Priority Tests (Week 3-4)

### Week 3: Feature Components

#### Day 11-12: Gallery & Project Components

**Files to test:**

- `tests/component/project-gallery.test.tsx`
- `tests/component/project-card.test.tsx`
- `tests/component/related-projects.test.tsx`

```typescript
// Project Gallery
describe('ProjectGallery', () => {
  test('should render gallery images')
  test('should navigate between images')
  test('should show image counter')
  test('should handle keyboard navigation')
  test('should open lightbox on click')
})

// Project Card
describe('ProjectCard', () => {
  test('should render project info')
  test('should render technologies')
  test('should navigate on click')
  test('should show featured badge')
  test('should show in-progress badge')
})

// Related Projects
describe('RelatedProjects', () => {
  test('should render related projects')
  test('should exclude current project')
  test('should limit to max projects')
  test('should show empty state when none')
})
```

**Estimated Time:** 6-8 hours
**Priority:** 🟡 MEDIUM

---

#### Day 13-14: Theme & UI Components

**Files to test:**

- `tests/component/theme-toggle.test.tsx`
- `tests/component/ui/badge.test.tsx`
- `tests/component/ui/spinner.test.tsx`
- `tests/component/code-block-with-copy.test.tsx`

```typescript
// Theme Toggle
describe('ThemeToggle', () => {
  test('should toggle between light/dark')
  test('should show current theme icon')
  test('should persist theme choice')
  test('should respect system preference')
})

// Badge
describe('Badge', () => {
  test('should render with default variant')
  test('should render all variants')
  test('should apply custom className')
})

// Code Block with Copy
describe('CodeBlockWithCopy', () => {
  test('should render code block')
  test('should show copy button')
  test('should copy code to clipboard')
  test('should show success feedback')
})
```

**Estimated Time:** 4-5 hours
**Priority:** 🟡 MEDIUM

---

### Week 4: Page E2E Tests

#### Day 15: Home Page E2E

**File:** `tests/e2e/home.spec.ts`

```typescript
describe('Home Page', () => {
  // Hero Section
  test('should display hero heading')
  test('should display hero description')
  test('should animate hero content')

  // Featured Projects
  test('should display featured projects')
  test('should navigate to projects')

  // Skills Section
  test('should display skills')
  test('should show skill categories')

  // CTA Section
  test('should display call-to-action')
  test('should navigate to contact')
})
```

**Estimated Time:** 3-4 hours
**Priority:** 🟡 MEDIUM

---

#### Day 16: About Page E2E

**File:** `tests/e2e/about.spec.ts`

```typescript
describe('About Page', () => {
  test('should display about content')
  test('should display images gallery')
  test('should display skills section')
  test('should display interests')
  test('should navigate to contact')
})
```

**Estimated Time:** 2-3 hours
**Priority:** 🟡 MEDIUM

---

#### Day 17-18: Error Handling

**Files to test:**

- `tests/e2e/404.spec.ts`
- Add error boundaries and test them

```typescript
describe('404 Page', () => {
  test('should show 404 for invalid routes')
  test('should display not found message')
  test('should provide navigation back')
  test('should suggest home page')
})

// TODO: Add error boundaries first
describe('Error Boundaries', () => {
  test('should catch rendering errors')
  test('should display error UI')
  test('should log errors to Sentry')
  test('should allow error recovery')
})
```

**Estimated Time:** 3-4 hours
**Priority:** 🟡 MEDIUM

---

## Low Priority Tests (Backlog)

### Animation Components

- `scroll-animation.test.tsx`
- `animated-text.test.tsx`
- `text-generate-effect.test.tsx`
- `typewriter-effect.test.tsx`

**Estimated Time:** 4-6 hours
**Priority:** 🟢 LOW

---

### Section Components

- `hero-section.test.tsx`
- `about-content.test.tsx`
- `featured-projects-section.test.tsx`
- `skills-section.test.tsx`
- `interests-section.test.tsx`

**Estimated Time:** 6-8 hours
**Priority:** 🟢 LOW

---

### Data Validation

- `tests/unit/data/projects-data.test.ts`
- Schema validation for all projects

**Estimated Time:** 2-3 hours
**Priority:** 🟢 LOW

---

### Loading States

- `tests/component/loading/home-loading.test.tsx`
- `tests/component/loading/about-loading.test.tsx`
- `tests/component/loading/projects-loading.test.tsx`
- `tests/component/skeleton-loader.test.tsx`

**Estimated Time:** 3-4 hours
**Priority:** 🟢 LOW

---

## Testing Strategy Guidelines

### Unit Tests

**When to write:**

- Pure functions with no side effects
- Utility functions
- Data transformations
- Validation logic

**What to test:**

- Input/output combinations
- Edge cases (empty, null, undefined)
- Error conditions
- Type handling

**Example structure:**

```typescript
describe('functionName', () => {
  test('should handle valid input')
  test('should handle edge case')
  test('should throw on invalid input')
})
```

---

### Integration Tests

**When to write:**

- Functions with external dependencies
- API integrations
- Database operations
- Email/webhook sending

**What to test:**

- Success paths
- Error handling
- Retry logic
- Timeouts
- Mock interactions

**Example structure:**

```typescript
describe('Integration: Service', () => {
  beforeEach(() => {
    // Setup mocks
  })

  test('should call external service')
  test('should handle service errors')
  test('should retry on failure')
})
```

---

### Component Tests

**When to write:**

- UI components with interactions
- Form components
- Components with state
- Components with side effects

**What to test:**

- Rendering with different props
- User interactions (click, type, submit)
- State changes
- Conditional rendering
- Accessibility

**Example structure:**

```typescript
describe('ComponentName', () => {
  test('should render with props')
  test('should handle user interaction')
  test('should show error states')
  test('should be accessible')
})
```

---

### E2E Tests

**When to write:**

- Critical user flows
- Multi-page interactions
- Form submissions
- Navigation flows

**What to test:**

- Complete user journeys
- Real browser behavior
- Navigation between pages
- Form validation and submission
- Error scenarios

**Example structure:**

```typescript
describe('User Flow', () => {
  test('should complete entire flow')
  test('should handle errors gracefully')
  test('should navigate correctly')
})
```

---

## Quick Reference

### Test Commands

```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run integration tests only
pnpm test:integration

# Run component tests only
pnpm test:component

# Run E2E tests
pnpm test:e2e

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test -- --watch

# Run tests in UI mode
pnpm test:ui
```

---

### Mock Locations

```typescript
// Mocks available
// Fixtures
import {
  invalidContactForm,
  validContactForm,
} from '@tests/fixtures/contact-form'
import { mockProjects } from '@tests/fixtures/projects'
import { mockAxiosPost } from '@tests/mocks/discord'
import { mockQueue } from '@tests/mocks/queue'
import { mockRedis } from '@tests/mocks/redis'
import { mockResendSend } from '@tests/mocks/resend'
import { mockVerifyTurnstile } from '@tests/mocks/turnstile'
// Test utilities
import { renderWithProviders } from '@tests/setup/test-utils'
```

---

### Estimated Total Time

| Priority  | Tasks        | Estimated Hours  |
| --------- | ------------ | ---------------- |
| Critical  | 5 areas      | 20-25 hours      |
| High      | 7 areas      | 25-30 hours      |
| Medium    | 8 areas      | 30-40 hours      |
| Low       | 5 areas      | 15-20 hours      |
| **Total** | **25 areas** | **90-115 hours** |

---

## Success Metrics

### Coverage Goals

- **Unit Tests:** 90%+ coverage
- **Integration Tests:** 80%+ coverage
- **Component Tests:** 70%+ coverage
- **E2E Tests:** Critical paths 100%

### Current vs Goal

```
Current:  103 tests (97% passing)
Goal:     300+ tests (95%+ passing)
Progress: 34%
```

---

## Notes & Recommendations

1. **Start with Critical** - Focus on server actions and workers first
2. **Mock Early** - Add new mocks as needed (Puppeteer, Sentry spans)
3. **Test Incrementally** - Don't try to test everything at once
4. **Run Tests Often** - Keep tests passing as you add new ones
5. **Document Learnings** - Update this roadmap with actual time spent
6. **Skip Low Priority** - Only do low-priority tests if time permits
7. **Consider Visual Regression** - For presentational components, consider snapshot testing
8. **Performance Testing** - Consider adding performance benchmarks for critical paths

---

**Happy Testing! 🧪**
