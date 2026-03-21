import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface NotesAreaProps {
  content: string
  onSave: (content: string) => void
}

export const NotesArea: React.FC<NotesAreaProps> = ({ content, onSave }) => {
  const [value, setValue] = useState(content)
  const [height, setHeight] = useState(120)
  const [isDragging, setIsDragging] = useState(false)
  const [saved, setSaved] = useState(true)
  const dragStartY = useRef(0)
  const dragStartHeight = useRef(0)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setValue(content)
  }, [content])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    setSaved(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      onSave(e.target.value)
      setSaved(true)
    }, 1200)
  }

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartY.current = e.clientY
    dragStartHeight.current = height
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const delta = e.clientY - dragStartY.current
      const newHeight = Math.max(80, Math.min(400, dragStartHeight.current + delta))
      setHeight(newHeight)
    }
    const handleMouseUp = () => setIsDragging(false)
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <motion.div
      className={cn(
        'w-full rounded-xl border overflow-hidden',
        'bg-warm-cardLight dark:bg-warm-cardDark',
        'border-amber-200 dark:border-amber-900/50',
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-amber-100 dark:border-amber-900/30">
        <span className="font-hand text-lg text-amber-800 dark:text-amber-200">
          Weekly Notes
        </span>
        <span className={cn(
          'font-hand text-xs transition-all',
          saved ? 'text-amber-400 dark:text-amber-600' : 'text-amber-500 dark:text-amber-400'
        )}>
          {saved ? 'saved' : 'saving...'}
        </span>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder="Jot down weekly thoughts, inspirations, color palettes..."
        className={cn(
          'w-full resize-none p-4 bg-transparent outline-none',
          'font-hand text-base text-amber-900 dark:text-amber-100',
          'placeholder-amber-300 dark:placeholder-amber-700',
          'leading-relaxed'
        )}
        style={{ height }}
      />

      {/* Drag handle */}
      <div
        onMouseDown={handleDragStart}
        className={cn(
          'w-full h-3 flex items-center justify-center cursor-ns-resize',
          'border-t border-amber-100 dark:border-amber-900/30',
          isDragging && 'bg-amber-50 dark:bg-amber-900/20'
        )}
      >
        <div className="w-8 h-0.5 rounded-full bg-amber-300 dark:bg-amber-700 opacity-60" />
      </div>
    </motion.div>
  )
}
