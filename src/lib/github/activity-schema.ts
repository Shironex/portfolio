import { z } from 'zod'

/**
 * Wire shape of `/api/github-activity`. Kept free of server imports so the
 * client heatmap can parse the response with the same schema the route emits.
 */
export const ContributionDaySchema = z.object({
  date: z.string(),
  count: z.number(),
  level: z.literal([0, 1, 2, 3, 4]),
})

export type ContributionDay = z.infer<typeof ContributionDaySchema>

export const GithubActivitySchema = z.object({
  total: z.number(),
  days: z.array(ContributionDaySchema),
})

export type GithubActivity = z.infer<typeof GithubActivitySchema>
