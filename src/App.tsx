import { useState } from 'react'
import './App.css'
import type { BookListItem } from './api/books'
import { HomeScreen } from './screens/HomeScreen'
import { InvitationScreen } from './screens/InvitationScreen'
import { RelationshipInputScreen } from './screens/RelationshipInputScreen'
import { RelationshipScreen } from './screens/RelationshipScreen'
import type { Relationship, Screen } from './types/invite'

interface AppProps {
  books: BookListItem[]
  isBooksLoading: boolean
  booksError: string | null
  onRetryBooks: () => void
  onOpenBook: (book: BookListItem) => void
}

function App({ books, isBooksLoading, booksError, onRetryBooks, onOpenBook }: AppProps) {
  const [screen, setScreen] = useState<Screen>('home')
  const [relationship, setRelationship] = useState<Relationship>('엄마')
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null)

  return (
    <div className="app-shell">
      {screen === 'home' && (
        <HomeScreen
          books={books}
          isLoading={isBooksLoading}
          error={booksError}
          onRetry={onRetryBooks}
          onAddBook={() => setScreen('relationship')}
          onOpenBook={onOpenBook}
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
