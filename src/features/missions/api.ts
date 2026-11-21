export type ApiEnvelope<T> = {
  success: boolean
  data: T | null
  error: { code: string; message: string } | null
}

export type Reflection = {
  id: number
  participantId: number
  content: string
  completedAt: string
  updatedAt: string
}
export type Progress = {
  participantId: number
  storyCompleted: boolean
  reflectionCompleted: boolean
}
export type Chapter = {
  id: number
  bookId: number
  name: string
  nextAction: 'WRITE_STORY' | 'WAIT' | 'DO_MISSION' | 'WAIT_FOR_OPEN' | 'READ'
  progress: Progress[]
  receivedMission: string | null
  myReflection: Reflection | null
  counterpartReflection: Reflection | null
}
export type Book = { bookId:number; title:string; status?:string; mySlotNo?:number; counterpartLabel?:string|null; counterpartName?:string|null }
export type CreatedBook = { book:Book; invitation:{code:string; inviteUrl:string; expiresAt:string} }
export type InvitationPreview = { status:'AVAILABLE'|'LINKED'; inviterName:string; bookTitle:string; expiresAt:string; bookId:number|null }
export type Participant = { participantId:number; displayName:string; birthYear:number|null }
export type ChapterDetails = Chapter & { openedAt:string|null; myStory:{title:string;content:string;missionInstruction:string}|null; counterpartStory:{title:string;content:string;missionInstruction:string}|null }

let participantRegistration: Promise<Participant> | null = null

export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, {
      ...init,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
  } catch {
    throw new ApiError('서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.', 0)
  }
  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null
  if (!response.ok || !body?.success) {
    throw new ApiError(body?.error?.message ?? '요청을 처리하지 못했어요.', response.status, body?.error?.code)
  }
  // 챕터 삭제처럼 성공해도 data가 null인 응답이 있다.
  return body.data as T
}

export const missionApi = {
  getBooks: () => request<Book[]>('/api/v1/books'),
  getBook: (bookId:number) => request<Book>(`/api/v1/books/${bookId}`),
  createBook: (counterpartLabel:string) => request<CreatedBook>('/api/v1/books',{method:'POST',body:JSON.stringify({title:'청춘 교환일기',counterpartLabel})}),
  createParticipant: (displayName:string) => {
    if (!participantRegistration) {
      participantRegistration = request<Participant>('/api/v1/participants',{method:'POST',body:JSON.stringify({displayName})})
        .finally(() => { participantRegistration = null })
    }
    return participantRegistration
  },
  getParticipant: () => request<Participant>('/api/v1/participants/me'),
  getInvitation: (code:string) => request<InvitationPreview>(`/api/v1/invitations/${encodeURIComponent(code)}`),
  acceptInvitation: (code:string,input:{displayName?:string;counterpartLabel?:string}) =>
    request<Book>(`/api/v1/invitations/${encodeURIComponent(code)}/accept`,{method:'POST',body:JSON.stringify(input)}),
  createChapter: (bookId:number,name:string) => request<Chapter>(`/api/v1/books/${bookId}/chapters`,{method:'POST',body:JSON.stringify({name})}),
  deleteChapter: (chapterId:number) => request<void>(`/api/v1/chapters/${chapterId}`,{method:'DELETE'}),
  getChapters: (bookId: number) => request<Chapter[]>(`/api/v1/books/${bookId}/chapters`),
  getChapter: (chapterId: number) => request<ChapterDetails>(`/api/v1/chapters/${chapterId}`),
  writeStory: (chapterId:number,input:{title:string;content:string;missionInstruction:string}) => request<ChapterDetails>(`/api/v1/chapters/${chapterId}/story`,{method:'PUT',body:JSON.stringify(input)}),
  completeStory: (chapterId:number) => request<ChapterDetails>(`/api/v1/chapters/${chapterId}/story/complete`,{method:'POST'}),
  saveReflection: (chapterId: number, content: string) =>
    request<Chapter>(`/api/v1/chapters/${chapterId}/reflection`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),
}
