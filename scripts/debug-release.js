#!/usr/bin/env node

/**
 * Debug script for semantic-release issues
 * Run this script to check for common issues that can cause release failures
 */

const { execSync } = require('child_process')

console.log('🔍 Debugging semantic-release setup...\n')

// Check for existing tags that might conflict
console.log('📋 Checking existing tags:')
try {
  const tags = execSync('git tag -l', { encoding: 'utf8' })
  const tagList = tags.trim().split('\n').filter(Boolean)
  console.log(`Found ${tagList.length} tags:`)
  tagList.slice(-5).forEach((tag) => console.log(`  - ${tag}`))
  if (tagList.length > 5) {
    console.log(`  ... and ${tagList.length - 5} more`)
  }
} catch (error) {
  console.log('❌ Error reading tags:', error.message)
}

console.log('\n📋 Checking for duplicate release commits:')
try {
  const releaseCommits = execSync(
    'git log --oneline --grep="chore(release):" -n 10',
    { encoding: 'utf8' }
  )
  const commits = releaseCommits.trim().split('\n').filter(Boolean)

  if (commits.length === 0) {
    console.log('✅ No release commits found')
  } else {
    console.log(`Found ${commits.length} recent release commits:`)
    commits.forEach((commit) => console.log(`  - ${commit}`))
  }
} catch (error) {
  console.log('❌ Error reading release commits:', error.message)
}

console.log('\n📋 Checking current version in package.json:')
try {
  const packageJson = require('../package.json')
  console.log(`Current version: ${packageJson.version}`)
} catch (error) {
  console.log('❌ Error reading package.json:', error.message)
}

console.log('\n📋 Checking for commits since last release:')
try {
  const lastTag = execSync('git describe --tags --abbrev=0', {
    encoding: 'utf8',
  }).trim()
  console.log(`Last tag: ${lastTag}`)

  const commitsSinceLastTag = execSync(`git log ${lastTag}..HEAD --oneline`, {
    encoding: 'utf8',
  })
  const commits = commitsSinceLastTag.trim().split('\n').filter(Boolean)

  if (commits.length === 0) {
    console.log('ℹ️  No commits since last release')
  } else {
    console.log(`${commits.length} commits since last release:`)
    commits.slice(0, 5).forEach((commit) => console.log(`  - ${commit}`))
    if (commits.length > 5) {
      console.log(`  ... and ${commits.length - 5} more`)
    }
  }
} catch (error) {
  console.log('❌ Error checking commits since last release:', error.message)
}

console.log('\n🚀 Semantic-release debug complete!')
console.log('\nTips:')
console.log(
  '- If you see duplicate release commits, you may need to clean up your git history'
)
console.log(
  '- If tags exist that conflict with semantic-release, delete them with: git tag -d <tag-name>'
)
console.log('- Make sure your commits follow conventional commit format')
console.log('- Check that your branch is up to date with origin')
