"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Download, Linkedin, Mail, Phone, Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  const [resumeData, setResumeData] = useState(null)
  const [loading, setLoading] = useState(true)

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
        setLoading(false)
      }
    }

    fetchResumeData()
  }, [])

  // Handle smooth scrolling for anchor links
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Resume...</h2>
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
    <div className="min-h-screen bg-background">
      {/* Structured data for ATS and SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Person",
            name: resumeData.personalInfo.name,
            url: resumeData.personalInfo.website,
            email: resumeData.personalInfo.email,
            telephone: resumeData.personalInfo.phone,
            jobTitle: "Engineering Student & Entrepreneur",
            worksFor: resumeData.experience.map((exp) => ({
              "@type": "Organization",
              name: exp.company,
              description: exp.description.join(" "),
            })),
            alumniOf: resumeData.education.map((edu) => ({
              "@type": "EducationalOrganization",
              name: edu.institution,
              description: edu.degree,
            })),
            knowsAbout: Object.values(resumeData.skills).flat(),
            description: resumeData.personalInfo.summary,
          }),
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">AG</span>
            <span className="hidden md:inline-block font-serif text-xl">{resumeData.personalInfo.name}</span>
          </div>
          <nav className="flex items-center gap-4 md:gap-6" aria-label="Main navigation">
            <a
              href="#about"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => handleScroll(e, "about")}
            >
              About
            </a>
            <a
              href="#experience"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => handleScroll(e, "experience")}
            >
              Experience
            </a>
            <a
              href="#education"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => handleScroll(e, "education")}
            >
              Education
            </a>
            <a
              href="#skills"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => handleScroll(e, "skills")}
            >
              Skills
            </a>
            <a
              href="#projects"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => handleScroll(e, "projects")}
            >
              Projects
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        {/* Hero Section */}
        <section id="about" className="py-8 md:py-12" aria-labelledby="about-heading">
          <div className="grid gap-8 md:grid-cols-[2fr_1fr] items-center">
            <div className="space-y-4">
              <h1 id="about-heading" className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
                {resumeData.personalInfo.name}
              </h1>
              <p className="text-xl text-muted-foreground">Engineering Student & Entrepreneur</p>
              <div className="max-w-[600px] text-muted-foreground">
                <p>{resumeData.personalInfo.summary}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a href="/api/resume/pdf" download="asmit-ghosh-resume.pdf">
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={`mailto:${resumeData.personalInfo.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Me
                  </a>
                </Button>
              </div>
              <div className="flex gap-4 pt-2">
                <Link
                  href={resumeData.personalInfo.linkedin || "https://linkedin.com/in/"}
                  target="_blank"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link
                  href={resumeData.personalInfo.github || "https://github.com/"}
                  target="_blank"
                  className="text-muted-foreground hover:text-primary"
                  aria-label="GitHub Profile"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link
                  href={`tel:${resumeData.personalInfo.phone}`}
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Phone Number"
                >
                  <Phone className="h-5 w-5" />
                  <span className="sr-only">Phone</span>
                </Link>
                <Link
                  href={`mailto:${resumeData.personalInfo.email}`}
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Email Address"
                >
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </Link>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-primary">
                <Image
                  src={resumeData.personalInfo.photo || "/placeholder.svg?height=256&width=256"}
                  alt={`${resumeData.personalInfo.name} profile photo`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Experience Section */}
        <section id="experience" className="py-8" aria-labelledby="experience-heading">
          <h2 id="experience-heading" className="font-serif text-3xl font-bold tracking-tight mb-6">
            Entrepreneurial Ventures
          </h2>
          <div className="grid gap-6">
            {resumeData.experience
              .filter((exp) => exp.type === "entrepreneurial")
              .map((exp, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold">{exp.title}</h3>
                        <p className="text-muted-foreground">{exp.company}</p>
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {exp.startDate} – {exp.endDate}
                      </Badge>
                    </div>
                    <ul className="mt-4 space-y-2 list-disc pl-5">
                      {exp.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
          </div>

          <h2 className="font-serif text-3xl font-bold tracking-tight mt-12 mb-6">Work Experience</h2>
          <div className="grid gap-6">
            {resumeData.experience
              .filter((exp) => exp.type === "work")
              .map((exp, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold">{exp.title}</h3>
                        {exp.company && <p className="text-muted-foreground">{exp.company}</p>}
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {exp.startDate} – {exp.endDate}
                      </Badge>
                    </div>
                    <ul className="mt-4 space-y-2 list-disc pl-5">
                      {exp.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Education Section */}
        <section id="education" className="py-8" aria-labelledby="education-heading">
          <h2 id="education-heading" className="font-serif text-3xl font-bold tracking-tight mb-6">
            Education
          </h2>
          {resumeData.education.map((edu, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">{edu.institution}</h3>
                    <p className="text-muted-foreground">{edu.degree}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="w-fit">
                      Expected Graduation: {edu.graduationYear}
                    </Badge>
                    <p className="mt-2 text-sm">CGPA: {edu.gpa}</p>
                  </div>
                </div>
                {edu.description && (
                  <div className="mt-4">
                    <p>{edu.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </section>

        <Separator className="my-8" />

        {/* Skills Section */}
        <section id="skills" className="py-8" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="font-serif text-3xl font-bold tracking-tight mb-6">
            Technical Skills
          </h2>

          <Tabs defaultValue="programming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
              {Object.keys(resumeData.skills).map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(resumeData.skills).map(([category, skills]) => (
              <TabsContent key={category} value={category} className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge key={index}>{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-8">
            <h3 className="font-serif text-2xl font-bold tracking-tight mb-4">Languages</h3>
            <div className="flex flex-wrap gap-3">
              {resumeData.languages.map((language, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {language.name} – {language.proficiency}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-serif text-2xl font-bold tracking-tight mb-4">Certifications</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resumeData.certifications.map((cert, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h4 className="font-bold">{cert.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer} ({cert.year})
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Projects Section */}
        <section id="projects" className="py-8" aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="font-serif text-3xl font-bold tracking-tight mb-6">
            Projects
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {resumeData.projects.map((project, index) => (
              <Card key={index} className="flex flex-col h-full">
                <CardContent className="p-6 flex-1">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <Badge className="mt-2 mb-3">{project.achievement}</Badge>
                  <p className="text-sm text-muted-foreground mb-3">Technologies: {project.technologies.join(", ")}</p>
                  <ul className="space-y-2 list-disc pl-5">
                    {project.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                  {project.link && (
                    <div className="mt-4">
                      <Link href={project.link} target="_blank" className="text-primary hover:underline">
                        View Project →
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Achievements Section */}
        <section id="achievements" className="py-8" aria-labelledby="achievements-heading">
          <h2 id="achievements-heading" className="font-serif text-3xl font-bold tracking-tight mb-6">
            Achievements & Hackathons
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumeData.achievements.map((achievement, index) => (
              <Card key={index} className="bg-primary/5">
                <CardContent className="p-4">
                  <h4 className="font-bold">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Extracurricular Activities */}
        <section id="activities" className="py-8" aria-labelledby="activities-heading">
          <h2 id="activities-heading" className="font-serif text-3xl font-bold tracking-tight mb-6">
            Extracurricular Activities
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumeData.activities.map((activity, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h4 className="font-bold">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Interests */}
        <section id="interests" className="py-8" aria-labelledby="interests-heading">
          <h2 id="interests-heading" className="font-serif text-3xl font-bold tracking-tight mb-6">
            Interests
          </h2>
          <div className="flex flex-wrap gap-3">
            {resumeData.interests.map((interest, index) => (
              <Badge key={index} variant="outline" className="text-sm py-2 px-4">
                {interest}
              </Badge>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Contact Section */}
        <section id="contact" className="py-8" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="font-serif text-3xl font-bold tracking-tight mb-6">
            Contact Me
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Phone className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-bold">Phone</h3>
                    <p>{resumeData.personalInfo.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Mail className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-bold">Email</h3>
                    <p>{resumeData.personalInfo.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} {resumeData.personalInfo.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={resumeData.personalInfo.linkedin || "https://linkedin.com/in/"}
              target="_blank"
              className="text-muted-foreground hover:text-primary"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href={resumeData.personalInfo.github || "https://github.com/"}
              target="_blank"
              className="text-muted-foreground hover:text-primary"
              aria-label="GitHub Profile"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

