import { useCallback, useEffect, useState } from 'react'
import { getChapters } from '../api/chapters'
import type { ChapterListItem } from '../types/chapter'

interface ChapterRequestState {
  bookId: number | null
  chapters: ChapterListItem[]
  error: string | null
  isLoading: boolean
}

export function useChapters(bookId: number | null) {
  const [state, setState] = useState<ChapterRequestState>({
    bookId,
    chapters: [],
    error: bookId === null ? '올바르지 않은 책이에요.' : null,
    isLoading: bookId !== null,
  })
  const [requestKey, setRequestKey] = useState(0)

  const retry = useCallback(() => {
    setState((current) => ({ ...current, bookId, error: null, isLoading: bookId !== null }))
    setRequestKey((key) => key + 1)
  }, [bookId])

  useEffect(() => {
    if (bookId === null) return

    const controller = new AbortController()
    getChapters(bookId, controller.signal)
      .then((chapters) => setState({ bookId, chapters, error: null, isLoading: false }))
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            bookId,
            chapters: [],
            error: reason instanceof Error ? reason.message : '엽서를 불러오지 못했어요.',
            isLoading: false,
          })
        }
      })

    return () => controller.abort()
  }, [bookId, requestKey])

  if (state.bookId !== bookId) {
    return {
      chapters: [],
      isLoading: bookId !== null,
      error: bookId === null ? '올바르지 않은 책이에요.' : null,
      retry,
    }
  }

  return { ...state, retry }
}
