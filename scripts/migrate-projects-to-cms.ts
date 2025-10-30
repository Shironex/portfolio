/**
 * Migration script to import existing projects into Payload CMS
 *
 * Usage:
 * 1. Make sure PostgreSQL is running: docker compose up -d postgres
 * 2. Make sure you have a .env file with DATABASE_URL and PAYLOAD_SECRET
 * 3. Run: tsx scripts/migrate-projects-to-cms.ts
 */

import { getPayload } from 'payload'
import config from '../payload.config'
import { projects } from '../src/data/projects-data'
import path from 'path'
import fs from 'fs'

async function migrate() {
  console.log('🚀 Starting migration of projects to Payload CMS...\n')

  try {
    // Initialize Payload
    const payload = await getPayload({ config })

    console.log('✅ Connected to Payload CMS\n')

    // First, create media uploads for images
    const mediaMap = new Map<string, string>() // Map old image paths to new media IDs

    console.log('📸 Uploading project images...\n')

    for (const project of projects) {
      // Upload main image
      if (!mediaMap.has(project.image)) {
        const imagePath = path.join(process.cwd(), 'public', project.image)

        if (fs.existsSync(imagePath)) {
          try {
            const media = await payload.create({
              collection: 'media',
              data: {
                alt: `${project.title} thumbnail`,
                caption: `Main image for ${project.title}`,
              },
              filePath: imagePath,
            })

            mediaMap.set(project.image, media.id)
            console.log(`  ✓ Uploaded: ${project.image}`)
          } catch (error) {
            console.error(`  ✗ Failed to upload ${project.image}:`, error)
          }
        } else {
          console.warn(`  ⚠ File not found: ${imagePath}`)
        }
      }

      // Upload gallery images
      for (const galleryItem of project.gallery) {
        if (!mediaMap.has(galleryItem.src)) {
          const imagePath = path.join(process.cwd(), 'public', galleryItem.src)

          if (fs.existsSync(imagePath)) {
            try {
              const media = await payload.create({
                collection: 'media',
                data: {
                  alt: galleryItem.alt,
                  caption: galleryItem.caption,
                },
                filePath: imagePath,
              })

              mediaMap.set(galleryItem.src, media.id)
              console.log(`  ✓ Uploaded: ${galleryItem.src}`)
            } catch (error) {
              console.error(`  ✗ Failed to upload ${galleryItem.src}:`, error)
            }
          } else {
            console.warn(`  ⚠ File not found: ${imagePath}`)
          }
        }
      }
    }

    console.log(`\n📦 Creating ${projects.length} projects...\n`)

    // Now create projects
    for (const project of projects) {
      try {
        const mainImageId = mediaMap.get(project.image)
        const galleryIds = project.gallery
          .map((item) => mediaMap.get(item.src))
          .filter(Boolean)

        const projectData = {
          id: project.id,
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          description: project.description.map((paragraph) => ({ paragraph })),
          image: mainImageId,
          gallery: galleryIds.map((imageId) => ({ image: imageId })),
          technologies: project.technologies.map((tech) => ({ tech })),
          features: project.features.map((feature) => ({ feature })),
          techDetails: {
            stack: project.techDetails.stack.map((tech) => ({ tech })),
            architecture: project.techDetails.architecture,
            challenges: project.techDetails.challenges.map((c) => ({
              challenge: c.challenge,
              solution: c.solution,
            })),
          },
          completedDate: project.completedDate,
          startDate: project.startDate,
          inProgress: project.inProgress || false,
          duration: project.duration,
          outcome: project.outcome,
          demoUrl: project.demoUrl,
          githubUrl: project.githubUrl,
          featured: project.featured,
        }

        await payload.create({
          collection: 'projects',
          data: projectData,
        })

        console.log(`  ✓ Created project: ${project.title}`)
      } catch (error) {
        console.error(`  ✗ Failed to create project ${project.title}:`, error)
      }
    }

    console.log('\n✨ Migration completed successfully!')
    console.log(`\n📊 Summary:`)
    console.log(`   - ${mediaMap.size} images uploaded`)
    console.log(`   - ${projects.length} projects created`)
    console.log('\n🎉 You can now access the admin panel at http://localhost:3000/admin')

    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()
