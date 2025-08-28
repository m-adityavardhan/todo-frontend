'use client'

interface ColorPickerProps {
  selectedColor: string
  onColorChange: (color: string) => void
}

const colors = [
  { name: 'red', value: 'red' },
  { name: 'orange', value: 'orange' },
  { name: 'yellow', value: 'yellow' },
  { name: 'green', value: 'green' },
  { name: 'blue', value: 'blue' },
  { name: 'indigo', value: 'indigo' },
  { name: 'purple', value: 'purple' },
  { name: 'pink', value: 'pink' },
  { name: 'brown', value: 'brown' },
]

const colorClasses = {
  red: 'bg-task-red',
  orange: 'bg-task-orange',
  yellow: 'bg-task-yellow',
  green: 'bg-task-green',
  blue: 'bg-task-blue',
  indigo: 'bg-task-indigo',
  purple: 'bg-task-purple',
  pink: 'bg-task-pink',
  brown: 'bg-task-brown',
}

export default function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[color:var(--figma-blue)]">
        Color
      </label>
      <div className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onColorChange(color.value)}
            className={`color-option ${
              colorClasses[color.value as keyof typeof colorClasses]
            } ${
              selectedColor === color.value ? 'selected' : ''
            }`}
            title={color.name}
          />
        ))}
      </div>
    </div>
  )
}
