#!/usr/bin/env node

// Database Setup Script for BlendTools
// This script helps verify Supabase connection and provides setup instructions

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://prbfqqnlcsujirmnasvy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYmZxcW5sY3N1amlybW5hc3Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NjA3NTMsImV4cCI6MjA3MjEzNjc1M30.-A20vU4oNh2MqjVhqs1HaO3BaRITBT22Cb9wlp4XoPo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔌 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase
      .from('_test')
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('✅ Connection successful! (Table not found is expected)');
      return true;
    } else if (error) {
      console.log('⚠️  Connection issue:', error.message);
      return false;
    } else {
      console.log('✅ Connection successful!');
      return true;
    }
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
    return false;
  }
}

async function checkTables() {
  console.log('📋 Checking database tables...');
  
  const tables = ['users', 'scripts', 'shaders', 'projects', 'render_jobs'];
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error && error.code === '42P01') {
        results[table] = '❌ Not found';
      } else if (error) {
        results[table] = `⚠️  Error: ${error.message}`;
      } else {
        results[table] = '✅ Exists';
      }
    } catch (err) {
      results[table] = `❌ Error: ${err.message}`;
    }
  }
  
  console.log('\nTable Status:');
  Object.entries(results).forEach(([table, status]) => {
    console.log(`  ${table}: ${status}`);
  });
  
  return results;
}

async function main() {
  console.log('🚀 BlendTools Database Setup Checker\n');
  
  const connected = await testConnection();
  
  if (!connected) {
    console.log('\n❌ Cannot connect to Supabase. Please check your credentials.');
    return;
  }
  
  const tableResults = await checkTables();
  
  const missingTables = Object.entries(tableResults)
    .filter(([, status]) => status.includes('Not found'))
    .map(([table]) => table);
  
  if (missingTables.length > 0) {
    console.log('\n📝 Next Steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Open the SQL Editor');
    console.log('3. Copy and paste the contents of database-schema.sql');
    console.log('4. Run the script');
    console.log('5. Restart your development server');
    console.log('\n🔗 Supabase Dashboard: https://supabase.com/dashboard/projects');
  } else {
    console.log('\n🎉 Database is fully set up!');
    console.log('Your BlendTools backend is ready to use.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}