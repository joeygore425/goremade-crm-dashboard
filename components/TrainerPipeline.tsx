'use client'

export default function TrainerPipeline() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Trainer Pipeline</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-700">
            <span className="text-gray-400">Prospects</span>
            <span className="text-2xl font-bold text-white">50</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-slate-700">
            <span className="text-gray-400">Contacted</span>
            <span className="text-2xl font-bold text-orange-600">50</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-slate-700">
            <span className="text-gray-400">Interested (Expected)</span>
            <span className="text-2xl font-bold text-yellow-500">10-15</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Onboarded</span>
            <span className="text-2xl font-bold text-green-500">0</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Conversion Funnel</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Prospects → Contacted</span>
              <span className="text-gray-400">100%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '100%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Contacted → Interested</span>
              <span className="text-gray-400">20-30%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{width: '25%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Interested → Onboarded</span>
              <span className="text-gray-400">50-70%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '0%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
