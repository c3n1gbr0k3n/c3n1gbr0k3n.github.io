// 标题
headerFoldHandle()
function headerFoldHandle() {
  const headers = [...document.querySelectorAll('h1'), ...document.querySelectorAll('h2'), ...document.querySelectorAll('h3')]
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i]
    header.querySelector('span').onclick = () => {
      const show = header.getAttribute('data-fold') === 'unfold'
      if (show) {
        header.setAttribute('data-fold', 'fold')
        header.querySelector('span').classList.add('fold')
      } else {
        header.setAttribute('data-fold', 'unfold')
        header.querySelector('span').classList.remove('fold')
      }
      checkFold()
    }
  }
}
function checkFold() {
  const children = document.querySelector('.ql-editor').children
  let show = true
  let lastLevel1show = true
  let lastLevel2show = true

  for (let i = 0; i < children.length; i++) {
    const dom = children[i]
    switch (dom.tagName) {
      case 'H1':
        lastLevel1show = dom.getAttribute("data-fold") === 'unfold'
        show = lastLevel1show
        lastLevel = 1
        break
      case 'H2':
        lastLevel2show = dom.getAttribute("data-fold") === 'unfold'
        if (lastLevel1show) {
          dom.classList.remove('hide')
          show = lastLevel2show
          lastLevel = 2
        } else {
          dom.classList.add('hide')
        }
        break
      case 'H3':
        if (lastLevel1show && lastLevel2show) {
          dom.classList.remove('hide')
          show = dom.getAttribute("data-fold") === 'unfold'
          lastLevel = 3
        } else {
          dom.classList.add('hide')
        }
        break
      default:
        if (show) {
          dom.classList.remove('hide')
        } else {
          dom.classList.add('hide')
        }
    }
  }
}

// 高亮
specialHighlightHandle()
function specialHighlightHandle() {
  const specialHighlightList = [...document.getElementsByClassName('highlight-specialBlack'), ...document.getElementsByClassName('highlight-specialWhite')]
  for (let i = 0; i < specialHighlightList.length; i++) {
    const dom = specialHighlightList[i]
    dom.onclick = () => {
      dom.classList.toggle('active')
    }
  }
}

// 链接
linkHandle()
function linkHandle() {
  const linkList = document.getElementsByClassName('link-embed')
  for (let i = 0; i < linkList.length; i++) {
    const dom = linkList[i]
    dom.onclick = () => {
      window.open(dom.getAttribute('data-value'))
    }
  }
}


// 附件
enclosureHandle()
function enclosureHandle() {
  const enclosureList = document.getElementsByClassName('lp-file')
  for (let i = 0; i < enclosureList.length; i++) {
    const dom = enclosureList[i]
    dom.onclick = () => {
      downloadFile(dom.getAttribute('data-src'), dom.getAttribute('data-preview'))
    }
  }
}

// 音频
audioHandle()
function audioHandle() {
  const audioList = document.getElementsByClassName('lp-audio')
  for (let i = 0; i < audioList.length; i++) {
    const dom = audioList[i]
    dom.onclick = () => {
      const audio = dom.querySelector('.lp-audio-file')
      if (dom.classList.contains('audio-pause')) {
        audio.pause()
      } else {
        audio.play()
      }
      audio.onplay = () => {
        dom.classList.add('audio-pause')
      }
      audio.onpause = () => {
        dom.classList.remove('audio-pause')
      }
    }
  }
}

// 复选框
checkboxHandle()
function checkboxHandle() {
  const checkboxList = [...document.querySelectorAll("[data-list='unchecked']"), ...document.querySelectorAll("[data-list='checked']")]
  for (let i = 0; i < checkboxList.length; i++) {
    const dom = checkboxList[i]
    dom.onclick = () => {
      if (dom.getAttribute('data-list') === 'checked') {
        dom.setAttribute('data-list', 'unchecked')
        dom.innerHTML = dom.innerHTML.replace('<s>', '').replace('</s>', '')
      } else {
        dom.setAttribute('data-list', 'checked')
        const text = dom.innerHTML.match(/(?<=<\/span>).*/)[0]
        dom.innerHTML = dom.innerHTML.replace(text, `<s>${text}</s>`)
      }
    }
  }
}

// 页面链接
pageLinkHandle()
function pageLinkHandle() {
  const pageLinkList = document.querySelectorAll('.page-link-embed')
  for (let i = 0; i < pageLinkList.length; i++) {
    const dom = pageLinkList[i]
    dom.onclick = () => {
      pageClickById(dom.getAttribute('data-page-id'))
    }
  }
}

