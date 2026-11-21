import { useEffect, useState } from 'react'
import './App.css'
import { ChapterReadingFlow } from './features/chapter-reading/ChapterReadingFlow'
import { HomeScreen } from './screens/HomeScreen'
import { InvitationScreen } from './screens/InvitationScreen'
import { RelationshipInputScreen } from './screens/RelationshipInputScreen'
import { RelationshipScreen } from './screens/RelationshipScreen'
import { MissionDetail } from './features/missions/MissionDetail'
import { ApiError, missionApi } from './features/missions/api'
import type { Relationship, Screen } from './types/invite'

interface AppProps {
  onOpenBook: (bookId: string) => void
}

function App({ onOpenBook }: AppProps) {
  const chapterId = new URLSearchParams(window.location.search).get('chapterId')
  const [screen, setScreen] = useState<Screen>('home')
  const [relationship, setRelationship] = useState<Relationship>('')
  const [inviteUrl,setInviteUrl]=useState('')
  const [flowError,setFlowError]=useState('')
  const [creatingBook,setCreatingBook]=useState(false)
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null)
  const [participantName,setParticipantName]=useState('')
  const [needsProfile,setNeedsProfile]=useState(false)
  const [profileLoading,setProfileLoading]=useState(true)
  const [profileBusy,setProfileBusy]=useState(false)
  const [selectedMission, setSelectedMission] = useState<{ chapterId: number; counterpart: string } | null>(null)
  const [readingChapterId, setReadingChapterId] = useState<number | null>(null)

  useEffect(()=>{let active=true;missionApi.getParticipant().then(()=>{if(active)setNeedsProfile(false)}).catch((error:unknown)=>{if(active)setNeedsProfile(error instanceof ApiError&&error.code==='SESSION_REQUIRED')}).finally(()=>{if(active)setProfileLoading(false)});return()=>{active=false}},[])

  if(profileLoading) return <div className="app-shell"><main className="screen"><p>사용자 정보를 확인하고 있어요…</p></main></div>
  if(needsProfile) return <div className="app-shell"><main className="screen profile-screen"><h1>시작하기</h1><p>사용할 이름을 입력해 주세요.</p><input value={participantName} onChange={e=>setParticipantName(e.target.value)} maxLength={50} placeholder="닉네임"/><button type="button" disabled={!participantName.trim()||profileBusy} onClick={async()=>{setProfileBusy(true);setFlowError('');try{await missionApi.createParticipant(participantName.trim());setNeedsProfile(false)}catch(e){setFlowError(e instanceof ApiError?e.message:'사용자 정보를 저장하지 못했어요.')}finally{setProfileBusy(false)}}}>{profileBusy?'저장 중…':'시작하기'}</button>{flowError&&<p role="alert">{flowError}</p>}</main></div>

  if (chapterId) {
    return <ChapterReadingFlow chapterId={chapterId} onBack={() => window.history.back()} />
  }

  if (selectedMission) {
    if (readingChapterId === selectedMission.chapterId) {
      return (
        <ChapterReadingFlow
          chapterId={String(readingChapterId)}
          onBack={() => setReadingChapterId(null)}
        />
      )
    }

    return (
      <div className="app-shell">
        <MissionDetail
          chapterId={selectedMission.chapterId}
          counterpart={selectedMission.counterpart}
          onBack={() => setSelectedMission(null)}
          onReadChapter={() => setReadingChapterId(selectedMission.chapterId)}
        />
      </div>
    )
  }

  return (
    <div className="app-shell">
      {screen === 'home' && (
        <HomeScreen
          onAddBook={() => setScreen('relationship')}
          onOpenBook={onOpenBook}
          onSelectMission={(chapterId, counterpart) => setSelectedMission({ chapterId, counterpart })}
        />
      )}
      {screen === 'relationship' && (
        <RelationshipScreen
          onBack={() => setScreen('home')}
          selectedRelationship={selectedRelationship}
          onSelectRelationship={setSelectedRelationship}
          error={flowError}
          busy={creatingBook}
          onContinue={async(nextRelationship) => {
            setCreatingBook(true); setFlowError('');
            try { const created=await missionApi.createBook(nextRelationship); setRelationship(nextRelationship); setInviteUrl(created.invitation.inviteUrl); setScreen('invitation') }
            catch(e){setFlowError(e instanceof ApiError?e.message:'초대 링크를 만들지 못했어요.')}
            finally{setCreatingBook(false)}
          }}
        />
      )}
      {screen === 'relationshipInput' && (
        <RelationshipInputScreen
          onBack={() => setScreen('relationship')}
          onSubmit={(nextRelationship) => {
            setSelectedRelationship(nextRelationship)
            setScreen('relationship')
          }}
        />
      )}
      {screen === 'invitation' && (
        <InvitationScreen
          relationship={relationship}
          inviteUrl={inviteUrl}
          onBack={() => setScreen('relationship')}
          onDone={() => {
            setSelectedRelationship(null)
            setScreen('home')
          }}
        />
      )}
    </div>
  )
}

export default App
