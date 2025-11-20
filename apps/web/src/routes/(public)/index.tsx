import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'motion/react'

export const Route = createFileRoute('/(public)/')({
  component: HomeComponent,
})

function HomeComponent() {
  const navigate = useNavigate()

  const features = [
    {
      title: 'AI-Powered Creativity',
      description:
        "Overcome writer's block with smart suggestions and plot generation tailored to your style.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      ),
    },
    {
      title: 'Character Depths',
      description: 'Build complex characters with detailed profiles, arcs, and relationship maps.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      title: 'World Building',
      description: 'Design immersive worlds with integrated lore management and interactive maps.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
  ]

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden text-white">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="w-full px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter">Story Brew</div>
          <div className="space-x-4">
            <button
              onClick={() => navigate({ to: '/login' })}
              className="text-sm font-medium hover:text-indigo-300 transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => navigate({ to: '/login' })}
              className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-colors backdrop-blur-sm"
            >
              Sign up
            </button>
          </div>
        </nav>

        <main className="flex-grow flex flex-col items-center justify-center px-4 pt-20 pb-32 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-4">
              ✨ The Future of Storytelling is Here
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60">
              Brew Your <br /> Masterpiece.
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              The all-in-one platform for writers to craft, organize, and visualize their stories
              with the power of AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate({ to: '/home' })}
                className="px-8 py-4 bg-white cursor-pointer text-black text-lg font-semibold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all"
              >
                Start Writing Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border border-white/20 text-white text-lg font-semibold rounded-full hover:bg-white/5 transition-colors"
              >
                View Demo
              </motion.button>
            </div>
          </motion.div>
        </main>

        <section className="w-full px-4 py-24 border-t border-white/5 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to write</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Powerful tools designed to help you focus on what matters most: your story.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-white/10 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-indigo-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <footer className="w-full py-8 text-center text-gray-600 text-sm border-t border-white/5">
          <p>© {new Date().getFullYear()} Story Brew. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
