import { useCallback, useEffect, useState } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import App from '../App'
import { ChapterCreateScreen } from '../screens/ChapterCreateScreen'
import { ChapterListScreen } from '../screens/ChapterListScreen'
import { ChapterReadingFlow } from '../features/chapter-reading/ChapterReadingFlow'
import { InviteAcceptScreen } from '../features/invitation/InviteAcceptScreen'
import { ApiError, missionApi, type Book, type Chapter } from '../features/missions/api'
import type { ChapterListItem } from '../types/chapter'

function HomeRoute() {
  const navigate = useNavigate()
  return <App onOpenBook={(bookId) => navigate(`/books/${bookId}`)} />
}

function BookRoute() {
  const {bookId=''}=useParams(); const navigate=useNavigate()
  const [chapters,setChapters]=useState<Chapter[]>([]);const [book,setBook]=useState<Book|null>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [reload,setReload]=useState(0)
  const load=useCallback(async()=>{setLoading(true);setError('');try{const id=Number(bookId);if(!Number.isInteger(id)||id<1)throw new ApiError('엽서함을 찾을 수 없어요.',404);const [b,c]=await Promise.all([missionApi.getBook(id),missionApi.getChapters(id)]);setBook(b);setChapters(c)}catch(e){setError(e instanceof ApiError?e.message:'엽서를 불러오지 못했어요.')}finally{setLoading(false)}},[bookId])
  useEffect(()=>{void load()},[load,reload])
  const items:ChapterListItem[]=chapters.map(c=>({id:String(c.id),title:c.name,tags:c.nextAction==='READ'?[{label:'열람 가능',tone:'green'}]:c.nextAction==='DO_MISSION'?[{label:'미션 도착',tone:'pink'}]:c.nextAction==='WAIT_FOR_OPEN'?[{label:'상대 감상 대기',tone:'purple'}]:c.nextAction==='WAIT'?[{label:'상대 작성 대기',tone:'purple'}]:[{label:'이야기 작성하기',tone:'green'}]}))
  if(loading)return <main className="screen"><p>엽서함을 불러오고 있어요…</p></main>
  if(error||!book)return <main className="screen"><div role="alert" className="mission-message error">{error||'엽서함을 찾을 수 없어요.'}<button type="button" onClick={()=>setReload(x=>x+1)}>다시 시도</button><button type="button" onClick={()=>navigate('/')}>홈으로</button></div></main>
  return <ChapterListScreen book={book} chapters={items} onBack={()=>navigate('/')} onAddChapter={id=>navigate(`/books/${id}/chapters/new`)} onOpenChapter={id=>navigate(`/chapters/${id}`)} onDeleteChapter={async id=>{await missionApi.deleteChapter(Number(id));setReload(x=>x+1)}} />
}
function CreateChapterRoute(){const {bookId=''}=useParams();const navigate=useNavigate();const [chapters,setChapters]=useState<Chapter[]>([]);const [error,setError]=useState('');const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false)
 useEffect(()=>{let active=true;Number(bookId)>0?missionApi.getChapters(Number(bookId)).then(c=>{if(active)setChapters(c)}).catch(e=>{if(active)setError(e instanceof ApiError?e.message:'챕터 정보를 불러오지 못했어요.')}).finally(()=>{if(active)setLoading(false)}):Promise.resolve().then(()=>{setError('엽서함 주소가 올바르지 않아요.');setLoading(false)});return()=>{active=false}},[bookId])
 return <ChapterCreateScreen chapterNumber={chapters.length+1} error={loading?'챕터 정보를 불러오는 중이에요…':error} busy={busy||loading} onBack={id=>navigate(`/books/${id}`)} onCreate={async(id,title)=>{setBusy(true);setError('');try{await missionApi.createChapter(Number(id),title);navigate(`/books/${id}`)}catch(e){setError(e instanceof ApiError?e.message:'엽서를 만들지 못했어요.')}finally{setBusy(false)}}} />
}
function ChapterRoute(){const {chapterId=''}=useParams();const navigate=useNavigate();return <ChapterReadingFlow chapterId={chapterId} onBack={()=>navigate(-1)} />}
export function AppRouter(){return <Routes><Route path="/" element={<HomeRoute/>}/><Route path="/invite/:code" element={<InviteAcceptScreen/>}/><Route path="/books/:bookId" element={<BookRoute/>}/><Route path="/chapters/:chapterId" element={<ChapterRoute/>}/><Route path="/books/:bookId/chapters/new" element={<CreateChapterRoute/>}/></Routes>}
