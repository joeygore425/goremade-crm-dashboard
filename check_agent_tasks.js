const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://ulrgyupbhkmuzrcpzaov.supabase.co",
  "sb_secret_Hy3XWLYM1eteq7dHK4IqLA_pDx2wzG8"
);

async function getAgentTasks() {
  try {
    // Get tasks table with agent status
    const { data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .order('created_at', { ascending: false })
      .limit(100);
    
    console.log("=== AGENT TASKS SUMMARY ===\n");
    
    const agentStats = {};
    
    if (tasks && tasks.length > 0) {
      tasks.forEach(task => {
        const agentName = task.agent_name || task.task_name || 'unknown';
        
        if (!agentStats[agentName]) {
          agentStats[agentName] = {
            total: 0,
            by_status: {},
            latest: null
          };
        }
        
        agentStats[agentName].total++;
        if (!agentStats[agentName].by_status[task.status]) {
          agentStats[agentName].by_status[task.status] = 0;
        }
        agentStats[agentName].by_status[task.status]++;
        
        // Store latest if not set yet (first in the list since ordered by desc)
        if (!agentStats[agentName].latest) {
          agentStats[agentName].latest = task;
        }
      });
      
      // Print summary by agent
      Object.entries(agentStats).sort().forEach(([agent, stats]) => {
        console.log(`\n${agent}:`);
        console.log(`  Total tasks: ${stats.total}`);
        Object.entries(stats.by_status).forEach(([status, count]) => {
          console.log(`    - ${status}: ${count}`);
        });
        
        if (stats.latest) {
          console.log(`  Last run: ${stats.latest.created_at}`);
          console.log(`  Last status: ${stats.latest.status}`);
          if (stats.latest.summary) console.log(`  Summary: ${stats.latest.summary}`);
          if (stats.latest.details) console.log(`  Details: ${JSON.stringify(stats.latest.details)}`);
        }
      });
    } else {
      console.log("No tasks found");
    }
    
    // Also get event data if available
    const { data: events } = await supabase
      .from("events")
      .select("*")
      .order('created_at', { ascending: false })
      .limit(50);
    
    console.log("\n\n=== RECENT EVENTS (Last 15) ===");
    if (events && events.length > 0) {
      events.slice(0, 15).forEach(e => {
        const time = new Date(e.created_at).toLocaleString();
        console.log(`${time}: ${e.event_type} - ${e.description || e.agent_name || ''}`);
      });
    } else {
      console.log("No events found");
    }

  } catch (error) {
    console.error("Error:", error.message);
  }
}

getAgentTasks();
