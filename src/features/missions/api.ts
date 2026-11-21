import { request } from '../../shared/api'

export { ApiError } from '../../shared/api'

export type Reflection = {
  id: number
  participantId: number
  content: string
  completedAt: string
  updatedAt: string
}
export type Progress = {
  participantId: number
  storyCompleted: boolean
  reflectionCompleted: boolean
}
export type Chapter = {
  id: number
  bookId: number
  name: string
  nextAction: 'WRITE_STORY' | 'WAIT' | 'DO_MISSION' | 'WAIT_FOR_OPEN' | 'READ'
  progress: Progress[]
  receivedMission: string | null
  myReflection: Reflection | null
  counterpartReflection: Reflection | null
}
export type Book = {
  bookId: number
  title: string
  counterpartLabel?: string | null
  counterpartName?: string | null
}

export const missionApi = {
  getBooks: () => request<Book[]>('/api/v1/books'),
  getChapters: (bookId: number) => request<Chapter[]>(`/api/v1/books/${bookId}/chapters`),
  getChapter: (chapterId: number) => request<Chapter>(`/api/v1/chapters/${chapterId}`),
  saveReflection: (chapterId: number, content: string) =>
    request<Chapter>(`/api/v1/chapters/${chapterId}/reflection`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),
}
