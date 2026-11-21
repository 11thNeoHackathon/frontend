export type ApiEnvelope<T> = {
  success: boolean
  data: T | null
  error: { code: string; message: string } | null
}

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

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
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
  if (!response.ok || !body?.success || body.data === null) {
    throw new ApiError(body?.error?.message ?? '요청을 처리하지 못했어요.', response.status, body?.error?.code)
  }
  return body.data
}
