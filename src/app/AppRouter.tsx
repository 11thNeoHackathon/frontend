import { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import App from '../App'
import { ChapterCreateScreen } from '../screens/ChapterCreateScreen'
import { ChapterListScreen } from '../screens/ChapterListScreen'
import type { ChapterListItem } from '../types/chapter'

const initialChapters: ChapterListItem[] = [
  { id: 'chapter-1', title: '초등학생 시절', tags: [{ label: '열람 가능', tone: 'green' }] },
  { id: 'chapter-2', title: '중학교 시절', tags: [{ label: '엄마가 추가', tone: 'green' }, { label: '내 미션 하기', tone: 'pink' }] },
  { id: 'chapter-3', title: '중학교 시절', tags: [{ label: '아직 아무도 안 썼어요', tone: 'purple' }, { label: '내 미션 하기', tone: 'pink' }] },
]

function HomeRoute() {
  const navigate = useNavigate()
  return <App onOpenBook={(bookId) => navigate(`/books/${bookId}`)} />
}

export function AppRouter() {
  const navigate = useNavigate()
  const [chapters, setChapters] = useState<ChapterListItem[]>(initialChapters)

  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route
        path="/books/:bookId"
        element={(
          <ChapterListScreen
            chapters={chapters}
            onBack={() => navigate('/')}
            onAddChapter={(bookId) => navigate(`/books/${bookId}/chapters/new`)}
          />
        )}
      />
      <Route
        path="/books/:bookId/chapters/new"
        element={(
          <ChapterCreateScreen
            chapterNumber={chapters.length + 1}
            onBack={(bookId) => navigate(`/books/${bookId}`)}
            onCreate={(bookId, title) => {
              setChapters((current) => [
                ...current,
                { id: `chapter-${current.length + 1}`, title, tags: [{ label: '아직 아무도 안 썼어요', tone: 'purple' }] },
              ])
              navigate(`/books/${bookId}`)
            }}
          />
        )}
      />
    </Routes>
  )
}
