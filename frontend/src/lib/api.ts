import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import { ImageEntry, WeekData, WeekNote } from '../types'

const baseURL = import.meta.env.VITE_API_URL ?? '/api'

export function useApi() {
  const { getToken } = useAuth()

  const authAxios = axios.create({ baseURL })

  authAxios.interceptors.request.use(async (config) => {
    const token = await getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  return {
    async getWeekData(weekKey: string): Promise<WeekData> {
      const { data } = await authAxios.get(`/weeks/${weekKey}`)
      return data
    },
    async uploadImage(file: File, date: string): Promise<ImageEntry> {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('date', date)
      const { data } = await authAxios.post('/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    async deleteImage(imageId: string): Promise<void> {
      await authAxios.delete(`/images/${imageId}`)
    },
    async deleteTerm(termId: string): Promise<void> {
      await authAxios.delete(`/terms/${termId}`)
    },
    async saveNote(weekKey: string, content: string): Promise<WeekNote> {
      const { data } = await authAxios.put(`/notes/${weekKey}`, { content })
      return data
    },
    async regenerateTerms(imageId: string): Promise<ImageEntry> {
      const { data } = await authAxios.post(`/images/${imageId}/regenerate`)
      return data
    },
  }
}
