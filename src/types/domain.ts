export type Participant = {
  id: string
  displayName: string
  birthYear?: number
}

export type Book = {
  id: string
  createdBy: string
  title: string
  createdAt: string
}

export type ChapterStatus = 'DRAFT' | 'PUBLISHED'

export type Chapter = {
  id: string
  bookId: string
  authorId: string
  periodLabel?: string
  title?: string
  memoryContent?: string
  musicTitle?: string
  musicArtist?: string
  musicUrl?: string
  status: ChapterStatus
  publishedAt?: string
}

export type Mission = {
  id: string
  chapterId: string
  bookId: string
  assigneeId: string
  instruction: string
  createdAt: string
}

export type MissionReflection = {
  id: string
  missionId: string
  content: string
  createdAt: string
  updatedAt: string
}
