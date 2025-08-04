import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { NoteMaterial } from '@/types';
import { Badge } from './ui/badge';
import { ArrowRight, IndianRupee } from 'lucide-react';

type NoteCardProps = {
  note: NoteMaterial;
};

export function NoteCard({ note }: NoteCardProps) {
  const validImageUrl = note.imageUrl || 'https://github.com/AryansDevStudios/ToppersToolkit/blob/main/icon/background.png?raw=true';

  return (
    <Link href={`/subjects/${note.subjectId}/${note.subcategoryId}`} className="group block">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card hover:bg-accent/40">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={validImageUrl}
              alt={note.chapter}
              className="w-full h-full object-cover"
              data-ai-hint="notebook education"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <Badge variant="secondary" className="mb-2">{note.subjectName} - {note.subcategoryName}</Badge>
          <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">{note.chapter}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{note.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <p className="font-bold text-lg flex items-center">
                <IndianRupee className="h-5 w-5 mr-1 text-primary"/>
                {note.price.toFixed(2)}
            </p>
           <div className="flex items-center text-sm font-semibold text-primary/80">
            <span className="group-hover:text-primary transition-colors">Explore</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
