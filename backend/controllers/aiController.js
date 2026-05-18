// controllers/aiController.js - AI-powered recommendation engine using OpenRouter API
const fetch = require('node-fetch');
const Employee = require('../models/Employee');
const { AppError } = require('../middleware/errorHandler');

/**
 * Call OpenRouter API with a given prompt
 */
const callOpenRouter = async (prompt) => {
  const response = await fetch(`${process.env.OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'Employee Analytics System'
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert HR analytics AI assistant. Analyze employee performance data and provide concise, actionable recommendations. 
          Focus on: promotion eligibility, training needs, skill gaps, and career development. 
          Keep responses structured with clear sections. Be specific and data-driven.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'OpenRouter API call failed');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No recommendation generated';
};

// ─── Controllers ───────────────────────────────────────────────────────────────

/**
 * @desc    Generate AI recommendation for a single employee
 * @route   POST /api/ai/recommend
 * @access  Private
 */
exports.generateRecommendation = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return next(new AppError('Employee ID is required', 400));
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }

    const prompt = `
Analyze the following employee and provide a comprehensive performance recommendation:

Employee Details:
- Name: ${employee.name}
- Department: ${employee.department}
- Performance Score: ${employee.performanceScore}/100
- Years of Experience: ${employee.experience}
- Skills: ${employee.skills.join(', ')}

Please provide:
1. **Promotion Recommendation**: Should this employee be promoted? Why?
2. **Training Suggestions**: What specific training or certifications would benefit them?
3. **Skill Enhancement**: What skills should they develop next?
4. **AI Feedback**: Overall performance assessment and actionable feedback
5. **Rating**: Overall rating (Excellent/Good/Average/Needs Improvement)
    `;

    const recommendation = await callOpenRouter(prompt);

    // Save recommendation to employee record
    employee.aiRecommendation = recommendation;
    await employee.save();

    res.status(200).json({
      success: true,
      message: 'AI recommendation generated successfully',
      data: {
        employee: {
          id: employee._id,
          name: employee.name,
          department: employee.department,
          performanceScore: employee.performanceScore
        },
        recommendation
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Rank all employees using AI analysis
 * @route   POST /api/ai/rank
 * @access  Private
 */
exports.rankEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });

    if (employees.length === 0) {
      return next(new AppError('No employees found to rank', 404));
    }

    const employeeList = employees.map((emp, i) => 
      `${i + 1}. ${emp.name} (${emp.department}) - Score: ${emp.performanceScore}, Experience: ${emp.experience}yrs, Skills: ${emp.skills.join(', ')}`
    ).join('\n');

    const prompt = `
Rank the following employees based on their overall performance and potential:

${employeeList}

For each employee provide:
1. Their rank position and justification
2. Promotion readiness (Ready/Not Ready/Conditionally Ready)
3. Key strengths
4. Development area

Format as a structured analysis.
    `;

    const rankingAnalysis = await callOpenRouter(prompt);

    res.status(200).json({
      success: true,
      message: 'Employee ranking generated successfully',
      data: {
        totalEmployees: employees.length,
        rankingAnalysis,
        employees: employees.map((emp, i) => ({
          rank: i + 1,
          name: emp.name,
          department: emp.department,
          performanceScore: emp.performanceScore,
          experience: emp.experience
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get AI training suggestions for an employee
 * @route   POST /api/ai/training
 * @access  Private
 */
exports.getTrainingSuggestions = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return next(new AppError('Employee not found', 404));
    }

    const prompt = `
For the following employee in the ${employee.department} department, suggest a detailed training and development plan:

Current Skills: ${employee.skills.join(', ')}
Performance Score: ${employee.performanceScore}/100
Experience: ${employee.experience} years

Provide:
1. **Immediate Training (0-3 months)**: Critical skills to learn now
2. **Medium-term Development (3-6 months)**: Skills to develop for growth
3. **Long-term Career Path (6-12 months)**: Advanced certifications and leadership training
4. **Online Resources**: Specific courses (Coursera, Udemy, etc.)
5. **Estimated Impact**: How training will improve performance score
    `;

    const trainingSuggestions = await callOpenRouter(prompt);

    res.status(200).json({
      success: true,
      data: {
        employee: { id: employee._id, name: employee.name },
        trainingSuggestions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate department-level AI analytics
 * @route   POST /api/ai/department-analysis
 * @access  Private
 */
exports.getDepartmentAnalysis = async (req, res, next) => {
  try {
    const { department } = req.body;
    const employees = await Employee.find(department ? { department } : {});

    if (employees.length === 0) {
      return next(new AppError('No employees found', 404));
    }

    const avgScore = (employees.reduce((sum, e) => sum + e.performanceScore, 0) / employees.length).toFixed(2);
    const topPerformer = employees.sort((a, b) => b.performanceScore - a.performanceScore)[0];

    const prompt = `
Department Analytics for ${department || 'All Departments'}:

Total Employees: ${employees.length}
Average Performance Score: ${avgScore}/100
Top Performer: ${topPerformer.name} (Score: ${topPerformer.performanceScore})

Department breakdown:
${employees.map(e => `- ${e.name}: Score ${e.performanceScore}, Skills: ${e.skills.join(', ')}`).join('\n')}

Provide:
1. **Department Health Assessment**
2. **Team Strengths**
3. **Areas for Improvement**
4. **Hiring Recommendations**: Skills/roles the department needs
5. **Team Building Suggestions**
    `;

    const analysis = await callOpenRouter(prompt);

    res.status(200).json({
      success: true,
      data: {
        department: department || 'All',
        totalEmployees: employees.length,
        averageScore: avgScore,
        analysis
      }
    });
  } catch (error) {
    next(error);
  }
};
