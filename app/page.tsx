export default function Home() {
  return (
    <html>
      <head>
        <title>GoreMade CRM</title>
        <style>{`
          body { font-family: system-ui; background: #0f172a; color: #e2e8f0; margin: 0; padding: 20px; }
          h1 { color: #f97316; }
          .card { background: #1e293b; border: 1px solid #334155; padding: 20px; margin: 10px 0; border-radius: 8px; }
          .value { font-size: 32px; font-weight: bold; margin: 10px 0; }
        `}</style>
      </head>
      <body>
        <h1>🚀 GoreMade Trainer Campaign</h1>
        <div className="card">
          <h2>Campaign Status</h2>
          <p className="value">50</p>
          <p>Trainers Contacted</p>
        </div>
        <div className="card">
          <h2>Timeline</h2>
          <p>✓ Emails sent: May 16 @ 10 AM</p>
          <p>⏳ Expected replies: May 16 @ 5 PM</p>
          <p>⏳ Follow-up 1: May 19</p>
          <p>⏳ Follow-up 2: May 23</p>
        </div>
        <div className="card">
          <p style={{marginTop: 20, color: '#64748b', fontSize: '14px'}}>Status reports: 3x daily via Telegram (8 AM, 2 PM, 8 PM EDT)</p>
        </div>
      </body>
    </html>
  )
}
