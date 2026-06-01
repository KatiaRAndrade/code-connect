import { Checkbox } from '../../atoms/Checkbox'
import { TextLink } from '../../atoms/TextLink'

interface RememberMeRowProps {
  checked: boolean
  onChange: (checked: boolean) => void
  forgotHref?: string
}

export function RememberMeRow({ checked, onChange, forgotHref = '#' }: RememberMeRowProps) {
  return (
    <div className="flex items-center justify-between">
      <Checkbox id="remember" label="Lembrar-me" checked={checked} onChange={onChange} />
      <TextLink href={forgotHref} variant="muted">Esqueci a senha</TextLink>
    </div>
  )
}
