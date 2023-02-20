import React, { useState, useEffect } from 'react'

// Create an instance.
const controller = new AbortController()

export function useLazyFetch(url: string, options: RequestInit) {
  const [response, setResponse] = useState<Response>(null)
  const [error, setError] = useState<Error>(null)
  const [loading, setLoading] = useState(false)
  const [called, setCalled] = useState(false)
  const signal = controller.signal

  useEffect(() => {
    //https://stackoverflow.com/a/69021180/7080032
    // having some problem with aborting, need to setup a ref I guess
    return () => {
      // controller.abort()
      setCalled(false)
    }
  }, [])

  const runFetch = async (data?: any) => {
    setCalled(true)
    setLoading(true)
    try {
      const result = await fetch(url, { ...options, signal, body: data })
      console.log({ result })
      setResponse(result)
      setLoading(false)
    } catch (e) {
      setError(e as Error)
      setResponse(null)
      setLoading(false)
    }
  }

  return [
    runFetch,
    {
      response,
      error,
      loading,
      called,
    },
  ] as [
    (data?: any) => Promise<void>,
    {
      response: Response
      error: Error
      loading: boolean
      called: boolean
    }
  ]
}
