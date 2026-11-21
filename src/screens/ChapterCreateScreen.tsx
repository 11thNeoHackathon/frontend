import chapterBg from '../assets/hifi/chapter-bg.svg'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { StatusBar } from '../components/StatusBar'

interface ChapterCreateScreenProps {
  chapterNumber: number
  onBack: (bookId: string) => void
  onCreate: (bookId: string, title: string) => void
  error?:string
  busy?:boolean
}

export function ChapterCreateScreen({ chapterNumber, onBack, onCreate, error, busy=false }: ChapterCreateScreenProps) {
  const { bookId = 'mom' } = useParams()
  const [title, setTitle] = useState('')
  const normalizedTitle = title.trim()

  return (
    <main className="screen flow-screen chapter-create-screen">
      <img className="chapter-create-graphic" src={chapterBg} alt="" aria-hidden="true" />
      <StatusBar />
      <PageHeader title="챕터 만들기" onBack={() => onBack(bookId)} />
      <section className="chapter-create-content">
        <header className="chapter-create-heading">
          <strong>chapter. {String(chapterNumber).padStart(2, '0')}</strong>
          <h1>어떤 시절이 궁금한가요?</h1>
        </header>

        <label className="chapter-title-field">
          <span>챕터 이름</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="챕터 이름을 입력해주세요."
            maxLength={30}
          />
        </label>

        {error && <p role="alert" className="flow-error">{error}</p>}
        {normalizedTitle && (
          <div className="chapter-info-box">
            <strong>두 사람의 화면에 모두 표시돼요.</strong>
            <span>둘 다 이야기를 쓰고, 서로에게 미션을 보내요.</span>
          </div>
        )}
      </section>
      <div className="chapter-create-footer">
        <button
          className="primary-button"
          type="button"
          disabled={!normalizedTitle||busy}
          onClick={() => onCreate(bookId, normalizedTitle)}
        >
          {busy ? '저장 중…' : '엽서 만들기'}
        </button>
      </div>
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}
