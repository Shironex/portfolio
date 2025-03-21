// // Matmajka images
// import matmajkaAboutLessons from '@/public/projects/matmajka/about-lessons.png'
// import matmajkaAboutMe from '@/public/projects/matmajka/about-me.png'
// import matmajkaContact from '@/public/projects/matmajka/contact.png'
// import matmajkaOpinions from '@/public/projects/matmajka/opinions.png'
// import matmajka from '@/public/projects/matmajka/thumbnail.png'
// // Toriime images
// import toriimeAboutProject from '@/public/projects/toriime/about-project.png'
// import toriimeFaq from '@/public/projects/toriime/faq.png'
// import toriimeFooter from '@/public/projects/toriime/footer.png'
// import toriimeImages2 from '@/public/projects/toriime/images-2.png'
// import toriimeImages3 from '@/public/projects/toriime/images-3.png'
// import toriimeImages from '@/public/projects/toriime/images.png'
// import toriime from '@/public/projects/toriime/thumbnail.png'
// // Write-Wiz images
// import writeWizEvents2 from '@/public/projects/write-wiz/events-2.png'
// import writeWIzEvents from '@/public/projects/write-wiz/events.png'
// import writeWizIntegrationsMessages from '@/public/projects/write-wiz/integrations-messages.png'
// import writeWizIntegrations from '@/public/projects/write-wiz/integrations.png'
// import writeWizProjectSettings from '@/public/projects/write-wiz/project-settings.png'
// import writeWizProjects from '@/public/projects/write-wiz/projects.png'
// import writeWizReports from '@/public/projects/write-wiz/reports.png'
// import writeWizSignIn from '@/public/projects/write-wiz/sign-in.png'
// import writeWizTeamPermissions from '@/public/projects/write-wiz/team-permissions.png'
// import writeWizTeam from '@/public/projects/write-wiz/team.png'
// import writeWiz from '@/public/projects/write-wiz/thumbnail.png'
// import writeWizWorkItems2 from '@/public/projects/write-wiz/work-items-2.png'
// import writeWizWorkItems from '@/public/projects/write-wiz/work-items.png'

// export const socials = [
//   {
//     href: 'https://github.com/Shironex',
//     label: 'GitHub',
//     ariaLabel: 'GitHub',
//     icon: IconBrandGithub,
//   },
//   {
//     href: 'https://discord.gg/ZpPwXMfU',
//     label: 'Discord',
//     ariaLabel: 'Discord',
//     icon: IconBrandDiscord,
//   },
// ]

// export const projects: Project[] = [
//   {
//     href: 'https://writewiz.shirone.xyz',
//     title: 'Write-Wiz',
//     description:
//       'Write-Wiz is an AI project management tool that helps you manage your projects and tasks. It includes Discord integration, AI chatbot, reports, and much more.',
//     thumbnail: writeWiz,
//     status: 'In Progress',
//     images: [
//       writeWiz,
//       writeWizProjects,
//       writeWizWorkItems,
//       writeWizWorkItems2,
//       writeWIzEvents,
//       writeWizEvents2,
//       writeWizReports,
//       writeWizSignIn,
//       writeWizTeam,
//       writeWizTeamPermissions,
//       writeWizIntegrations,
//       writeWizIntegrationsMessages,
//       writeWizProjectSettings,
//     ],
//     stack: [
//       { name: 'NextJS', category: 'frontend' },
//       { name: 'Typescript', category: 'frontend' },
//       { name: 'Shadcn', category: 'libraries' },
//       { name: 'Zod', category: 'libraries' },
//       { name: 'Redis', category: 'database' },
//       { name: 'Docker', category: 'devops' },
//       { name: 'PostgreSQL', category: 'database' },
//       { name: 'Terraform', category: 'devops' },
//       { name: 'Stripe', category: 'services' },
//       { name: 'OpenAI', category: 'services' },
//       { name: 'AWS', category: 'services' },
//       { name: 'BullMQ', category: 'libraries' },
//       { name: 'React-hook-form', category: 'libraries' },
//       { name: 'zsa-react', category: 'libraries' },
//       { name: 'Recharts', category: 'libraries' },
//       { name: 'React-email', category: 'libraries' },
//     ],
//     slug: 'write-wiz',
//     content: 'Write-Wiz is an AI project management tool with many features.',
//   },
//   {
//     href: 'https://matmajka.com',
//     title: 'Matmajka',
//     description:
//       'Matmajka connects parents and students with private tutor for math, physics, and chemistry.',
//     thumbnail: matmajka,
//     status: 'Completed',
//     images: [
//       matmajka,
//       matmajkaAboutMe,
//       matmajkaAboutLessons,
//       matmajkaOpinions,
//       matmajkaContact,
//     ],
//     stack: [
//       { name: 'NextJS', category: 'frontend' },
//       { name: 'Tailwind', category: 'frontend' },
//       { name: 'Docker', category: 'devops' },
//       { name: 'Resend', category: 'services' },
//     ],
//     slug: 'matmajka',
//     content:
//       'Matmajka is a platform for private lessons in math, physics, and chemistry.',
//   },
//   {
//     href: 'https://toriime.pl',
//     title: 'Toriime',
//     description:
//       'Toriime is a platform for finding and watching anime series/movies with Polish subtitles.',
//     thumbnail: toriime,
//     status: 'In Progress',
//     images: [
//       toriime,
//       toriimeAboutProject,
//       toriimeImages,
//       toriimeImages2,
//       toriimeImages3,
//       toriimeFaq,
//       toriimeFooter,
//     ],
//     stack: [
//       { name: 'NextJS', category: 'frontend' },
//       { name: 'NestJS', category: 'backend' },
//       { name: 'Shadcn', category: 'libraries' },
//       { name: 'Typescript', category: 'frontend' },
//       { name: 'Tailwind', category: 'frontend' },
//       { name: 'MongoDB', category: 'database' },
//       { name: 'Prisma', category: 'database' },
//       { name: 'Zod', category: 'libraries' },
//       { name: 'React-hook-form', category: 'libraries' },
//       { name: 'hello-pangea/dnd', category: 'libraries' },
//       { name: 'Axios', category: 'libraries' },
//       { name: 'AWS', category: 'services' },
//       { name: 'Docker', category: 'devops' },
//     ],
//     slug: 'toriime',
//     content:
//       'Toriime is a collaborative project that I work with a group of friends. We are trying to create a website where you can find and watch anime series/movies with subtitles in Polish language, create your own lists and watch them later. Have own account with statistics of watched series/movies and much more interesting features.',
//   },
// ]
