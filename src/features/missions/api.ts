export type ApiEnvelope<T> = {
  success: boolean
  data: T | null
  error: { code: string; message: string } | null
}

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

export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, {
      ...init,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
  } catch {
    throw new ApiError('서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.', 0)
  }
  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null
  if (!response.ok || !body?.success || body.data === null) {
    throw new ApiError(body?.error?.message ?? '요청을 처리하지 못했어요.', response.status, body?.error?.code)
  }
  return body.data
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
