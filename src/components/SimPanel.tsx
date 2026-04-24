import { useState } from 'react'
import { useWorkflowStore } from '../store/workflowStore'
import { simulateWorkflow } from '../api/mockApi'

type Log = { status: 'ok' | 'error' | 'warn'; message: string; time: string }

export default function SimPanel() {
  const { nodes, edges } = useWorkflowStore()
  const [logs, setLogs] = useState<Log[]>([])
  const [running, setRunning] = useState(false)
  const [open, setOpen] = useState(false)

  const run = async () => {
    setOpen(true)
    setRunning(true)
    setLogs([])
    const result = await simulateWorkflow(nodes, edges)
    setLogs(result as Log[])
    setRunning(false)
  }

  const iconColor = { ok: '#1D9E75', error: '#E24B4A', warn: '#BA7517' }
  const iconLabel = { ok: '✓', error: '✕', warn: '!' }

  return (
    <>
      <button onClick={run} style={{
        padding: '7px 14px',
        background: '#378ADD',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}>
        ▶ Run Simulation
      </button>

      {open && (
        <div style={{
          position: 'fixed',
          top: 70,
          right: 20,
          width: 320,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          zIndex: 99999,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 400,
        }}>
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0 }}>
              Simulation Log
            </h3>
            <button onClick={() => setOpen(false)} style={{
              background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 18, color: '#888',
              lineHeight: 1,
            }}>×</button>
          </div>

          <div style={{
            padding: '10px 14px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            {running && (
              <p style={{ fontSize: 12, color: '#888' }}>Running simulation...</p>
            )}
            {logs.map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: iconColor[log.status] + '22',
                  color: iconColor[log.status],
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                  flexShrink: 0, marginTop: 1,
                }}>
                  {iconLabel[log.status]}
                </div>
                <div>
                  <p style={{ fontSize: 12, color: '#111', lineHeight: 1.4, margin: 0 }}>
                    {log.message}
                  </p>
                  <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}