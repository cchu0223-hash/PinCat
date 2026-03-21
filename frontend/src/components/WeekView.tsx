import React, { useCallback } from 'react'
import { ImageEntry } from '../types'
import { DayCell } from './DayCell'
import { NotesArea } from './NotesArea'
import { getWeekDates, dateToISO } from '../lib/utils'

interface WeekViewProps {
  weekKey: string
  images: ImageEntry[]
  noteContent: string
  onUpload: (file: File, date: string) => Promise<unknown>
  onDeleteImage: (imageId: string) => void
  onDeleteTerm: (termId: string, imageId: string) => void
  onSaveNote: (content: string) => void
}

const VertDivider: React.FC = () => (
  <div className="flex-shrink-0 w-5 flex items-stretch justify-center py-4">
    <div
      className="w-px border-l-2 border-amber-300/40 dark:border-amber-700/30"
      style={{ borderLeftStyle: 'dashed' }}
    />
  </div>
)

const HorizDivider: React.FC = () => (
  <div className="mx-6 my-0.5 border-t-2 border-dashed border-amber-300/30 dark:border-amber-700/25" />
)

export const WeekView: React.FC<WeekViewProps> = ({
  weekKey, images, noteContent, onUpload, onDeleteImage, onDeleteTerm, onSaveNote,
}) => {
  const { days } = getWeekDates(weekKey)

  const getImagesForDate = useCallback((date: Date, isWeekend = false) => {
    if (isWeekend) {
      const satKey = dateToISO(days[5])
      const sunKey = dateToISO(days[6])
      return images.filter(img => img.date === satKey || img.date === sunKey)
    }
    return images.filter(img => img.date === dateToISO(date))
  }, [images, days])

  const weekendKey = dateToISO(days[5])

  return (
    <div className="flex flex-col p-4 gap-0">
      {/* Row 1: Mon Tue Wed */}
      <div className="flex items-stretch min-h-[280px]">
        {[days[0], days[1], days[2]].map((day, i) => (
          <React.Fragment key={dateToISO(day)}>
            <DayCell
              date={day}
              dateKey={dateToISO(day)}
              images={getImagesForDate(day)}
              onUpload={onUpload}
              onDeleteImage={onDeleteImage}
              onDeleteTerm={onDeleteTerm}
            />
            {i < 2 && <VertDivider />}
          </React.Fragment>
        ))}
      </div>

      <HorizDivider />

      {/* Row 2: Thu Fri Weekend */}
      <div className="flex items-stretch min-h-[280px]">
        {[days[3], days[4]].map((day, i) => (
          <React.Fragment key={dateToISO(day)}>
            <DayCell
              date={day}
              dateKey={dateToISO(day)}
              images={getImagesForDate(day)}
              onUpload={onUpload}
              onDeleteImage={onDeleteImage}
              onDeleteTerm={onDeleteTerm}
            />
            <VertDivider />
          </React.Fragment>
        ))}
        <DayCell
          date={days[5]}
          dateKey={weekendKey}
          images={getImagesForDate(days[5], true)}
          onUpload={async (file) => onUpload(file, weekendKey)}
          onDeleteImage={onDeleteImage}
          onDeleteTerm={onDeleteTerm}
          isWeekend
        />
      </div>

      <HorizDivider />

      {/* Row 3: Notes */}
      <div className="mt-2">
        <NotesArea content={noteContent} onSave={onSaveNote} />
      </div>
    </div>
  )
}
