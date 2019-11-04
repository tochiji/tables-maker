import React from 'react'
import { useParams, Link } from 'react-router-dom'
import shortid from 'shortid'
import { saveProjects, saveProject } from './save'
import Loading from './Loading'
import Title from './Title'
import './Project.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTable } from '@fortawesome/free-solid-svg-icons'

const Project = props => {
  const { projects, setProjects } = props
  const { projectId } = useParams()
  const project = find(projects, projectId)
  if (project === undefined) {
    return (
      <div className="Project">
        <Title />
        <Loading />
      </div>
    )
  }

  const addNewTable = e => {
    e.preventDefault()
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
    saveProject(pjs[index])
    document.getElementById('new-table').value = ''
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
                <span>
                  <FontAwesomeIcon className="table-icon" icon={faTable} />
                </span>
                <span>{v.name}</span>
                <span className="column-count">{v.columns.length}つのカラムがあります</span>
              </Link>
            </li>
          ))}
        </ul>
        <form onSubmit={addNewTable}>
          新規テーブル名
          <input id="new-table" autoComplete="off" />
          <button type="button" onClick={addNewTable}>
            テーブルを追加
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
