export const AUTOMATIONS = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create Ticket', params: ['system', 'title'] },
]

export async function getAutomations() {
  await new Promise((r) => setTimeout(r, 300))
  return AUTOMATIONS
}

export async function simulateWorkflow(nodes: any[]) {
  await new Promise((r) => setTimeout(r, 500))

  const logs: { status: 'ok' | 'error' | 'warn'; message: string; time: string }[] = []

  if (nodes.length === 0) {
    return [{ status: 'error', message: 'No nodes in workflow', time: '0ms' }]
  }

  const startNode = nodes.find((n) => n.data.type === 'start')
  if (!startNode) {
    logs.push({ status: 'error', message: 'Missing Start node', time: '0ms' })
    return logs
  }

  const endNode = nodes.find((n) => n.data.type === 'end')
  if (!endNode) {
    logs.push({ status: 'warn', message: 'No End node found', time: '100ms' })
  }

  let delay = 0
  for (const node of nodes) {
    delay += 200
    const d = node.data
    if (d.type === 'start') {
      logs.push({ status: 'ok', message: `Workflow started: ${d.title}`, time: `${delay}ms` })
    } else if (d.type === 'task') {
      logs.push({ status: 'ok', message: `Task "${d.title}" assigned to ${d.assignee || 'Unassigned'}`, time: `${delay}ms` })
    } else if (d.type === 'approval') {
      logs.push({ status: 'ok', message: `Approval required from ${d.approverRole}`, time: `${delay}ms` })
    } else if (d.type === 'auto') {
      logs.push({ status: 'ok', message: `Running automation: ${d.actionId}`, time: `${delay}ms` })
    } else if (d.type === 'end') {
      logs.push({ status: 'ok', message: `Workflow complete: ${d.endMessage}`, time: `${delay}ms` })
    }
  }

  return logs
}