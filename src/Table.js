import React, { useCallback, useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { Link, useParams } from 'react-router-dom'
import HTML5Backend from 'react-dnd-html5-backend'
import shortid from 'shortid'
import { items } from './definition'
import { saveProjects } from './save'
import DnDTypes from './DnDTypes'
import Title from './Title'
import { CellBool, CellTypeSelect, CellText, CellTextArea } from './Cells.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash ,faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import './Table.scss'

function find(projects, projectId, tableId) {
  return projects.find(p => p.id === projectId).tables.find(t => t.id === tableId)
}

function Table(props) {
  const { projects, setProjects } = props
  const { projectId, tableId } = useParams()
  const table = find(projects, projectId, tableId)

  const setColumns = newColumns => {
    const pjs = projects.slice()
    const pjIndex = pjs.findIndex(e => e.id === projectId)
    const tableIndex = pjs[pjIndex].tables.findIndex(e => e.id === tableId)
    pjs[pjIndex].tables[tableIndex].columns = newColumns
    setProjects(pjs)
    saveProjects(pjs)
  }

  const setTableName = event => {
    const pjs = projects.slice()
    const pjIndex = pjs.findIndex(e => e.id === projectId)
    const tableIndex = pjs[pjIndex].tables.findIndex(e => e.id === tableId)
    pjs[pjIndex].tables[tableIndex].name = event.target.value
    setProjects(pjs)
    saveProjects(pjs)
  }

  const p = {
    table: table,
    columns: table.columns,
    setColumns: setColumns,
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
      <Info columns={table.columns} />
    </div>
  )
}

function Header(prop) {
  const style = { backgroundColor: '#666', color: '#fff' }
  return (
    <thead>
      <tr>
        <th style={style}>No</th>
        {items.map(v => (
          <th key={v.id} style={style}>
            {v.name}
          </th>
        ))}
        <th className="del" style={{ backgroundColor: 'transparent' }} />
      </tr>
    </thead>
  )
}

function Rows(props) {
  const columns = props.columns

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = columns[dragIndex]
      const hoverRow = columns[hoverIndex]
      const newColumns = columns.slice()
      newColumns[hoverIndex] = dragRow
      newColumns[dragIndex] = hoverRow
      props.setColumns(newColumns)
    },
    [props, columns]
  )

  return (
    <tbody>
      {columns.map((r, i) => (
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
    const columns = props.columns.slice()
    const newColumns = columns.filter(r => {
      return r.id !== props.rowid
    })
    props.setColumns(newColumns)
  }
  const r = props.row.data
  return (
    <tr ref={ref} style={{ backgroundColor: isDragging ? '#eee' : '#fff' }}>
      <td>{props.rowNo + 1}</td>
      {items.map((item, i) => (
        <Cell
          key={item.id}
          rowid={props.rowid}
          itemid={item.id}
          type={item.type}
          content={r[item.id]}
          style={item.style}
          {...props}
        />
      ))}
      <td className="del" onClick={del} style={{ visibility: isDragging ? 'hidden' : 'visible', color: '#808080' }}>
        <FontAwesomeIcon icon={faTrash} />
      </td>
    </tr>
  )
}

function Cell(props) {
  if (props.type === 'bool') {
    return <CellBool {...props} />
  } else if (props.type === 'type-select') {
    return <CellTypeSelect {...props} />
  } else if (props.type === 'textarea') {
    return <CellTextArea {...props} />
  } else {
    return <CellText {...props} />
  }
}

function NewLineAdd(prop) {
  const addRow = () => {
    const columns = prop.columns.slice()
    columns.push({ id: shortid.generate(), data: {} })
    prop.setColumns(columns)
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

function Info(prop) {
  const PKcount = prop.columns.filter(v => {
    return v.data.ispk
  }).length
  return (
    <div style={{ marginTop: '50px' }}>
      <div>{prop.columns.length + '行あるよ'}</div>
      <div>{'PKは' + PKcount + '個あるよ'}</div>
    </div>
  )
}

export default Table
