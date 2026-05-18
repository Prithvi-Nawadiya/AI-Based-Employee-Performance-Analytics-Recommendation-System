async function seedData() {
  try {
    console.log('1. Registering Admin user...');
    let token;
    let registerRes = await fetch('http://localhost:5100/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Admin',
        email: 'admin@company.com',
        password: 'password123',
        role: 'hr'
      })
    });
    
    let regData = await registerRes.json();
    
    if (!registerRes.ok && registerRes.status === 400) {
      console.log('Admin already exists. Logging in...');
      let loginRes = await fetch('http://localhost:5100/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@company.com', password: 'password123' })
      });
      let loginData = await loginRes.json();
      token = loginData.token;
    } else {
      token = regData.token;
    }

    console.log('✅ Token acquired:', token.substring(0, 20) + '...');

    console.log('2. Adding new employee: Aman Verma');
    const empRes = await fetch('http://localhost:5100/api/employees', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        name: 'Aman Verma',
        email: 'aman.verma@company.com',
        department: 'Development',
        skills: ['React', 'Node.js', 'MongoDB'],
        performanceScore: 85,
        experience: 3
      })
    });
    const empData = await empRes.json();
    console.log('✅ Employee added successfully!', empData.data.name);

    console.log('3. Adding new employee: Priya Sharma');
    const empRes2 = await fetch('http://localhost:5100/api/employees', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        name: 'Priya Sharma',
        email: 'priya.sharma@company.com',
        department: 'Design',
        skills: ['Figma', 'UI/UX', 'CSS'],
        performanceScore: 92,
        experience: 5
      })
    });
    const empData2 = await empRes2.json();
    console.log('✅ Employee 2 added successfully!', empData2.data.name);

    console.log('🎉 Done adding dummy data!');

  } catch (err) {
    console.error('Error:', err.message);
  }
}

seedData();
