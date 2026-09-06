import type { Booking } from './types'

export type BookingDraft = Partial<
  Pick<
    Booking,
    | 'city'
    | 'street_address'
    | 'lawn_size'
    | 'full_name'
    | 'email'
    | 'phone'
    | 'service_date'
    | 'time_slot'
  >
>

const STORAGE_KEY = 'trim_team_booking_draft'
const EMPTY: BookingDraft = {}
let cachedRaw: string | null = null
let cachedDraft: BookingDraft = EMPTY

export function getDraftSnapshot(): BookingDraft {
  if (typeof window === 'undefined') return EMPTY

  const raw = sessionStorage.getItem(STORAGE_KEY)

  if (raw !== cachedRaw) {
    cachedRaw = raw
    try {
      cachedDraft = raw ? JSON.parse(raw) : EMPTY
    } catch {
      cachedDraft = EMPTY
    }
  }

  return cachedDraft
}

export function getServerDraftSnapshot(): BookingDraft {
  return EMPTY
}

export function subscribeDraft(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

export function saveDraft(patch: BookingDraft): BookingDraft {
  if (typeof window === 'undefined') return patch

  const merged = { ...getDraftSnapshot(), ...patch }

  try {
    const raw = JSON.stringify(merged)
    sessionStorage.setItem(STORAGE_KEY, raw)
    cachedRaw = raw
    cachedDraft = merged
  } catch (e) {
    console.warn('saveDraft: failed to persist draft to sessionStorage', e)
  }

  return merged
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return

  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.warn('clearDraft: failed to remove draft from sessionStorage', e)
  }

  cachedRaw = null
  cachedDraft = EMPTY
}
