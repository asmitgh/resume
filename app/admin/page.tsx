"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { PlusCircle, Trash2, Save, ArrowLeft, Eye, Lock } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [resumeData, setResumeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("personal")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")

  // Simple authentication for demo purposes
  // In a real app, you would use a proper authentication system
  const authenticate = () => {
    // This is just a placeholder - in a real app, use proper authentication
    if (password === "admin123") {
      setIsAuthenticated(true)
      localStorage.setItem("admin-auth", "true")
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid password",
        variant: "destructive",
      })
    }
  }

  // Check if user is already authenticated
  useEffect(() => {
    const auth = localStorage.getItem("admin-auth")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  // Fetch resume data on component mount
  useEffect(() => {
    if (!isAuthenticated) return

    const fetchResumeData = async () => {
      try {
        const response = await fetch("/api/resume")
        const data = await response.json()
        setResumeData(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching resume data:", error)
        toast({
          title: "Error",
          description: "Failed to load resume data",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchResumeData()
  }, [isAuthenticated])

  const handleSave = async (section, data) => {
    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [section]: data }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Resume data updated successfully",
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Error saving resume data:", error)
      toast({
        title: "Error",
        description: "Failed to save resume data",
        variant: "destructive",
      })
    }
  }

  // Personal Info handlers
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }))
  }

  // Experience handlers
  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          title: "",
          company: "",
          type: "work", // default type
          startDate: "",
          endDate: "",
          description: [""],
        },
      ],
    }))
  }

  const updateExperience = (index, field, value) => {
    setResumeData((prev) => {
      const updatedExperience = [...prev.experience]
      updatedExperience[index] = {
        ...updatedExperience[index],
        [field]: value,
      }
      return {
        ...prev,
        experience: updatedExperience,
      }
    })
  }

  const updateExperienceDescription = (expIndex, descIndex, value) => {
    setResumeData((prev) => {
      const updatedExperience = [...prev.experience]
      const updatedDescriptions = [...updatedExperience[expIndex].description]
      updatedDescriptions[descIndex] = value

      updatedExperience[expIndex] = {
        ...updatedExperience[expIndex],
        description: updatedDescriptions,
      }

      return {
        ...prev,
        experience: updatedExperience,
      }
    })
  }

  const addExperienceDescription = (expIndex) => {
    setResumeData((prev) => {
      const updatedExperience = [...prev.experience]
      updatedExperience[expIndex] = {
        ...updatedExperience[expIndex],
        description: [...updatedExperience[expIndex].description, ""],
      }

      return {
        ...prev,
        experience: updatedExperience,
      }
    })
  }

  const removeExperienceDescription = (expIndex, descIndex) => {
    setResumeData((prev) => {
      const updatedExperience = [...prev.experience]
      const updatedDescriptions = [...updatedExperience[expIndex].description]
      updatedDescriptions.splice(descIndex, 1)

      updatedExperience[expIndex] = {
        ...updatedExperience[expIndex],
        description: updatedDescriptions,
      }

      return {
        ...prev,
        experience: updatedExperience,
      }
    })
  }

  const removeExperience = (index) => {
    setResumeData((prev) => {
      const updatedExperience = [...prev.experience]
      updatedExperience.splice(index, 1)

      return {
        ...prev,
        experience: updatedExperience,
      }
    })
  }

  // Education handlers
  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: "",
          degree: "",
          graduationYear: "",
          gpa: "",
          description: "",
        },
      ],
    }))
  }

  const updateEducation = (index, field, value) => {
    setResumeData((prev) => {
      const updatedEducation = [...prev.education]
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value,
      }
      return {
        ...prev,
        education: updatedEducation,
      }
    })
  }

  const removeEducation = (index) => {
    setResumeData((prev) => {
      const updatedEducation = [...prev.education]
      updatedEducation.splice(index, 1)

      return {
        ...prev,
        education: updatedEducation,
      }
    })
  }

  // Project handlers
  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "",
          achievement: "",
          technologies: [],
          description: [""],
          link: "",
        },
      ],
    }))
  }

  const updateProject = (index, field, value) => {
    setResumeData((prev) => {
      const updatedProjects = [...prev.projects]

      if (field === "technologies") {
        // Handle technologies as an array
        updatedProjects[index] = {
          ...updatedProjects[index],
          technologies: value.split(",").map((tech) => tech.trim()),
        }
      } else {
        updatedProjects[index] = {
          ...updatedProjects[index],
          [field]: value,
        }
      }

      return {
        ...prev,
        projects: updatedProjects,
      }
    })
  }

  const updateProjectDescription = (projIndex, descIndex, value) => {
    setResumeData((prev) => {
      const updatedProjects = [...prev.projects]
      const updatedDescriptions = [...updatedProjects[projIndex].description]
      updatedDescriptions[descIndex] = value

      updatedProjects[projIndex] = {
        ...updatedProjects[projIndex],
        description: updatedDescriptions,
      }

      return {
        ...prev,
        projects: updatedProjects,
      }
    })
  }

  const addProjectDescription = (projIndex) => {
    setResumeData((prev) => {
      const updatedProjects = [...prev.projects]
      updatedProjects[projIndex] = {
        ...updatedProjects[projIndex],
        description: [...updatedProjects[projIndex].description, ""],
      }

      return {
        ...prev,
        projects: updatedProjects,
      }
    })
  }

  const removeProjectDescription = (projIndex, descIndex) => {
    setResumeData((prev) => {
      const updatedProjects = [...prev.projects]
      const updatedDescriptions = [...updatedProjects[projIndex].description]
      updatedDescriptions.splice(descIndex, 1)

      updatedProjects[projIndex] = {
        ...updatedProjects[projIndex],
        description: updatedDescriptions,
      }

      return {
        ...prev,
        projects: updatedProjects,
      }
    })
  }

  const removeProject = (index) => {
    setResumeData((prev) => {
      const updatedProjects = [...prev.projects]
      updatedProjects.splice(index, 1)

      return {
        ...prev,
        projects: updatedProjects,
      }
    })
  }

  // Skills handlers
  const updateSkill = (category, index, value) => {
    setResumeData((prev) => {
      const updatedSkills = { ...prev.skills }
      const categorySkills = [...updatedSkills[category]]
      categorySkills[index] = value

      return {
        ...prev,
        skills: {
          ...updatedSkills,
          [category]: categorySkills,
        },
      }
    })
  }

  const addSkill = (category) => {
    setResumeData((prev) => {
      const updatedSkills = { ...prev.skills }

      return {
        ...prev,
        skills: {
          ...updatedSkills,
          [category]: [...updatedSkills[category], ""],
        },
      }
    })
  }

  const removeSkill = (category, index) => {
    setResumeData((prev) => {
      const updatedSkills = { ...prev.skills }
      const categorySkills = [...updatedSkills[category]]
      categorySkills.splice(index, 1)

      return {
        ...prev,
        skills: {
          ...updatedSkills,
          [category]: categorySkills,
        },
      }
    })
  }

  const addSkillCategory = () => {
    const categoryName = prompt("Enter new skill category name (lowercase, no spaces):")
    if (!categoryName) return

    const formattedName = categoryName.toLowerCase().replace(/\s+/g, "")

    setResumeData((prev) => {
      if (prev.skills[formattedName]) {
        toast({
          title: "Error",
          description: "Category already exists",
          variant: "destructive",
        })
        return prev
      }

      return {
        ...prev,
        skills: {
          ...prev.skills,
          [formattedName]: [],
        },
      }
    })
  }

  // Language handlers
  const addLanguage = () => {
    setResumeData((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        {
          name: "",
          proficiency: "",
        },
      ],
    }))
  }

  const updateLanguage = (index, field, value) => {
    setResumeData((prev) => {
      const updatedLanguages = [...prev.languages]
      updatedLanguages[index] = {
        ...updatedLanguages[index],
        [field]: value,
      }
      return {
        ...prev,
        languages: updatedLanguages,
      }
    })
  }

  const removeLanguage = (index) => {
    setResumeData((prev) => {
      const updatedLanguages = [...prev.languages]
      updatedLanguages.splice(index, 1)

      return {
        ...prev,
        languages: updatedLanguages,
      }
    })
  }

  // Certification handlers
  const addCertification = () => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          title: "",
          issuer: "",
          year: "",
          description: "",
        },
      ],
    }))
  }

  const updateCertification = (index, field, value) => {
    setResumeData((prev) => {
      const updatedCertifications = [...prev.certifications]
      updatedCertifications[index] = {
        ...updatedCertifications[index],
        [field]: value,
      }
      return {
        ...prev,
        certifications: updatedCertifications,
      }
    })
  }

  const removeCertification = (index) => {
    setResumeData((prev) => {
      const updatedCertifications = [...prev.certifications]
      updatedCertifications.splice(index, 1)

      return {
        ...prev,
        certifications: updatedCertifications,
      }
    })
  }

  // Achievement handlers
  const addAchievement = () => {
    setResumeData((prev) => ({
      ...prev,
      achievements: [
        ...prev.achievements,
        {
          title: "",
          description: "",
        },
      ],
    }))
  }

  const updateAchievement = (index, field, value) => {
    setResumeData((prev) => {
      const updatedAchievements = [...prev.achievements]
      updatedAchievements[index] = {
        ...updatedAchievements[index],
        [field]: value,
      }
      return {
        ...prev,
        achievements: updatedAchievements,
      }
    })
  }

  const removeAchievement = (index) => {
    setResumeData((prev) => {
      const updatedAchievements = [...prev.achievements]
      updatedAchievements.splice(index, 1)

      return {
        ...prev,
        achievements: updatedAchievements,
      }
    })
  }

  // Activity handlers
  const addActivity = () => {
    setResumeData((prev) => ({
      ...prev,
      activities: [
        ...prev.activities,
        {
          title: "",
          description: "",
        },
      ],
    }))
  }

  const updateActivity = (index, field, value) => {
    setResumeData((prev) => {
      const updatedActivities = [...prev.activities]
      updatedActivities[index] = {
        ...updatedActivities[index],
        [field]: value,
      }
      return {
        ...prev,
        activities: updatedActivities,
      }
    })
  }

  const removeActivity = (index) => {
    setResumeData((prev) => {
      const updatedActivities = [...prev.activities]
      updatedActivities.splice(index, 1)

      return {
        ...prev,
        activities: updatedActivities,
      }
    })
  }

  // Interest handlers
  const addInterest = () => {
    setResumeData((prev) => ({
      ...prev,
      interests: [...prev.interests, ""],
    }))
  }

  const updateInterest = (index, value) => {
    setResumeData((prev) => {
      const updatedInterests = [...prev.interests]
      updatedInterests[index] = value
      return {
        ...prev,
        interests: updatedInterests,
      }
    })
  }

  const removeInterest = (index) => {
    setResumeData((prev) => {
      const updatedInterests = [...prev.interests]
      updatedInterests.splice(index, 1)

      return {
        ...prev,
        interests: updatedInterests,
      }
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your password to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && authenticate()}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={authenticate}>
              <Lock className="mr-2 h-4 w-4" />
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p>Please wait while we fetch your resume data.</p>
        </div>
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>Failed to load resume data. Please try again later.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Resume Management Dashboard</h1>
          <p className="text-muted-foreground">Update and manage your resume information from this dashboard.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resume
          </Button>
          <Button onClick={() => window.open("/", "_blank")}>
            <Eye className="mr-2 h-4 w-4" />
            View Resume
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your basic personal and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={resumeData.personalInfo.name}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={resumeData.personalInfo.email}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={resumeData.personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={resumeData.personalInfo.website}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={resumeData.personalInfo.linkedin}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    name="github"
                    value={resumeData.personalInfo.github}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photo">Profile Photo URL</Label>
                  <Input
                    id="photo"
                    name="photo"
                    value={resumeData.personalInfo.photo}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={resumeData.personalInfo.summary}
                  onChange={handlePersonalInfoChange}
                  rows={5}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("personalInfo", resumeData.personalInfo)}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>Manage your work experience and entrepreneurial ventures.</CardDescription>
              </div>
              <Button onClick={addExperience}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </CardHeader>
            <CardContent className="space-y-8">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Experience #{index + 1}</h3>
                    <Button variant="destructive" size="sm" onClick={() => removeExperience(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${index}`}>Title/Position</Label>
                      <Input
                        id={`title-${index}`}
                        value={exp.title}
                        onChange={(e) => updateExperience(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`company-${index}`}>Company/Organization</Label>
                      <Input
                        id={`company-${index}`}
                        value={exp.company}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`type-${index}`}>Experience Type</Label>
                      <select
                        id={`type-${index}`}
                        value={exp.type}
                        onChange={(e) => updateExperience(index, "type", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="work">Work Experience</option>
                        <option value="entrepreneurial">Entrepreneurial Venture</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                      <Input
                        id={`startDate-${index}`}
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`endDate-${index}`}>End Date</Label>
                      <Input
                        id={`endDate-${index}`}
                        value={exp.endDate}
                        onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <Label>Description Points</Label>
                      <Button variant="outline" size="sm" onClick={() => addExperienceDescription(index)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Point
                      </Button>
                    </div>

                    {exp.description.map((desc, descIndex) => (
                      <div key={descIndex} className="flex gap-2">
                        <Textarea
                          value={desc}
                          onChange={(e) => updateExperienceDescription(index, descIndex, e.target.value)}
                          className="flex-1"
                        />
                        {exp.description.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExperienceDescription(index, descIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("experience", resumeData.experience)}>
                <Save className="mr-2 h-4 w-4" />
                Save All Experience
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Education</CardTitle>
                <CardDescription>Manage your educational background and qualifications.</CardDescription>
              </div>
              <Button onClick={addEducation}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Education
              </Button>
            </CardHeader>
            <CardContent className="space-y-8">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Education #{index + 1}</h3>
                    <Button variant="destructive" size="sm" onClick={() => removeEducation(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`institution-${index}`}>Institution</Label>
                      <Input
                        id={`institution-${index}`}
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`degree-${index}`}>Degree</Label>
                      <Input
                        id={`degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`graduationYear-${index}`}>Graduation Year</Label>
                      <Input
                        id={`graduationYear-${index}`}
                        value={edu.graduationYear}
                        onChange={(e) => updateEducation(index, "graduationYear", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`gpa-${index}`}>GPA</Label>
                      <Input
                        id={`gpa-${index}`}
                        value={edu.gpa}
                        onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`eduDescription-${index}`}>Description</Label>
                    <Textarea
                      id={`eduDescription-${index}`}
                      value={edu.description}
                      onChange={(e) => updateEducation(index, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("education", resumeData.education)}>
                <Save className="mr-2 h-4 w-4" />
                Save All Education
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Manage your technical skills and competencies.</CardDescription>
              </div>
              <Button onClick={addSkillCategory}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Skill Category
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={Object.keys(resumeData.skills)[0]} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
                  {Object.keys(resumeData.skills).map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.keys(resumeData.skills).map((category) => (
                  <TabsContent key={category} value={category} className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold capitalize">{category} Skills</h3>
                      <Button variant="outline" size="sm" onClick={() => addSkill(category)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Skill
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {resumeData.skills[category].map((skill, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={skill}
                            onChange={(e) => updateSkill(category, index, e.target.value)}
                            className="flex-1"
                          />
                          {resumeData.skills[category].length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => removeSkill(category, index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button className="mt-4" onClick={() => handleSave("skills", resumeData.skills)}>
                      <Save className="mr-2 h-4 w-4" />
                      Save {category} Skills
                    </Button>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Languages</CardTitle>
                <CardDescription>Manage your language proficiencies.</CardDescription>
              </div>
              <Button onClick={addLanguage}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Language
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.languages.map((language, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Language"
                    value={language.name}
                    onChange={(e) => updateLanguage(index, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Proficiency"
                    value={language.proficiency}
                    onChange={(e) => updateLanguage(index, "proficiency", e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeLanguage(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("languages", resumeData.languages)}>
                <Save className="mr-2 h-4 w-4" />
                Save Languages
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Manage your projects and achievements.</CardDescription>
              </div>
              <Button onClick={addProject}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </CardHeader>
            <CardContent className="space-y-8">
              {resumeData.projects.map((project, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Project #{index + 1}</h3>
                    <Button variant="destructive" size="sm" onClick={() => removeProject(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`project-title-${index}`}>Project Title</Label>
                      <Input
                        id={`project-title-${index}`}
                        value={project.title}
                        onChange={(e) => updateProject(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`project-achievement-${index}`}>Achievement/Award</Label>
                      <Input
                        id={`project-achievement-${index}`}
                        value={project.achievement}
                        onChange={(e) => updateProject(index, "achievement", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor={`project-tech-${index}`}>Technologies (comma separated)</Label>
                      <Input
                        id={`project-tech-${index}`}
                        value={project.technologies.join(", ")}
                        onChange={(e) => updateProject(index, "technologies", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor={`project-link-${index}`}>Project Link (optional)</Label>
                      <Input
                        id={`project-link-${index}`}
                        value={project.link}
                        onChange={(e) => updateProject(index, "link", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <Label>Description Points</Label>
                      <Button variant="outline" size="sm" onClick={() => addProjectDescription(index)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Point
                      </Button>
                    </div>

                    {project.description.map((desc, descIndex) => (
                      <div key={descIndex} className="flex gap-2">
                        <Textarea
                          value={desc}
                          onChange={(e) => updateProjectDescription(index, descIndex, e.target.value)}
                          className="flex-1"
                        />
                        {project.description.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProjectDescription(index, descIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("projects", resumeData.projects)}>
                <Save className="mr-2 h-4 w-4" />
                Save All Projects
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Certifications</CardTitle>
                <CardDescription>Manage your certifications and professional qualifications.</CardDescription>
              </div>
              <Button onClick={addCertification}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Certification
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Certification #{index + 1}</h3>
                    <Button variant="destructive" size="sm" onClick={() => removeCertification(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor={`cert-title-${index}`}>Title</Label>
                      <Input
                        id={`cert-title-${index}`}
                        value={cert.title}
                        onChange={(e) => updateCertification(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`cert-issuer-${index}`}>Issuer</Label>
                      <Input
                        id={`cert-issuer-${index}`}
                        value={cert.issuer}
                        onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`cert-year-${index}`}>Year</Label>
                      <Input
                        id={`cert-year-${index}`}
                        value={cert.year}
                        onChange={(e) => updateCertification(index, "year", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`cert-description-${index}`}>Description</Label>
                    <Textarea
                      id={`cert-description-${index}`}
                      value={cert.description}
                      onChange={(e) => updateCertification(index, "description", e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("certifications", resumeData.certifications)}>
                <Save className="mr-2 h-4 w-4" />
                Save All Certifications
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Manage your achievements and awards.</CardDescription>
              </div>
              <Button onClick={addAchievement}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Achievement
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.achievements.map((achievement, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Achievement #{index + 1}</h3>
                    <Button variant="destructive" size="sm" onClick={() => removeAchievement(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`achievement-title-${index}`}>Title</Label>
                      <Input
                        id={`achievement-title-${index}`}
                        value={achievement.title}
                        onChange={(e) => updateAchievement(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`achievement-description-${index}`}>Description</Label>
                      <Textarea
                        id={`achievement-description-${index}`}
                        value={achievement.description}
                        onChange={(e) => updateAchievement(index, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("achievements", resumeData.achievements)}>
                <Save className="mr-2 h-4 w-4" />
                Save All Achievements
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Extracurricular Activities</CardTitle>
                <CardDescription>Manage your extracurricular activities and involvements.</CardDescription>
              </div>
              <Button onClick={addActivity}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Activity
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.activities.map((activity, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Activity #{index + 1}</h3>
                    <Button variant="destructive" size="sm" onClick={() => removeActivity(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`activity-title-${index}`}>Title</Label>
                      <Input
                        id={`activity-title-${index}`}
                        value={activity.title}
                        onChange={(e) => updateActivity(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`activity-description-${index}`}>Description</Label>
                      <Textarea
                        id={`activity-description-${index}`}
                        value={activity.description}
                        onChange={(e) => updateActivity(index, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("activities", resumeData.activities)}>
                <Save className="mr-2 h-4 w-4" />
                Save All Activities
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Interests Tab */}
        <TabsContent value="interests">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Interests</CardTitle>
                <CardDescription>Manage your personal and professional interests.</CardDescription>
              </div>
              <Button onClick={addInterest}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Interest
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.interests.map((interest, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={interest} onChange={(e) => updateInterest(index, e.target.value)} className="flex-1" />
                  <Button variant="ghost" size="icon" onClick={() => removeInterest(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave("interests", resumeData.interests)}>
                <Save className="mr-2 h-4 w-4" />
                Save All Interests
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}

