const items = [
  // { id: 'name', name: 'カラム名', type: 'text' },
  { id: 'logicName', name: '論理名', type: 'alphabet' },
  { id: 'type', name: '型', type: 'type-select' },
  { id: 'supplementation', name: '補足', type: 'textarea' },
  { id: 'calc', name: '計算ロジック', type: 'textarea' },
  { id: 'ispk', name: 'is PK', type: 'bool' },
  { id: 'isnull', name: 'nullを許容', type: 'bool' },
  { id: 'defaultvalue', name: 'デフォルト値', type: 'text' },
  { id: 'from', name: 'データ元', type: 'text' },
  { id: 'example', name: '項目例', type: 'textarea' },
]

const columnTypes = [
  { id: 'int', name: 'int' },
  { id: 'double', name: 'double' },
  { id: 'string', name: 'string' },
  { id: 'varchar', name: 'varchar' },
  { id: 'date', name: 'date' },
  { id: 'datetime', name: 'datetime' },
]

export { items, columnTypes }
