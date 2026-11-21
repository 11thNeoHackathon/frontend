import { useEffect, useState, type FormEvent } from 'react'
import { ApiError, missionApi, type Chapter } from './api'
import arrowRight from './assets/arrow-right.svg'
import { HomeIndicator, StatusBar } from './StatusChrome'

export function MissionDetail({ chapterId, counterpart, onBack, onReadChapter }: { chapterId: number; counterpart: string; onBack: () => void; onReadChapter: () => void }) {
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    void missionApi.getChapter(chapterId).then((data) => {
      if (!active) return
      setChapter(data)
      setContent(data.myReflection?.content ?? '')
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof ApiError ? cause.message : '챕터를 불러오지 못했어요.')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [chapterId, reloadKey])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!content.trim() || saving) return
    setSaving(true)
    setError('')
    try {
      const updated = await missionApi.saveReflection(chapterId, content.trim())
      setChapter(updated)
      setContent(updated.myReflection?.content ?? content.trim())
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : '감상을 저장하지 못했어요.')
    } finally {
      setSaving(false)
    }
  }

  const navigation = <nav className="detail-nav"><button className="back-button" onClick={onBack} aria-label="홈으로"><img src={arrowRight} alt="" /></button><strong>챕터 미션</strong></nav>
  if (loading) return <main className="detail-page"><StatusBar />{navigation}<p className="detail-message">챕터를 불러오고 있어요…</p><HomeIndicator /></main>
  if (error && !chapter) return <main className="detail-page"><StatusBar />{navigation}<div className="detail-message error" role="alert"><p>{error}</p><button className="retry-button" type="button" onClick={() => setReloadKey((key) => key + 1)}>다시 시도</button></div><HomeIndicator /></main>
  if (!chapter) return null

  const waiting = chapter.nextAction === 'WAIT_FOR_OPEN'
  const opened = chapter.nextAction === 'READ'
  const canWrite = chapter.nextAction === 'DO_MISSION' || waiting
  const chapterTitle = chapter.name.replace(/\s*이야기$/, '')

  return <main className="detail-page">
    <StatusBar />
    {navigation}
    <div className="chapter-heading"><span>chapter. {String(chapter.id).padStart(2, '0')}</span><h1>{chapterTitle} 이야기</h1><p>{counterpart}와 내가 모두 미션을 하면 {chapterTitle} 챕터가 열려요.</p></div>
    {opened ? <section className="status-panel"><span className="status-icon">✓</span><h2>챕터가 열렸어요</h2><p>가족이 남긴 이야기를 함께 확인해 보세요.</p><button className="submit-button" type="button" onClick={onReadChapter}>챕터 열어보기</button></section>
      : waiting ? <section className="status-panel"><span className="status-icon">…</span><h2>감상을 보냈어요</h2><p>상대방이 감상을 남기면 챕터가 열려요.</p></section>
        : chapter.nextAction !== 'DO_MISSION' ? <section className="status-panel"><h2>{chapter.nextAction === 'WAIT' ? '상대의 이야기를 기다리고 있어요' : '아직 미션을 시작할 수 없어요'}</h2><p>챕터가 준비되면 이곳에서 미션을 확인할 수 있어요.</p></section>
        : <section className="mission-prompt"><span className="mission-label">{counterpart}의 미션</span><p>{chapter.receivedMission ?? '미션 내용을 불러오지 못했어요.'}</p></section>}
    {canWrite && <form className="reflection-form" onSubmit={submit}>
      <label htmlFor="reflection">{waiting ? '감상을 수정할 수 있어요' : '나의 후기를 적어주세요.'}</label>
      <textarea id="reflection" value={content} onChange={(event) => setContent(event.target.value)} maxLength={10000} placeholder="미션을 하며 느낀 점을 적어주세요." />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="submit-button" disabled={!content.trim() || saving}>{saving ? '저장 중…' : waiting ? '후기 수정하기' : '후기 남기기'}</button>
    </form>}
    {!canWrite && <button className="submit-button secondary" onClick={onBack}>홈으로 돌아가기</button>}
    <HomeIndicator />
  </main>
}
