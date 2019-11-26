import React, { useCallback, useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { Link, useParams } from 'react-router-dom'
import HTML5Backend from 'react-dnd-html5-backend'
import { items } from './definition'
import { setTableName as st, setRows as sc, addTableRow, delTableRow } from './updates'
import DnDTypes from './DnDTypes'
import Title from './Title'
import Loading from './Loading'
import { Cell } from './Cell'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import './Table.scss'

const CheckRedirect = check => {
  if (check === undefined) window.location.href = '/'
}

function Table(props) {
  const { projects, setProjects } = props
  const { projectId, tableId } = useParams()
  
  const project = projects.find(p => p.id === projectId)
  CheckRedirect(project)
  const table = projects.find(p => p.id === projectId).tables.find(t => t.id === tableId)
  CheckRedirect(table)

  if (table === null) {
    return (
      <div className="Project">
        <Title />
        <Loading />
      </div>
    )
  }

  const setTableName = event => {
    const newTableName = event.target.value
    st(projects, projectId, tableId, newTableName, setProjects)
  }

  const setRows = newRows => {
    sc(projects, projectId, tableId, newRows, setProjects)
  }

  const p = {
    table: table,
    rows: table.rows,
    setRows,
    projectId,
    tableId,
    ...props,
  }

  return (
    <div className="Table">
      <Title />
      <Link className="back" to={`/${projectId}`}>
        戻る
      </Link>
      <input className="Table-name" value={table.name} onChange={setTableName} />
      <table className="Table-content">
        <Header />
        <DndProvider backend={HTML5Backend}>
          <Rows {...p} />
        </DndProvider>
        <NewLineAdd {...p} />
      </table>
    </div>
  )
}

function Header(prop) {
  const noStyle = { backgroundColor: '#666', color: '#fff', width: '40px' }
  const style = { backgroundColor: '#666', color: '#fff' }
  return (
    <thead>
      <tr>
        <th style={noStyle}>No</th>
        {items.map(v => (
          <th key={v.id} style={style}>
            {v.name}
          </th>
        ))}
        <th className="del" style={{ backgroundColor: 'transparent', width: '40px' }} />
      </tr>
    </thead>
  )
}

function Rows(props) {
  const rows = props.rows

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = rows[dragIndex]
      const hoverRow = rows[hoverIndex]
      const newRows = rows.slice()
      newRows[hoverIndex] = dragRow
      newRows[dragIndex] = hoverRow
      props.setRows(newRows)
    },
    [props, rows]
  )

  return (
    <tbody>
      {rows.map((r, i) => (
        <Row key={r.id} rowid={r.id} rowNo={i} row={r} moveRow={moveRow} {...props} />
      ))}
    </tbody>
  )
}

function Row(props) {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: DnDTypes.ROW,
    hover(item, monitor) {
      if (!ref.current) return
      const dragIndex = item.rowNo
      const hoverIndex = props.rowNo
      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      props.moveRow(dragIndex, hoverIndex)
      item.rowNo = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    item: { type: DnDTypes.ROW, rowid: props.rowid, rowNo: props.rowNo },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })
  drag(drop(ref))

  const del = () => {
    const { projects, projectId, tableId, rowid, setProjects } = props
    delTableRow(projects, projectId, tableId, rowid, setProjects)
  }
  const r = props.row.data
  return (
    <tr ref={ref} style={{ backgroundColor: isDragging ? '#eee' : 'transparent' }}>
      <td style={{ backgroundColor: '#fff' }}>{props.rowNo + 1}</td>
      {items.map((item, i) => (
        <Cell
          key={item.id}
          rowid={props.rowid}
          itemid={item.id}
          type={item.type}
          content={r[item.id]}
          style={{ padding: '5px 4px', backgroundColor: '#fff', ...item.style }}
          {...props}
        />
      ))}
      <td className="del" onClick={del} style={{ backgroundColor: 'transparent', color: '#808080' }}>
        <FontAwesomeIcon icon={faTrash} />
      </td>
    </tr>
  )
}

function NewLineAdd(props) {
  const addRow = () => {
    const { projects, projectId, tableId, setProjects } = props
    addTableRow(projects, projectId, tableId, setProjects)
  }

  return (
    <tfoot className="App-addrow">
      <tr>
        <td colSpan={items.length + 1} onClick={addRow}>
          <FontAwesomeIcon className="button" icon={faPlusCircle} />
          行追加
        </td>
      </tr>
    </tfoot>
  )
}

export default Table
