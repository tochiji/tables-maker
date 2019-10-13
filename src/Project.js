import React from 'react'
import { useParams, Link } from 'react-router-dom'
import shortid from 'shortid'
import { saveProjects } from './save'

const Project = props => {
  const { projects, setProjects } = props
  const { projectId } = useParams()
  const project = find(projects, projectId)

  const addNewTable = () => {
    const name = document.getElementById('new-table').value
    if (name === '') return
    const pjs = projects.slice()
    const index = pjs.findIndex(e => e.id === projectId)
    pjs[index].tables = pjs[index].tables || []
    pjs[index].tables.push({
      id: shortid.generate(),
      name: name,
      columns: []
    })
    setProjects(pjs)
    saveProjects(pjs)
  }

  return (
    <div className="Project">
      <div>{project.name}</div>
      <ul>
        {project.tables.map(v => (
          <li key={v.id}>
            <Link to={`${projectId}/${v.id}`}>{v.name}</Link>
          </li>
        ))}
      </ul>
      <div>
        <form>
          新規テーブル名：
          <input id="new-table" />
          <button type="button" onClick={addNewTable}>
            プロジェクトを追加
          </button>
        </form>
      </div>
    </div>
  )
}

function find(projects, id) {
  return projects.find(p => p.id === id)
}

export default Project
