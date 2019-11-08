import React from 'react'
import { useParams, Link } from 'react-router-dom'
import shortid from 'shortid'
import { saveProjects, saveProject } from './save'
import Loading from './Loading'
import Title from './Title'
import './Project.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTable, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

const TableList = props => {
  const { project, projectId } = props

  return (
    <div className="table-list">
      <div className="table-list-title">テーブル一覧</div>
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
    </div>
  )
}

const NewTableInput = props => {
  const { projects, projectId, setProjects } = props

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
    <div className="newtable-input">
      <div>新規テーブル名</div>
      <form onSubmit={addNewTable}>
        <input id="new-table" autoComplete="off" />
        <FontAwesomeIcon className="button" icon={faPlusCircle} onClick={addNewTable} />
      </form>
    </div>
  )
}

const ErDiagram = props => {
  const { project, projects, projectId, setProjects } = props
  const substr = word => {
    if(word === undefined || word == null) return "";
    if (word.length >= 11) {
      return word.substr(0, 10) + '...'
    }
    return word
  }

  return (
    <div className="er-diagram">
      <div className="er-diagram-title">ER図</div>
      <svg width="1300px" height="800px" viewBox="0,0,1300,800">
        {project.tables.map((v, i) => {
          return (
            <g key={v.id}>
              <text x={21 + 250 * i} y={32}>
                {v.name}
              </text>
              <rect
                x={20 + 250 * i}
                y={40}
                rx="3"
                ry="3"
                width="160"
                height={(v.columns.length + 1) * 30}
                strokeWidth="1"
                stroke="#000"
                fill="#fff"
                draggable="true"
              ></rect>
              {v.columns.map((c, i2) => (
                <text className="columnName" x={30 + 250 * i} y={65 + i2 * 24} key={c.id}>
                  {substr(c.data.name)}
                </text>
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

const Project = props => {
  const { projects } = props
  const { projectId } = useParams()
  const project = find(projects, projectId)

  if (project === undefined) {
    return (
      <div className="Project">
        <Title />
        <Loading />
      </div>
    )
  } else {
    return (
      <div className="Project">
        <Title />
        <div className="Project-content">
          <Link className="Project-title" to="/">
            {project.name}
          </Link>
          <TableList project={project} projectId={projectId} />
          <NewTableInput projectId={projectId} {...props} />
          <ErDiagram project={project} projectId={projectId} {...props} />
        </div>
      </div>
    )
  }
}

function find(projects, id) {
  return projects.find(p => p.id === id)
}

export default Project
