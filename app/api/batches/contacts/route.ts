import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function GET(req: Request) {
  try {
    const supabase = getSupabaseAdmin()
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'trainer' // 'trainer' or 'client'
    
    const { data, error } = await supabase
      .from('batch_prospects')
      .select(`
        id,
        batch_id,
        prospect_type,
        prospect_name,
        prospect_email,
        prospect_title,
        prospect_city,
        prospect_company,
        added_at,
        campaign_batches(batch_number)
      `)
      .eq('prospect_type', type)
      .order('added_at', { ascending: false })
    
    if (error) {
      console.error(`Error fetching ${type} contacts:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Transform data to flatten batch_number
    const transformed = (data || []).map((contact: any) => ({
      id: contact.id,
      prospect_name: contact.prospect_name,
      prospect_email: contact.prospect_email,
      prospect_title: contact.prospect_title,
      prospect_city: contact.prospect_city,
      prospect_company: contact.prospect_company,
      prospect_type: contact.prospect_type,
      batch_number: contact.campaign_batches?.batch_number || 0,
      added_at: contact.added_at,
    }))
    
    return NextResponse.json(transformed)
  } catch (err: any) {
    console.error('Batch contacts API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = getSupabaseAdmin()
    
    // Add prospect to batch
    const { data, error } = await supabase
      .from('batch_prospects')
      .insert([{
        batch_id: body.batch_id,
        prospect_type: body.prospect_type,
        prospect_id: body.prospect_id,
        prospect_name: body.prospect_name,
        prospect_email: body.prospect_email,
        prospect_title: body.prospect_title,
        prospect_city: body.prospect_city,
        prospect_company: body.prospect_company,
      }])
      .select()
    
    if (error) throw error
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Error adding contact to batch:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
