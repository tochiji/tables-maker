import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { load, loadProjects } from './save'
import Home from './Home'
import Project from './Project'
import Table from './Table'

const App = () => {
  const saved = load() || []
  const savedProjects = loadProjects() || []
  const [projects, setProjects] = useState(savedProjects)
  const [table, setTable] = useState(saved)
  const state = {
    projects: projects,
    setProjects: setProjects,
    table: table,
    setTable: setTable,
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home {...state} />
        </Route>
        <Route path="/:projectId/:tableId">
          <Table {...state} />
        </Route>
        <Route path="/:projectId">
          <Project {...state} />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
