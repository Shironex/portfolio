import Link from 'next/link'
import React from 'react'

import { motion } from 'framer-motion'

type Props = {
  text: string
  href: string
  props?: React.ComponentProps<typeof Link>
}

const Badge = ({ text, href, ...props }: Props) => {
  return (
    <Link
      href={{
        pathname: href,
      }}
      className="group relative inline-block cursor-pointer rounded-full bg-slate-900 p-px text-xs font-semibold leading-6 text-white no-underline shadow-2xl shadow-zinc-900"
      {...props}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
      </span>
      <div className="relative z-10 flex items-center space-x-2 rounded-full bg-transparent px-4 py-2 ring-1 ring-white/10">
        <span>{text}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M10.75 8.75L14.25 12L10.75 15.25"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          ></motion.path>
        </svg>
      </div>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
    </Link>
  )
}

export default Badge
