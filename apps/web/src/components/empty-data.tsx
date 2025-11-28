import { motion } from 'motion/react'

export function EmptyData({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center"
    >
      <div className="rounded-full bg-muted p-6">{icon}</div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground max-w-sm">{description}</p>
      </div>
    </motion.div>
  )
}
