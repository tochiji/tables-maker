import shortid from 'shortid'
import { saveProjects, saveProject } from './save'

function save(pjs, index, setProjects) {
  setProjects(pjs)
  saveProjects(pjs)
  saveProject(pjs[index])
}

function ReturnPjAndIndex(projects, projectId) {
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
    rows: [],
  })
  save(pjs, pjIndex, setProjects)
}

function delTable(projects, projectId, tableId, setProjects) {
  const { pjs, pjIndex } = ReturnPjAndIndex(projects, projectId)
  pjs[pjIndex].tables = pjs[pjIndex].tables.filter(v => v.id !== tableId)
  save(pjs, pjIndex, setProjects)
}

function tmpFunctionForChangeDataStructure(projects, projectId, setProjects) {
  const { pjs, pjIndex } = ReturnPjAndIndex(projects, projectId)
  pjs[pjIndex].tables.forEach((v, i) => {
    if (pjs[pjIndex].tables[i].rows === undefined) {
      pjs[pjIndex].tables[i].rows = pjs[pjIndex].tables[i].columns
      save(pjs, pjIndex, setProjects)
    }
    if (pjs[pjIndex].tables[i].columns !== undefined) {
      delete pjs[pjIndex].tables[i].columns
      save(pjs, pjIndex, setProjects)
    }
    if (pjs[pjIndex].tables[i].row !== undefined) {
      delete pjs[pjIndex].tables[i].row
      save(pjs, pjIndex, setProjects)
    }
  })
}

function getTableIndex(pjs, pjIndex, tableId) {
  return pjs[pjIndex].tables.findIndex(e => e.id === tableId)
}

function setTableName(projects, projectId, tableId, tableName, setProjects) {
  const { pjs, pjIndex } = ReturnPjAndIndex(projects, projectId)
  const tableIndex = getTableIndex(pjs, pjIndex, tableId)
  pjs[pjIndex].tables[tableIndex].name = tableName
  save(pjs, pjIndex, setProjects)
}

function setLogicalTableName(projects, projectId, tableId, logicalTableName, setProjects) {
  const { pjs, pjIndex } = ReturnPjAndIndex(projects, projectId)
  const tableIndex = getTableIndex(pjs, pjIndex, tableId)
  pjs[pjIndex].tables[tableIndex].logicalName = logicalTableName
  save(pjs, pjIndex, setProjects)
}

function setRows(projects, projectId, tableId, newRows, setProjects) {
  const { pjs, pjIndex } = ReturnPjAndIndex(projects, projectId)
  const tableIndex = getTableIndex(pjs, pjIndex, tableId)
  pjs[pjIndex].tables[tableIndex].rows = newRows
  save(pjs, pjIndex, setProjects)
}

function addTableRow(projects, projectId, tableId, setProjects) {
  const { pjs, pjIndex } = ReturnPjAndIndex(projects, projectId)
  const tableIndex = getTableIndex(pjs, pjIndex, tableId)
  const newdata = { id: shortid.generate(), data: {} }
  pjs[pjIndex].tables[tableIndex].rows.push(newdata)
  save(pjs, pjIndex, setProjects)
}

function delTableRow(projects, projectId, tableId, rowid, setProjects) {
  const { pjs, pjIndex } = ReturnPjAndIndex(projects, projectId)
  const tableIndex = getTableIndex(pjs, pjIndex, tableId)
  pjs[pjIndex].tables[tableIndex].rows = pjs[pjIndex].tables[tableIndex].rows.filter(r => r.id !== rowid)
  save(pjs, pjIndex, setProjects)
}

export {
  changeProjectName,
  addTable,
  delTable,
  setTableName,
  setLogicalTableName,
  setRows,
  addTableRow,
  delTableRow,
  tmpFunctionForChangeDataStructure,
}
