import React, { useState } from 'react'
import { SignedIn, SignedOut, SignIn, useAuth } from '@clerk/clerk-react'
import { Navigation } from './components/Navigation'
import { WeekView } from './components/WeekView'
import { useWeekData } from './hooks/useWeekData'
import { useDarkMode } from './hooks/useDarkMode'
import { getWeekKey } from './lib/utils'
import { Loader } from 'lucide-react'

function Main() {
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

function App() {
  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-warm-bg dark:bg-warm-bgDark">
          <SignIn
            appearance={{
              variables: {
                colorPrimary: '#d97706',
                colorBackground: '#fffbf0',
                colorText: '#78350f',
                colorInputBackground: '#fef3c7',
                colorInputText: '#78350f',
                borderRadius: '0.75rem',
                fontFamily: 'inherit',
              },
              elements: {
                card: 'shadow-xl border border-amber-200',
                headerTitle: 'text-amber-800 font-hand-bold text-2xl',
                headerSubtitle: 'text-amber-600',
                socialButtonsBlockButton: 'border-amber-300 hover:bg-amber-50',
                formButtonPrimary: 'bg-amber-500 hover:bg-amber-600',
                footerActionLink: 'text-amber-600 hover:text-amber-700',
              },
            }}
          />
        </div>
      </SignedOut>
      <SignedIn>
        <Main />
      </SignedIn>
    </>
  )
}

export default App
