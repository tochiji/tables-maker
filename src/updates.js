import shortid from 'shortid'

import { saveProjects, saveProject } from './save'

function save(pjs, index, setProjects) {
  setProjects(pjs)
  saveProjects(pjs)
  saveProject(pjs[index])
}

function changeProjectName(projects, projectId, projectName, setProjects) {
  const pjs = projects.slice()
  const index = pjs.findIndex(e => e.id === projectId)
  pjs[index].name = projectName
  save(pjs, index, setProjects)
}

function addTable(projects, projectId, tableName, setProjects) {
  const pjs = projects.slice()
  const index = pjs.findIndex(e => e.id === projectId)
  pjs[index].tables = pjs[index].tables || []
  pjs[index].tables.push({
    id: shortid.generate(),
    name: tableName,
    columns: [],
  })
  save(pjs, index, setProjects)
}

function delTable(projects, projectId, tableId, setProjects) {
  const pjs = projects.slice()
  const index = pjs.findIndex(e => e.id === projectId)
  pjs[index].tables = pjs[index].tables.filter(v => v.id !== tableId)
  save(pjs, index, setProjects)
}

export { changeProjectName, addTable, delTable }
