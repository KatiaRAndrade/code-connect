interface TagProps {
  label: string
  onRemove?: () => void
  variant?: 'default' | 'active'
}

export function Tag({ label, onRemove, variant = 'default' }: TagProps) {
  const base = 'inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-sm font-medium transition-colors'
  const styles = {
    default: 'bg-surface-input text-muted border border-surface-divider',
    active: 'bg-muted text-surface-bg',
  }

  return (
    <span className={`${base} ${styles[variant]}`}>
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover filtro ${label}`}
          className="leading-none hover:text-foreground transition-colors"
        >
          <span className="material-icons" style={{ fontSize: 14 }}>close</span>
        </button>
      )}
    </span>
  )
}
