import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    
    // Fetch all trainer prospects
    const { data: trainers, error: trainersError } = await supabase
      .from('trainer_prospects')
      .select('*')
    
    if (trainersError) throw trainersError
    
    // Fetch all client prospects
    const { data: clients, error: clientsError } = await supabase
      .from('client_prospects')
      .select('*')
    
    if (clientsError) throw clientsError
    
    // Calculate trainer metrics
    const trainerMetrics = {
      total_researched: trainers?.length || 0,
      total_contacted: trainers?.filter((t: any) => t.outreach_date).length || 0,
      total_replied: trainers?.filter((t: any) => t.response_date).length || 0,
      total_interested: trainers?.filter((t: any) => t.response_type === 'interested').length || 0,
      total_onboarded: trainers?.filter((t: any) => t.status === 'onboarded').length || 0,
      contact_rate: trainers?.length > 0 ? Math.round(((trainers?.filter((t: any) => t.outreach_date).length || 0) / trainers.length) * 100) : 0,
      response_rate: trainers?.length > 0 ? Math.round(((trainers?.filter((t: any) => t.response_date).length || 0) / trainers.length) * 100) : 0,
      onboarding_rate: trainers?.length > 0 ? Math.round(((trainers?.filter((t: any) => t.status === 'onboarded').length || 0) / trainers.length) * 100) : 0,
    }
    
    // Calculate client metrics
    const clientMetrics = {
      total_researched: clients?.length || 0,
      total_contacted: clients?.filter((c: any) => c.outreach_date).length || 0,
      total_replied: clients?.filter((c: any) => c.response_date).length || 0,
      total_interested: clients?.filter((c: any) => c.response_type === 'interested').length || 0,
      total_booked: clients?.filter((c: any) => c.status === 'demo_booked' || c.status === 'active').length || 0,
      contact_rate: clients?.length > 0 ? Math.round(((clients?.filter((c: any) => c.outreach_date).length || 0) / clients.length) * 100) : 0,
      response_rate: clients?.length > 0 ? Math.round(((clients?.filter((c: any) => c.response_date).length || 0) / clients.length) * 100) : 0,
      booking_rate: clients?.length > 0 ? Math.round(((clients?.filter((c: any) => c.status === 'demo_booked' || c.status === 'active').length || 0) / clients.length) * 100) : 0,
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      trainers: trainerMetrics,
      clients: clientMetrics,
      summary: {
        total_prospects: (trainers?.length || 0) + (clients?.length || 0),
        total_contacted: (trainers?.filter((t: any) => t.outreach_date).length || 0) + (clients?.filter((c: any) => c.outreach_date).length || 0),
        total_replied: (trainers?.filter((t: any) => t.response_date).length || 0) + (clients?.filter((c: any) => c.response_date).length || 0),
      }
    })
  } catch (err: any) {
    console.error('Campaign metrics API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
