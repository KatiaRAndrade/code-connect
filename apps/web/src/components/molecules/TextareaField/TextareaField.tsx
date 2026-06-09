import { Label } from '../../atoms/Label'
import { Textarea } from '../../atoms/Textarea'
import type { ChangeEvent } from 'react'

interface TextareaFieldProps {
  id: string
  label: string
  name?: string
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  rows?: number
}

export function TextareaField({ id, label, name, value, onChange, placeholder, rows = 4 }: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} />
    </div>
  )
}
