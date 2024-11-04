'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PageContent } from '@/types'
import { PlusCircle, Trash2 } from 'lucide-react'

interface PageContentFormProps {
  pageContent: PageContent
  // onSubmit: (pageContent: PageContent) => void,
  onPageContentChange: (pageContent: PageContent) => void
}

export function PageContentFormComponent(
  { pageContent, onPageContentChange }: Readonly<PageContentFormProps>
) {
  return (
    <form className="space-y-8 max-w-2xl mx-auto w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Page Content Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aboutSection">About Section</Label>
            <Textarea
              id="aboutSection"
              value={pageContent.aboutSection}
              onChange={
                (e) => onPageContentChange({ ...pageContent, aboutSection: e.target.value })
              }
              wrap="soft"
              placeholder="Enter about section content"
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-4">
            <Label>Links</Label>
            {/* input field to quicklinks main section title */}
            <div>
              <Label htmlFor="quickLinksTitle">Section Title for Quick Links</Label>
              <Input
                id="quickLinksTitle"
                value={pageContent.quickLinksTitle}
                onChange={(e) => onPageContentChange({ ...pageContent, quickLinksTitle: e.target.value })}
                placeholder="Enter quick links title"
              />
            </div>
            {pageContent.quickLinks?.map((link, index) => (
              <Card key={index}>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`quickLinkTitle-${index}`}>Linkt Title</Label>
                    <Input
                      id={`quickLinkTitle-${index}`}
                      value={link.title}
                      onChange={(e) => onPageContentChange({ ...pageContent, quickLinks: pageContent.quickLinks?.map((l, i) => i === index ? { ...l, title: e.target.value } : l) })}
                      placeholder="Enter quick link title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`quickLinkUrl-${index}`}>Link</Label>
                    <Input
                      id={`quickLinkUrl-${index}`}
                      value={link.link}
                      onChange={(e) => onPageContentChange({ ...pageContent, quickLinks: pageContent.quickLinks?.map((l, i) => i === index ? { ...l, link: e.target.value } : l) })}
                      placeholder="Enter quick link URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`quickLinkDescription-${index}`}>Description</Label>
                    <Textarea
                      id={`quickLinkDescription-${index}`}
                      value={link.description}
                      onChange={(e) => onPageContentChange({ ...pageContent, quickLinks: pageContent.quickLinks?.map((l, i) => i === index ? { ...l, description: e.target.value } : l) })}
                      placeholder="Enter quick link description"
                      className="min-h-[100px]"
                    />
                  </div>
                  {/* quick link button label */}
                  <div
                    className="space-y-2">
                    <Label htmlFor={`quickLinkButtonLabel-${index}`}>Button Label</Label>
                    <Input
                      id={`quickLinkButtonLabel-${index}`}
                      value={link.buttonLabel}
                      onChange={(e) => onPageContentChange({ ...pageContent, quickLinks: pageContent.quickLinks?.map((l, i) => i === index ? { ...l, buttonLabel: e.target.value } : l) })}
                      placeholder="Enter quick link button label"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onPageContentChange({ ...pageContent, quickLinks: pageContent.quickLinks?.filter((_, i) => i !== index) })}
                    className="mt-2"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Link
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button type="button"
              onClick={() => onPageContentChange({ ...pageContent, quickLinks: [...(pageContent.quickLinks || []), { title: '', link: '', description: '' }] })}
              variant="outline" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Quick Link
            </Button>
          </div>
          {/* <Button type="submit" className="w-full">Submit</Button> */}
        </CardContent>
      </Card>
    </form>
  )
}