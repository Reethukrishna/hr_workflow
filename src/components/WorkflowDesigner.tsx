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
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <Sidebar />

      <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
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
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
          <Controls />
          <MiniMap />
        </ReactFlow>

        <div style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
          zIndex: 10,
        }}>
          <SimPanel />
          <button onClick={exportWorkflow} style={{
            padding: '8px 16px',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            Export JSON
          </button>
          <button onClick={clearAll} style={{
            padding: '8px 16px',
            background: '#fff',
            border: '1px solid #E24B4A',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            color: '#E24B4A',
            fontFamily: 'inherit',
          }}>
            Clear
          </button>
        </div>
      </div>

      <ConfigPanel />
    </div>
  )
}