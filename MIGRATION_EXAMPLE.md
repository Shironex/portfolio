# Frontend Migration Example

This shows how to update your existing pages to use Payload CMS instead of the static data file.

## Option 1: Keep Static Data (Easiest - No Changes Needed)

You can keep using `src/data/projects-data.ts` as-is. The CMS will be available for managing projects through the admin panel, but your code doesn't change. This is good for testing.

## Option 2: Switch to Payload (Recommended)

Update your pages to fetch from Payload CMS instead of the static file.

### Example: Projects List Page

**Before** (`src/app/projects/page.tsx`):
```typescript
import { projects } from '@/data/projects-data'

export default function ProjectsPage() {
  const featuredProjects = projects.filter((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  return (
    <div>
      {/* render projects */}
    </div>
  )
}
```

**After** (using Payload):
```typescript
import { getProjects, getFeaturedProjects } from '@/lib/payload/get-projects'

export default async function ProjectsPage() {
  // Fetch from Payload CMS
  const featuredProjects = await getFeaturedProjects(3)
  const allProjects = await getProjects()
  const otherProjects = allProjects.filter((p) => !p.featured)

  return (
    <div>
      {/* render projects - same as before! */}
    </div>
  )
}
```

### Example: Single Project Page

**Before** (`src/app/projects/[slug]/page.tsx`):
```typescript
import { projects } from '@/data/projects-data'

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug)

  if (!project) {
    notFound()
  }

  return (
    <div>
      {/* render project */}
    </div>
  )
}
```

**After** (using Payload):
```typescript
import { getProjectBySlug, getProjectSlugs } from '@/lib/payload/get-projects'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <div>
      {/* render project - same as before! */}
    </div>
  )
}
```

### Example: Featured Projects Section

**Before** (`src/components/sections/featured-projects-section.tsx`):
```typescript
import { projects } from '@/data/projects-data'

export function FeaturedProjectsSection() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3)

  return (
    <section>
      {/* render featured projects */}
    </section>
  )
}
```

**After** (using Payload):
```typescript
import { getFeaturedProjects } from '@/lib/payload/get-projects'

export async function FeaturedProjectsSection() {
  const featuredProjects = await getFeaturedProjects(3)

  return (
    <section>
      {/* render featured projects - same as before! */}
    </section>
  )
}
```

## Key Changes Summary

1. **Import change**:
   - From: `import { projects } from '@/data/projects-data'`
   - To: `import { getProjects, getFeaturedProjects } from '@/lib/payload/get-projects'`

2. **Component type**:
   - Components using Payload must be `async` Server Components
   - The data structure remains the same - no changes to your rendering logic!

3. **Data fetching**:
   - Instead of filtering the array, call the appropriate function
   - `projects.filter(p => p.featured)` → `await getFeaturedProjects()`
   - `projects.find(p => p.slug === slug)` → `await getProjectBySlug(slug)`

## Benefits of Using Payload

1. ✅ **Easier Content Management**: Edit projects through a nice UI instead of editing code
2. ✅ **Live Updates**: Content changes appear immediately (no code deployment needed)
3. ✅ **Image Optimization**: Automatic image resizing and optimization
4. ✅ **Type Safety**: Still fully type-safe with auto-generated types
5. ✅ **Same Interface**: Your `Project` type stays the same - minimal code changes

## Gradual Migration

You can migrate gradually:
1. Start by using the CMS to add/edit projects
2. Keep the static data as a backup
3. Switch pages one by one to use Payload
4. Once everything works, remove `src/data/projects-data.ts`

## Testing

After migration:
1. Test that all pages load correctly
2. Check that images display properly
3. Verify filtering (featured, etc.) works
4. Test the admin panel CRUD operations

---

**Questions?** Check `PAYLOAD_SETUP.md` for more details!
