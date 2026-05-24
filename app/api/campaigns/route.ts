import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    
    // Fetch all trainer prospects
    const { data: trainers, error } = await supabase
      .from('trainer_prospects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching trainers:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Format and return data
    const formatted = (trainers || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      city: t.city,
      state: t.state,
      status: t.status,
      response_type: t.response_type,
      outreach_date: t.outreach_date,
      response_date: t.response_date,
      created_at: t.created_at,
    }))
    
    return NextResponse.json(formatted)
  } catch (err: any) {
    console.error('Campaign API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
