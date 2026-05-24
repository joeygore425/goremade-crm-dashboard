const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://ulrgyupbhkmuzrcpzaov.supabase.co",
  "sb_secret_Hy3XWLYM1eteq7dHK4IqLA_pDx2wzG8"
);

async function queryFullStatus() {
  try {
    // Get trainer prospects with all details to analyze by source
    console.log("=== TRAINER PROSPECTS DETAIL ===");
    const { data: trainers } = await supabase
      .from("trainer_prospects")
      .select("*");
    
    if (trainers && trainers.length > 0) {
      console.log("Sample record:");
      console.log(JSON.stringify(trainers[0], null, 2));
      
      // Group by status
      const statusMap = {};
      trainers.forEach(t => {
        if (!statusMap[t.status]) statusMap[t.status] = [];
        statusMap[t.status].push(t);
      });
      
      console.log("\nTrainer Status Breakdown:");
      Object.entries(statusMap).forEach(([status, records]) => {
        console.log(`  ${status}: ${records.length}`);
      });
    }

    // Get client prospects
    console.log("\n=== CLIENT PROSPECTS DETAIL ===");
    const { data: clients } = await supabase
      .from("client_prospects")
      .select("*");
    
    if (clients && clients.length > 0) {
      console.log("Sample record:");
      console.log(JSON.stringify(clients[0], null, 2));
      
      const statusMap = {};
      clients.forEach(c => {
        if (!statusMap[c.status]) statusMap[c.status] = [];
        statusMap[c.status].push(c);
      });
      
      console.log("\nClient Status Breakdown:");
      Object.entries(statusMap).forEach(([status, records]) => {
        console.log(`  ${status}: ${records.length}`);
      });
    }

    // Check tasks for agent names
    console.log("\n=== TASKS TABLE ===");
    const { data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .limit(20);
    
    if (tasks && tasks.length > 0) {
      console.log("Sample task:");
      console.log(JSON.stringify(tasks[0], null, 2));
    }

  } catch (error) {
    console.error("Error:", error.message);
  }
}

queryFullStatus();
