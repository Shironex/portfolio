# Payload CMS Setup Guide

This guide will help you set up and configure Payload CMS for your portfolio.

## 🚀 Quick Start

### 1. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
PUPPETEER_SKIP_DOWNLOAD=true pnpm install
```

### 2. Start PostgreSQL Database

```bash
docker compose up -d postgres
```

This will start PostgreSQL on port 5432 with:
- Database: `portfolio_cms`
- User: `portfolio_user`
- Password: `portfolio_password`

### 3. Set Up Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Then add these required Payload variables to your `.env`:

```env
# Payload CMS
DATABASE_URL=postgres://portfolio_user:portfolio_password@localhost:5432/portfolio_cms
PAYLOAD_SECRET=your-super-secret-key-at-least-32-characters-long-change-this
```

**⚠️ IMPORTANT:** Change `PAYLOAD_SECRET` to a secure random string (at least 32 characters).

Generate a secure secret with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start Development Server

```bash
pnpm dev
```

### 5. Create Your First Admin User

Visit http://localhost:3000/admin and create your first admin account.

### 6. Migrate Existing Projects (Optional)

If you want to import your existing projects from `src/data/projects-data.ts`:

```bash
pnpm tsx scripts/migrate-projects-to-cms.ts
```

This will:
- Upload all project images to Payload
- Create all projects in the CMS
- Preserve all data (features, tech stack, challenges, etc.)

## 📚 Using the CMS

### Admin Panel

Access the admin panel at: http://localhost:3000/admin

Features:
- ✅ Create/Edit/Delete projects
- ✅ Upload and manage images
- ✅ Rich text editing
- ✅ Type-safe collections
- ✅ Auto-generated TypeScript types

### API Endpoints

Payload automatically creates REST and GraphQL APIs:

**REST API:**
- GET all projects: `http://localhost:3000/api/projects`
- GET single project: `http://localhost:3000/api/projects/:id`
- GET project by slug: `http://localhost:3000/api/projects?where[slug][equals]=project-slug`

**GraphQL API:**
- Endpoint: `http://localhost:3000/api/graphql`
- GraphQL Playground: `http://localhost:3000/api/graphql-playground`

### Fetching Data in Next.js

#### Server Components (Recommended)

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function ProjectsPage() {
  const payload = await getPayload({ config })

  const { docs: projects } = await payload.find({
    collection: 'projects',
    where: {
      featured: {
        equals: true,
      },
    },
    limit: 3,
  })

  return <div>{/* render projects */}</div>
}
```

#### Client Components (API Route)

Create an API route that fetches from Payload, then call it from your client component.

## 🔧 Configuration Files

- `payload.config.ts` - Main Payload configuration
- `src/payload/collections/projects.ts` - Projects collection schema
- `src/payload/collections/media.ts` - Media/uploads collection
- `src/payload/collections/users.ts` - Admin users collection

## 📦 Collection Structure

### Projects Collection

Matches your existing `Project` interface with these fields:
- Basic info (id, slug, title, summary)
- Description (array of paragraphs)
- Media (main image + gallery)
- Technologies array
- Features array
- Tech details (stack, architecture, challenges)
- Dates (startDate, completedDate, inProgress flag)
- Links (demoUrl, githubUrl)
- Featured flag

### Media Collection

Handles all image uploads with:
- Automatic image optimization
- Multiple sizes (thumbnail, card, full)
- Alt text and captions
- Upload to `/public/uploads`

## 🔐 Security

- Admin panel requires authentication
- All collections have access control
- Environment variables for secrets
- Projects are publicly readable (for your portfolio)

## 🎨 Customization

### Admin UI Styling

Edit `src/app/(payload)/custom.scss` to customize the admin panel appearance.

### Collection Fields

Edit collection files in `src/payload/collections/` to add/modify fields.

### Access Control

Modify the `access` property in collection configs to control who can read/write.

## 📝 Next Steps

1. ✅ Start the database
2. ✅ Set environment variables
3. ✅ Start the dev server
4. ✅ Create admin user
5. ✅ Migrate existing projects (optional)
6. ✅ Update frontend to fetch from Payload API
7. ✅ Deploy (works with Vercel, Railway, etc.)

## 🆘 Troubleshooting

### Database connection failed

Make sure PostgreSQL is running:
```bash
docker compose ps
```

Restart if needed:
```bash
docker compose restart postgres
```

### Type errors

Regenerate Payload types:
```bash
pnpm payload generate:types
```

### Admin panel won't load

Check your environment variables are set correctly in `.env`.

## 🚀 Deployment

When deploying to production:

1. Set up a production PostgreSQL database (Railway, Supabase, etc.)
2. Update `DATABASE_URL` in production environment
3. Generate a new secure `PAYLOAD_SECRET`
4. Run migrations if needed
5. Deploy to Vercel/Railway/etc.

Payload works great with:
- ✅ Vercel (serverless)
- ✅ Railway
- ✅ Render
- ✅ Any Node.js hosting

---

**Need help?** Check the [Payload CMS docs](https://payloadcms.com/docs)
