import React from 'react'
import { ChevronLeft, ChevronRight, Sun, Moon, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { UserButton } from '@clerk/clerk-react'
import { cn } from '../lib/utils'
import { getWeekDates, formatWeekRange, getPrevWeek, getNextWeek } from '../lib/utils'

interface NavigationProps {
  weekKey: string
  onWeekChange: (weekKey: string) => void
  dark: boolean
  onToggleDark: () => void
}

export const Navigation: React.FC<NavigationProps> = ({
  weekKey,
  onWeekChange,
  dark,
  onToggleDark,
}) => {
  const { start, end } = getWeekDates(weekKey)
  const [, weekPart] = weekKey.split('-W')
  const weekNum = parseInt(weekPart)

  return (
    <div className="sticky top-0 z-40 bg-warm-bg/90 dark:bg-warm-bgDark/90 backdrop-blur-sm border-b border-amber-200 dark:border-amber-900/50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-amber-600 dark:text-amber-400" />
          <span className="font-hand-bold text-2xl text-amber-700 dark:text-amber-300">
            PinCat
          </span>
        </div>

        {/* Week navigation */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onWeekChange(getPrevWeek(weekKey))}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-800/60 text-amber-700 dark:text-amber-300 transition-colors"
          >
            <ChevronLeft size={16} />
          </motion.button>

          <div className="text-center min-w-[200px]">
            <div className="font-hand-bold text-xl text-amber-800 dark:text-amber-200">
              Week {weekNum}
            </div>
            <div className="font-hand text-sm text-amber-600 dark:text-amber-400">
              {formatWeekRange(start, end)}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onWeekChange(getNextWeek(weekKey))}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-800/60 text-amber-700 dark:text-amber-300 transition-colors"
          >
            <ChevronRight size={16} />
          </motion.button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleDark}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-800/60 text-amber-700 dark:text-amber-300 transition-colors"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
