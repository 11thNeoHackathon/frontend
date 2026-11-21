import { useEffect, useState } from 'react'
import { ApiError, missionApi, type Chapter } from './api'

type MissionCard = { chapter: Chapter; counterpart: string }

export function HomeMissions({ onSelect }: { onSelect: (chapterId: number, counterpart: string) => void }) {
  const [cards, setCards] = useState<MissionCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const pendingCount = cards.filter(({ chapter }) => chapter.nextAction === 'DO_MISSION').length

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const books = await missionApi.getBooks()
        const groups = await Promise.all(books.map(async (book) => ({
          book,
          chapters: await missionApi.getChapters(book.bookId),
        })))
        if (!active) return
        setCards(groups.flatMap(({ book, chapters }) => chapters
          .filter((chapter) => chapter.nextAction === 'DO_MISSION' || chapter.nextAction === 'READ')
          .map((chapter) => ({ chapter, counterpart: book.counterpartLabel || '가족' }))))
      } catch (cause) {
        if (active) setError(cause instanceof ApiError ? cause.message : '미션을 불러오지 못했어요.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [reloadKey])

  return <div className="home-missions" aria-live="polite">
    <p className="home-mission-count">총 {loading ? '…' : pendingCount}건의 미션이 남아있습니다.</p>
    {loading ? <div className="mission-message">미션을 불러오고 있어요…</div>
      : error ? <div className="mission-message error" role="alert">{error}<button className="retry-button" type="button" onClick={() => setReloadKey((key) => key + 1)}>다시 시도</button></div>
        : cards.length === 0 ? <div className="mission-message">지금은 기다리는 미션이 없어요.</div>
          : <div className="mission-list">{cards.map(({ chapter, counterpart }) =>
            <button className="mission-card" type="button" key={chapter.id} onClick={() => onSelect(chapter.id, counterpart)}>
              <span className={`mission-chip${chapter.nextAction === 'READ' ? ' read' : counterpart.includes('아빠') ? ' pink' : ' green'}`}>{chapter.nextAction === 'READ' ? '열린 챕터' : `${counterpart} X 나`}</span>
              <span className="mission-copy"><small>chp{chapter.id}. {chapter.name}</small><strong>{chapter.nextAction === 'READ' ? '서로의 이야기와 후기 읽기' : chapter.receivedMission}</strong></span>
              <span className="chevron chevron-right" aria-hidden="true" />
            </button>)}</div>}
  </div>
}
