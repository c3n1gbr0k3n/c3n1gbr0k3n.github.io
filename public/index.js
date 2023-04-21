// 记录folder展开情况
let foldIdSet = new Set(storage.get('foldIdList', []))
function foldIdListHandle(id) {
  if (foldIdSet.has(id)) {
    foldIdSet.delete(id)
  } else {
    foldIdSet.add(id)
  }
  storage.set('foldIdList', Array.from(foldIdSet))
}

// 生成左侧侧边栏
function generateMenu(json, isPage = false) {
  const sidebar = document.querySelector('.sidebar-container')
  const rootFolder = doFolder(json, 20, isPage, true)
  sidebar.appendChild(rootFolder)
}
function doFolder(folderJson, paddingLeft = 20, isPage = false, isFirst = false) {
  let folder
  if (isFirst) {
    folder = document.createDocumentFragment()
    const sidebarHeader = document.getElementById('sidebarHeader')
    sidebarHeader.innerText = folderJson.title
    sidebarHeader.onclick = () => {
      generateFolderContent(folderJson)
      if (isMobile) {
        closeLeftSidebarHandle()
      }
    }
    if (!isPage) {
      generateFolderContent(folderJson)
    }
  } else {
    folder = document.createElement('div')

    const folderRow = document.createElement('div')
    folderRow.className = 'folder-row'
    if (foldIdSet.has(folderJson.id)) {
      folderRow.classList.add('fold')
    }
    folderRow.onclick = () => {
      const selectedDoms = document.querySelectorAll('.selected')
      for (let i = 0; i < selectedDoms.length; i++) {
        selectedDoms[i].classList.remove('selected')
      }
      folderRow.classList.add('selected')
      generateFolderContent(folderJson)

      if (isMobile) {
        closeLeftSidebarHandle()
      }
    }

    const folderBorderTop = document.createElement('div')
    folderBorderTop.className = 'folder-border-top'
    folderBorderTop.style.left = `${paddingLeft - 20}px`
    folderRow.appendChild(folderBorderTop)

    const folderArrow = document.createElement('div')
    const isEmpty = folderJson.children.length + folderJson.pages.length === 0
    folderArrow.className = `folder-arrow ${isEmpty ? 'empty' : ''}`
    folderArrow.style.marginLeft = `${paddingLeft - 20}px`
    if (!isEmpty) {
      folderArrow.onclick = (e) => {
        e.stopPropagation()
        foldIdListHandle(folderJson.id)
        folderRow.classList.toggle('fold')
      }
    }

    const folderContainer = document.createElement('div')
    folderContainer.innerHTML = folderJson.title
    folderContainer.className = 'folder'

    folderRow.appendChild(folderArrow)
    folderRow.appendChild(folderContainer)
    folder.appendChild(folderRow)
  }
  

  const childList = document.createElement('div')
  childList.className = 'list'

  for (let i = 0; i < folderJson.pages.length; i++) {
    const pageJson = folderJson.pages[i]
    const page = document.createElement('div')
    page.className = 'page'
    if (pageJson.id === window.pageId) {
      page.classList.add('selected')
    }
    page.setAttribute('data-src', pageJson.src)
    page.setAttribute('data-id', pageJson.id)
    page.innerHTML = pageJson.title
    page.style.paddingLeft = `${paddingLeft}px`
    page.onclick = () => {
      if (isMobile) {
        closeLeftSidebarHandle()
      }
      if (location.href.includes('/pages/')) {
        location.href = location.href.replace(/\/pages\/.*/, `/${pageJson.src}`)
      } else {
        location.href = location.href.replace('index.html', pageJson.src) 
      }
      // // 设置html标题
      // document.title = pageJson.title
      // // 设置显示iframe
      // const container = document.querySelector('.content-container')
      // container.classList.remove('show-folder-page')
      
      // const iframe = document.querySelector('iframe')
      // iframe.src = pageJson.src
      // const selectedDoms = document.querySelectorAll('.selected')
      // for (let i = 0; i < selectedDoms.length; i++) {
      //   selectedDoms[i].classList.remove('selected')
      // }
      // page.classList.add('selected')

      // if (isMobile) {
      //   closeLeftSidebarHandle()
      // }
    }
    childList.appendChild(page)
  }

  for (let i = 0; i < folderJson.children.length; i++) {
    childList.appendChild(doFolder(folderJson.children[i], paddingLeft + 20, isPage))
  }
  if (childList.children.length) {
    folder.appendChild(childList)
  }
  return folder
}

