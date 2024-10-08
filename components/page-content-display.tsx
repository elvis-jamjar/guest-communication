'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageContent } from "@/app/types"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"


export function PageContentDisplayComponent({ aboutSection, quickLinksTitle, quickLinks }: PageContent) {
  return (
    <div className="container mx-auto px-4 py-8">

      {aboutSection && (
        <AboutDescription hasTitle aboutSection={aboutSection} />
      )}
      <PageQuickLinks
        pageContent={{ quickLinksTitle, quickLinks }}
      />
    </div>
  )
}


export function PageQuickLinks({ pageContent, className }: { pageContent: PageContent, className?: string }) {
  return (
    <section className={cn(className)}>
      <h2 className="text-3xl font-semibold mb-6">{pageContent?.quickLinksTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageContent?.quickLinks?.map((link, index) => (
          <Card key={index} className="flex flex-col shadow-none border-2 bg-transparent border-primary-main">
            <CardHeader>
              <CardTitle>{link.title || 'Quick Link'}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{link.description || 'No description available.'}</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-primary-main">
                <a href={link.link || '#'} target="_blank" rel="noopener noreferrer">
                  {link.buttonLabel || 'Learn More'}
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>

  )
}

export function AboutDescription({ aboutSection, hasTitle }: { aboutSection: string, hasTitle?: boolean }) {

  return (
    <section className="bg-transparent p-6 rounded-lg">
      {hasTitle && <h2 className="text-2xl font-semibold mb-4">About Us</h2>}
      <p className="text-muted-foreground">{aboutSection}</p>
    </section>
  )
}