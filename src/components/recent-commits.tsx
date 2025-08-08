'use client'

import React from 'react'

import { Badge } from './ui/badge'

interface Commit {
  id: string
  message: string
  repository: string
  branch: string
  date: string
  additions: number
  deletions: number
  url?: string
}

interface RecentCommitsProps {
  commits?: Commit[]
}

const RecentCommits: React.FC<RecentCommitsProps> = ({
  commits = generateMockCommits(),
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="w-full rounded-lg bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Recent Commits
        </h3>
        <p className="text-sm text-muted-foreground">
          Latest commits across all repositories
        </p>
      </div>
      
      <div className="space-y-3">
        {commits.map((commit) => (
          <div
            key={commit.id}
            className="group relative rounded-md border border-border/50 bg-background/50 p-4 transition-all hover:border-primary/50 hover:bg-secondary/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-primary">
                    {commit.repository}
                  </span>
                  <span className="text-muted-foreground">/</span>
                  <Badge variant="outline" className="text-xs">
                    {commit.branch}
                  </Badge>
                </div>
                
                <p className="text-sm text-foreground">
                  {commit.message}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{formatDate(commit.date)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">+{commit.additions}</span>
                    <span className="text-red-600">-{commit.deletions}</span>
                  </div>
                </div>
              </div>
              
              {commit.url && (
                <a
                  href={commit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" x2="21" y1="14" y2="3" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-sm text-primary hover:underline">
          View all commits →
        </button>
      </div>
    </div>
  )
}

function generateMockCommits(): Commit[] {
  return [
    {
      id: '1',
      message: 'feat: add next.js saas template project data and images',
      repository: 'portfolio',
      branch: 'main',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      additions: 145,
      deletions: 23,
      url: '#',
    },
    {
      id: '2',
      message: 'fix: resolve TypeScript errors in contact form validation',
      repository: 'next-boilerplate',
      branch: 'develop',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      additions: 28,
      deletions: 15,
      url: '#',
    },
    {
      id: '3',
      message: 'chore: update dependencies and fix security vulnerabilities',
      repository: 'api-server',
      branch: 'main',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      additions: 89,
      deletions: 67,
      url: '#',
    },
    {
      id: '4',
      message: 'feat: implement Redis caching for improved performance',
      repository: 'e-commerce-platform',
      branch: 'feature/redis-cache',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      additions: 234,
      deletions: 45,
      url: '#',
    },
    {
      id: '5',
      message: 'docs: update README with installation instructions',
      repository: 'cli-tool',
      branch: 'main',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      additions: 45,
      deletions: 12,
      url: '#',
    },
  ]
}

export default RecentCommits