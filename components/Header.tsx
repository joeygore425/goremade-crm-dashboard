'use client'

export default function Header() {
  return (
    <div className="border-b border-slate-700 bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              GoreMade CRM
            </h1>
            <p className="text-gray-400">
              Trainer acquisition & client management dashboard
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
