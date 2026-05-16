'use client'

export default function TokenTracker() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">API Token Usage</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Resend (Email)</span>
              <span className="text-white font-semibold">50 credits</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '5%'}}></div>
            </div>
            <p className="text-gray-500 text-xs mt-1">50 trainer outreach emails</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Supabase</span>
              <span className="text-white font-semibold">Unlimited</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '10%'}}></div>
            </div>
            <p className="text-gray-500 text-xs mt-1">Database queries + real-time data sync</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Estimated Costs</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Email Campaign (50 emails @ $0.0001/email)</span>
            <span className="text-white font-semibold">$0.01</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Supabase Hosting (included tier)</span>
            <span className="text-white font-semibold">$0.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Vercel Hosting (included tier)</span>
            <span className="text-white font-semibold">$0.00</span>
          </div>
          <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between">
            <span className="text-white font-semibold">Total This Month</span>
            <span className="text-green-500 font-bold">~$0.01</span>
          </div>
        </div>
      </div>
    </div>
  )
}
