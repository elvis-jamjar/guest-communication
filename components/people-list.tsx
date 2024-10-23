'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Person {
  name: string;
  title?: string;
  bio: string;
  photo?: string;
}

export function PeopleList({ people = [] }: { people: Person[] }) {
  return (
    <div className="space-y-4">
      {people.map((person, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={person.photo} alt={person.name} />
              <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{person.name}</CardTitle>
              {person.title && <p className="text-sm text-muted-foreground">{person.title}</p>}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{person.bio}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}