import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    
    const { data, error } = await supabase
      .from('campaign_batches')
      .select('*')
      .order('batch_number', { ascending: false })
    
    if (error) {
      console.error('Error fetching batches:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error('Batches API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = getSupabaseAdmin()
    
    // Create new batch
    const { data, error } = await supabase
      .from('campaign_batches')
      .insert([{
        batch_number: body.batch_number,
        batch_type: body.batch_type,
        status: 'running',
        scheduled_time: body.scheduled_time,
      }])
      .select()
    
    if (error) throw error
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Error creating batch:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
