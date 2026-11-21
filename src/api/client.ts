export interface ApiErrorDetail {
  code?: string
  message?: string
}

interface ApiResponse<T> {
  success?: boolean
  data?: T
  error?: ApiErrorDetail | null
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '')

export class ApiError extends Error {
  code?: string

  constructor(message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      credentials: 'include',
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    })
  } catch {
    throw new ApiError('서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.')
  }

  let body: ApiResponse<T> | null = null
  try {
    body = await response.json() as ApiResponse<T>
  } catch {
    if (!response.ok) throw new ApiError('서버 요청에 실패했어요.')
  }

  if (!response.ok || body?.success === false || body?.data === undefined) {
    throw new ApiError(body?.error?.message ?? '서버 요청에 실패했어요.', body?.error?.code)
  }

  return body.data
}
