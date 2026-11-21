import { useState } from 'react'
import './demo-video-flow.css'
import momArt from '../../assets/hifi/mom.svg'
import dadArt from '../../assets/hifi/dad.svg'
import grandmaArt from '../../assets/hifi/grandma.svg'
import grandpaArt from '../../assets/hifi/grandpa.svg'
import postcardArt from '../../assets/hifi/postcard-face.svg'
import copyIcon from '../../assets/hifi/copy.svg'
import ribbonGreen from '../../assets/hifi/ribbon-green.svg'
import ribbonPink from '../../assets/hifi/ribbon-pink.svg'

type Step = 'home-start' | 'list' | 'chapter' | 'story' | 'list-created' | 'reflection' | 'list-ready' | 'postcards' | 'home-done' | 'relationship' | 'invite' | 'arrival'
const family = [
  { name: '엄마', art: momArt }, { name: '아빠', art: dadArt },
  { name: '할머니', art: grandmaArt }, { name: '할아버지', art: grandpaArt },
]

export function DemoVideoFlow() {
  const [step, updateStep] = useState<Step>(() => window.location.search.includes('invite=mom') ? 'arrival' : 'home-start')
  const setStep = (next: Step) => { updateStep(next); window.scrollTo({ top: 0, behavior: 'instant' }) }
  const [title, setTitle] = useState('')
  const [story, setStory] = useState('')
  const [mission, setMission] = useState('')
  const [reflection, setReflection] = useState('')
  const [relationship, setRelationship] = useState('')
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState(false)
  const inviteUrl = `${window.location.origin}/demo?invite=mom`

  const back = () => {
    const previous: Record<Step, Step> = { 'home-start': 'home-start', list: 'home-start', chapter: 'list', story: 'chapter', 'list-created': 'story', reflection: 'list-created', 'list-ready': 'reflection', postcards: 'list-ready', 'home-done': 'postcards', relationship: 'home-done', invite: 'relationship', arrival: 'invite' }
    setStep(previous[step])
  }
  const header = (label: string, canBack = true) => <header className="demo-nav"><button aria-label="뒤로" disabled={!canBack} onClick={back}>‹</button><span>{label}</span><span className="nav-spacer" /></header>
  const footer = (label: string, onClick: () => void, disabled = false) => <button className="demo-primary" disabled={disabled} onClick={onClick}>{label}</button>

  return <main className={`demo-shell demo-step-${step}`} lang="ko">
    {step === 'home-start' && <>
      <section className="demo-home-hero"><div className="demo-brand">RE Post</div><h1>오늘은 어떤 시절로 떠나볼까요?</h1><p>총 0건의 미션이 남아있습니다.</p><div className="empty-mission">지금은 기다리는 미션이 없어요.</div></section>
      <section className="demo-bookshelf"><h2>내 엽서함</h2><div className="books-grid-demo"><button className="book-demo" onClick={() => setStep('list')}><div className="paper-stack-demo" style={{ background: '#caf984' }} /><strong>엄마 <i>↝</i> 나</strong></button><button className="add-demo" onClick={() => setStep('relationship')}>＋</button></div></section>
    </>}
    {step === 'list' && <>
      <section className="demo-list-hero"><div className="demo-brand">RE Post</div><h1>엄마 <span>↝</span> 나</h1><p>현재 열람 가능한 엽서가 <b>1</b>개 있어요!</p><div className="hero-postcard"><img src={postcardArt} alt=""/><small>엽서를 눌러보세요!</small></div></section>
      <section className="demo-list-body"><div className="section-heading"><h2>지금까지 나눈 엽서 <b>1</b>개</h2><button aria-label="챕터 추가" onClick={() => setStep('chapter')}>＋</button></div>
        <div className="chapter-row"><span>01</span><div><strong>초등학생 시절</strong><small>열람 가능</small></div><button aria-label="초등학생 시절 열기" onClick={() => setStep('postcards')}>›</button></div>
      </section>
    </>}

    {step === 'chapter' && <>
      {header('챕터 만들기')}
      <section className="demo-form"><p className="chapter-kicker">chapter. 04</p><h1>어떤 시절이 궁금한가요?</h1><label htmlFor="demo-title">챕터 이름</label><input id="demo-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="" /><aside><strong>엄마와 내 화면에 모두 표시돼요.</strong><span>둘 다 이야기를 쓰고, 서로에게 미션을 보내요.</span></aside><div className="chapter-watermark"><img src={postcardArt} alt="" /></div></section>
      {footer('챕터 만들기', () => setStep('story'), !title.trim())}
    </>}

    {step === 'story' && <>
      {header('추억과 미션 건네기')}
      <section className="demo-form"><p className="chapter-kicker">chapter. 04</p><h1>{title || '중학교 시절 이야기'}</h1><label htmlFor="story-title">제목</label><input id="story-title" value={story.split('\n')[0] || ''} onChange={e => setStory(`${e.target.value}${story.includes('\n') ? story.slice(story.indexOf('\n')) : ''}`)} placeholder="" /><label htmlFor="story-body">나의 추억을 적어주세요</label><textarea wrap="soft" spellCheck={false} id="story-body" value={story.includes('\n') ? story.slice(story.indexOf('\n') + 1) : ''} onChange={e => setStory(`${story.split('\n')[0] || ''}\n${e.target.value}`)} placeholder="" /><label htmlFor="mission-body">상대에게 보낼 미션</label><textarea wrap="soft" spellCheck={false} className="mission-input" id="mission-body" value={mission} onChange={e => setMission(e.target.value)} placeholder="" /></section>
      {footer('완료', () => setStep('list-created'))}
    </>}

    {(step === 'list-created' || step === 'list-ready') && <>
      <section className="demo-list-hero"><div className="demo-brand">RE Post</div><h1>엄마 <span>↝</span> 나</h1><p>현재 열람 가능한 엽서가 <b>3</b>개 있어요!</p><div className="hero-postcard"><img src={postcardArt} alt=""/><small>엽서를 눌러보세요!</small></div></section>
      <section className="demo-list-body"><div className="section-heading"><h2>지금까지 나눈 엽서 <b>2</b>개</h2><button aria-label="챕터 추가" onClick={() => setStep('chapter')}>＋</button></div>
        <div className="chapter-row"><span>01</span><div><strong>초등학생 시절</strong><small>열람 가능</small></div></div>
        <div className="chapter-row"><span>02</span><div><strong>{title || '중학교 시절'}</strong><small>{step === 'list-created' ? '엄마가 추가' : '열람 가능'}</small></div><button aria-label="중학교 시절 열기" onClick={() => setStep(step === 'list-created' ? 'reflection' : 'postcards')}>›</button></div>
      </section>
    </>}

    {step === 'home-done' && <>
      <section className="demo-home-hero"><div className="demo-brand">RE Post</div><h1>오늘은 어떤 시절로 떠나볼까요?</h1><p>총 0건의 미션이 남아있습니다.</p><div className="empty-mission">지금은 기다리는 미션이 없어요.</div>
      </section>
      <section className="demo-bookshelf"><h2>내 엽서함</h2><div className="books-grid-demo">{['엄마','아빠','언니'].map((name, index) => <button className="book-demo" key={name} onClick={() => setStep('postcards')}><div className="paper-stack-demo" style={{ background: index === 1 ? '#fea9fe' : '#caf984' }} /><strong>{name} <i>↝</i> 나</strong></button>)}<button className="add-demo" onClick={() => setStep('relationship')}>＋</button></div></section>
    </>}

    {step === 'reflection' && <>
      {header('챕터 미션')}
      <section className="demo-form"><p className="chapter-kicker">chapter. 04</p><h1>{title || '중학교 시절 이야기'}</h1><p className="form-subtitle">엄마와 내가 모두 미션을 하면 중학교 시절 챕터가 열려요.</p><div className="demo-mission-prompt"><div className="demo-mission-heading"><img src={ribbonGreen} alt=""/><span>엄마의 미션</span></div><p>{mission || '이 노래 들어보고 감상 남겨줘'}</p></div><label htmlFor="reflection">나의 후기를 적어주세요.</label><textarea wrap="soft" spellCheck={false} id="reflection" value={reflection} onChange={e => setReflection(e.target.value)} placeholder="" /></section>
      {footer('후기 남기기', () => setStep('list-ready'))}
    </>}

    {step === 'postcards' && <>
      {header('중학교 시절 이야기')}
      <section className="flipped-postcards">{['엄마의 중학교 시절', '나의 중학교 시절'].map((label, index) => <button className={`flip-card ${index ? 'pink-card' : ''} ${flipped[label] ? 'is-flipped' : ''}`} key={label} onClick={() => setFlipped(v => ({ ...v, [label]: !v[label] }))} aria-pressed={Boolean(flipped[label])}>
        <span><img src={index ? ribbonPink : ribbonGreen} alt=""/>{flipped[label] ? label : label}</span><p>{flipped[label] ? (index ? story.split('\n')[1] : reflection) : '눌러서 후기를 확인해보세요.'}</p><div className="lined-paper" /></button>)}</section>
      {footer('홈으로 돌아가기', () => setStep('home-done'))}
    </>}

    {step === 'relationship' && <>
      {header('새 엽서 만들기')}
      <section className="demo-form relationship-form"><h1>초대할 가족이<br/>나의 누구인지 알려주세요.</h1><p className="form-subtitle">서로의 청춘을 엽서로 주고받아요</p><div className="relationship-grid">{family.map(member => <button key={member.name} className={relationship === member.name ? 'selected' : ''} onClick={() => setRelationship(member.name)}><div><img src={member.art} alt=""/></div><span>{member.name}</span></button>)}</div></section>
      {footer('초대 링크 만들기', () => setStep('invite'), relationship !== '엄마')}
    </>}

    {step === 'invite' && <>
      {header('새 엽서 만들기')}
      <section className="demo-form invite-form"><h1>엄마를 초대해요</h1><p className="form-subtitle">엄마가 수락하면 엽서함이 열려요</p><button className="invite-url" onClick={async () => { try { await navigator.clipboard.writeText(inviteUrl) } catch { const field = document.createElement('textarea'); field.value = inviteUrl; field.style.position = 'fixed'; field.style.opacity = '0'; document.body.append(field); field.select(); document.execCommand('copy'); field.remove() } setCopied(true) }}><span>초대 링크</span><strong>{inviteUrl}</strong><img src={copyIcon} alt="복사"/></button><div className="instructions"><strong>이렇게 진행돼요</strong><p>① 링크를 엄마에게 보내요</p><p>② 엄마가 링크를 열고 수락해요</p><p>③ 엽서가 엽서함에 꽂히고 챕터를 만들 수 있어요</p></div>{copied && <div className="copy-toast" role="status">링크를 복사했어요.</div>}</section>
      {footer('상대 화면 보기', () => setStep('arrival'))}
    </>}

    {step === 'arrival' && <>
      {header('초대장 도착')}
      <section className="arrival-content"><div className="arrival-logo">RE</div><h1>새로운 교환엽서 초대장이<br/>도착했어요</h1><p>서로의 어린 시절과 청춘을 이야기로 나누는 교환엽서예요.</p><div className="instructions"><strong>이렇게 진행돼요</strong><p>① 궁금한 시절을 챕터로 만들어요</p><p>② 각자 그 시절의 이야기를 써요</p><p>③ 서로에게 미션을 보내고 해봐요</p></div></section>
      {footer('수락하고 시작하기', () => setStep('home-done'))}<button className="later-button" onClick={() => setStep('home-done')}>다음에 할게요</button>
    </>}
  </main>
}
