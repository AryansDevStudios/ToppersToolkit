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
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card hover:bg-accent/40">
        <CardHeader>
            <div className="p-4 bg-primary/10 rounded-lg self-start">
                <Icon className="h-8 w-8 text-primary" />
            </div>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-xl font-bold mb-2">{subject.name}</CardTitle>
          <p className="text-sm text-muted-foreground mb-4 h-10">
            {subject.subcategories.map(s => s.name).join(', ')}
          </p>
          <div className="flex items-center text-sm font-semibold text-primary/80">
            <span className="group-hover:text-primary transition-colors">View Chapters</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
