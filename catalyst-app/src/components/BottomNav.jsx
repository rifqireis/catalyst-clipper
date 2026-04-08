const NAV_ITEMS = [
  {
    id: 'live',
    label: 'Live',
  },
  {
    id: 'dashboard',
    label: 'Studio',
  },
]

function LiveIcon({ isActive }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={['h-5 w-5', isActive ? 'text-[#FF0000]' : 'text-gray-400'].join(' ')}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="5.5" width="13" height="13" rx="2" />
      <path d="m16.5 10 4-2.5v9L16.5 14" />
    </svg>
  )
}

function StudioIcon({ isActive }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={['h-5 w-5', isActive ? 'text-[#FF0000]' : 'text-gray-400'].join(' ')}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 5.5h15v13h-15z" />
      <path d="M8 15V9" />
      <path d="M12 15V7" />
      <path d="M16 15v-4" />
    </svg>
  )
}

const ICONS = {
  live: LiveIcon,
  dashboard: StudioIcon,
}

function BottomNav({ activeTab, onTabChange }) {
  return (
    <div className="pointer-events-none fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2">
      <nav className="pointer-events-auto w-full border-t border-gray-200 bg-white">
        <div className="grid grid-cols-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeTab
          const Icon = ICONS[item.id]

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={[
                'flex flex-col items-center justify-center gap-1 px-4 py-3 text-xs font-medium transition-colors',
                isActive
                  ? 'text-[#FF0000]'
                  : 'text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              <Icon isActive={isActive} />
              <span>{item.label}</span>
              <span
                className={[
                  'h-0.5 w-8 rounded-full transition-colors',
                  isActive ? 'bg-[#FF0000]' : 'bg-transparent',
                ].join(' ')}
              />
            </button>
          )
        })}
        </div>
      </nav>
    </div>
  )
}

export default BottomNav