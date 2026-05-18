async function seedMoreData() {
  try {
    console.log('1. Logging in as Admin...');
    let token;
    let loginRes = await fetch('http://localhost:5100/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@company.com', password: 'password123' })
    });
    
    if (!loginRes.ok) {
        throw new Error("Login failed");
    }
    let loginData = await loginRes.json();
    token = loginData.token;

    console.log('✅ Token acquired');
    
    const employeesToAdd = [
      {
        name: 'Rahul Khanna',
        email: 'rahul.k@company.com',
        department: 'Marketing',
        skills: ['SEO', 'Content Strategy', 'Google Ads'],
        performanceScore: 78,
        experience: 4
      },
      {
        name: 'Sneha Patel',
        email: 'sneha.p@company.com',
        department: 'HR',
        skills: ['Recruitment', 'Employee Relations', 'Payroll'],
        performanceScore: 88,
        experience: 6
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.s@company.com',
        department: 'Sales',
        skills: ['B2B Sales', 'Negotiation', 'CRM'],
        performanceScore: 95,
        experience: 8
      },
      {
        name: 'Anjali Desai',
        email: 'anjali.d@company.com',
        department: 'Finance',
        skills: ['Accounting', 'Financial Modeling', 'Excel'],
        performanceScore: 65,
        experience: 2
      }
    ];

    for (let i = 0; i < employeesToAdd.length; i++) {
        const emp = employeesToAdd[i];
        console.log(`Adding employee ${i+1}: ${emp.name}`);
        const empRes = await fetch('http://localhost:5100/api/employees', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(emp)
        });
        const empData = await empRes.json();
        if (empRes.ok) {
            console.log(`✅ Employee ${i+1} added successfully!`, empData.data.name);
        } else {
            console.log(`❌ Failed to add ${emp.name}:`, empData.message);
        }
    }

    console.log('🎉 Done adding 4 more employees!');

  } catch (err) {
    console.error('Error:', err.message);
  }
}

seedMoreData();
