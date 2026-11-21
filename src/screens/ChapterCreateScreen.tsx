import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { StatusBar } from '../components/StatusBar'

interface ChapterCreateScreenProps {
  chapterNumber: number
  relationship: string
  onBack: () => void
  onCreate: (title: string) => Promise<void>
}

export function ChapterCreateScreen({ chapterNumber, relationship, onBack, onCreate }: ChapterCreateScreenProps) {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const normalizedTitle = title.trim()

  async function handleCreate() {
    if (!normalizedTitle || isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      await onCreate(normalizedTitle)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '챕터를 만들지 못했어요.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="screen flow-screen chapter-create-screen">
      <StatusBar />
      <PageHeader title="챕터 만들기" onBack={onBack} />
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

        {normalizedTitle && (
          <div className="chapter-info-box">
            <strong>{relationship}와 내 화면에 모두 표시돼요.</strong>
            <span>둘 다 이야기를 쓰고, 서로에게 미션을 보내요.</span>
          </div>
        )}
        {error && <p className="chapter-submit-error" role="alert">{error}</p>}
      </section>
      <div className="chapter-create-footer">
        <button
          className="primary-button"
          type="button"
          disabled={!normalizedTitle || isSubmitting}
          onClick={handleCreate}
        >
          {isSubmitting ? '만드는 중...' : '챕터 만들기'}
        </button>
      </div>
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}
