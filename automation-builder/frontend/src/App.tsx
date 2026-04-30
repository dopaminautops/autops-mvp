import { FormEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ReactFlow, Background } from 'reactflow'
import 'reactflow/dist/style.css'
import { api } from './lib/api'
import { useChatStore } from './store/chat'

export default function App() {
  const [text, setText] = useState('')
  const [preview, setPreview] = useState<any>({ nodes: [], edges: [] })
  const { messages, add, sessionId, setSession } = useChatStore()

  const mutation = useMutation({
    mutationFn: async (message: string) => (await api.post('/chat/parse', { message, session_id: sessionId })).data,
    onSuccess: (data) => {
      setSession(data.session_id)
      add({ role: 'assistant', content: data.reply })
      setPreview(data.workflow_preview)
    },
  })

  const onSend = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    add({ role: 'user', content: text })
    mutation.mutate(text)
    setText('')
  }

  return (
    <div className="layout">
      <section className="chat">
        <h2>NLP Automation Builder</h2>
        <div className="messages">{messages.map((m, i) => <p key={i}><b>{m.role}:</b> {m.content}</p>)}</div>
        <form onSubmit={onSend}><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Describe automation..." /><button>Send</button></form>
      </section>
      <section className="preview">
        <h3>Workflow Preview</h3>
        <div className="graph"><ReactFlow nodes={preview?.nodes || []} edges={preview?.edges || []} fitView><Background /></ReactFlow></div>
      </section>
    </div>
  )
}
