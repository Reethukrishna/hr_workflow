import { ReactFlowProvider } from 'reactflow'
import WorkflowDesigner from './components/WorkflowDesigner'
import 'reactflow/dist/style.css'
import './index.css'

function App() {
  return (
    <ReactFlowProvider>
      <WorkflowDesigner />
    </ReactFlowProvider>
  )
}

export default App