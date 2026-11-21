import { useState } from 'react'
import './demo-video-flow.css'
import mom from '../../assets/hifi/mom.svg'
import dad from '../../assets/hifi/dad.svg'
import grandma from '../../assets/hifi/grandma.svg'
import grandpa from '../../assets/hifi/grandpa.svg'
import card from '../../assets/hifi/postcard-face.svg'
import green from '../../assets/hifi/ribbon-green.svg'
import pink from '../../assets/hifi/ribbon-pink.svg'
import copy from '../../assets/hifi/copy.svg'

const family = [{ name: '엄마', art: mom }, { name: '아빠', art: dad }, { name: '할머니', art: grandma }, { name: '할아버지', art: grandpa }]
const sample = {
  period: '중학교 시절', title: '그해 여름, 라디오 앞에서',
  story: '그해 여름, 나는 라디오 앞에서 숨을 죽였어. 신청곡 첫 소절이 나오자마자 녹음 버튼을 눌렀지. 그 테이프를 아직도 간직하고 있어.',
  mission: '그때 내가 좋아했던 노래를 한 곡 듣고, 떠오르는 장면을 들려줘.',
  reply: '이어폰을 빼고 창가에서 들어봤어. 같은 노래를 들으며 서로 다른 여름을 보냈다는 게 신기했어.',
}
type Chapter = typeof sample & { open: boolean }
const first: Chapter = {
  period: '초등학생 시절', title: '학교 앞 문방구', story: '하굣길마다 문방구 앞에 멈춰 섰어. 동생과 나눠 먹을 별사탕을 고르는 게 제일 즐거웠지.',
  mission: '집에 돌아오는 길에 작은 간식을 누군가와 나눠봐.', reply: '친구와 사탕 한 봉지를 나누니 집까지 가는 길이 금방이었어.', open: true,
}
type Step = 'nickname' | 'home' | 'family' | 'custom' | 'invite' | 'arrival' | 'list' | 'chapter' | 'story' | 'mission' | 'read'
type Book = { name: string; chapters: Chapter[] }
const invitation = new URLSearchParams(window.location.search).get('invite')?.trim().slice(0, 30)
const initialBooks: Book[] = [
  { name: '엄마', chapters: [first, { ...sample, open: false }] },
  { name: '아빠', chapters: [{ ...first, open: false, mission: '오늘 하루 작은 간식 하나를 친구와 나눠봐.' }] },
  { name: '언니', chapters: [first] },
]

