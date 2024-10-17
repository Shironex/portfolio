'use client'

import Image from 'next/image'

import { motion } from 'framer-motion'

import Paragraph from './paragraph'

const AboutMe = () => {
  const images = [
    'https://images.unsplash.com/photo-1570630992840-0bdd5732442e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1597914377769-db5167cb0221?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=format&fit=crop&w=800&q=60',
  ]

  return (
    <div>
      <div className="my-10 grid grid-cols-2 gap-10 md:grid-cols-4">
        {images.map((image, index) => (
          <motion.div
            key={image}
            initial={{
              opacity: 0,
              y: -50,
              rotate: 0,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: index % 2 === 0 ? 3 : -3,
            }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
          >
            <Image
              src={image}
              width={200}
              height={400}
              alt="about"
              className="block h-40 w-full rotate-3 transform rounded-md object-cover shadow-xl transition duration-200 hover:rotate-0 md:h-60"
            />
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl">
        <Paragraph
          className="mt-4"
          words="Hey there, I'm Kacper – a passionate developer, tech enthusiast,
          and a lover of creativity in all forms. Welcome to my digital corner!"
        />
        <Paragraph
          className="mt-4"
          words="From the moment I began my coding journey, I was captivated by the magic of building web applications that could genuinely make a difference. As a junior Next.js developer with two years of experience, I specialize in turning ideas into functional, seamless digital solutions. Whether it’s a tool to make life easier for me, my friends, or my family, I’m all about creating impactful software that merges performance with elegance."
        />
        <Paragraph
          className="mt-4"
          words="Beyond the code, I have a diverse range of interests. Music is a big part of my life – I enjoy exploring different genres and discovering new artists. Im also a fan of problem-solving in any form, whether its untangling complex coding issues or solving a Rubiks cube. And when Im not immersed in tech, youll probably find me dreaming about motorbikes; my goal is to own a CFMoto 450 SS in the near future."
        />
        <Paragraph
          className="mt-4"
          words="This website is my platform to share my experiences, projects, and
          everything I'm passionate about. If you're a fellow developer looking
          for insights, a tech enthusiast like me, or even someone who enjoys a
          good story or a cool project, you'll find something interesting here."
        />
        <Paragraph
          className="mt-4"
          words="Join me on this journey of coding, creativity, and discovery. Lets explore the exciting world of technology together and enjoy the ride – sometimes literally!"
        />
        <Paragraph
          className="mt-4"
          words="Thanks for stopping by, and I cant wait to share some bike adventures with you in the near future."
        />
      </div>
    </div>
  )
}

export default AboutMe
