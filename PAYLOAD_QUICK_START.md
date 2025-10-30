# 🚀 Payload CMS - Quick Start

Your portfolio now has a powerful CMS! Here's how to get started in 5 minutes.

## ⚡ Quick Setup (5 minutes)

### 1. Start the Database
```bash
docker compose up -d postgres
```

### 2. Create .env File
```bash
cp .env.example .env
```

Then add to `.env`:
```env
DATABASE_URL=postgres://portfolio_user:portfolio_password@localhost:5432/portfolio_cms
PAYLOAD_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

### 3. Start Development Server
```bash
pnpm dev
```

### 4. Create Admin User
Visit **http://localhost:3000/admin** and create your account.

### 5. Import Existing Projects (Optional)
```bash
pnpm tsx scripts/migrate-projects-to-cms.ts
```

## ✨ That's It!

Your CMS is ready at: **http://localhost:3000/admin**

## 📖 What You Got

- ✅ **Admin Panel**: Beautiful UI to manage projects at `/admin`
- ✅ **REST API**: Auto-generated at `/api/projects`
- ✅ **GraphQL API**: Available at `/api/graphql`
- ✅ **Image Uploads**: Automatic optimization and resizing
- ✅ **Type Safety**: Auto-generated TypeScript types
- ✅ **Self-Hosted**: Complete control, no vendor lock-in

## 📝 Common Tasks

### Add a New Project
1. Go to http://localhost:3000/admin
2. Click "Projects" → "Create New"
3. Fill in the form
4. Upload images
5. Save!

### Edit Existing Project
1. Go to http://localhost:3000/admin
2. Click "Projects"
3. Click on a project
4. Make changes
5. Save!

### Use in Your Code

**Server Component:**
```typescript
import { getProjects } from '@/lib/payload/get-projects'

export default async function Page() {
  const projects = await getProjects()
  return <div>{/* render */}</div>
}
```

**API Route:**
```bash
GET http://localhost:3000/api/projects
GET http://localhost:3000/api/projects?where[featured][equals]=true
```

## 📚 Documentation

- **Full Setup Guide**: `PAYLOAD_SETUP.md`
- **Migration Examples**: `MIGRATION_EXAMPLE.md`
- **Official Docs**: https://payloadcms.com/docs

## 🆘 Help

### Database won't start?
```bash
docker compose restart postgres
docker compose ps  # check status
```

### Can't access admin panel?
- Make sure dev server is running (`pnpm dev`)
- Check `.env` has `DATABASE_URL` and `PAYLOAD_SECRET`
- Visit http://localhost:3000/admin (not /admin/)

### Types not working?
```bash
pnpm payload generate:types
```

## 🎉 Enjoy Your New CMS!

No more editing JSON files - manage your portfolio like a pro! 🚀
