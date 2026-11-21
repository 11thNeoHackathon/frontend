import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { HomeScreen } from './screens/HomeScreen'
import { InvitationScreen } from './screens/InvitationScreen'
import { RelationshipInputScreen } from './screens/RelationshipInputScreen'
import { RelationshipScreen } from './screens/RelationshipScreen'
import type { Relationship, Screen } from './types/invite'

function App() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState<Screen>('home')
  const [relationship, setRelationship] = useState<Relationship>('엄마')
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null)

  return (
    <div className="app-shell">
      {screen === 'home' && (
        <HomeScreen
          onAddBook={() => setScreen('relationship')}
          onOpenBook={(bookId) => navigate(`/books/${bookId}`)}
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
