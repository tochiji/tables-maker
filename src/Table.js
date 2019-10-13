import React, { useCallback, useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { Link, useParams } from 'react-router-dom'
import HTML5Backend from 'react-dnd-html5-backend'
import shortid from 'shortid'
import { items } from './definition'
import { save, saveProjects } from './save'
import DnDTypes from './DnDTypes'
import { CellBool, CellTypeSelect, CellText } from './Cells'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import './Table.scss'

function find(projects, projectId, tableId) {
  return projects.find(p => p.id === projectId).tables.find(t => t.id === tableId)
}

function Table(props) {
  const { projects, setProjects } = props
  const { projectId, tableId } = useParams()
  const table = find(projects, projectId, tableId)

  // setColumnsにするべきである！
  const setTable = (newTable) => {
    const pjs = projects.slice()
    const pjIndex = pjs.findIndex(e => e.id === projectId)
    const tableIndex = pjs[pjIndex].findIndex(e => e.id === tableId)
    pjs[pjIndex].tables[tableIndex] = newTable
    setProjects(pjs)
    saveProjects(pjs)
  }

  const p = {
    table:table,
    columns: table.columns,
    setTable:setTable
  }

  return (
    <div className="Table">
      <DndProvider backend={HTML5Backend}>
        <div className="Table-title">
          <Link style={{ textDecoration: 'none' }} to="/">
            テーブル設計サイト
          </Link>
        </div>
        <table className="Table-content">
          <Header />
          {/* <Rows {...p} />
          <NewLineAdd {...p} /> */}
        </table>
        <Info columns={table.columns} />
      </DndProvider>
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

// function Rows(prop) {
//   const table = prop.table

//   const moveRow = useCallback(
//     (dragIndex, hoverIndex) => {
//       const dragRow = table[dragIndex]
//       const hoverRow = table[hoverIndex]
//       const newTable = table.slice()
//       newTable[hoverIndex] = dragRow
//       newTable[dragIndex] = hoverRow
//       prop.setTable(newTable)
//       save(newTable)
//     },
//     [prop, table]
//   )

//   return (
//     <tbody>
//       {prop.table.map((r, i) => (
//         <Row key={r.id} rowid={r.id} rowNo={i} row={r} moveRow={moveRow} {...prop} />
//       ))}
//     </tbody>
//   )
// }

// function Row(prop) {
//   const ref = useRef(null)
//   const [, drop] = useDrop({
//     accept: DnDTypes.ROW,
//     hover(item, monitor) {
//       if (!ref.current) return
//       const dragIndex = item.rowNo
//       const hoverIndex = prop.rowNo
//       if (dragIndex === hoverIndex) return

//       const hoverBoundingRect = ref.current.getBoundingClientRect()
//       const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
//       const clientOffset = monitor.getClientOffset()
//       const hoverClientY = clientOffset.y - hoverBoundingRect.top

//       if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
//       if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

//       prop.moveRow(dragIndex, hoverIndex)
//       item.rowNo = hoverIndex
//     },
//   })
//   const [{ isDragging }, drag] = useDrag({
//     item: { type: DnDTypes.ROW, rowid: prop.rowid, rowNo: prop.rowNo },
//     collect: monitor => ({
//       isDragging: monitor.isDragging(),
//     }),
//   })
//   drag(drop(ref))

//   const del = () => {
//     const table = prop.table.slice()
//     const newtable = table.filter(r => {
//       return r.id !== prop.rowid
//     })
//     prop.setTable(newtable)
//   }
//   const r = prop.row.data
//   return (
//     <tr ref={ref} style={{ backgroundColor: isDragging ? '#eee' : '#fff' }}>
//       <td>{prop.rowNo + 1}</td>
//       {items.map((item, i) => (
//         <Cell key={item.id} rowid={prop.rowid} itemid={item.id} type={item.type} content={r[item.id]} {...prop} />
//       ))}
//       <td className="del" onClick={del} style={{ visibility: isDragging ? 'hidden' : 'visible', color: '#808080' }}>
//         <FontAwesomeIcon icon={faTrash} />
//       </td>
//     </tr>
//   )
// }

// function Cell(prop) {
//   if (prop.type === 'bool') {
//     return <CellBool {...prop} />
//   } else if (prop.type === 'type-select') {
//     return <CellTypeSelect {...prop} />
//   } else {
//     return <CellText {...prop} />
//   }
// }

// function NewLineAdd(prop) {
//   const addRow = () => {
//     const r = prop.table.slice()
//     r.push({ id: shortid.generate(), data: {} })
//     prop.setTable(r)
//     console.log(r)
//     save(r)
//   }

//   return (
//     <tfoot className="App-addrow">
//       <tr>
//         <td colSpan={items.length + 1} onClick={addRow}>
//           ここをクリックしてね
//         </td>
//       </tr>
//     </tfoot>
//   )
// }

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
