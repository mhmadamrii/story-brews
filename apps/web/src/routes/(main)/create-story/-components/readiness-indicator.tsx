import { CheckCheck, CircleQuestionMark, ListChecks } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@story-brew/ui/components/ui/dialog'
import { Button } from '@story-brew/ui/components/ui/button'

interface ReadinessIndicatorProps {
  checks: {
    label: string
    isValid: boolean
    onClick?: () => void
  }[]
}

export function ReadinessIndicator({ checks }: ReadinessIndicatorProps) {
  const completedCount = checks.filter((c) => c.isValid).length
  const totalCount = checks.length
  const progress = (completedCount / totalCount) * 100

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-between gap-2">
          <div className="flex items-center gap-2">
            <ListChecks size={16} />
            <span className="text-muted-foreground">Readiness</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {completedCount}/{totalCount}
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Story Requirements</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          <ul className="space-y-2">
            {checks.map((check, index) => (
              <li
                key={index}
                onClick={check.onClick}
                className={cn(
                  'flex items-center justify-between text-sm p-2 rounded-md transition-colors border',
                  check.onClick && 'cursor-pointer hover:bg-accent',
                  check.isValid
                    ? 'bg-green-50/50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400'
                    : 'bg-muted/50 border-transparent text-muted-foreground'
                )}
              >
                <span>{check.label}</span>
                {check.isValid ? (
                  <CheckCheck className="h-4 w-4" />
                ) : (
                  <CircleQuestionMark className="h-4 w-4" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
