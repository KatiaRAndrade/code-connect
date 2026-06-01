import { Input } from '../../atoms/Input'
import { Label } from '../../atoms/Label'
import type { ChangeEvent } from 'react'

interface FormFieldProps {
  id: string
  label: string
  type?: string
  name?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

export function FormField({ id, label, type = 'text', name, value, onChange, placeholder }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  )
}
