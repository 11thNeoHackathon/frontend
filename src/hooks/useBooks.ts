import { useCallback, useEffect, useState } from 'react'
import { getBooks, type BookListItem } from '../api/books'

export function useBooks() {
  const [books, setBooks] = useState<BookListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestKey, setRequestKey] = useState(0)
  const retry = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setRequestKey((key) => key + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    getBooks(controller.signal)
      .then(setBooks)
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : '책을 불러오지 못했어요.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [requestKey])

  return { books, isLoading, error, retry }
}
