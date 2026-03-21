import { useState, useEffect, useCallback } from 'react'
import { WeekData, ImageEntry, WeekNote } from '../types'
import { getWeekData, uploadImage, deleteImage, deleteTerm, saveNote } from '../lib/api'
import { getWeekKey } from '../lib/utils'

export function useWeekData(weekKey: string) {
  const [data, setData] = useState<WeekData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const weekData = await getWeekData(weekKey)
      setData(weekData)
    } catch (e) {
      setError('Failed to load week data')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [weekKey])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleUpload = useCallback(async (file: File, date: string) => {
    const newImage = await uploadImage(file, date)
    setData(prev => {
      if (!prev) return prev
      return { ...prev, images: [...prev.images, newImage] }
    })
    return newImage
  }, [])

  const handleDeleteImage = useCallback(async (imageId: string) => {
    await deleteImage(imageId)
    setData(prev => {
      if (!prev) return prev
      return { ...prev, images: prev.images.filter(img => img.id !== imageId) }
    })
  }, [])

  const handleDeleteTerm = useCallback(async (termId: string, imageId: string) => {
    await deleteTerm(termId)
    setData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        images: prev.images.map(img => {
          if (img.id !== imageId) return img
          return { ...img, terms: img.terms.filter(t => t.id !== termId) }
        }),
      }
    })
  }, [])

  const handleSaveNote = useCallback(async (content: string) => {
    const note = await saveNote(weekKey, content)
    setData(prev => {
      if (!prev) return prev
      return { ...prev, note }
    })
  }, [weekKey])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    uploadImage: handleUpload,
    deleteImage: handleDeleteImage,
    deleteTerm: handleDeleteTerm,
    saveNote: handleSaveNote,
  }
}
