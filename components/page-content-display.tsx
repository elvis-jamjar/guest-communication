'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageContent } from "@/app/types"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import RichTextEditor from "./RichTextEditor"
import { JSONContent } from "@tiptap/react"


export function PageContentDisplayComponent({ aboutSection, quickLinksTitle, quickLinks, className }: PageContent & { className?: string }) {
  return (
    <div className={cn("container mx-auto px-4 py-8", className)}>

      {aboutSection && (
        <AboutDescription hasTitle={true} aboutSection={aboutSection} />
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
      <h2 className="text-2xl font-semibold mb-6">{pageContent?.quickLinksTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageContent?.quickLinks?.map((link, index) => (
          <Card key={index} className="flex flex-col shadow-none border-2 bg-transparent border-primary-main">
            <CardHeader>
              <CardTitle className="font-bold text-sm text-primary-purple py-2 break-words">{link?.title || 'Quick Link'}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{link.description || 'No description available.'}</p>
            </CardContent>
            <CardFooter>
              <a href={link?.link || '#'} target="_blank" rel="noopener noreferrer">
                <Button className="w-full group bg-primary-main hover:bg-primary-main/80">
                  {link?.buttonLabel || 'Learn More'}
                  <ArrowUpRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </a>

            </CardFooter>
          </Card>
        ))}
      </div>
    </section>

  )
}

export function AboutDescription({ aboutSection, hasTitle, className }: { aboutSection: JSONContent | string, hasTitle?: boolean, className?: string }) {

  return (
    <section className={cn("bg-transparent mt-8 text-black rounded-lg", className)}>
      {hasTitle && <h2 className="text-2xl font-semibold mb-4">About Us</h2>}
      {typeof aboutSection === "string" ? (
        <p className="text-left prose max-w-5xl text-xl whitespace-pre-wrap text-inherit drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
          {aboutSection}
        </p>
      ) : (
        <div className={cn("max-w-5xl prose prose-sm md:prose-xl", hasTitle ? "prose-slate [&_*]:!text-black [&_h1]:!text-black [&_h2]:!text-black [&_h3]:!text-black [&_h4]:!text-black [&_h5]:!text-black [&_h6]:!text-black [&_p]:!text-black [&_li]:!text-black [&_span]:!text-black [&_strong]:!text-black [&_em]:!text-black [&_a]:!text-black text-black" : "prose-invert [&_*]:!text-white [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white [&_h5]:!text-white [&_h6]:!text-white [&_p]:!text-white [&_li]:!text-white [&_span]:!text-white [&_strong]:!text-white [&_em]:!text-white [&_a]:!text-white")}>
          <RichTextEditor content={aboutSection} editable={false} />
        </div>
      )}
    </section>
  )
}