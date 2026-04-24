# HR Workflow Designer

A visual drag-and-drop workflow builder for HR processes like onboarding, leave approval, and document verification. Built with React, TypeScript, and React Flow.

## Live Demo

[Click here to view the live app](https://hr-workflow-rust.vercel.app)

## Features

- Drag and drop nodes onto a canvas
- 5 node types: Start, Task, Approval, Automated, End
- Click any node to configure it in the side panel
- Connect nodes by dragging from the handle dots
- Run a step-by-step workflow simulation
- Export workflow as JSON
- Delete nodes using the Delete key
- Minimap for navigation

## How to Run

Clone the repo

    git clone https://github.com/Reethukrishna/hr_workflow.git

Go into the folder

    cd hr_workflow

Install dependencies

    npm install

Start the app

    npm run dev

Open in browser

    http://localhost:5173

## Node Types

| Node | Color | Purpose |
|------|-------|---------|
| Start | Green | Entry point of the workflow |
| Task | Blue | Human task e.g. collect documents |
| Approval | Orange | Manager or HR approval step |
| Automated | Pink | System action e.g. send email |
| End | Gray | Workflow completion |

## Architecture

    src/
      nodes/           - Custom React Flow node component
      components/
        Sidebar        - Draggable node palette
        ConfigPanel    - Node configuration forms
        SimPanel       - Simulation log panel
        WorkflowDesigner - Main canvas layout
      store/           - Zustand global state
      api/             - Mock API (automations + simulate)
      types/           - TypeScript interfaces

## Tech Stack

- React 18 + TypeScript
- React Flow for canvas and node management
- Zustand for global state management
- Vite as build tool

## Design Decisions

- Zustand over Redux — simpler API, less boilerplate for this scope
- React Flow — handles complex canvas logic like drag, connect, zoom out of the box
- Mock API layer — separated from UI so it can be swapped with a real backend later
- Per-node config forms — each node type has its own form making it easy to add new node types
- TypeScript throughout — strict types for all node data makes the system reliable and easy to extend

## What I Would Add With More Time

- Undo / Redo
- Workflow validation with visual error indicators on nodes
- Auto layout button
- Save and Load workflows from localStorage
- Node templates for common HR flows
- Real backend with database persistence
- Authentication for HR admins