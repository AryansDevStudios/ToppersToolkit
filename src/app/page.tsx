import { getSubjects, getRecentNotes } from '@/lib/data';
import { SubjectCard } from '@/components/SubjectCard';
import { NoteCard } from '@/components/NoteCard';

export default async function Home() {
  const subjects = await getSubjects();
  const recentNotes = await getRecentNotes(8);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight">
            Unlock Your Potential with QuickNotes
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            High-quality, chapter-wise notes for Science, SST, Maths, and more, delivered right to you.
          </p>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center font-headline mb-8">
            Browse by Subject
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Notes Section */}
      <section className="py-12 md:py-16 bg-muted/20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center font-headline mb-8">
            Recently Added Notes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
