import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'

export const Route = createFileRoute('/(public)/motion/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen border border-red-500 flex items-center justify-center flex-col">
      <h1>Hello world from motion.dev</h1>
      <motion.div
        initial={{ scale: 1 }}
        animate={{
          rotate: [0, 0, Math.PI / 2, Math.PI],
        }}
        className="h-[200px] w-[200px] rounded-xl bg-blue-500 shadow-lg cursor-pointer"
      ></motion.div>
      <hr />
      <div className="h-[500px] border border-blue-500">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1],
            transition: {
              duration: 1,
            },
          }}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae eius deserunt nihil! Laborum
          dignissimos iusto rerum, dolorum consectetur natus sint.
        </motion.p>
      </div>
    </div>
  )
}
