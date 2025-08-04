import { getSubjectById } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

type SubjectPageProps = {
  params: {
    subjectId: string;
  };
};

export default async function SubjectPage({ params }: SubjectPageProps) {
  const subject = await getSubjectById(params.subjectId);

  if (!subject) {
    notFound();
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold font-headline mb-2">
        {subject.name}
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Choose a category to explore chapters.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subject.subcategories.map((subcategory) => (
          <Link key={subcategory.id} href={`/subjects/${subject.id}/${subcategory.id}`} className="group block">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary">
              <CardHeader>
                <CardTitle>{subcategory.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-semibold text-primary">
                  <span>View Chapters</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
    const { getSubjects } = await import('@/lib/data');
    const subjects = await getSubjects();
    return subjects.map(subject => ({ subjectId: subject.id }));
}
