import React, { useState , useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { loadProjects } from './save'
import Home from './Home'
import Project from './Project'
import Table from './Table'
import NotFound from './404'

const App = () => {
  const [projects, setProjects] = useState([])
  useEffect(() => {
    async function fetchData() {
      const projects = await loadProjects()
      setProjects(projects)
    }
    fetchData();
  },[])
  const state = {
    projects: projects,
    setProjects: setProjects
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
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default App
