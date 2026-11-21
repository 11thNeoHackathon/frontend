import { Route, Routes } from 'react-router-dom'
import App from '../App'
import { ChapterListScreen } from '../screens/ChapterListScreen'
import { ChapterCreateScreen } from '../screens/ChapterCreateScreen'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/books/:bookId" element={<ChapterListScreen />} />
      <Route path="/books/:bookId/chapters/new" element={<ChapterCreateScreen />} />
    </Routes>
  )
}
