import { Spinner } from '@/components/ui/spinner'

interface RouteLoadingProps {
  message?: string
  className?: string
}

export function RouteLoading({
  message = 'Loading...',
  className,
}: RouteLoadingProps) {
  return (
    <div
      className={`flex items-center justify-center gap-3 py-8 ${className || ''}`}
    >
      <Spinner className="size-5" />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  )
}
