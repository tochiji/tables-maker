import shortid from 'shortid'
import { saveProjects, saveProject } from './save'

function save(pjs, index, setProjects) {
  setProjects(pjs)
  saveProjects(pjs)
  saveProject(pjs[index])
}

function ReturnPjAndIndex(projects, projectId){
    const pjs = projects.slice()
    const pjIndex = pjs.findIndex(e => e.id === projectId)
    return { pjs, pjIndex }
}

function changeProjectName(projects, projectId, projectName, setProjects) {
  const { pjs, pjIndex } = ReturnPjAndIndex(projects, projectId)
  pjs[pjIndex].name = projectName
  save(pjs, pjIndex, setProjects)
}

function addTable(projects, projectId, tableName, setProjects) {
  const { pjs, pjIndex } = ReturnPjAndIndex(projects, projectId)
  pjs[pjIndex].tables = pjs[pjIndex].tables || []
  pjs[pjIndex].tables.push({
    id: shortid.generate(),
    name: tableName,
    columns: [],
  })
  save(pjs, pjIndex, setProjects)
}

function delTable(projects, projectId, tableId, setProjects) {
  const { pjs, pjIndex } = ReturnPjAndIndex(projects, projectId)
  pjs[pjIndex].tables = pjs[pjIndex].tables.filter(v => v.id !== tableId)
  save(pjs, pjIndex, setProjects)
}

function setTableName(projects, projectId, tableId, tableName, setProjects) {
  const { pjs, pjIndex } = ReturnPjAndIndex(projects, projectId)
  const tableIndex = pjs[pjIndex].tables.findIndex(e => e.id === tableId)
  pjs[pjIndex].tables[tableIndex].name = tableName
  save(pjs, pjIndex, setProjects)
}

function setLogicalTableName(projects, projectId, tableId, logicalTableName, setProjects) {
  const { pjs, pjIndex } = ReturnPjAndIndex(projects, projectId)
  const tableIndex = pjs[pjIndex].tables.findIndex(e => e.id === tableId)
  pjs[pjIndex].tables[tableIndex].logicalName = logicalTableName
  save(pjs, pjIndex, setProjects)
}

function setColumns(projects, projectId, tableId, newColumns, setProjects) {
  const { pjs, pjIndex } = ReturnPjAndIndex(projects, projectId)
  const tableIndex = pjs[pjIndex].tables.findIndex(e => e.id === tableId)
  pjs[pjIndex].tables[tableIndex].columns = newColumns
  save(pjs, pjIndex, setProjects)
}

export { changeProjectName, addTable, delTable, setTableName, setLogicalTableName, setColumns }
