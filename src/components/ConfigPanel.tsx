import { useWorkflowStore } from '../store/workflowStore'
import { AUTOMATIONS } from '../api/mockApi'
import type { NodeData, StartData, TaskData, ApprovalData, AutoData, EndData } from '../types'

export default function ConfigPanel() {
  const { nodes, selectedNodeId, setSelectedNodeId, updateNodeData } = useWorkflowStore()
  const node = nodes.find((n) => n.id === selectedNodeId)

  if (!node) return null

  const data = node.data
  const update = (fields: Partial<NodeData>) => updateNodeData(node.id, fields)

  return (
    <div style={{
      width: 240,
      borderLeft: '1px solid #e5e7eb',
      background: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>Configure Node</h3>
        <button onClick={() => setSelectedNodeId(null)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 16, color: '#888',
        }}>×</button>
      </div>

      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
        {data.type === 'start' && <StartForm data={data} update={update} />}
        {data.type === 'task' && <TaskForm data={data} update={update} />}
        {data.type === 'approval' && <ApprovalForm data={data} update={update} />}
        {data.type === 'auto' && <AutoForm data={data} update={update} />}
        {data.type === 'end' && <EndForm data={data} update={update} />}
      </div>
    </div>
  )
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <label style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {label}
    </label>
    {children}
  </div>
)

const inputStyle = {
  fontSize: 12, padding: '6px 8px',
  border: '1px solid #e5e7eb', borderRadius: 6,
  background: '#fff', color: '#111',
  fontFamily: 'inherit', outline: 'none', width: '100%',
}

function StartForm({ data, update }: { data: StartData; update: any }) {
  return (
    <>
      <Field label="Title">
        <input style={inputStyle} value={data.title} onChange={(e) => update({ title: e.target.value })} />
      </Field>
      <Field label="Metadata">
        {data.meta.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
            <input placeholder="key" style={{ ...inputStyle, flex: 1 }} value={m.key}
              onChange={(e) => { const meta = [...data.meta]; meta[i].key = e.target.value; update({ meta }) }} />
            <input placeholder="value" style={{ ...inputStyle, flex: 1 }} value={m.value}
              onChange={(e) => { const meta = [...data.meta]; meta[i].value = e.target.value; update({ meta }) }} />
          </div>
        ))}
        <button onClick={() => update({ meta: [...data.meta, { key: '', value: '' }] })}
          style={{ fontSize: 11, color: '#378ADD', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          + Add field
        </button>
      </Field>
    </>
  )
}

function TaskForm({ data, update }: { data: TaskData; update: any }) {
  return (
    <>
      <Field label="Title">
        <input style={inputStyle} value={data.title} onChange={(e) => update({ title: e.target.value })} />
      </Field>
      <Field label="Description">
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={data.description}
          onChange={(e) => update({ description: e.target.value })} />
      </Field>
      <Field label="Assignee">
        <input style={inputStyle} value={data.assignee} onChange={(e) => update({ assignee: e.target.value })} />
      </Field>
      <Field label="Due Date">
        <input type="date" style={inputStyle} value={data.dueDate} onChange={(e) => update({ dueDate: e.target.value })} />
      </Field>
    </>
  )
}

function ApprovalForm({ data, update }: { data: ApprovalData; update: any }) {
  return (
    <>
      <Field label="Title">
        <input style={inputStyle} value={data.title} onChange={(e) => update({ title: e.target.value })} />
      </Field>
      <Field label="Approver Role">
        <select style={inputStyle} value={data.approverRole} onChange={(e) => update({ approverRole: e.target.value })}>
          <option>Manager</option>
          <option>HRBP</option>
          <option>Director</option>
          <option>CEO</option>
        </select>
      </Field>
      <Field label="Auto Approve Threshold (days)">
        <input type="number" style={inputStyle} value={data.autoApproveThreshold}
          onChange={(e) => update({ autoApproveThreshold: Number(e.target.value) })} />
      </Field>
    </>
  )
}

function AutoForm({ data, update }: { data: AutoData; update: any }) {
  const automation = AUTOMATIONS.find((a) => a.id === data.actionId)
  return (
    <>
      <Field label="Title">
        <input style={inputStyle} value={data.title} onChange={(e) => update({ title: e.target.value })} />
      </Field>
      <Field label="Action">
        <select style={inputStyle} value={data.actionId} onChange={(e) => update({ actionId: e.target.value, params: {} })}>
          {AUTOMATIONS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
      </Field>
      {automation?.params.map((p) => (
        <Field key={p} label={p}>
          <input style={inputStyle} value={data.params[p] || ''}
            onChange={(e) => update({ params: { ...data.params, [p]: e.target.value } })} />
        </Field>
      ))}
    </>
  )
}

function EndForm({ data, update }: { data: EndData; update: any }) {
  return (
    <>
      <Field label="End Message">
        <input style={inputStyle} value={data.endMessage} onChange={(e) => update({ endMessage: e.target.value })} />
      </Field>
      <Field label="Show Summary">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div onClick={() => update({ showSummary: !data.showSummary })} style={{
            width: 36, height: 20, borderRadius: 10,
            background: data.showSummary ? '#378ADD' : '#ddd',
            cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 3,
              left: data.showSummary ? 18 : 3,
              transition: 'left 0.2s',
            }} />
          </div>
          <span style={{ fontSize: 12, color: '#555' }}>{data.showSummary ? 'On' : 'Off'}</span>
        </div>
      </Field>
    </>
  )
}