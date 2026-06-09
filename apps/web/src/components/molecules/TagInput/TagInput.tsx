import { useState, type KeyboardEvent } from 'react'
import { Input } from '../../atoms/Input'
import { Label } from '../../atoms/Label'
import { Tag } from '../../atoms/Tag/Tag'

interface TagInputProps {
  id: string
  label: string
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ id, label, tags, onChange, placeholder }: TagInputProps) {
  const [value, setValue] = useState('')

  function addTag() {
    const trimmed = value.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setValue('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && value === '' && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag))
  }

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-describedby={`${id}-hint`}
      />
      <p id={`${id}-hint`} className="text-xs text-muted">
        Pressione Enter ou vírgula para adicionar uma tag.
      </p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((tag) => (
            <Tag key={tag} label={tag} onRemove={() => removeTag(tag)} />
          ))}
        </div>
      )}
    </div>
  )
}
