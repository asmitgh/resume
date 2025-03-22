"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { PlusCircle, Trash2, Save } from "lucide-react"

export default function BackendPage() {
  const [resumeData, setResumeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("personal")

  // Fetch resume data on component mount
  useEffect(() => {
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
  }, [])

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

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          title: "",
          company: "",
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
      <h1 className="text-3xl font-bold mb-6">Resume Management Dashboard</h1>
      <p className="text-muted-foreground mb-8">Update and manage your resume information from this dashboard.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your basic personal and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-2 gap-4 mb-4">
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
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Manage your educational background and qualifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Institution</TableHead>
                    <TableHead>Degree</TableHead>
                    <TableHead>Graduation Year</TableHead>
                    <TableHead>GPA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resumeData.education.map((edu, index) => (
                    <TableRow key={index}>
                      <TableCell>{edu.institution}</TableCell>
                      <TableCell>{edu.degree}</TableCell>
                      <TableCell>{edu.graduationYear}</TableCell>
                      <TableCell>{edu.gpa}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Manage your technical skills and competencies.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="programming" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="programming">Programming</TabsTrigger>
                  <TabsTrigger value="aiml">AI/ML</TabsTrigger>
                  <TabsTrigger value="webDev">Web Dev</TabsTrigger>
                  <TabsTrigger value="databases">Databases</TabsTrigger>
                  <TabsTrigger value="devops">DevOps</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
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

                  <div className="grid grid-cols-2 gap-4 mb-4">
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
      </Tabs>

      <Toaster />
    </div>
  )
}

