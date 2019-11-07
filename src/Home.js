import React from 'react'
import { Link } from 'react-router-dom'
import shortid from 'shortid'
import { saveProjects, saveProject } from './save'
import Title from './Title'
import './Home.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

const Home = props => {
  const projects = props.projects
  const setProjects = props.setProjects
  const addNewProject = e => {
    e.preventDefault()
    const name = document.getElementById('new-project').value
    if (name === '') return
    const pjs = projects.slice()
    const newpj = {
      id: shortid.generate(),
      name: name,
      tables: [],
    }
    pjs.unshift(newpj)
    setProjects(pjs)
    saveProjects(pjs)
    saveProject(newpj)
    document.getElementById('new-project').value = ''
  }
  return (
    <div className="Home">
      <Title />
      <div className="Home-content">
        <ul>
          {projects.map(v => (
            <li key={v.id}>
              <Link to={v.id}>
                <div>{v.name}</div>
                <div className="table-count">{v.tables.length}個のテーブル</div>
              </Link>
            </li>
          ))}
          <li className="add">
            <form onSubmit={addNewProject}>
              <div>新規プロジェクト名</div>
              <input id="new-project" name={shortid.generate()} />
              <div className="button-container">
                <FontAwesomeIcon className="button" icon={faPlusCircle} onClick={addNewProject} />
              </div>
            </form>
          </li>
          {projects.length % 3 === 0 || projects.length <= 2 ? null : (
            <>
              <li className="space" />
              <li className="space" />
            </>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Home
