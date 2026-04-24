export type NodeType = 'start' | 'task' | 'approval' | 'auto' | 'end'

export interface StartData {
  type: 'start'
  title: string
  meta: { key: string; value: string }[]
}

export interface TaskData {
  type: 'task'
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: { key: string; value: string }[]
}

export interface ApprovalData {
  type: 'approval'
  title: string
  approverRole: string
  autoApproveThreshold: number
}

export interface AutoData {
  type: 'auto'
  title: string
  actionId: string
  params: Record<string, string>
}

export interface EndData {
  type: 'end'
  title: string
  endMessage: string
  showSummary: boolean
}

export type NodeData = StartData | TaskData | ApprovalData | AutoData | EndData

export interface WorkflowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: NodeData
}