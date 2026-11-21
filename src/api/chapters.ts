import type { ChapterListItem } from '../types/chapter'
import { apiRequest } from './client'

interface ChapterViewResponse {
  id: number
  bookId: number
  name?: string
  nextAction?: string
  openedAt?: string
}

function toChapterListItem(chapter: ChapterViewResponse): ChapterListItem {
  return {
    id: chapter.id,
    bookId: chapter.bookId,
    title: chapter.name ?? '',
    nextAction: chapter.nextAction,
    openedAt: chapter.openedAt,
  }
}

export async function getChapters(bookId: number, signal?: AbortSignal): Promise<ChapterListItem[]> {
  const chapters = await apiRequest<ChapterViewResponse[]>(`/api/v1/books/${bookId}/chapters`, { signal })
  return chapters.map(toChapterListItem)
}

export async function createChapter(bookId: number, name: string): Promise<ChapterListItem> {
  const chapter = await apiRequest<ChapterViewResponse>(`/api/v1/books/${bookId}/chapters`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return toChapterListItem(chapter)
}
