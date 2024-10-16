import clsx from 'clsx'

type Props = {
  children: React.ReactNode
  className?: string
}

const Prose = ({ children, className }: Props) => {
  return (
    <div
      className={clsx(
        className,
        'prose prose-sm prose-blue max-w-none prose-p:text-secondary-foreground'
      )}
    >
      {children}
    </div>
  )
}

export default Prose
