import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { ImageEntry } from '../types'
import { ImageCard } from './ImageCard'
import { formatDateLabel } from '../lib/utils'
import { isToday } from 'date-fns'

interface DayCellProps {
  date: Date
  images: ImageEntry[]
  onUpload: (file: File, date: string) => Promise<unknown>
  onDeleteImage: (imageId: string) => void
  onDeleteTerm: (termId: string, imageId: string) => void
  isWeekend?: boolean
  dateKey: string
}

export const DayCell: React.FC<DayCellProps> = ({
  date, images, onUpload, onDeleteImage, onDeleteTerm, isWeekend = false, dateKey,
}) => {
  const today = isToday(date)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      await onUpload(file, dateKey)
    } finally {
      setUploading(false)
    }
  }, [dateKey, onUpload])

  // Document-level paste listener active when this column is hovered
  useEffect(() => {
    if (!isHovered) return
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) await handleFile(file)
          break
        }
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [isHovered, handleFile])

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as Element).closest('[data-image-card]')) return
    inputRef.current?.click()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <motion.div
      className={cn(
        'flex-1 flex flex-col min-h-[280px] px-4 py-3 cursor-pointer relative',
        dragging && 'bg-amber-50/60 dark:bg-amber-900/10'
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setDragging(false) }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false) }}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {/* Date header */}
      <div className="flex items-baseline gap-1.5 mb-4 select-none pointer-events-none">
        <span className={cn(
          'font-hand text-2xl leading-none',
          today
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-amber-800/65 dark:text-amber-300/65'
        )}>
          {isWeekend ? 'Sat — Sun' : formatDateLabel(date)}
        </span>
        {today && (
          <span className="font-hand text-xs text-amber-500 dark:text-amber-400 opacity-80">✦</span>
        )}
      </div>

      {/* Images — 2-column grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-7">
        {images.map(img => (
          <ImageCard
            key={img.id}
            image={img}
            onDelete={onDeleteImage}
            onDeleteTerm={onDeleteTerm}
          />
        ))}
      </div>

      {/* Bottom hint */}
      <div className="flex-1 flex items-end justify-center pb-2 select-none pointer-events-none">
        <span className={cn(
          'font-hand text-xs transition-opacity duration-300',
          isHovered ? 'opacity-35' : 'opacity-10',
          'text-amber-600 dark:text-amber-400'
        )}>
          paste · drop · click
        </span>
      </div>

      {/* Drag highlight overlay */}
      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 border-2 border-dashed border-amber-400 dark:border-amber-500 rounded-xl bg-amber-50/20 dark:bg-amber-900/15 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
