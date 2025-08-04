import { getSubjectById, getChaptersForSubcategory } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ChapterAccordion } from '@/components/ChapterAccordion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type SubcategoryPageProps = {
  params: {
    subjectId: string;
    subcategoryId: string;
  };
};

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const subject = await getSubjectById(params.subjectId);
  const subcategory = subject?.subcategories.find(sc => sc.id === params.subcategoryId);
  const chapters = await getChaptersForSubcategory(params.subjectId, params.subcategoryId);

  if (!subject || !subcategory) {
    notFound();
  }

  return (
    <div key={`${params.subjectId}-${params.subcategoryId}`} className="container py-12">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link href={`/subjects/${subject.id}`} className="hover:text-primary">{subject.name}</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>{subcategory.name}</span>
        </div>
      <h1 className="text-4xl font-bold font-headline mb-2">{subcategory.name}</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Select materials from the chapters below to add to your cart.
      </p>

      <ChapterAccordion chapters={chapters} />
    </div>
  );
}

export async function generateStaticParams() {
    const { getSubjects } = await import('@/lib/data');
    const subjects = await getSubjects();
    const params: { subjectId: string; subcategoryId: string }[] = [];

    subjects.forEach(subject => {
        subject.subcategories.forEach(subcategory => {
            params.push({
                subjectId: subject.id,
                subcategoryId: subcategory.id,
            });
        });
    });

    return params;
}
