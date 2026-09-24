import { CurriculumBrowser } from '@/components/curriculum/CurriculumBrowser';

export const metadata = {
  title: 'Curriculum Foundation | Engineering Practice Engine',
  description: 'Authoritative Course Coverage & Syllabus Registry extracted from 6 official syllabi.',
};

export default function CurriculumPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <CurriculumBrowser />
    </main>
  );
}
