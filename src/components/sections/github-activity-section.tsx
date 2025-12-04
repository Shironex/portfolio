import React from 'react'

import ContributionGraph from '../github-contribution-graph'
import RecentCommits from '../recent-commits'

const GitHubActivitySection = () => {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            GitHub Activity
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Track my coding journey through contributions and recent commits across all projects.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <ContributionGraph />
          </div>
          
          <div className="lg:col-span-2">
            <RecentCommits />
          </div>
        </div>
      </div>
    </section>
  )
}

export default GitHubActivitySection