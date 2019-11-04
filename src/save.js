function saveProjects(projects) {
  window.localStorage.setItem('projects', JSON.stringify(projects))
}

function saveProject(project) {
  const url = 'https://us-central1-pivotal-keep-256007.cloudfunctions.net/api/input/project'
  console.log(project)
  try {
    fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(project),
    })
  } catch (e) {
    console.log(e)
  }
}

async function loadProjects() {
  const url = 'https://us-central1-pivotal-keep-256007.cloudfunctions.net/api/projects'
  try {
    const result = await fetch(url)
    const json = await result.json()
    // JSONの中にあるJSONをパースしてObjectにする
    json.forEach(pj => {
      pj.id = pj.id.toString()
      pj.tables = JSON.parse(pj.tables)
    })
    return json
  } catch (e) {
    const data = window.localStorage.getItem('projects')
    return JSON.parse(data)
  }
}

export { saveProjects, saveProject, loadProjects }
