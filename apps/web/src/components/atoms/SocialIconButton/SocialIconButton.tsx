interface SocialIconButtonProps {
  iconSrc: string
  alt: string
  label: string
  onClick?: () => void
}

export function SocialIconButton({ iconSrc, alt, label, onClick }: SocialIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 rounded-md p-2 transition-colors hover:bg-surface-input"
    >
      <img src={iconSrc} alt={alt} className="h-7 w-7" />
      <span className="text-xs text-muted">{label}</span>
    </button>
  )
}
