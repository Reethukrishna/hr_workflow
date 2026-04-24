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
        padding: '8px 16px',
        background: '#378ADD',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}>
        ▶ Run Simulation
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          bottom: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 360,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          zIndex: 100,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 340,
        }}>
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>
              Simulation Log
            </h3>
            <button onClick={() => setOpen(false)} style={{
              background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 16, color: '#888',
            }}>×</button>
          </div>

          <div style={{ padding: '10px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {running && (
              <p style={{ fontSize: 12, color: '#888' }}>Running simulation...</p>
            )}
            {logs.map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: iconColor[log.status] + '22',
                  color: iconColor[log.status],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1,
                }}>
                  {iconLabel[log.status]}
                </div>
                <div>
                  <p style={{ fontSize: 12, color: '#111', lineHeight: 1.4 }}>{log.message}</p>
                  <p style={{ fontSize: 11, color: '#aaa' }}>{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}