// 点击文件夹生成文件夹目录
function generateFolderContent(folderJson) {
  document.body.classList.add('show-folder-content')
  
  // 设置html标题
  document.title = folderJson.title

  // 先处理生成包含笔记的文件夹列表
  const folderList = getHasPageData(folderJson)

  const folderPage = document.querySelector('.main-container')
  folderPage.innerHTML = ''

  // 生成标题
  const folderPageTitle = document.createElement('div')
  folderPageTitle.className = 'folder-page-title'
  
  // 标题左侧边栏开关
  const leftSidebarBtn = document.createElement('div')
  leftSidebarBtn.className = 'left-sidebar-btn'
  leftSidebarBtn.onclick = () => {
    toggleShowSidebar()
  }
  folderPageTitle.appendChild(leftSidebarBtn)

  const folderPageTitleSpan = document.createElement('span')
  folderPageTitleSpan.innerText = folderJson.title
  folderPageTitle.appendChild(folderPageTitleSpan)

  // 标题右侧修改主题颜色
  const toggleNightThemeBtn = document.createElement('div')
  toggleNightThemeBtn.id = 'toggleNightThemeBtn'
  folderPageTitle.append(toggleNightThemeBtn) 

  folderPage.appendChild(folderPageTitle)

  // 生成内容容器
  const folderPageContent = document.createElement('div')
  folderPageContent.className = 'folder-page-content'

  // 循环插入标题和页面
  for (let i = 0; i < folderList.length; i++) {
    const folderItem = folderList[i]
    // 单个folder容器
    const folderItemContainer = document.createElement('div')
    folderItemContainer.className = 'folder-item-container'

    // 插入标题
    const folderItemTitle = document.createElement('div')
    folderItemTitle.className = 'folder-item-title'
    folderItemTitle.innerText = folderItem.title
    folderItemContainer.onclick = () => {
      folderItemContainer.classList.toggle('fold')
      console.log(folderItem)
    }
    folderItemContainer.appendChild(folderItemTitle)

    // 插入页面
    for (let j = 0; j < folderItem.pages.length; j++) {
      const pageItem = folderItem.pages[j]
      const pageItemTitle = document.createElement('div')
      pageItemTitle.className = 'page-item-title'
      pageItemTitle.innerText = pageItem.title
      pageItemTitle.onclick = () => {
        const targetDom = document.querySelector(`[data-src="${pageItem.src}"]`)
        if (targetDom) {
          targetDom.click()
        }
      }
      folderItemContainer.appendChild(pageItemTitle)
    }
    folderPageContent.appendChild(folderItemContainer)
  }
  folderPage.appendChild(folderPageContent)
  themeBtnHandle()
}
function getHasPageData(folderJson, prefix = '') {
  const folderList = []
  const title = `${prefix ? prefix + '/' : '' }${folderJson.title}`
  if (folderJson.pages.length) {
    folderList.push({ title, pages: folderJson.pages })
  }
  for (let i = 0; i < folderJson.children.length; i++) {
    folderList.push(...getHasPageData(folderJson.children[i], title))
  }
  return folderList
}

const clientTheme = storage.get('clientTheme', 'defaultTheme')
toggleNightTheme(clientTheme === 'nightTheme')
function toggleNightTheme(bool) {
  storage.set('clientTheme', bool ? 'nightTheme' : 'defaultTheme')
  const body = document.body
  const lpPage = document.querySelector('.lp-page')
  if (bool) {
    body.classList.add('nightTheme')
    body.classList.remove('defaultTheme')
    if (lpPage) {
      lpPage.classList.add('nightTheme')
      lpPage.classList.remove('defaultTheme')
    }
  } else {
    body.classList.add('defaultTheme')
    body.classList.remove('nightTheme')
    if (lpPage) {
      lpPage.classList.add('defaultTheme')
      lpPage.classList.remove('nightTheme')
    }
  }
}
// 切换客户端颜色模式
themeBtnHandle()
function themeBtnHandle() {
  const themeBtn = document.querySelector('#toggleNightThemeBtn')
  if (themeBtn) {
    themeBtn.onclick = () => {
      const clientTheme = storage.get('clientTheme', 'defaultTheme')
      toggleNightTheme(clientTheme !== 'nightTheme')
    }
  }
}

// 打开/关闭左侧侧边栏
function toggleShowSidebar() {
  if (document.body.classList.contains('close-left-sidebar')) {
    showLeftSidebarHandle()
  } else {
    closeLeftSidebarHandle()
  }
}

function showLeftSidebarHandle() {
  document.body.classList.remove('close-left-sidebar')
  storage.set('close-left-sidebar', false)
}
function closeLeftSidebarHandle() {
  document.body.classList.add('close-left-sidebar')
  storage.set('close-left-sidebar', true)
}
function closeRightSidebarHandle() {
  document.body.classList.add('close-right-sidebar')
  storage.set('close-right-sidebar', true)
}

// 点击遮罩
maskHandle()
function maskHandle() {
  document.querySelector('.mask').onclick = () => {
    closeLeftSidebarHandle()
    closeRightSidebarHandle()
  }
}

// 判断加入isMobile标识
isMobileHandle()
function isMobileHandle() {
  if (isMobile) {
    document.body.classList.add('isMobile')
    storage.set('close-right-sidebar', true)
  } else {
    document.body.classList.remove('isMobile')
  }
}

function pageClickById(id) {
  const targetDom = document.querySelector(`[data-id="${id}"]`)
  if (targetDom) {
    targetDom.click()
  }
}