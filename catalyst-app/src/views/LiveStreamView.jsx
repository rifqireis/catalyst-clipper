import { useEffect, useState } from 'react'
import { BASE_URL } from '../config/api'

const AMOUNT_PRESETS = [10000, 50000, 100000]

const INITIAL_FORM = {
  donor_name: '',
  streamer_target: 'Streamer A',
  amount: '50000',
  message: 'Keren banget produk UMKM nya!',
}

const toastStyles = {
  success: 'border-blue-200 bg-white text-gray-900',
  info: 'border-gray-200 bg-white text-gray-900',
  error: 'border-red-200 bg-white text-gray-900',
}

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

function LiveStreamView() {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [submissionState, setSubmissionState] = useState('idle')
  const [feedback, setFeedback] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [toast, setToast] = useState(null)
  const [isToastVisible, setIsToastVisible] = useState(false)

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    setIsToastVisible(true)

    const hideTimer = window.setTimeout(() => {
      setIsToastVisible(false)
    }, 2600)

    const clearTimer = window.setTimeout(() => {
      setToast(null)
    }, 3000)

    return () => {
      window.clearTimeout(hideTimer)
      window.clearTimeout(clearTimer)
    }
  }, [toast])

  function handlePresetAmountClick(amount) {
    setFormData((current) => ({
      ...current,
      amount: String(amount),
    }))
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmissionState('submitting')
    setErrorMessage('')

    try {
      const response = await fetch(`${BASE_URL}/api/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donor_name: formData.donor_name.trim(),
          amount: Number(formData.amount),
          message: formData.message.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal mengirim donasi ke backend Catalyst.')
      }

      const payload = await response.json()
      setFeedback({
        ...payload,
        streamer_target: formData.streamer_target,
      })
      setToast({
        tone: payload.clip_task_created ? 'success' : 'info',
        title: payload.clip_task_created
          ? 'Tugas clipper berhasil dibuat.'
          : 'Donasi berhasil dikirim.',
        message:
          payload.detected_keywords.length > 0
            ? `Keyword terdeteksi: ${payload.detected_keywords.join(', ')}`
            : 'Belum ada keyword UMKM yang memicu tugas clipper baru.',
      })
      setSubmissionState('success')
      setErrorMessage('')
      setFormData(INITIAL_FORM)
    } catch (error) {
      setSubmissionState('error')
      const nextMessage =
        error instanceof Error ? error.message : 'Terjadi kesalahan tak terduga.'

      setErrorMessage(nextMessage)
      setToast({
        tone: 'error',
        title: 'Pengiriman donasi gagal.',
        message: nextMessage,
      })
    }
  }

  return (
    <section className="relative space-y-4 px-4 py-4 sm:px-5">
      {toast ? (
        <div className="pointer-events-none sticky top-4 z-20">
          <div
            className={[
              'rounded-lg border px-4 py-3 shadow-sm transition-all duration-300',
              toastStyles[toast.tone],
              isToastVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0',
            ].join(' ')}
          >
            <p className="text-sm font-semibold">{toast.title}</p>
            <p className="mt-1 text-xs leading-5 text-gray-600">{toast.message}</p>
          </div>
        </div>
      ) : null}

      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-gray-400">
          Creator Studio
        </p>
        <h1 className="text-xl font-semibold text-gray-900">Catalyst Live</h1>
      </header>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="relative aspect-video bg-black">
          <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Live
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
            Preview streaming UMKM
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-200 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-gray-400">
              Nama Streamer
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">Gaming Indo</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-gray-400">
              Penonton
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">15K</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-gray-400">
            Super Chat Simulation
          </p>
          <h2 className="mt-1 text-lg font-semibold text-gray-900">
            Kirim Dukungan UMKM
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Simulasikan donasi untuk memicu workflow Catalyst tanpa mengubah payload backend.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Nama Donatur
            </span>
            <input
              required
              type="text"
              name="donor_name"
              value={formData.donor_name}
              onChange={handleChange}
              placeholder="Contoh: UMKM Nusantara"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Pilih Streamer Tujuan
            </span>
            <select
              name="streamer_target"
              value={formData.streamer_target}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            >
              <option>Streamer A</option>
              <option>Streamer B</option>
            </select>
          </label>

          <div>
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Nominal Dukungan
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {AMOUNT_PRESETS.map((amount) => {
                const isSelected = formData.amount === String(amount)

                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handlePresetAmountClick(amount)}
                    className={[
                      'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300',
                    ].join(' ')}
                  >
                    {amount === 10000 ? '10K' : amount === 50000 ? '50K' : '100K'}
                  </button>
                )
              })}
            </div>

            <input
              required
              min="1"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Masukkan nominal"
              className="mt-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            />
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Pesan Donasi
            </span>
            <textarea
              required
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tulis pesan dukungan dengan keyword UMKM, produk, beli, atau promo."
              className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            />
          </label>

          <button
            type="submit"
            disabled={submissionState === 'submitting'}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {submissionState === 'submitting'
              ? 'Mengirim dukungan...'
              : 'Kirim Dukungan UMKM'}
          </button>
        </form>

        {errorMessage ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {feedback ? (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            <p className="font-medium text-gray-900">
              Dukungan terkirim ke {feedback.streamer_target}.
            </p>
            <p className="mt-2 text-gray-600">
              Keyword terdeteksi:{' '}
              <span className="font-medium text-gray-900">
                {feedback.detected_keywords.length > 0
                  ? feedback.detected_keywords.join(', ')
                  : 'tidak ada'}
              </span>
            </p>
            <p className="mt-2 text-gray-600">
              Status task:{' '}
              <span className="font-medium text-gray-900">
                {feedback.clip_task_created
                  ? 'Tugas berhasil dibuat untuk clipper.'
                  : 'Donasi tercatat tanpa task baru.'}
              </span>
            </p>
            {feedback.clip_task ? (
              <div className="mt-3 rounded-md bg-white px-3 py-2 text-xs text-gray-500">
                <p>
                  Nominal: <span className="font-medium text-gray-700">{currencyFormatter.format(feedback.amount)}</span>
                </p>
                <p className="mt-1 break-all font-mono">{feedback.clip_task.ip_license_token}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </section>
  )
}

export default LiveStreamView