import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { changeProjectName, addTable, delTable, tmpFunctionForChangeDataStructure } from './updates'
import Title from './Title'
import './Project.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faTable, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

const CheckRedirect = (project) => {
  if (project === undefined) window.location.href = "/"
}

const Project = props => {
  const { projects, setProjects } = props
  const { projectId } = useParams()
  const project = projects.find(p => p.id === projectId)
  CheckRedirect(project)
  tmpFunctionForChangeDataStructure(projects, projectId, setProjects)

  return (
    <div className="Project">
      <Title />
      <div className="Project-content">
        <Link className="Project-title" to="/">
          {project.name}
        </Link>
        <input
          className="Project-name"
          value={project.name}
          onChange={e => changeProjectName(projects, projectId, e.target.value, setProjects)}
        />
        <TableList project={project} projectId={projectId} {...props} />
        <NewTableInput projectId={projectId} {...props} />
        <ErDiagram project={project} projectId={projectId} {...props} />
      </div>
    </div>
  )
}

const TableList = props => {
  const { projects, project, projectId, setProjects } = props
  const [modal, setModal] = useState(false)

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
              <span className="column-count">{v.rows.length}つのカラムがあります</span>
            </Link>
            <div className="del" onClick={() => setModal(v.id)} modalopen={(modal === v.id).toString()}>
              <FontAwesomeIcon icon={faTrash} />
            </div>
            <div className="delcheck" modalopen={(modal === v.id).toString()}>
              <div className="confirm-del" onClick={() => delTable(projects, projectId, v.id, setProjects)}>
                削除
              </div>
              <div className="cancel" onClick={() => setModal(false)}>
                削除しない
              </div>
            </div>
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
    addTable(projects, projectId, name, setProjects)
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
    if (word === undefined || word == null) return ''
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
          const tableXwidth = 200
          const textHeight = 24

          return (
            <g key={v.id}>
              <text x={21 + tableXwidth * i} y={32}>
                {v.name}
              </text>
              <rect
                x={20 + tableXwidth * i}
                y={40}
                rx="3"
                ry="3"
                width="160"
                height={(v.rows.length + 1) * textHeight}
                strokeWidth="1"
                stroke="#000"
                fill="#fff"
                draggable="true"
              ></rect>
              {v.rows.map((c, i2) => (
                <text className="columnName" x={30 + tableXwidth * i} y={66 + i2 * textHeight} key={c.id}>
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

export default Project
