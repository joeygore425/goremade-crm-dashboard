const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ulrgyupbhkmuzrcpzaov.supabase.co';
const supabaseKey = 'sb_secret_Hy3XWLYM1eteq7dHK4IqLA_pDx2wzG8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getAgentStatus() {
  try {
    // Get agents
    const { data: agents } = await supabase
      .from('agents')
      .select('*');
    
    // Get tasks with agent details
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(50);
    
    // Get trainer prospects count by status
    const { data: trainerStats } = await supabase
      .from('trainer_prospects')
      .select('status', { count: 'exact' });
    
    // Get client prospects count by status
    const { data: clientStats } = await supabase
      .from('client_prospects')
      .select('status', { count: 'exact' });
    
    console.log('=== AGENTS ===');
    agents?.forEach(agent => {
      console.log(`\n${agent.name}:`);
      console.log(`  Status: ${agent.status}`);
      console.log(`  Last Active: ${agent.last_active}`);
      console.log(`  Specialties: ${agent.specialties?.join(', ')}`);
    });
    
    console.log('\n=== RECENT TASKS (Last 10) ===');
    const recentTasks = tasks?.slice(0, 10) || [];
    recentTasks.forEach((task, idx) => {
      console.log(`\n${idx + 1}. ${task.name}`);
      console.log(`   Status: ${task.status}`);
      console.log(`   Progress: ${task.progress_percentage}%`);
      console.log(`   Updated: ${task.updated_at}`);
      console.log(`   Agent: ${task.agent_id}`);
    });
    
    // Count by status
    console.log('\n=== TRAINER PROSPECTS SUMMARY ===');
    const trainerSummary = {};
    trainerStats?.forEach(stat => {
      trainerSummary[stat.status] = (trainerSummary[stat.status] || 0) + 1;
    });
    Object.entries(trainerSummary).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
    console.log('\n=== CLIENT PROSPECTS SUMMARY ===');
    const clientSummary = {};
    clientStats?.forEach(stat => {
      clientSummary[stat.status] = (clientSummary[stat.status] || 0) + 1;
    });
    Object.entries(clientSummary).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getAgentStatus();
