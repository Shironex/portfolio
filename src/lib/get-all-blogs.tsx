import glob from 'fast-glob'
import * as path from 'path'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function importBlog(blogFileNames: any) {
  const { meta, default: component } = await import(
    `../app/blog/${blogFileNames}`
  )
  return {
    slug: blogFileNames.replace(/(\/content)?\.mdx$/, ''),
    ...meta,
    component,
  }
}

export async function getAllBlogs() {
  const blogFileNames = await glob(['*.mdx', '*/content.mdx'], {
    cwd: path.join(process.cwd(), './src/app/blog'),
  })

  const blogs = await Promise.all(blogFileNames.map(importBlog))

  return blogs.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })
}
