import { apiRequest } from './client'

interface BookViewResponse {
  bookId: number
  title?: string
  status?: string
  mySlotNo?: number
  counterpartLabel?: string
  counterpartName?: string
}

export interface BookListItem {
  id: number
  title: string
  relationship: string
  counterpartName: string
}

export async function getBooks(signal?: AbortSignal): Promise<BookListItem[]> {
  const books = await apiRequest<BookViewResponse[]>('/api/v1/books', { signal })

  return books.map((book) => ({
    id: book.bookId,
    title: book.title ?? '',
    relationship: book.counterpartLabel ?? book.counterpartName ?? '가족',
    counterpartName: book.counterpartName ?? '',
  }))
}
