'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from 'lucide-react'
import { PageContent } from '@/app/types'
import { Dialog, DialogDescription, DialogHeader, DialogContent, DialogTrigger, DialogTitle, DialogFooter } from "./ui/dialog"
import { useState } from "react"
import RichTextEditor from "./RichTextEditor"

interface PageContentFormProps {
  pageContent: PageContent
  // onSubmit: (pageContent: PageContent) => void,
  onPageContentChange: (pageContent: PageContent) => void
}

export function PageContentFormComponent(
  { pageContent, onPageContentChange }: Readonly<PageContentFormProps>
) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <form className="space-y-8 max-w-2xl mx-auto w-full">
      <Card className="border-2 shadow-sm">
        {/* <CardHeader>
          <CardTitle className="text-sm">Page Content Form</CardTitle>
        </CardHeader> */}
        <CardContent className="space-y-4 p-2">
          <div className="space-y-2">
            {/* <Label htmlFor="aboutSection">About Section</Label> */}
            <RichTextEditor
              content={pageContent.aboutSection}
              editable={true}
              onChange={(content) => {
                onPageContentChange({ ...pageContent, aboutSection: content })
              }}
            />
            <hr className="border-t border-gray-200" />
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
                  <Dialog open={isOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setIsOpen(true)} variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Quick Link
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Remove Quick Link <strong>{link.title}</strong> </DialogTitle>
                        <DialogDescription>
                          <p>Are you sure you want to remove this quick link?</p>
                          <p>This action cannot be undone.</p>
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="destructive" onClick={() => {
                          onPageContentChange({ ...pageContent, quickLinks: pageContent.quickLinks?.filter((_, i) => i !== index) })
                          setIsOpen(false)
                        }}>Remove</Button>
                        <Button variant="secondary" onClick={() => {
                          setIsOpen(false)
                        }}>Cancel</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
        </CardContent>
      </Card>
    </form>
  )
}