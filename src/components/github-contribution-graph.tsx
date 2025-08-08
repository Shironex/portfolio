'use client'

import React from 'react'

interface ContributionDay {
  date: string
  level: number
  count: number
}

interface ContributionGraphProps {
  contributions?: ContributionDay[]
  totalContributions?: number
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({
  contributions = generateMockData(),
  totalContributions = 2188,
}) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const days = ['Mon', 'Wed', 'Fri']
  
  const getContributionColor = (level: number) => {
    const colors = {
      0: 'bg-secondary/30',
      1: 'bg-green-900/60',
      2: 'bg-green-700/70', 
      3: 'bg-green-600/80',
      4: 'bg-green-500',
    }
    return colors[level as keyof typeof colors] || colors[0]
  }

  const weeks = []
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7))
  }

  // Display months from Jan to Dec in order
  const displayMonths = months

  return (
    <div className="w-full rounded-lg bg-card p-3 sm:p-6">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">
          {totalContributions.toLocaleString()} contributions in the last year
        </h3>
      </div>
      
      <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="min-w-[600px] sm:min-w-[700px]">
          <div className="mb-2 flex justify-between px-8">
            {displayMonths.map((month) => (
              <span key={month} className="text-xs text-muted-foreground">
                {month}
              </span>
            ))}
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col justify-around">
              {days.map((day) => (
                <span key={day} className="text-xs text-muted-foreground">
                  {day}
                </span>
              ))}
            </div>
            
            <div className="flex flex-1 gap-[2px] sm:gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[2px] sm:gap-[3px]">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-sm ${getContributionColor(day.level)} transition-all hover:ring-2 hover:ring-primary/50`}
                      title={`${day.count} contributions on ${day.date}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-end gap-2">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-sm ${getContributionColor(level)}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function generateMockData(): ContributionDay[] {
  const data: ContributionDay[] = []
  const today = new Date()
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    let level = 0
    let count = 0
    
    const random = Math.random()
    if (random > 0.3) {
      level = Math.floor(Math.random() * 4) + 1
      count = Math.floor(Math.random() * 20) + 1
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      level,
      count,
    })
  }
  
  return data
}

export default ContributionGraph