import { NextResponse } from "next/server"

// This is a simple API route to handle resume data updates
// In a real application, you would connect this to a database

// Sample resume data structure with expanded fields for ATS compatibility
const resumeData = {
  personalInfo: {
    name: "Asmit Ghosh",
    email: "asmitghosh2004@gmail.com",
    phone: "+91-987-534-2543",
    website: "asmitghosh.tech",
    linkedin: "https://linkedin.com/in/asmitghosh",
    github: "https://github.com/asmitghosh",
    photo: "/placeholder.svg?height=256&width=256",
    summary:
      "A highly motivated engineering student with a passion for AI, ML, and web development, alongside entrepreneurial experience in social media management and AI-driven platforms. Skilled in software development, UI/UX design, and AI-powered automation, with a proven track record of leading innovative projects and winning national-level competitions.",
  },
  education: [
    {
      institution: "Heritage Institute of Technology, Kolkata",
      degree: "B.Tech in Electronics and Communication Engineering",
      graduationYear: "2027",
      gpa: "7.9",
      description: "Focusing on AI/ML applications in electronics and communication systems.",
    },
  ],
  experience: [
    {
      title: "Founder & Lead – Astra",
      company: "Social Media Management & Web Development Team",
      type: "entrepreneurial",
      startDate: "Jan 2025",
      endDate: "Present",
      description: [
        "Built and led a social media and web development team offering digital marketing, branding, and web solutions to startups and businesses.",
        "Developed over 10+ high-performance websites for various clients, focusing on UI/UX, SEO, and optimization.",
        "Successfully managed branding strategies for businesses, improving audience engagement by 35% through targeted content and AI-driven analytics.",
      ],
    },
    {
      title: "Core Developer & Lead – ADISHRAR",
      company: "AI-Based Learning Management System",
      type: "entrepreneurial",
      startDate: "Dec 2024",
      endDate: "Present",
      description: [
        "Spearheading the development of ADISHRAR, an AI-powered LMS platform designed to enhance personalized learning experiences.",
        "Implemented ML algorithms to analyze student performance and recommend customized study paths.",
        "Integrated real-time analytics dashboards for educators, tracking student progress and optimizing learning efficiency.",
      ],
    },
    {
      title: "Part-Time Tutor & Mentor",
      company: "",
      type: "work",
      startDate: "March 2023",
      endDate: "Present",
      description: [
        "Mentored students in Physics, improving their academic proficiency.",
        "Designed custom learning roadmaps for students aspiring to enter AI/ML domains.",
      ],
    },
    {
      title: "Freelance Video Editor & Graphic Designer",
      company: "",
      type: "work",
      startDate: "July 2022",
      endDate: "Present",
      description: [
        "Created brand videos and promotional content for businesses using Filmora and Canva.",
        "Managed social media creatives, increasing brand engagement by 30%.",
      ],
    },
  ],
  skills: {
    programming: ["Python", "JavaScript", "C++", "HTML/CSS", "SQL"],
    aiml: ["TensorFlow", "PyTorch", "OpenCV", "Scikit-learn"],
    webDev: ["React.js", "Next.js", "Node.js", "Flask", "Django"],
    databases: ["MySQL", "MongoDB", "Firebase"],
    devops: ["AWS", "Google Cloud", "Docker", "Git", "Linux"],
    design: ["Canva", "Lightroom", "Filmora", "Blender"],
    other: ["RESTful APIs", "Web Scraping", "Cybersecurity Fundamentals"],
  },
  languages: [
    { name: "English", proficiency: "Fluent" },
    { name: "Hindi", proficiency: "Fluent" },
    { name: "Bengali", proficiency: "Native" },
  ],
  projects: [
    {
      title: "Smart AI-Based Traffic Management System",
      achievement: "National Level SIH Hackathon Qualifier",
      technologies: ["Python", "TensorFlow", "OpenCV"],
      description: [
        "Designed a real-time AI model for optimizing traffic flow, reducing congestion, and improving road safety.",
        "Implemented adaptive signal controls based on live traffic density analysis.",
      ],
      link: "",
    },
    {
      title: "ALARMS – AI-Based Live Anomaly Detection",
      achievement: "3rd Place & Special Achievement – Tech Knights 2024",
      technologies: ["Python", "OpenCV", "IoT Sensors"],
      description: [
        "Developed an AI-powered real-time anomaly detection system for industrial monitoring.",
        "Achieved 92% accuracy in detecting operational failures, preventing potential breakdowns.",
      ],
      link: "",
    },
  ],
  certifications: [
    {
      title: "Machine Learning Bootcamp",
      issuer: "Udemy",
      year: "2023",
      description: "Comprehensive training in machine learning algorithms and applications.",
    },
    {
      title: "Advanced Web Development with React",
      issuer: "Coursera",
      year: "2022",
      description: "In-depth study of React.js and modern web development practices.",
    },
    {
      title: "Introduction to AI",
      issuer: "edX",
      year: "2021",
      description: "Fundamentals of artificial intelligence and its applications.",
    },
  ],
  achievements: [
    {
      title: "Winner – HackHeritage",
      description: "Inter-College Hackathon (AI/ML-based project development)",
    },
    {
      title: "Qualified – Smart India Hackathon",
      description: "National Level (AI-driven Traffic Management System)",
    },
    {
      title: "3rd Place – Tech Knights 2.0",
      description: "ALARMS – AI-Based Anomaly Detection System",
    },
  ],
  activities: [
    {
      title: "Web Development Club",
      description: "Member, Heritage Institute of Technology",
    },
    {
      title: "AI/ML Contributor",
      description: "Participates in Kaggle challenges and AI forums",
    },
    {
      title: "Event Organizer",
      description: "Hosted coding workshops and AI discussions for student communities",
    },
  ],
  interests: ["AI/ML Research", "Entrepreneurship & Startups", "Web & App Development", "UI/UX Design & Automation"],
}

export async function GET() {
  return NextResponse.json(resumeData)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // In a real application, you would validate the data and save it to a database
    // For this example, we'll just update our in-memory object

    // Handle different section updates
    if (data.personalInfo) {
      resumeData.personalInfo = {
        ...resumeData.personalInfo,
        ...data.personalInfo,
      }
    }

    if (data.education) {
      resumeData.education = data.education
    }

    if (data.experience) {
      resumeData.experience = data.experience
    }

    if (data.skills) {
      resumeData.skills = data.skills
    }

    if (data.languages) {
      resumeData.languages = data.languages
    }

    if (data.projects) {
      resumeData.projects = data.projects
    }

    if (data.certifications) {
      resumeData.certifications = data.certifications
    }

    if (data.achievements) {
      resumeData.achievements = data.achievements
    }

    if (data.activities) {
      resumeData.activities = data.activities
    }

    if (data.interests) {
      resumeData.interests = data.interests
    }

    return NextResponse.json({
      success: true,
      message: "Resume data updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update resume data" }, { status: 500 })
  }
}

