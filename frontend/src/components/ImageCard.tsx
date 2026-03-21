import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { ImageEntry, DesignTerm } from '../types'
import { Decoration } from './Decoration'

interface ImageCardProps {
  image: ImageEntry
  onDelete: (imageId: string) => void
  onDeleteTerm: (termId: string, imageId: string) => void
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onDelete, onDeleteTerm }) => {
  const [hovered, setHovered] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const copyTerm = async (e: React.MouseEvent, term: DesignTerm) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(term.term)
    setCopiedId(term.id)
    setTimeout(() => setCopiedId(null), 1200)
  }

  const copyAll = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(image.terms.map(t => t.term).join(', '))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1500)
  }

  return (
    <div
      data-image-card="true"
      className="relative"
      style={{ zIndex: hovered ? 50 : 1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => e.stopPropagation()}
    >
      {/* First term badge above — only in resting state */}
      <AnimatePresence>
        {!hovered && image.terms.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-5 inset-x-0 flex justify-center pointer-events-none z-10"
          >
            <span className="font-hand text-[10px] px-1.5 py-px rounded-full whitespace-nowrap max-w-full truncate bg-amber-100/80 dark:bg-amber-900/60 border border-amber-300/50 dark:border-amber-700/40 text-amber-700 dark:text-amber-300">
              {image.terms[0].term}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Polaroid — scales up on hover */}
      <motion.div
        className={cn(
          'relative w-full',
          'bg-warm-cardLight dark:bg-warm-cardDark',
          'rounded-sm shadow-polaroid p-1.5 pb-5',
          'border border-amber-100 dark:border-amber-900/50',
        )}
        animate={{
          scale: hovered ? 1.65 : 1,
          rotate: hovered ? 0 : image.rotation,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        style={{ transformOrigin: 'top center' }}
      >
        <Decoration type={image.decoration} />

        {/* Image */}
        <div className="w-full aspect-square overflow-hidden bg-amber-50 dark:bg-amber-950/30">
          <img
            src={image.imageUrl}
            alt="Design inspiration"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Terms overlay — gradient + chips inside the polaroid on hover */}
        <AnimatePresence>
          {hovered && image.terms.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-x-1.5 top-1.5 bottom-5 flex flex-col justify-end overflow-hidden rounded-sm"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)',
              }}
            >
              {/* Term chips */}
              <div className="flex flex-wrap gap-1 px-1.5 pt-1 pb-0.5">
                {image.terms.map(term => (
                  <OverlayChip
                    key={term.id}
                    term={term}
                    copied={copiedId === term.id}
                    onCopy={(e) => copyTerm(e, term)}
                    onDelete={(e) => { e.stopPropagation(); onDeleteTerm(term.id, image.id) }}
                  />
                ))}
              </div>

              {/* Copy all */}
              <button
                onClick={copyAll}
                className="font-hand text-[9px] text-right text-white/55 hover:text-white/90 transition-colors px-2 pb-1 leading-none"
              >
                {copiedAll ? 'copied! ✓' : 'copy all'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Date label */}
        <div className="absolute bottom-1 inset-x-0 flex justify-center pointer-events-none">
          <span className="font-hand text-[9px] text-amber-600/45 dark:text-amber-400/35">
            {new Date(image.date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Delete button */}
        <AnimatePresence>
          {hovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={(e) => { e.stopPropagation(); onDelete(image.id) }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-400 dark:bg-red-500 flex items-center justify-center shadow-md hover:bg-red-500 z-20"
            >
              <Trash2 size={9} className="text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// Term chip inside the hover overlay
interface OverlayChipProps {
  term: DesignTerm
  copied: boolean
  onCopy: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
}

const OverlayChip: React.FC<OverlayChipProps> = ({ term, copied, onCopy, onDelete }) => {
  const [chipHovered, setChipHovered] = useState(false)

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setChipHovered(true)}
      onMouseLeave={() => setChipHovered(false)}
    >
      <button
        onClick={onCopy}
        className={cn(
          'font-hand text-[10px] px-1.5 py-px rounded-full border transition-all duration-100',
          copied
            ? 'bg-green-400/40 border-green-300/50 text-white'
            : 'bg-white/20 border-white/30 text-white hover:bg-white/35'
        )}
      >
        {copied ? `✓ ${term.term}` : term.term}
      </button>

      <AnimatePresence>
        {chipHovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={onDelete}
            className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-red-500 flex items-center justify-center z-20"
          >
            <X size={6} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
