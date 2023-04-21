const isMobile = screen.width < 900

const storage = {
  get: (key, orNot = null) => {
    const value = localStorage.getItem(key)
    try {
      return value ? JSON.parse(value) : orNot
    } catch (e) {
      console.log('storage catch', e, orNot)
      return orNot
    }
  },
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove: (key) => {
    localStorage.removeItem(key)
  },
  clear: () => {
    localStorage.clear()
  }
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}