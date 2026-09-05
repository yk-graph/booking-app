'use client'

import { useRouter } from 'next/navigation'
import { SubmitEvent, useState, useSyncExternalStore } from 'react'
import { toast } from 'sonner'

import StepHeader from '@/components/StepHeader'
import StepNav from '@/components/StepNav'
import TextField from '@/components/TextField'
import {
  type BookingDraft,
  getDraftSnapshot,
  getServerDraftSnapshot,
  saveDraft,
  subscribeDraft,
} from '@/lib/storage'

export default function Step2Page() {
  const router = useRouter()
  const draft = useSyncExternalStore(subscribeDraft, getDraftSnapshot, getServerDraftSnapshot)

  const [edits, setEdits] = useState<BookingDraft>({})
  const fullName = edits.full_name ?? draft.full_name ?? ''
  const email = edits.email ?? draft.email ?? ''
  const phone = edits.phone ?? draft.phone ?? ''

  const handleNext = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.dismiss()

    if (!fullName.trim()) {
      toast.error('Please enter your full name.')
      return
    }

    if (!email.trim()) {
      toast.error('Please enter your email address.')
      return
    }

    if (!phone.trim()) {
      toast.error('Please enter your phone number.')
      return
    }

    saveDraft({
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    })

    router.push('/step3')
  }

  return (
    <div className="max-w-xl mx-auto">
      <StepHeader
        step={2}
        title="Tell us about yourself"
        subtitle="Please provide your contact details so we can reach you about your service."
      />

      <form
        onSubmit={handleNext}
        className="space-y-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
      >
        <TextField
          label="Full Name"
          name="full_name"
          type="text"
          placeholder="e.g. John Doe"
          value={fullName}
          onChange={(e) => setEdits((prev) => ({ ...prev, full_name: e.target.value }))}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          placeholder="e.g. john@example.com"
          value={email}
          onChange={(e) => setEdits((prev) => ({ ...prev, email: e.target.value }))}
        />

        <TextField
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="e.g. 6045551234"
          value={phone}
          onChange={(e) => setEdits((prev) => ({ ...prev, phone: e.target.value }))}
        />

        <StepNav onBack={() => router.push('/step1')} />
      </form>
    </div>
  )
}
