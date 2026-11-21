import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { ChapterReadingFlow } from './features/chapter-reading/ChapterReadingFlow'
import { HomeScreen } from './screens/HomeScreen'
import { InvitationScreen } from './screens/InvitationScreen'
import { RelationshipInputScreen } from './screens/RelationshipInputScreen'
import { RelationshipScreen } from './screens/RelationshipScreen'
import { MissionDetail } from './features/missions/MissionDetail'
import type { Relationship, Screen } from './types/invite'

function App() {
  const navigate = useNavigate()
  const chapterId = new URLSearchParams(window.location.search).get('chapterId')
  const [screen, setScreen] = useState<Screen>('home')
  const [relationship, setRelationship] = useState<Relationship>('엄마')
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null)
  const [selectedMission, setSelectedMission] = useState<{ chapterId: number; counterpart: string } | null>(null)
  const [readingChapterId, setReadingChapterId] = useState<number | null>(null)

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
          onOpenBook={(bookId) => navigate(`/books/${bookId}`)}
          onSelectMission={(chapterId, counterpart) => setSelectedMission({ chapterId, counterpart })}
        />
      )}
      {screen === 'relationship' && (
        <RelationshipScreen
          onBack={() => setScreen('home')}
          selectedRelationship={selectedRelationship}
          onSelectRelationship={setSelectedRelationship}
          onAddRelationship={() => setScreen('relationshipInput')}
          onContinue={(nextRelationship) => {
            setRelationship(nextRelationship)
            setScreen('invitation')
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
