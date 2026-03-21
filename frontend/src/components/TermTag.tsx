import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check } from 'lucide-react'
import { cn } from '../lib/utils'
import { DesignTerm } from '../types'

interface TermTagProps {
  term: DesignTerm
  onDelete: (termId: string) => void
}

export const TermTag: React.FC<TermTagProps> = ({ term, onDelete }) => {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(term.term)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.div
      className="relative inline-flex items-center group"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      layout
    >
      <motion.button
        onClick={handleCopy}
        className={cn(
          'font-hand text-sm px-2 py-0.5 rounded-full border transition-all duration-200',
          'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700',
          'text-amber-800 dark:text-amber-200',
          'hover:bg-amber-200 dark:hover:bg-amber-800/60',
          'shadow-tag cursor-pointer select-none'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {copied ? (
          <span className="flex items-center gap-1">
            <Check size={10} />
            {term.term}
          </span>
        ) : (
          term.term
        )}
      </motion.button>

      <AnimatePresence>
        {hovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => onDelete(term.id)}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-400 dark:bg-red-500 flex items-center justify-center shadow-sm hover:bg-red-500 z-20"
          >
            <X size={8} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface TermTagListProps {
  terms: DesignTerm[]
  onDelete: (termId: string, imageId: string) => void
  imageId: string
}

export const TermTagList: React.FC<TermTagListProps> = ({ terms, onDelete, imageId }) => {
  const [expanded, setExpanded] = useState(false)

  if (terms.length === 0) return null

  return (
    <div
      className="relative"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1"
          >
            <TermTag
              term={terms[0]}
              onDelete={(id) => onDelete(id, imageId)}
            />
            {terms.length > 1 && (
              <span className="font-hand text-xs text-amber-600 dark:text-amber-400 font-semibold">
                +{terms.length - 1}
              </span>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex flex-wrap gap-1 bg-warm-paper dark:bg-warm-cardDark border border-amber-200 dark:border-amber-800 rounded-lg p-2 shadow-lg z-30 absolute top-0 left-0 min-w-[160px]"
            style={{ zIndex: 30 }}
          >
            {terms.map(term => (
              <TermTag
                key={term.id}
                term={term}
                onDelete={(id) => onDelete(id, imageId)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