// a链接
aPageLinkHandle()
function aPageLinkHandle() {
  const aPageLinkList = document.querySelectorAll('.link')
  for (let i = 0; i < aPageLinkList.length; i++) {
    const dom = aPageLinkList[i]
    dom.onclick = () => {
      window.open(dom.href)
    }
  }
}


// 外框
boundaryHandle()
async function boundaryHandle() {
  await sleep(200)
  const boundaryStartList = document.querySelectorAll('.boundary-start')
  for (let i = 0; i < boundaryStartList.length; i++) {
    const boundaryStart = boundaryStartList[i]
    let contentHeight = 0
    let nextDom = boundaryStart.nextElementSibling
    while (nextDom && !nextDom.classList.contains('boundary-end')) {
      contentHeight += nextDom.clientHeight
      nextDom = nextDom.nextElementSibling
    }
    const titleHeight = boundaryStart.querySelector('.boundary-title').clientHeight
    const boundaryLine = boundaryStart.querySelector('.boundary-line')
    const boundaryLineFakerBottom = boundaryStart.querySelector('.boundary-line-faker-bottom')
    if (boundaryLine) {
      boundaryLine.style.height = contentHeight + titleHeight + 9.5 + 'px'
    }
    if (boundaryLineFakerBottom) {
      boundaryLineFakerBottom.style.top = contentHeight + titleHeight + 13.5 + 'px'
    }
  }
}

// 无序列表
bulletHandle()
function bulletHandle() {
  const bulletList = document.querySelectorAll('[data-list="bullet"]')
  for (let i = 0; i < bulletList.length; i++) {
    const bullet = bulletList[i]
    bullet.querySelector('.ql-ui').onclick = () => {
      const selfFold = bullet.getAttribute('data-fold') !== 'fold'
      const selfLevel = parseInt(bullet.className.replace('ql-indent-', '')) || 0

      // 如果没有下级则不收起
      const nextDom = bullet.nextElementSibling
      if (nextDom && nextDom.getAttribute('data-list') === 'bullet') {
        const nextLevel = parseInt(nextDom.className.replace('ql-indent-', '')) || 0
        if (nextLevel > selfLevel) {
          bullet.setAttribute('data-fold', selfFold ? 'fold' : 'unfold')
          doBullet(bullet, selfFold, selfLevel)
        }
      }
    }
  }
}
function doBullet(lastBullet, fold = true, level = 0) {
  const currentDom = lastBullet.nextElementSibling
  if (!currentDom || currentDom.getAttribute('data-list') !== 'bullet') return
  const currentLevel = parseInt(currentDom.className.replace('ql-indent-', '')) || 0
  if (currentLevel <= level) return
  currentDom.style = fold ? 'display: none;' : ''
  const currentFold = currentDom.getAttribute('data-fold') === 'fold'
  // 如果都为关 停止
  if (currentFold === true) return
  doBullet(currentDom, fold, level)
}

function downloadFile(url, filename = '') {
  fetch(url, {
    headers: new Headers({
      Origin: location.origin,
    }),
    mode: 'cors',
  }).then(async res => {
    if(res.status == 200) {
      download(await res.blob(), filename)
    } else {
      window.open(url)
    }
  }).catch(err => {
    window.open(url)
    console.error('downloadFile err', err)
  })
}

function download(blob, filename) {
  const a = document.createElement('a')
  a.download = filename
  const blobUrl = URL.createObjectURL(blob)
  a.href = blobUrl
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(blobUrl)
}

// 生成dom也可以在导出的时候生成
// headers, remarks
function renderRightSidebar(headers, remarks) {
  const tabs = document.querySelectorAll('aside header div')
  const bodys = document.querySelectorAll('aside main .list-container')
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i]
    tab.onclick = () => {
      tabs[0].classList.toggle('active')
      tabs[1].classList.toggle('active')
      if (tabs[0].classList.contains('active')) {
        bodys[0].classList.add('active')
        bodys[1].classList.remove('active')
      } else {
        bodys[0].classList.remove('active')
        bodys[1].classList.add('active')
      }
    }
  }
  generateHeaderList(headers)
  generateRemarkList(remarks)
}

