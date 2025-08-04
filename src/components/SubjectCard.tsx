import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Calculator, FlaskConical, Globe } from 'lucide-react';
import type { Subject } from '@/types';

const iconMap: { [key: string]: React.ElementType } = {
  science: FlaskConical,
  sst: Globe,
  maths: Calculator,
  english: BookOpen,
  default: BookOpen,
};

type SubjectCardProps = {
  subject: Subject;
};

export function SubjectCard({ subject }: SubjectCardProps) {
  const Icon = iconMap[subject.id] || iconMap.default;

  return (
    <Link href={`/subjects/${subject.id}`} className="group block">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">{subject.name}</CardTitle>
          <Icon className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {subject.subcategories.map(s => s.name).join(', ')}
          </p>
          <div className="flex items-center text-sm font-semibold text-primary">
            <span>View Chapters</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
