import '../scss/style.scss'

// ============ 底部导航高亮 ============
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll<HTMLAnchorElement>('.bottom-nav .nav-item')
  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href')
      if (!href || href === '#' || href.startsWith('#')) {
        e.preventDefault()
        items.forEach((i) => (i.className = 'nav-item text-body'))
        item.className = 'nav-item active bg-primary text-white'
      }
    })
  })
})

// ============ 技术服务额度（演示逻辑，生产环境由服务端发放） ============
const QUOTA_KEY = 'xq_consult_quota'
function getQuota(): number {
  const v = parseInt(localStorage.getItem(QUOTA_KEY) || '0', 10)
  return isNaN(v) ? 0 : v
}
function setQuota(v: number): void {
  localStorage.setItem(QUOTA_KEY, String(v))
}
function refreshQuota(): void {
  const q = getQuota()
  const lock = document.getElementById('consult-lock')
  const form = document.getElementById('consult-form')
  const left = document.getElementById('quota-left')
  if (lock && form) {
    if (q > 0) {
      lock.style.display = 'none'
      form.style.display = 'block'
      if (left) left.textContent = String(q)
    } else {
      lock.style.display = 'block'
      form.style.display = 'none'
    }
  }
}

declare global {
  interface Window {
    buyPackage(btn: HTMLElement): void
  }
}

window.buyPackage = function (btn: HTMLElement): void {
  btn.getAttribute('data-offer')
  const times = parseInt(btn.getAttribute('data-times') || '0', 10)
  btn.getAttribute('data-price')
  if (
    window.confirm(
      `【演示】模拟虚拟支付成功，到账 ${times} 次技术服务额度？\n（生产环境此处调起微信虚拟支付，支付成功后由服务端回调自动发放额度）`,
    )
  ) {
    setQuota(getQuota() + times)
    refreshQuota()
    window.alert(`已到账 ${times} 次技术服务额度，现在可以进行在线技术服务了。`)
  }
}

const consultForm = document.getElementById('consult-submit-form') as HTMLFormElement | null
consultForm?.addEventListener('submit', (e) => {
  e.preventDefault()
  const q = getQuota()
  if (q <= 0) {
    window.alert('技术服务次数不足，请先购买在线技术服务套餐。')
    return
  }
  setQuota(q - 1)
  refreshQuota()
  window.alert(`技术服务已提交，剩余 ${getQuota()} 次。`)
  consultForm.reset()
})

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', refreshQuota)
} else {
  refreshQuota()
}

// ============ 文档目录（TOC 高亮 + 侧边栏开合） ============
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html'
  const hash = window.location.hash || ''
  document.querySelectorAll<HTMLAnchorElement>('.doc-toc a').forEach((a) => {
    const href = a.getAttribute('href')
    if (href === page + hash || (href === page && !hash)) {
      a.classList.add('active')
    }
  })
  const active = document.querySelector<HTMLElement>('.doc-toc a.active')
  if (active) {
    let group = active.closest<HTMLElement>('.toc-children')
    while (group) {
      group.style.display = ''
      const prev = group.previousElementSibling as HTMLElement | null
      if (prev && (prev.classList.contains('toc-group-item') || prev.classList.contains('toc-sub-group'))) {
        const arrow = prev.querySelector<HTMLElement>('.toc-arrow')
        if (arrow) arrow.className = 'bi bi-chevron-down toc-arrow'
      }
      group = group.parentElement ? group.parentElement.closest<HTMLElement>('.toc-children') : null
    }
  }
  document.querySelectorAll<HTMLElement>('[data-toggle="toc"]').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      const children = item.nextElementSibling as HTMLElement | null
      if (children && children.classList.contains('toc-children')) {
        const arrow = item.querySelector<HTMLElement>('.toc-arrow')
        if (children.style.display === 'none') {
          children.style.display = ''
          if (arrow) arrow.className = 'bi bi-chevron-down toc-arrow'
        } else {
          children.style.display = 'none'
          if (arrow) arrow.className = 'bi bi-chevron-right toc-arrow'
        }
      }
    })
  })
  const menuBtn = document.querySelector<HTMLElement>('.doc-menu-btn')
  const closeBtn = document.querySelector<HTMLElement>('.sidebar-close-btn')
  const sidebar = document.querySelector<HTMLElement>('.sidebar')
  const overlay = document.querySelector<HTMLElement>('.sidebar-overlay')
  const open = () => {
    sidebar?.classList.add('sidebar-open')
    overlay?.classList.add('show')
    document.body.style.overflow = 'hidden'
  }
  const close = () => {
    sidebar?.classList.remove('sidebar-open')
    overlay?.classList.remove('show')
    document.body.style.overflow = ''
  }
  menuBtn?.addEventListener('click', open)
  closeBtn?.addEventListener('click', close)
  overlay?.addEventListener('click', close)
  document.querySelectorAll<HTMLElement>('.sidebar .doc-toc a').forEach((a) => {
    a.addEventListener('click', () => setTimeout(close, 150))
  })
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) document.body.style.overflow = ''
  })
})()
