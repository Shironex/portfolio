import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'featured', 'inProgress', 'completedDate'],
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Auto-generate ID from slug if not provided
            return value || data?.slug || `project-${Date.now()}`
          },
        ],
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier for the project',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short summary for project cards',
      },
    },
    {
      name: 'description',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'paragraph',
          type: 'textarea',
          required: true,
        },
      ],
      admin: {
        description: 'Full description split into paragraphs',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main project thumbnail image',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        description: 'Project screenshots gallery',
      },
    },
    {
      name: 'technologies',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'tech',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Technologies used (e.g., Next.js, TypeScript)',
      },
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'feature',
          type: 'textarea',
          required: true,
        },
      ],
      admin: {
        description: 'Key features of the project',
      },
    },
    {
      name: 'techDetails',
      type: 'group',
      fields: [
        {
          name: 'stack',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'tech',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'architecture',
          type: 'textarea',
        },
        {
          name: 'challenges',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'challenge',
              type: 'textarea',
              required: true,
            },
            {
              name: 'solution',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
      admin: {
        description: 'Technical implementation details',
      },
    },
    {
      name: 'completedDate',
      type: 'date',
      admin: {
        description: 'Project completion date',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        description: 'Project start date',
      },
    },
    {
      name: 'inProgress',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark if project is still in development',
      },
    },
    {
      name: 'duration',
      type: 'text',
      required: true,
      admin: {
        description: 'Human-readable duration (e.g., "3 months")',
      },
    },
    {
      name: 'outcome',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Project outcome and results',
      },
    },
    {
      name: 'demoUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'Live demo URL',
      },
    },
    {
      name: 'githubUrl',
      type: 'text',
      admin: {
        description: 'GitHub repository URL (optional)',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show in featured projects section',
      },
    },
  ],
}
