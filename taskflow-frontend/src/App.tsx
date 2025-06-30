import React from 'react'
import TaskList from './components/TaskList'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <TaskList />
      </div>
    </ErrorBoundary>
  )
}

export default App 