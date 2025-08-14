
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold font-headline text-center mb-4">Terms and Conditions</h1>
      <p className="text-muted-foreground text-center mb-8">Last Updated: 11-08-2025</p>

      <div className="space-y-6 text-foreground">
        <p className='text-muted-foreground'>
            Welcome to <strong>Topper’s Toolkit Shop</strong> (<Link href="https://topperstoolkit.netlify.app" className="text-primary hover:underline">https://topperstoolkit.netlify.app</Link>), owned and operated by <strong>Aryan Gupta (AryansDevStudios)</strong>. By purchasing any product from this site — whether in <strong>digital</strong> or <strong>printed</strong> format — you agree to these Terms and Conditions.
        </p>

        <Separator className="my-8" />

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Parties Involved</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-sm p-4 rounded-lg border bg-card">
                    <h3 className="font-semibold text-lg text-card-foreground">Site Owner</h3>
                    <p className="text-muted-foreground">Aryan Gupta (AryansDevStudios)</p>
                    <a href="mailto:aryan0106gupta@gmail.com" className="text-primary hover:underline block mt-2">aryan0106gupta@gmail.com</a>
                    <a href="https://wa.me/919838040111" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">WhatsApp: +91 98380 40111</a>
                </div>
                <div className="text-sm p-4 rounded-lg border bg-card">
                    <h3 className="font-semibold text-lg text-card-foreground">Seller</h3>
                    <p className="text-muted-foreground">Kuldeep Singh</p>
                    <a href="mailto:kuldeepsingh012011@gmail.com" className="text-primary hover:underline block mt-2">kuldeepsingh012011@gmail.com</a>
                    <a href="https://wa.me/917754000411" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">WhatsApp: +91 77540 00411</a>
                </div>
            </div>
        </div>
        
        <Separator className="my-8" />

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Relationship with Access Site</h2>
            <p className="text-muted-foreground">
                All digital notes purchased here are accessed exclusively through our official viewer platform, <strong>Topper’s Toolkit Viewer</strong> (<Link href="https://topperstoolkitviewer.netlify.app" className="text-primary hover:underline">https://topperstoolkitviewer.netlify.app</Link>). Purchasing a note grants you <strong>view-only access</strong> via the Viewer platform once the transaction is verified.
            </p>
        </div>

        <Separator className="my-8" />

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Ownership of Content</h2>
            <p className="text-muted-foreground">
                All notes, study materials, PDFs, booklets, and related resources are the sole property of <strong>Kuldeep Singh</strong>. Purchasing a product does <strong>not</strong> grant ownership rights — you are purchasing a <strong>license to use</strong>, not the right to reproduce, distribute, or resell.
            </p>
        </div>

        <Separator className="my-8" />

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Delivery of Access</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Digital Purchases:</strong> Access is provided only after payment verification, which may take <strong>up to 1–2 hours</strong> depending on seller availability.</li>
                <li><strong>Printed Purchases:</strong> Orders for booklets will be processed and delivered according to our delivery timelines.</li>
                <li>A transaction is considered <strong>successful only when confirmed by the buyer on the seller’s WhatsApp</strong>.</li>
            </ul>
        </div>
        
        <Separator className="my-8" />

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Refund Policy</h2>
            <p className="text-muted-foreground mb-2">Refunds are granted <strong>only under the following conditions</strong>:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Technical Glitch:</strong> If a technical error occurs on our side, we will fix it within <strong>3 hours</strong> of it being reported.</li>
                <li><strong>Mistaken Order:</strong> If you placed an order by mistake, contact the seller on WhatsApp within <strong>15 minutes</strong> of purchase.</li>
                <li>Refund decisions are at the sole discretion of the Owner and Seller.</li>
                <li>No refunds are given for violations of these Terms.</li>
            </ul>
        </div>

        <Separator className="my-8" />

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Prohibited Activities (Digital & Printed Content)</h2>
            <p className="text-muted-foreground mb-2">You may <strong>not</strong>:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Download or save digital notes without permission.</li>
                <li>Take screenshots, screen recordings, or capture any part of the digital notes.</li>
                <li>Print, photocopy, scan, or create physical copies of digital notes.</li>
                <li>Take photos of printed booklets or any physical copy.</li>
                <li>Scan printed booklets to create digital versions.</li>
                <li>Share, redistribute, lend, gift, or sell the notes — whether <strong>digital, physical, or photographs thereof</strong>.</li>
                <li>Share your account or login credentials with anyone.</li>
            </ul>
        </div>

        <Separator className="my-8" />

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Terms for Printed Purchases (Booklets)</h2>
            <p className="text-muted-foreground mb-2">If you purchase a printed version of our notes (“booklet” format), you agree that:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>The booklet is for <strong>personal use only</strong>.</li>
              <li>You may <strong>not</strong> copy, scan, photograph, or reproduce the booklet in any way.</li>
              <li>You may <strong>not</strong> distribute the booklet or any images of its content — whether in print, photo, or digital form.</li>
              <li>Any attempt to share, resell, or make public the booklet’s content will be treated as piracy and subject to enforcement action.</li>
            </ul>
        </div>

        <Separator className="my-8" />

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Anti-Piracy Notice</h2>
            <p className="text-muted-foreground">
                We actively monitor for <strong>digital and physical piracy</strong>. Content may contain <strong>digital watermarks</strong> or other identifiers to trace unauthorized distribution. Any violation — including sharing photographs of printed materials — will be treated as copyright infringement.
            </p>
        </div>

        <Separator className="my-8" />

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Enforcement</h2>
            <p className="text-muted-foreground mb-2">If you engage in any unauthorized activity, the Owner and Seller reserve the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Temporarily suspend or permanently ban your account.</li>
                <li>Remove access to purchased content without refund.</li>
                <li>Cancel pending orders.</li>
                <li>Pursue legal action if necessary.</li>
                <li>All enforcement decisions are final.</li>
            </ul>
        </div>
        
        <Separator className="my-8" />

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">10. Agreement Requirement</h2>
            <p className="text-muted-foreground">
                You must explicitly agree to these Terms before making a purchase. A checkbox confirmation is required at checkout or account registration.
            </p>
        </div>

        <Separator className="my-8" />

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">11. Availability</h2>
            <p className="text-muted-foreground">
                We aim for high availability of our services. In rare cases, downtime may occur, with a maximum expected outage of <strong>1 hour</strong>.
            </p>
        </div>

        <Separator className="my-8" />

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">12. Contact</h2>
            <p className="text-muted-foreground">
                For any questions regarding these Terms, please contact the relevant party listed in Section 1.
            </p>
        </div>

      </div>
    </div>
  );
}
