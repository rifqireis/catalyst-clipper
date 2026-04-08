import { useState } from 'react'
import BottomNav from './components/BottomNav'
import ClipperDashboard from './views/ClipperDashboard'
import LiveStreamView from './views/LiveStreamView'

const TABS = {
  LIVE: 'live',
  DASHBOARD: 'dashboard',
}

function App() {
  const [activeTab, setActiveTab] = useState(TABS.LIVE)

  return (
    <div className="min-h-screen bg-gray-100 md:px-6 md:py-6">
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col relative md:min-h-[calc(100vh-3rem)] md:rounded-2xl md:border md:border-gray-200 md:bg-white md:shadow-sm">
        <main className="flex-1 overflow-y-auto pb-20">
          {activeTab === TABS.LIVE ? <LiveStreamView /> : <ClipperDashboard />}
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}

export default App
