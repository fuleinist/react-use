import { useState, useEffect, useRef, useCallback } from 'react'

export const useLazyFetch = (url: string, options: RequestInit) => {
  const controllerRef = useRef<AbortController>()
  const [response, setResponse] = useState<Response>(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState<Error>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [called, setCalled] = useState<boolean>(false)

  const runFetch = useCallback(
    async (data: any) => {
      setCalled(true)
      setLoading(true)
      // Create an instance.
      const controller = new AbortController()
      controllerRef.current = controller
      const signal = controller.signal
      try {
        let fetchUrl = url
        let fetchOptions = {}
        //default method is GET
        const method = options?.method || 'GET'
        if (method === 'GET' && data) {
          fetchUrl = `${url}?${new URLSearchParams(data)}`
          fetchOptions = {
            ...options,
            method,
            signal,
          }
        } else {
          fetchOptions = {
            ...options,
            method,
            signal,
            body: data,
          }
        }
        const response = await fetch(fetchUrl, fetchOptions)
        const result = await response.json()
        setResult(result)
        setResponse(response)
        setLoading(false)
      } catch (e) {
        setError(e)
        setResponse(null)
        setLoading(false)
      }
    },
    [url]
  )

  useEffect(() => {
    controllerRef?.current?.abort()
    return () => {
      setCalled(false)
    }
  }, [controllerRef])

  return [
    runFetch,
    {
      data: result,
      response,
      error,
      loading,
      called,
    },
  ] as [
    (data: any) => Promise<void>,
    {
      data: any
      response: Response
      error: Error
      loading: boolean
      called: boolean
    }
  ]
}
