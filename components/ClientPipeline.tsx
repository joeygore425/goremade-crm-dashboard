'use client'

export default function ClientPipeline() {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-xl font-semibold text-white mb-4">Client Pipeline</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-700">
          <span className="text-gray-400">Active Clients</span>
          <span className="text-2xl font-bold text-white">8</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-slate-700">
          <span className="text-gray-400">Client Prospects</span>
          <span className="text-2xl font-bold text-white">0</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-slate-700">
          <span className="text-gray-400">Monthly Revenue</span>
          <span className="text-2xl font-bold text-green-500">$0</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Avg. Sessions per Client</span>
          <span className="text-2xl font-bold text-white">0</span>
        </div>
      </div>
    </div>
  )
}
