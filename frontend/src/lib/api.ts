import axios from 'axios'
import { ImageEntry, WeekData, WeekNote } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})

export async function getWeekData(weekKey: string): Promise<WeekData> {
  const { data } = await api.get(`/weeks/${weekKey}`)
  return data
}

export async function uploadImage(file: File, date: string): Promise<ImageEntry> {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('date', date)
  const { data } = await api.post('/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteImage(imageId: string): Promise<void> {
  await api.delete(`/images/${imageId}`)
}

export async function deleteTerm(termId: string): Promise<void> {
  await api.delete(`/terms/${termId}`)
}

export async function saveNote(weekKey: string, content: string): Promise<WeekNote> {
  const { data } = await api.put(`/notes/${weekKey}`, { content })
  return data
}

export async function regenerateTerms(imageId: string): Promise<ImageEntry> {
  const { data } = await api.post(`/images/${imageId}/regenerate`)
  return data
}
