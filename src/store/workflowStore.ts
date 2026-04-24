import { create } from 'zustand'
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow'
import type { Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow'
import type { NodeData } from '../types'

interface WorkflowStore {
  nodes: Node<NodeData>[]
  edges: Edge[]
  selectedNodeId: string | null
  addNode: (node: Node<NodeData>) => void
  updateNodeData: (id: string, data: Partial<NodeData>) => void
  setSelectedNodeId: (id: string | null) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  clearAll: () => void
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node] })),

  updateNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

  onConnect: (connection) =>
    set((state) => ({ edges: addEdge(connection, state.edges) })),

  clearAll: () => set({ nodes: [], edges: [], selectedNodeId: null }),
}))
