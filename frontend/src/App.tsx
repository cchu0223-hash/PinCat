import React, { useState } from 'react'
import { Navigation } from './components/Navigation'
import { WeekView } from './components/WeekView'
import { useWeekData } from './hooks/useWeekData'
import { useDarkMode } from './hooks/useDarkMode'
import { getWeekKey } from './lib/utils'
import { Loader } from 'lucide-react'

function App() {
  const [weekKey, setWeekKey] = useState(() => getWeekKey(new Date()))
  const { dark, toggle } = useDarkMode()
  const {
    data,
    loading,
    error,
    uploadImage,
    deleteImage,
    deleteTerm,
    saveNote,
  } = useWeekData(weekKey)

  return (
    <div className="min-h-screen bg-warm-bg dark:bg-warm-bgDark">
      <Navigation
        weekKey={weekKey}
        onWeekChange={setWeekKey}
        dark={dark}
        onToggleDark={toggle}
      />

      <main className="max-w-7xl mx-auto">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader size={24} className="text-amber-500 animate-spin" />
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center py-20">
            <p className="font-hand text-lg text-red-400">{error}</p>
          </div>
        )}
        {data && !loading && (
          <WeekView
            weekKey={weekKey}
            images={data.images}
            noteContent={data.note?.content ?? ''}
            onUpload={uploadImage}
            onDeleteImage={deleteImage}
            onDeleteTerm={deleteTerm}
            onSaveNote={saveNote}
          />
        )}
      </main>
    </div>
  )
}

export default App
