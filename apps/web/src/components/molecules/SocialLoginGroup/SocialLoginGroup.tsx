import { SocialIconButton } from '../../atoms/SocialIconButton'

interface SocialProvider {
  iconSrc: string
  alt: string
  label: string
  onClick?: () => void
}

interface SocialLoginGroupProps {
  providers: SocialProvider[]
}

export function SocialLoginGroup({ providers }: SocialLoginGroupProps) {
  return (
    <div className="flex justify-center gap-8">
      {providers.map((p) => (
        <SocialIconButton key={p.alt} iconSrc={p.iconSrc} alt={p.alt} label={p.label} onClick={p.onClick} />
      ))}
    </div>
  )
}
