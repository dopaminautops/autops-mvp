import { useState } from 'react'
import './profile-settings.css'
import { appApi } from '../services/api'

const initialForm = {
  whatsapp_message: 'Hi, I have fever and cough since two days. Need doctor appointment.',
  age: 34,
  medical_history: 'mild asthma',
  preferred_date: 'Tomorrow',
}

export default function ClinicIntakeTriageAgentPage() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('Fill details and run agent workflow')

  const onChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const runAgent = async () => {
    try {
      setStatus('Processing WhatsApp → intent → symptoms → risk → booking...')
      const response = await appApi.clinicIntakeTriage({ ...form, age: Number(form.age) })
      setResult(response)
      setStatus('Agent completed workflow successfully')
    } catch (error) {
      setStatus(`Agent failed: ${error.message}`)
    }
  }

  return (
    <section className="page-card">
      <h2>Clinic Intake + Triage Agent</h2>
      <p className="helper-text">Workflow: WhatsApp msg → intent detect → ask symptoms → collect age/history → risk score → book doctor → send reminders.</p>

      <label className="field-label">
        WhatsApp message
        <textarea value={form.whatsapp_message} onChange={(e) => onChange('whatsapp_message', e.target.value)} rows={3} />
      </label>

      <label className="field-label">
        Age
        <input type="number" min="0" value={form.age} onChange={(e) => onChange('age', e.target.value)} />
      </label>

      <label className="field-label">
        Medical history
        <input value={form.medical_history} onChange={(e) => onChange('medical_history', e.target.value)} />
      </label>

      <label className="field-label">
        Preferred date
        <input value={form.preferred_date} onChange={(e) => onChange('preferred_date', e.target.value)} />
      </label>

      <button type="button" className="primary-btn" onClick={runAgent}>
        Run Clinic Intake Agent
      </button>
      <p className="helper-text">{status}</p>

      {result ? (
        <div className="template-card selected-template">
          <h3>Agent output</h3>
          <p className="helper-text">Intent: {result.intent}</p>
          <p className="helper-text">Symptoms: {result.symptoms?.join(', ')}</p>
          <p className="helper-text">Risk: {result.risk_level} ({result.risk_score})</p>
          <p className="helper-text">Doctor: {result.doctor_booking?.doctor_name}</p>
          <p className="helper-text">Appointment: {result.doctor_booking?.appointment_date}</p>
          <p className="helper-text">Reminder: {result.reminder}</p>
        </div>
      ) : null}
    </section>
  )
}
