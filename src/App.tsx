import { useState } from 'react'
import './App.css'
import { HomeScreen } from './screens/HomeScreen'
import { InvitationScreen } from './screens/InvitationScreen'
import { RelationshipScreen } from './screens/RelationshipScreen'
import type { Relationship, Screen } from './types/invite'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [relationship, setRelationship] = useState<Relationship>('엄마')

  return (
    <div className="app-shell">
      {screen === 'home' && <HomeScreen onAddBook={() => setScreen('relationship')} />}
      {screen === 'relationship' && (
        <RelationshipScreen
          onBack={() => setScreen('home')}
          onAddRelationship={() => {
            setRelationship('엄마')
            setScreen('invitation')
          }}
          onContinue={(nextRelationship) => {
            setRelationship(nextRelationship)
            setScreen('invitation')
          }}
        />
      )}
      {screen === 'invitation' && (
        <InvitationScreen
          relationship={relationship}
          onBack={() => setScreen('relationship')}
          onDone={() => setScreen('home')}
        />
      )}
    </div>
  )
}

export default App
