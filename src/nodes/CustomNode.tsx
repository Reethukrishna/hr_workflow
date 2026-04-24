import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { NodeData } from '../types'

const NODE_COLORS: Record<string, string> = {
  start: '#1D9E75',
  task: '#378ADD',
  approval: '#D85A30',
  auto: '#D4537E',
  end: '#888780',
}

const NODE_ICONS: Record<string, string> = {
  start: '▶',
  task: '☑',
  approval: '✓',
  auto: '⚡',
  end: '■',
}

export default function CustomNode({ data, selected }: NodeProps<NodeData>) {
  const color = NODE_COLORS[data.type]
  const icon = NODE_ICONS[data.type]

  const title = data.type === 'end' ? data.endMessage : data.title
  const subtitle =
    data.type === 'task' ? `Assignee: ${data.assignee || 'Unassigned'}` :
    data.type === 'approval' ? `Role: ${data.approverRole}` :
    data.type === 'auto' ? `Action: ${data.actionId}` :
    data.type === 'start' ? 'Entry point' :
    'Completion'

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? color : '#e5e7eb'}`,
      borderRadius: 12,
      minWidth: 180,
      maxWidth: 220,
      boxShadow: selected ? `0 0 0 3px ${color}33` : '0 2px 8px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      transition: 'all 0.15s',
    }}>
      {data.type !== 'start' && (
        <Handle type="target" position={Position.Left} style={{
          background: color, width: 10, height: 10, border: '2px solid #fff'
        }} />
      )}

      <div style={{
        background: color + '15',
        borderBottom: `1px solid ${color}33`,
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, color: '#fff', flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{
          fontSize: 11, fontWeight: 700,
          color: color, letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {data.type}
        </div>
      </div>

      <div style={{ padding: '10px 12px' }}>
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: '#111', marginBottom: 3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 11, color: '#888',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {subtitle}
        </div>
      </div>

      {data.type !== 'end' && (
        <Handle type="source" position={Position.Right} style={{
          background: color, width: 10, height: 10, border: '2px solid #fff'
        }} />
      )}
    </div>
  )
}