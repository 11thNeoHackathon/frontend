import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import mascotOutline from '../assets/chapter-list/mascot-outline.svg'
import { PageHeader } from '../components/PageHeader'
import { StatusBar } from '../components/StatusBar'

export function ChapterCreateScreen() {
  const navigate = useNavigate()
  const { bookId = 'mom-and-me' } = useParams()
  const [title, setTitle] = useState('')
  const normalizedTitle = title.trim()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="app-shell">
      <main className="screen flow-screen chapter-create-screen">
        <StatusBar />
        <PageHeader title="챕터 만들기" onBack={() => navigate(`/books/${bookId}`)} />
        <section className="chapter-create-content">
          <header className="chapter-create-heading"><strong>chapter. 04</strong><h1>어떤 시절이 궁금한가요?</h1></header>
          <label className="chapter-title-field">
            <span>챕터 이름</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="챕터 이름을 입력해주세요." maxLength={30} />
          </label>
          {normalizedTitle && <div className="chapter-info-box"><strong>엄마와 내 화면에 모두 표시돼요.</strong><span>둘 다 이야기를 쓰고, 서로에게 미션을 보내요.</span></div>}
        </section>
        <div className="chapter-create-mascot" aria-hidden="true">
          <img src={mascotOutline} alt="" />
        </div>
        <div className="chapter-create-footer">
          <button className="primary-button" type="button" disabled={!normalizedTitle} onClick={() => navigate(`/books/${bookId}`)}>챕터 만들기</button>
        </div>
        <div className="home-indicator" aria-hidden="true" />
      </main>
    </div>
  )
}
