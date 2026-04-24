import { useCallback, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from 'reactflow'
import type { Node } from 'reactflow'
import { useWorkflowStore } from '../store/workflowStore'
import CustomNode from '../nodes/CustomNode'
import Sidebar from './Sidebar'
import ConfigPanel from './ConfigPanel'
import SimPanel from './SimPanel'
import type { NodeData, NodeType } from '../types'

const nodeTypes = { start: CustomNode, task: CustomNode, approval: CustomNode, auto: CustomNode, end: CustomNode }

let idCounter = 1
const getId = () => `node_${idCounter++}`

function getDefaultData(type: NodeType): NodeData {
  if (type === 'start') return { type, title: 'Workflow Start', meta: [] }
  if (type === 'task') return { type, title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] }
  if (type === 'approval') return { type, title: 'Approval Step', approverRole: 'Manager', autoApproveThreshold: 3 }
  if (type === 'auto') return { type, title: 'Auto Step', actionId: 'send_email', params: {} }
  return { type, title: 'End', endMessage: 'Workflow complete', showSummary: false }
}

export default function WorkflowDesigner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, setSelectedNodeId, clearAll } = useWorkflowStore()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null as any)

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('nodeType') as NodeType
    if (!type || !reactFlowInstance) return

    const bounds = reactFlowWrapper.current!.getBoundingClientRect()
    const position = reactFlowInstance.screenToFlowPosition({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    })

    const newNode: Node<NodeData> = {
      id: getId(),
      type,
      position,
      data: getDefaultData(type),
    }
    addNode(newNode)
  }, [reactFlowInstance, addNode])

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNodeId(node.id)
  }, [setSelectedNodeId])

  const exportWorkflow = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'workflow.json'
    a.click()
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', background: '#f9fafb' }}>
      <Sidebar />

      <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative', background: '#f9fafb' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          zIndex: 10,
        }}>
          <div>
            <h1 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>
              HR Workflow Designer
            </h1>
            <p style={{ fontSize: 11, color: '#888', margin: 0 }}>
              Drag nodes from sidebar · Connect · Configure · Simulate
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <SimPanel />
            <button onClick={exportWorkflow} style={{
              padding: '7px 14px',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              color: '#555',
            }}>
              Export JSON
            </button>
            <button onClick={clearAll} style={{
              padding: '7px 14px',
              background: '#fff',
              border: '1px solid #E24B4A',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              color: '#E24B4A',
              fontFamily: 'inherit',
            }}>
              Clear
            </button>
          </div>
        </div>

        <div style={{ position: 'absolute', top: 57, left: 0, right: 0, bottom: 0 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode="Delete"
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d1d5db" />
            <Controls style={{ bottom: 20, left: 20 }} />
            <MiniMap
              style={{ bottom: 20, right: 20 }}
              nodeColor={(n) => {
                const colors: Record<string, string> = {
                  start: '#1D9E75', task: '#378ADD',
                  approval: '#D85A30', auto: '#D4537E', end: '#888780'
                }
                return colors[n.type || ''] || '#888'
              }}
            />
          </ReactFlow>

          {nodes.length === 0 && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center', pointerEvents: 'none',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>+</div>
              <p style={{ fontSize: 14, color: '#aaa', fontWeight: 500 }}>
                Drag nodes from the sidebar to get started
              </p>
              <p style={{ fontSize: 12, color: '#ccc', marginTop: 4 }}>
                Build onboarding, leave approval, or any HR workflow
              </p>
            </div>
          )}
        </div>
      </div>

      <ConfigPanel />
    </div>
  )
}