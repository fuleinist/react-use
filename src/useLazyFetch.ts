import { useState, useEffect, useRef } from 'react'

// Create an instance.
const controller = new AbortController()

export function useLazyFetch(url, options) {
  const fetchRef = useRef()
  const [response, setResponse] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
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

  const runFetch = async (data) => {
    setCalled(true)
    setLoading(true)
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
          signal
        }
      } else {
        fetchOptions = {
          ...options,
          method,
          signal
        }
      }
      const response = await fetch(fetchUrl, fetchOptions)
      const result = await response.json()
      setResult(result)
      setResponse(result)
      setLoading(false)
    } catch (e) {
      setError(e)
      setResponse(null)
      setLoading(false)
    }
  }

  return [
    runFetch,
    {
      data: result,
      response,
      error,
      loading,
      called,
    },
  ]
}
