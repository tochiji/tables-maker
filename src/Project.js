import React from 'react'
import { useParams, Link } from 'react-router-dom'
import shortid from 'shortid'
import { saveProjects } from './save'
import Title from './Title'
import './Project.scss'

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
      columns: [],
    })
    setProjects(pjs)
    saveProjects(pjs)
  }

  return (
    <div className="Project">
      <Title />
      <div className="Project-content">
        <Link className="Project-title" to="/">
          {project.name}
        </Link>
        <div className="table-list">テーブル一覧</div>
        <ul>
          {project.tables.map(v => (
            <li key={v.id}>
              <Link to={`${projectId}/${v.id}`}>
                <span>{v.name}</span>
                <span>{v.columns.length}個のカラムがあります</span>
              </Link>
            </li>
          ))}
        </ul>
        <div>
          <form>
            新規テーブル名：
            <input id="new-table" autoComplete="off" />
            <button type="button" onClick={addNewTable}>
              プロジェクトを追加
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function find(projects, id) {
  return projects.find(p => p.id === id)
}

export default Project
