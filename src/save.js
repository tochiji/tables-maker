function save(data){
  window.localStorage.setItem('table',JSON.stringify(data))
}

function saveProjects(data){
  window.localStorage.setItem('projects',JSON.stringify(data))
}

function load(){
  const data = window.localStorage.getItem('table')
  return JSON.parse(data)
}

function loadProjects(){
  const data = window.localStorage.getItem('projects')
  return JSON.parse(data)
}

export {save, saveProjects, load, loadProjects}