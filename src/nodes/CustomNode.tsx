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

const NODE_LABELS: Record<string, string> = {
  start: 'START',
  task: 'TASK',
  approval: 'APPROVAL',
  auto: 'AUTOMATED',
  end: 'END',
}

export default function CustomNode({ data, selected }: NodeProps<NodeData>) {
  const color = NODE_COLORS[data.type]
  const label = NODE_LABELS[data.type]

  const title =
    data.type === 'end'
      ? data.endMessage
      : data.title

  return (
    <div
      style={{
        background: selected ? color : color + '22',
        border: `${selected ? 2 : 1}px solid ${color}`,
        borderRadius: 10,
        padding: '8px 16px',
        minWidth: 140,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {data.type !== 'start' && (
        <Handle type="target" position={Position.Left} style={{ background: color }} />
      )}

      <div style={{
        fontSize: 10,
        fontWeight: 600,
        color: selected ? '#fff' : color,
        letterSpacing: '0.06em',
        marginBottom: 2,
      }}>
        {label}
      </div>

      <div style={{
        fontSize: 12,
        color: selected ? '#ffffffcc' : '#444',
        maxWidth: 120,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {title}
      </div>

      {data.type !== 'end' && (
        <Handle type="source" position={Position.Right} style={{ background: color }} />
      )}
    </div>
  )
}