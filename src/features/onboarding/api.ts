import { request } from '../../shared/api'

export type Participant = {
  participantId: number
  displayName: string
  birthYear: number | null
}

export const participantApi = {
  getMe: () => request<Participant>('/api/v1/participants/me'),
  register: (displayName: string) => request<Participant>('/api/v1/participants', {
    method: 'POST',
    body: JSON.stringify({ displayName, birthYear: null }),
  }),
}
