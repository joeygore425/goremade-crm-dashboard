export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 px-6 py-8">
        <h1 className="text-3xl font-bold text-white">GoreMade Fitness — Trainer Acquisition</h1>
        <p className="text-gray-400 mt-2">Real-time pipeline tracking and campaign metrics</p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-700 sticky top-0 z-10 bg-slate-900/95 backdrop-blur px-6 py-4">
        <div className="flex space-x-8">
          <a href="#overview" className="pb-3 px-1 text-sm font-medium border-b-2 border-orange-600 text-white">📊 Overview</a>
          <a href="#trainers" className="pb-3 px-1 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-gray-300">👨‍🏫 Trainer Pipeline</a>
          <a href="#clients" className="pb-3 px-1 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-gray-300">👥 Client Pipeline</a>
          <a href="#campaigns" className="pb-3 px-1 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-gray-300">📧 Campaigns</a>
          <a href="#tokens" className="pb-3 px-1 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-gray-300">🔑 Token Usage</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        <div id="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Trainer Prospects Card */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-gray-400 text-sm font-medium mb-3">Trainer Prospects</div>
                  <div className="text-3xl font-bold text-white">50</div>
                  <div className="text-gray-500 text-xs mt-3">+50 this week</div>
                </div>
                <div className="text-3xl ml-4">👨‍🏫</div>
              </div>
            </div>

            {/* Active Clients Card */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-gray-400 text-sm font-medium mb-3">Active Clients</div>
                  <div className="text-3xl font-bold text-white">8</div>
                  <div className="text-gray-500 text-xs mt-3">Stable</div>
                </div>
                <div className="text-3xl ml-4">👥</div>
              </div>
            </div>

            {/* Campaigns Card */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-gray-400 text-sm font-medium mb-3">Campaigns Running</div>
                  <div className="text-3xl font-bold text-white">1</div>
                  <div className="text-gray-500 text-xs mt-3">Active now</div>
                </div>
                <div className="text-3xl ml-4">📧</div>
              </div>
            </div>

            {/* Response Rate Card */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-gray-400 text-sm font-medium mb-3">Avg Response Rate</div>
                  <div className="text-3xl font-bold text-white">—</div>
                  <div className="text-gray-500 text-xs mt-3">Monitoring</div>
                </div>
                <div className="text-3xl ml-4">📊</div>
              </div>
            </div>
          </div>

          {/* Campaign Status */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Campaign Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Emails Sent</span>
                <span className="text-white font-semibold">50 / 50</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
              <div className="text-sm text-gray-500">Staggered 5 minutes apart • Started May 16 @ 10:00 AM EDT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
