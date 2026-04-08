import { useEffect, useEffectEvent, useState } from 'react'
import { BASE_URL } from '../config/api'

function formatClockTime(value) {
  const date = new Date(value)

  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((part) => String(part).padStart(2, '0'))
    .join(':')
}

function ClipperDashboard() {
  const [queue, setQueue] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadQueue = useEffectEvent(async ({ signal, showLoading = false } = {}) => {
    if (showLoading) {
      setIsLoading(true)
    } else {
      setIsRefreshing(true)
    }

    setError('')

    try {
      const response = await fetch(`${BASE_URL}/api/clips/queue/1`, {
        signal,
      })

      if (!response.ok) {
        throw new Error('Gagal memuat antrean tugas clipper.')
      }

      const payload = await response.json()
      setQueue(payload)
    } catch (fetchError) {
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return
      }

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Terjadi kesalahan saat mengambil antrean.',
      )
    } finally {
      if (showLoading) {
        setIsLoading(false)
      } else {
        setIsRefreshing(false)
      }
    }
  })

  useEffect(() => {
    const controller = new AbortController()

    loadQueue({ signal: controller.signal, showLoading: true })

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <section className="min-h-full bg-white px-4 py-4 sm:px-5">
      <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-gray-400">
            Content Queue
          </p>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">
            Clipper Task Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Lihat tugas potong video terbaru seperti daftar konten di studio creator.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            loadQueue()
          }}
          disabled={isRefreshing}
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <span className={isRefreshing ? 'animate-spin' : ''}>↻</span>
          {isRefreshing ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      <div className="pt-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700" />
            <p className="mt-4 text-sm font-medium text-gray-700">
              Memuat antrean tugas clipper...
            </p>
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!isLoading && !error && queue.length === 0 ? (
          <div className="px-2 py-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
              Queue Kosong
            </p>
            <p className="mt-3 text-base text-gray-700">
              Belum ada tugas pemotongan video baru.
            </p>
          </div>
        ) : null}

        {!isLoading && !error && queue.length > 0 ? (
          <div>
            {queue.map((task) => (
              <article
                key={task.id}
                className="flex gap-3 border-b border-gray-100 py-4 last:border-b-0"
              >
                <div className="mt-0.5 h-14 w-24 shrink-0 rounded-md bg-gray-200" />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {formatClockTime(task.start_timestamp)} - {formatClockTime(task.end_timestamp)}
                    </p>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                      Pending
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    Task #{task.id} • Donation #{task.donation_id}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                      {task.ip_license_token}
                    </code>

                    <button
                      type="button"
                      onClick={() => {
                        window.alert(
                          `Membuka editor video untuk lisensi: ${task.ip_license_token}`,
                        )
                      }}
                      className="rounded-md border border-gray-300 bg-transparent px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Kerjakan
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default ClipperDashboard