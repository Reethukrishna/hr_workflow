import { DragEvent } from 'react'
import type { NodeType } from '../types'

const NODE_TYPES: { type: NodeType; label: string; color: string; desc: string }[] = [
  { type: 'start', label: 'Start', color: '#1D9E75', desc: 'Workflow entry point' },
  { type: 'task', label: 'Task', color: '#378ADD', desc: 'Human task step' },
  { type: 'approval', label: 'Approval', color: '#D85A30', desc: 'Manager approval' },
  { type: 'auto', label: 'Automated', color: '#D4537E', desc: 'System action' },
  { type: 'end', label: 'End', color: '#888780', desc: 'Workflow complete' },
]

export default function Sidebar() {
  const onDragStart = (e: DragEvent, type: NodeType) => {
    e.dataTransfer.setData('nodeType', type)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div style={{
      width: 200,
      background: '#fafafa',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 12px',
      gap: 8,
    }}>
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>HR Workflow</h2>
        <p style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Drag nodes to canvas</p>
      </div>

      {NODE_TYPES.map((n) => (
        <div
          key={n.type}
          draggable
          onDragStart={(e) => onDragStart(e, n.type)}
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: `1px solid ${n.color}33`,
            background: n.color + '11',
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{
            width: 10, height: 10,
            borderRadius: '50%',
            background: n.color,
            flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: n.color }}>{n.label}</div>
            <div style={{ fontSize: 10, color: '#888' }}>{n.desc}</div>
          </div>
        </div>
      ))}

      <div style={{
        marginTop: 'auto',
        padding: '10px',
        background: '#f0f0f0',
        borderRadius: 8,
        fontSize: 11,
        color: '#888',
        lineHeight: 1.5,
      }}>
        💡 Click a node to configure it. Connect nodes by dragging from the handle.
      </div>
    </div>
  )
}