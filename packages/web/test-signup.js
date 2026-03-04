const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://efgizrbiotnrlgtdojku.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmZ2l6cmJpb3RucmxndGRvamt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTIzNTMsImV4cCI6MjA4ODIyODM1M30.3PlXcZeJVm4j8EJ7L_fEy-HnhpE5-VOmmO2qJxm-kr8'
);

async function test() {
    console.log("Testing Signup...");
    const fakeEmail = `testuser${Date.now()}@example.com`;
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: fakeEmail,
        password: "password123!",
    });
    console.log("Signup Error:", signUpError || "Success!");
    console.log("Signup Data:", signUpData);
}

test();