function generateHeaderList(headers) {
  if (headers.length === 0) return
  const listBox = document.querySelector('.list-box')
  listBox.innerHTML = ''
  const fragment = document.createDocumentFragment()

  for (let i = 0; i < headers.length; i++) {
    fragment.appendChild(doHeader(headers[i]))
  }

  listBox.appendChild(fragment)
}
function doHeader(headerJson) {
  const header = document.createElement('div')

  const headerContainer = document.createElement('div')
  headerContainer.className = `header show`

  const arrow = document.createElement('div')
  arrow.className = 'icon'
  if (headerJson.children.length) {
    arrow.className = 'icon arrow'
    arrow.onclick = () => {
      headerContainer.classList.toggle('show')
    }
  }
  headerContainer.appendChild(arrow)

  const title = document.createElement('span')
  title.className = 'header-title'
  title.innerHTML = headerJson.value
  title.onclick = () => {
    const findHeader = document.getElementById(headerJson.id)
    if (findHeader) {
      findHeader.scrollIntoView({block: 'center', inline: 'nearest'})
      if (isMobile) {
        closeRightSidebarHandle()
      }
    }
  }
  headerContainer.appendChild(title)
 
  header.appendChild(headerContainer)

  const childList = document.createElement('div')
  childList.className = 'list'

  for (let i = 0; i < headerJson.children.length; i++) {
    childList.appendChild(doHeader(headerJson.children[i]))
  }
  if (childList.children.length) {
    header.appendChild(childList)
  }
  return header
}
// 全部展开/折叠
let foldAll = false
toggleFoldAll()
function toggleFoldAll() {
  const toggleFoldAllBtn = document.querySelector('.toggle-fold-all')
  toggleFoldAllBtn.onclick = () => {
    foldAll = !foldAll
    const headerList = document.getElementById('headerList')
    const headerDoms = headerList.querySelectorAll('.header')
    for (let i = 0; i < headerDoms.length; i++) {
      if (foldAll) {
        headerDoms[i].classList.remove('show')
      } else {
        headerDoms[i].classList.add('show')
      }
    }
  }
}

function generateRemarkList(remarks) {
  if (remarks.length === 0) return
  const remarkList = document.getElementById('remarkList')
  remarkList.innerHTML = ''
  const fragment = document.createDocumentFragment()
  for (let i = 0; i < remarks.length; i++) {
    const remarkDom = document.querySelector(`#${remarks[i].id}`)
    if (remarkDom) {
      remarkDom.title = remarks[i].text
      // remarkDom.setAttribute('remark-text', remarks[i].text)
    }
    const remarkItem = document.createElement('div')
    remarkItem.className = 'remark-item'
    remarkItem.onclick = () => {
      if (remarkDom) {
        remarkDom.scrollIntoView({block: 'center', inline: 'nearest'})
        if (isMobile) {
          closeRightSidebarHandle()
        }
      }
    }

    const numberBtnDefault = document.createElement('div')
    numberBtnDefault.className = 'number'
    numberBtnDefault.innerHTML = i + 1
    remarkItem.appendChild(numberBtnDefault)

    const remarkContainer = document.createElement('div')
    remarkContainer.className = 'remark-container'
    
    const title = document.createElement('div')
    title.className = 'title'
    title.innerHTML = remarks[i].title
    remarkContainer.appendChild(title)

    const text = document.createElement('div')
    text.className = 'text'
    text.innerHTML = remarks[i].text
    remarkContainer.appendChild(text)

    remarkItem.appendChild(remarkContainer)
    fragment.appendChild(remarkItem)
  }
  remarkList.appendChild(fragment)
} 

// 获取标题栏标题
getTitlebarContentHandle()
function getTitlebarContentHandle() {
  const titleContainer = document.getElementById('titleContainer')
  
  // 标题左侧边栏开关
  const leftSidebarBtn = document.createElement('div')
  leftSidebarBtn.className = 'left-sidebar-btn'
  leftSidebarBtn.onclick = () => {
    toggleShowSidebar()
  }
  titleContainer.appendChild(leftSidebarBtn)

  const folderPageTitleSpan = document.createElement('span')
  folderPageTitleSpan.innerText = document.querySelector('.note-title').innerText
  titleContainer.appendChild(folderPageTitleSpan)
}

// 开关侧边栏
toggleSidebarHandle()
function toggleSidebarHandle() {
  const btn = document.getElementById('toggleOpenRightSidebarBtn')
  btn.onclick = () => {
    document.body.classList.toggle('close-right-sidebar')
    storage.set('close-right-sidebar', document.body.classList.contains('close-right-sidebar'))
  }
}

window.addEventListener('resize', () => {
  boundaryHandle()
})
