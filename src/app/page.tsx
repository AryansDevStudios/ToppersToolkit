import { getSubjects, getRecentNotes } from '@/lib/data';
import { SubjectCard } from '@/components/SubjectCard';
import { NoteCard } from '@/components/NoteCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const subjects = await getSubjects();
  const recentNotes = await getRecentNotes(8);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-card to-background">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter">
            Unlock Your Academic Potential
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            High-quality, chapter-wise notes for Science, SST, Maths, and more. Curated for clarity, designed for success.
          </p>
           <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button asChild size="lg">
              <Link href="#subjects">
                Browse Subjects <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#recent">
                See Latest Notes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects" className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-center font-headline mb-12">
            Browse by Subject
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Notes Section */}
      <section id="recent" className="py-16 md:py-24 bg-card/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center font-headline mb-12">
            Recently Added Notes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {recentNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
