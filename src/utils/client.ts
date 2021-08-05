import type {AppResponse} from '../../types/apiTypes'

async function client<T>(path: string): Promise<AppResponse<T>> {
  const response: AppResponse<T> = {
    status: 'idle',
    data: undefined,
    error: undefined,
  }
  const savedData = window.localStorage.getItem(path)
  if (savedData) {
    response.data = JSON.parse(savedData)
    response.status = 'resolved'
    return response
  }
  await fetch(`https://dummyapi.io/data/api${path}`, {
    headers: {'app-id': `${process.env.REACT_APP_API_APP_ID}`},
  })
    .then(async res => {
      const data = await res.json()
      response.data = data as T
      window.localStorage.setItem(path, JSON.stringify(data))
      response.status = 'resolved'
    })
    .catch((err: Error) => {
      response.status = 'rejected'
      response.error = err
    })
  return response
}

export default client
