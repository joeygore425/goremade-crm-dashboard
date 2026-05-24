const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://ulrgyupbhkmuzrcpzaov.supabase.co",
  "sb_secret_Hy3XWLYM1eteq7dHK4IqLA_pDx2wzG8"
);

async function getAllTables() {
  try {
    // Query information schema
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (data) {
      console.log("=== ALL PUBLIC TABLES ===");
      data.forEach(t => console.log(`  - ${t.table_name}`));
    } else if (error) {
      console.log("Error fetching tables:", error);
      // Try alternative approach
      console.log("\nTrying alternative method...");
      
      // List some common table names
      const tableNames = [
        'agents', 'agent_runs', 'trainer_prospects', 'client_prospects',
        'bobby', 'scout', 'skywalker', 'apex', 'closer',
        'agent_statuses', 'agent_metrics', 'email_campaigns', 'run_logs'
      ];
      
      for (const tableName of tableNames) {
        const { data: result, error: e } = await supabase
          .from(tableName)
          .select('count(*)', { count: 'exact', head: true });
        
        if (!e) {
          console.log(`  ✓ ${tableName} exists`);
        }
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

getAllTables();
