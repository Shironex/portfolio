import Link from 'next/link'

import { Download, Mail } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'

import { ScrollAnimation } from '@/components/scroll-animation'

import { APP_ROUTES } from '@/lib/constants'

export const AboutContent = () => {
  return (
    <ScrollAnimation delay={0.2}>
      <div className="flex flex-col justify-center">
        <h2 className="mb-6 text-3xl font-bold">My Journey</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            From the moment I began my coding journey, I was captivated by the
            magic of building web applications that could genuinely make a
            difference.
          </p>
          <p>
            As a junior Next.js developer with two years of experience, I
            specialize in turning ideas into functional, seamless digital
            solutions. Whether it&apos;s a tool to make life easier for me, my
            friends, or my family, I&apos;m all about creating impactful
            software that merges performance with elegance.
          </p>
          <p>
            Beyond the code, I have a diverse range of interests. Music is a big
            part of my life – I enjoy exploring different genres and discovering
            new artists. I&apos;m also a fan of problem-solving in any form,
            whether it&apos;s untangling complex coding issues or solving a
            Rubik&apos;s cube.
          </p>
          <p>
            And when I&apos;m not immersed in tech, you&apos;ll probably find me
            dreaming about motorcycles. My goal is to own a CFMoto 450 SSR in
            the near future.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href={APP_ROUTES.toContact}>
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={{
                hover: { scale: 1.05 },
                tap: { scale: 0.98 },
              }}
            >
              <Button className="gap-2">
                Contact Me
                <Mail className="h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={{
              hover: { scale: 1.05 },
              tap: { scale: 0.98 },
            }}
          >
            <Button variant="outline" className="gap-2" disabled>
              Download Resume
              <Download className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </ScrollAnimation>
  )
}
