'use client'

export default function OutreachPerformance() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Current Campaign: Trainer Acquisition</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Sent</span>
              <span className="text-white font-semibold">50 / 50</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '100%'}}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Opened</span>
              <span className="text-white font-semibold">Monitoring...</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{width: '0%'}}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Replied</span>
              <span className="text-white font-semibold">Monitoring...</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: '0%'}}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Booked Calls</span>
              <span className="text-white font-semibold">Pending...</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-yellow-600 h-2 rounded-full" style={{width: '0%'}}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Timeline</h3>
        <div className="space-y-3">
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-semibold">Emails Sent</p>
              <p className="text-gray-400 text-sm">May 16 @ 10:00 AM EDT</p>
              <p className="text-gray-500 text-sm">50 personalized emails staggered 5 min apart</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-semibold">Expected First Replies</p>
              <p className="text-gray-400 text-sm">May 16 @ 5:00 PM EDT</p>
              <p className="text-gray-500 text-sm">20-30% response rate expected</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-semibold">Follow-up Round 1</p>
              <p className="text-gray-400 text-sm">May 19 (Day 3)</p>
              <p className="text-gray-500 text-sm">Automated follow-up for non-responders</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-semibold">Follow-up Round 2</p>
              <p className="text-gray-400 text-sm">May 23 (Day 7)</p>
              <p className="text-gray-500 text-sm">Final follow-up for non-responders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
