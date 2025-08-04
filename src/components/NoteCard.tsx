import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { NoteMaterial } from '@/types';
import { Badge } from './ui/badge';
import { ArrowRight, IndianRupee } from 'lucide-react';

type NoteCardProps = {
  note: NoteMaterial;
};

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link href={`/subjects/${note.subjectId}/${note.subcategoryId}`} className="group block">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={note.imageUrl || 'https://placehold.co/600x400'}
              alt={note.chapter}
              fill
              className="object-cover"
              data-ai-hint="notebook education"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <Badge variant="secondary" className="mb-2">{note.subjectName} - {note.subcategoryName}</Badge>
          <CardTitle className="text-lg font-medium leading-tight">{note.chapter}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{note.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <p className="font-semibold text-lg flex items-center">
                <IndianRupee className="h-4 w-4 mr-1" />
                {note.price.toFixed(2)}
            </p>
           <div className="flex items-center text-sm font-semibold text-primary">
            <span>Explore Notes</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
