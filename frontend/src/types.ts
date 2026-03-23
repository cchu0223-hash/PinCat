export interface DesignTerm {
  id: string
  term: string
  imageId: string
}

export interface ImageEntry {
  id: string
  date: string // ISO date string YYYY-MM-DD
  imageUrl: string
  thumbnailUrl?: string
  terms: DesignTerm[]
  rotation: number // random rotation -8 to 8 degrees
  decoration: 'tape-yellow' | 'tape-blue' | 'tape-washi' | 'pin-red' | 'pin-yellow' | 'clip'
  note?: string
  createdAt: string
  analysing?: boolean
}

export interface WeekNote {
  id: string
  weekKey: string // format: "2024-W01"
  content: string
  updatedAt: string
}

export interface WeekData {
  weekKey: string
  weekNumber: number
  startDate: string
  endDate: string
  images: ImageEntry[]
  note: WeekNote | null
}