export function DemoVideoFlow() {
  const [step, setStep] = useState<Step>(invitation ? 'arrival' : 'nickname')
  const [history, setHistory] = useState<Step[]>([])
  const [nickname, setNickname] = useState('지민')
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [relative, setRelative] = useState(invitation || '엄마')
  const [chosen, setChosen] = useState('')
  const [custom, setCustom] = useState('')
  const [index, setIndex] = useState(0)
  const [draft, setDraft] = useState({ ...sample })
  const [reply, setReply] = useState(sample.reply)
  const [reverse, setReverse] = useState([false, false])
  const [copyMessage, setCopyMessage] = useState('')
  const book = books.find(item => item.name === relative)
  const chapters = book?.chapters ?? []
  const chapter = chapters[index]
  const inviteUrl = new URL('/demo', window.location.origin)
  inviteUrl.searchParams.set('invite', chosen || relative)

  function show(next: Step) {
    setStep(next)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  function go(next: Step) {
    setHistory(previous => [...previous, step])
    show(next)
  }
  function land(next: Step) {
    setHistory([])
    show(next)
  }
  function back() {
    const previous = history.at(-1)
    setHistory(history.slice(0, -1))
    show(previous ?? 'home')
  }
  function visit(name: string, position: number, next: Step) {
    setRelative(name)
    setIndex(position)
    setReverse([false, false])
    setReply(sample.reply)
    go(next)
  }
  function updateChapters(change: (items: Chapter[]) => Chapter[]) {
    setBooks(items => items.map(item => item.name === relative ? { ...item, chapters: change(item.chapters) } : item))
  }
  function publish() {
    updateChapters(items => [...items, { ...draft, open: false, reply: '' }])
    setIndex(chapters.length)
    land('list')
  }
  function accept() {
    const name = chosen || relative
    setRelative(name)
    setBooks(items => items.some(item => item.name === name) ? items : [...items, { name, chapters: [] }])
    land('home')
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteUrl.href)
      setCopyMessage('복사가 완료되었어요.')
    } catch {
      setCopyMessage('아래 링크를 길게 눌러 복사해 주세요.')
    }
  }
  const header = (label: string) => <header className="demo-nav"><button type="button" onClick={back} aria-label="뒤로">‹</button><span>{label}</span></header>
  const action = (label: string, run: () => void, disabled = false) => <button type="button" className="demo-primary" disabled={disabled} onClick={run}>{label}</button>
  const tasks = books.flatMap(item => item.chapters.flatMap((c, i) => c.open ? [] : [{ name: item.name, chapter: c, index: i }]))
  const cards = chapter && [
    { who: relative, text: chapter.story, feedback: chapter.reply, icon: green },
    { who: '나', text: '내 플레이리스트엔 등굣길에 친구와 이어폰 한 쪽씩 나눠 듣던 노래가 있어. 첫 소절만 들어도 그 골목이 생각나.', feedback: '네가 걷던 길을 따라 그 노래를 들으니, 너의 하루를 조금 알 것 같았어.', icon: pink },
  ]

  return <main className={`demo-shell demo-step-${step}`} lang="ko">
    {step === 'nickname' && <>
      <header className="demo-nav"><span /><span>닉네임 설정</span></header>
      <section className="demo-form"><h1>내 닉네임을 정해주세요</h1><p className="form-subtitle">앞으로 사용할 이름을 입력해 주세요.</p>
        <label htmlFor="nickname">닉네임</label><input id="nickname" maxLength={50} value={nickname} onChange={e => setNickname(e.target.value)} />
        <aside><strong>6자 이내의 쉬운 이름도 좋아요.</strong><span>가족에게 보이는 닉네임이에요.</span></aside>
      </section>{action('완료', () => land('home'), !nickname.trim())}
    </>}
    {step === 'home' && <>
      <section className="demo-home-hero"><div className="demo-brand">RE:Post</div><h1>오늘은 어떤 시절로 떠나볼까요?</h1>
        <p>총 {tasks.length}건의 미션이 남아있습니다.</p>
        {tasks.map(task => <button key={task.name + task.index} className="mission-tile" onClick={() => visit(task.name, task.index, 'mission')}>
          <span>{task.name}의 미션</span><small>{task.chapter.period}</small><strong>{task.chapter.mission}</strong><b>›</b></button>)}
      </section>
      <section className="demo-bookshelf"><h2>내 엽서함</h2><div className="books-grid-demo">
        {books.map(item => <button className="book-demo" key={item.name} onClick={() => visit(item.name, 0, 'list')}><div className="paper-stack-demo" /><strong>{item.name} <i>↝</i> 나</strong></button>)}
        <button className="add-demo" aria-label="가족 초대" onClick={() => { setChosen(''); setCopyMessage(''); go('family') }}>＋</button>
      </div></section>
    </>}
    {step === 'family' && <>{header('새 엽서 만들기')}<section className="demo-form relationship-form"><h1>초대할 가족이<br />나의 누구인지 알려주세요.</h1><p className="form-subtitle">서로의 청춘을 엽서로 주고받아요.</p>
      <div className="relationship-grid"><button className={chosen && chosen === custom.trim() ? 'selected' : ''} onClick={() => go('custom')} aria-label="관계 직접 입력"><div>＋</div><span>{custom || '직접 입력'}</span></button>
        {family.map(person => <button key={person.name} aria-pressed={chosen === person.name} className={chosen === person.name ? 'selected' : ''} onClick={() => setChosen(person.name)}><div><img src={person.art} alt="" /></div><span>{person.name}</span></button>)}
      </div></section>{action('초대 링크 만들기', () => go('invite'), !chosen)}</>}
    {step === 'custom' && <>{header('새 엽서 만들기')}<section className="demo-form"><h1>초대할 가족의 관계를 적어주세요.</h1><label htmlFor="relation">관계</label><input id="relation" value={custom} maxLength={30} onChange={e => setCustom(e.target.value)} placeholder="예시: 이모, 삼촌, 고모" /></section>
      {action('선택 완료', () => { setChosen(custom.trim()); back() }, !custom.trim())}</>}
    {step === 'invite' && <>{header('새 엽서 만들기')}<section className="demo-form invite-form"><h1>{chosen} 초대장</h1><p>링크를 보내면 가족이 수락할 수 있어요.</p>
      <button className="invite-url" onClick={copyLink}><span>초대 링크</span><strong>{inviteUrl.href}</strong><img src={copy} alt="복사" /></button>
      {copyMessage && <div role="status">{copyMessage} <a href={inviteUrl.href}>초대장 열기</a></div>}
      <div className="instructions"><strong>이렇게 진행돼요</strong><p>① 가족에게 링크를 보내요.</p><p>② 초대장을 열고 수락해요.</p><p>③ 엽서함에서 서로의 추억을 교환해요.</p></div></section>
      {action('상대 화면 보기', () => go('arrival'))}</>}
    {step === 'arrival' && <>{header('초대장 도착')}<section className="arrival-content"><img src={card} alt="" /><h1>새로운 교환엽서 초대장이<br />도착했어요</h1>
      <p>{chosen || relative}에게 보낸 초대장이에요.</p><div className="instructions"><strong>이렇게 진행돼요</strong><p>① 궁금한 시절을 챕터로 만들어요.</p><p>② 각자 그 시절의 이야기를 써요.</p><p>③ 서로에게 미션을 보내고 해봐요.</p></div></section>
      {action('수락하고 시작하기', accept)}<button className="later-button" onClick={() => land('home')}>다음에 할게요</button></>}
    {step === 'list' && <>
      <section className="demo-list-hero"><button aria-label="홈으로" className="demo-back" onClick={() => land('home')}>‹</button><h1>{relative} <span>↝</span> 나</h1>
        <p>현재 열람 가능한 엽서가 <b>{chapters.filter(c => c.open).length}</b>개 있어요!</p>
        <button className="hero-postcard" aria-label="최근 엽서 열기" disabled={!chapters.length} onClick={() => visit(relative, chapters.length - 1, chapters.at(-1)?.open ? 'read' : 'mission')}><img src={card} alt="" /></button>
      </section><section className="demo-list-body"><div className="section-heading"><h2>지금까지 나눈 엽서 <b>{chapters.length}</b>개</h2><button aria-label="챕터 추가" onClick={() => { setDraft({ ...sample }); go('chapter') }}>＋</button></div>
      {chapters.map((c, i) => <button className="demo-chapter-item" key={i} onClick={() => visit(relative, i, c.open ? 'read' : 'mission')}><span>{String(i + 1).padStart(2, '0')}</span><strong>{c.period}<small>{c.open ? '열람 가능' : '미션 하기'}</small></strong><b>›</b></button>)}</section></>}
    {step === 'chapter' && <>{header('챕터 만들기')}<section className="demo-form"><p className="chapter-kicker">chapter. {String(chapters.length + 1).padStart(2, '0')}</p><h1>어떤 시절이 궁금한가요?</h1><label htmlFor="period">챕터 이름</label><input id="period" value={draft.period} onChange={e => setDraft({ ...draft, period: e.target.value })} />
      <aside><strong>{relative}와 내 화면에 모두 표시돼요.</strong><span>각자 이야기를 쓰고 미션을 교환해요.</span></aside><div className="chapter-watermark"><img src={card} alt="" /></div></section>
      {action('챕터 만들기', () => go('story'), !draft.period.trim())}</>}
    {step === 'story' && <>{header('추억과 미션 건네기')}<section className="demo-form"><p className="chapter-kicker">{relative}의 엽서</p><h1>{draft.period} 이야기</h1>
      <label htmlFor="story-title">제목</label><input id="story-title" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
      <label htmlFor="story-body">나의 추억을 적어주세요</label><textarea id="story-body" value={draft.story} onChange={e => setDraft({ ...draft, story: e.target.value })} />
      <label htmlFor="mission">상대에게 보낼 미션</label><textarea id="mission" className="mission-input" value={draft.mission} onChange={e => setDraft({ ...draft, mission: e.target.value })} /></section>
      {action('완료', publish, !draft.title.trim() || !draft.story.trim() || !draft.mission.trim())}</>}
    {step === 'mission' && chapter && <>{header('챕터 미션')}<section className="demo-form"><p className="chapter-kicker">{nickname || '나'}의 엽서함</p><h1>{chapter.period} 이야기</h1>
      <p className="form-subtitle">서로의 미션을 하면 챕터가 열려요.</p><div className="demo-mission-prompt"><div className="demo-mission-heading"><img src={green} alt="" /><span>{relative}의 미션</span></div><p>{chapter.mission}</p></div>
      <label htmlFor="review">나의 후기를 적어주세요.</label><textarea id="review" value={reply} onChange={e => setReply(e.target.value)} /></section>
      {action('후기 남기기', () => { updateChapters(items => items.map((c, i) => i === index ? { ...c, open: true, reply: reply.trim() } : c)); land('list') }, !reply.trim())}</>}
    {step === 'read' && chapter && cards && <>{header('엽서 읽기')}<section className="flipped-postcards"><h1>{chapter.period} 이야기</h1>
      {cards.map((item, i) => <button className={`flip-card ${i ? 'pink-card' : ''} ${reverse[i] ? 'is-flipped' : ''}`} key={item.who + i} aria-pressed={reverse[i]}
        onClick={() => setReverse(flags => flags.map((flag, j) => j === i ? !flag : flag))}><span><img src={item.icon} alt="" />{reverse[i] ? (i ? relative : '나') + '의 미션 후기' : item.who + '의 ' + chapter.period}</span>
        {!reverse[i] && !i && <strong>{chapter.title}</strong>}<p>{reverse[i] ? item.feedback : item.text}</p></button>)}
      <div className="demo-pager"><button aria-label="이야기 보기" onClick={() => setReverse([false, false])}>‹</button><button aria-label="후기 보기" onClick={() => setReverse([true, true])}>›</button></div></section>
      {action('엽서함으로', () => land('list'))}</>}
  </main>
}
