import React from 'react'
import { Link } from 'react-router-dom'
import shortid from 'shortid'
import { saveProjects } from './save'
import './Home.scss'

const Home = props => {
  const projects = props.projects
  const setProjects = props.setProjects
  const addNewProject = () =>{
    const name = document.getElementById("new-project").value
    if(name === "") return
    const newpj = projects.slice()
    newpj.push({
      id: shortid.generate(),
      name: name,
      tables: []
    })
    setProjects(newpj)
    saveProjects(newpj)
  }
  return (
    <div className="Home">
      <div>ここがホーム画面です</div>
      <ul>
        {projects.map(v => (
          <li key={v.id}><Link to={v.id}>{v.name}</Link></li>
        ))}
      </ul>
      <div>
        <form>
          新規プロジェクト名：<input id="new-project" />
          <button type="button" onClick={addNewProject}>プロジェクトを追加</button>
        </form>
      </div>
      <div>
        <Link to="/table">テーブルへ</Link>
      </div>
    </div>
  )
}

export default Home
