import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import App from '../App'
import { createChapter } from '../api/chapters'
import { useBooks } from '../hooks/useBooks'
import { useChapters } from '../hooks/useChapters'
import { ChapterCreateScreen } from '../screens/ChapterCreateScreen'
import { ChapterListScreen } from '../screens/ChapterListScreen'

function parseBookId(value: string | undefined) {
  if (!value) return null
  const bookId = Number(value)
  return Number.isSafeInteger(bookId) && bookId > 0 ? bookId : null
}

function HomeRoute() {
  const navigate = useNavigate()
  const { books, isLoading, error, retry } = useBooks()

  return (
    <App
      books={books}
      isBooksLoading={isLoading}
      booksError={error}
      onRetryBooks={retry}
      onOpenBook={(book) => navigate(`/books/${book.id}`, { state: { relationship: book.relationship } })}
    />
  )
}

function ChapterListRoute() {
  const { bookId: bookIdParam } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const bookId = parseBookId(bookIdParam)
  const { chapters, isLoading, error, retry } = useChapters(bookId)
  const relationship = typeof location.state?.relationship === 'string' ? location.state.relationship : '가족'

  return (
    <ChapterListScreen
      relationship={relationship}
      chapters={chapters}
      isLoading={isLoading}
      error={error}
      onRetry={retry}
      onBack={() => navigate('/')}
      onAddChapter={() => {
        if (bookId !== null) {
          navigate(`/books/${bookId}/chapters/new`, { state: { chapterNumber: chapters.length + 1, relationship } })
        }
      }}
    />
  )
}

function ChapterCreateRoute() {
  const { bookId: bookIdParam } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const bookId = parseBookId(bookIdParam)
  const chapterNumber = typeof location.state?.chapterNumber === 'number' ? location.state.chapterNumber : 1
  const relationship = typeof location.state?.relationship === 'string' ? location.state.relationship : '가족'

  return (
    <ChapterCreateScreen
      chapterNumber={chapterNumber}
      relationship={relationship}
      onBack={() => navigate(bookId === null ? '/' : `/books/${bookId}`, { state: { relationship } })}
      onCreate={async (name) => {
        if (bookId === null) throw new Error('올바르지 않은 책이에요.')
        await createChapter(bookId, name)
        navigate(`/books/${bookId}`, { state: { relationship } })
      }}
    />
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/books/:bookId" element={<ChapterListRoute />} />
      <Route path="/books/:bookId/chapters/new" element={<ChapterCreateRoute />} />
    </Routes>
  )
}
