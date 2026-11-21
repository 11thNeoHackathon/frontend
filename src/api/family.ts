import { ApiError, type ApiEnvelope, type Chapter } from '../features/missions/api'

export type Book = {
  bookId: number
  title: string
  status: 'INVITE_PENDING' | 'ACTIVE'
  mySlotNo: number
  counterpartLabel: string
  counterpartName: string | null
}

export type BookInvitation = {
  book: Book
  invitation: { code: string; inviteUrl: string; expiresAt: string }
}

async function request<T>(path: string, init?: RequestInit, nullable = false): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, {
      ...init,
      credentials: 'include',
      headers: { ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers },
    })
  } catch {
    throw new ApiError('서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.', 0)
  }
  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null
  if (!response.ok || !body?.success || (!nullable && body.data === null)) {
    throw new ApiError(body?.error?.message ?? '요청을 처리하지 못했어요.', response.status, body?.error?.code)
  }
  return body.data as T
}

export const familyApi = {
  getBooks: () => request<Book[]>('/api/v1/books'),
  getBook: (bookId: number) => request<Book>(`/api/v1/books/${bookId}`),
  createBook: (counterpartLabel: string) => request<BookInvitation>('/api/v1/books', {
    method: 'POST', body: JSON.stringify({ counterpartLabel }),
  }),
  getChapters: (bookId: number) => request<Chapter[]>(`/api/v1/books/${bookId}/chapters`),
  createChapter: (bookId: number, name: string) => request<Chapter>(`/api/v1/books/${bookId}/chapters`, {
    method: 'POST', body: JSON.stringify({ name }),
  }),
  deleteChapter: (chapterId: number) => request<null>(`/api/v1/chapters/${chapterId}`, { method: 'DELETE' }, true),
}
