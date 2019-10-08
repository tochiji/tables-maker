function save(data){
  window.localStorage.setItem('table',JSON.stringify(data))
}

function load(){
  const data = window.localStorage.getItem('table')
  return JSON.parse(data)
}

export {save, load}