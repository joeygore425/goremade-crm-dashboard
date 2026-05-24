const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://ulrgyupbhkmuzrcpzaov.supabase.co",
  "sb_secret_Hy3XWLYM1eteq7dHK4IqLA_pDx2wzG8"
);

async function getAgentStatus() {
  try {
    // Get agents table
    const { data: agents } = await supabase
      .from("agents")
      .select("*");
    
    console.log("=== AGENTS ===");
    if (agents && agents.length > 0) {
      agents.forEach(agent => {
        console.log(`\n${agent.name || agent.id}:`);
        console.log(`  Status: ${agent.status || 'unknown'}`);
        console.log(`  Last Updated: ${agent.updated_at || 'n/a'}`);
        console.log(JSON.stringify(agent, null, 2));
      });
    } else {
      console.log("No agents found");
    }

    // Get agent_runs with recent data
    const { data: runs } = await supabase
      .from("agent_runs")
      .select("*")
      .order('created_at', { ascending: false })
      .limit(20);
    
    console.log("\n\n=== RECENT AGENT RUNS ===");
    if (runs && runs.length > 0) {
      runs.forEach(run => {
        console.log(`\n${run.agent_name || run.id}:`);
        console.log(`  Status: ${run.status}`);
        console.log(`  Created: ${run.created_at}`);
        console.log(`  Summary: ${run.summary || 'n/a'}`);
      });
    }

    // Get trainer prospects summary
    const { data: trainers } = await supabase
      .from("trainer_prospects")
      .select("*");
    
    console.log("\n\n=== TRAINER PROSPECTS SUMMARY ===");
    const trainerStatus = {};
    if (trainers) {
      trainers.forEach(t => {
        if (!trainerStatus[t.status]) trainerStatus[t.status] = 0;
        trainerStatus[t.status]++;
      });
      Object.entries(trainerStatus).sort().forEach(([status, count]) => {
        console.log(`  ${status}: ${count}`);
      });
      console.log(`  TOTAL: ${trainers.length}`);
    }

    // Get client prospects summary
    const { data: clients } = await supabase
      .from("client_prospects")
      .select("*");
    
    console.log("\n=== CLIENT PROSPECTS SUMMARY ===");
    const clientStatus = {};
    if (clients) {
      clients.forEach(c => {
        if (!clientStatus[c.status]) clientStatus[c.status] = 0;
        clientStatus[c.status]++;
      });
      Object.entries(clientStatus).sort().forEach(([status, count]) => {
        console.log(`  ${status}: ${count}`);
      });
      console.log(`  TOTAL: ${clients.length}`);
    }

  } catch (error) {
    console.error("Error:", error.message);
  }
}

getAgentStatus();
