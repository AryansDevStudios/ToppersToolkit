
import { getAdminSettings } from '@/lib/data';
import { PrintForm } from '@/components/PrintForm';

export default async function PrintPage() {
    const settings = await getAdminSettings();
    const pricePerPage = settings.printPricePerPage ?? 3.00;

    return (
        <div className="container py-12">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold font-headline text-center">Print on Demand</h1>
                <p className="text-muted-foreground text-center mt-2 mb-8">
                    Have your own notes? Submit a link and we'll print them for you.
                </p>
                <PrintForm pricePerPage={pricePerPage} />
            </div>
        </div>
    );
}
