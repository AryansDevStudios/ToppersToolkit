import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold font-headline text-center mb-4">Terms and Conditions</h1>
      <p className="text-muted-foreground text-center mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="space-y-6 text-foreground">
        <p>
            Welcome to <strong>Topper’s Toolkit Shop</strong> (<Link href="https://topperstoolkit.netlify.app" className="text-primary hover:underline" target="_blank">https://topperstoolkit.netlify.app</Link>), operated by <strong>Kuldeep Singh</strong>. By purchasing any product from this site, you agree to these Terms and Conditions.
        </p>

        <Separator className="my-8" />

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Parties Involved</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Site Owner:</strong> Aryan Gupta (AryansDevStudios) — Contact: <a href="mailto:aryan0106gupta@gmail.com" className="text-primary hover:underline">aryan0106gupta@gmail.com</a>, WhatsApp: +91 98380 40111</li>
                <li><strong>Seller:</strong> Kuldeep Singh — Contact: <a href="mailto:kuldeepsingh012011@gmail.com" className="text-primary hover:underline">kuldeepsingh012011@gmail.com</a>, WhatsApp: +91 77540 00411</li>
            </ul>
        </div>
        
        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Relationship with Access Site</h2>
            <p className="text-muted-foreground">
                All purchased notes are accessed exclusively through our official viewer platform, <strong>Topper’s Toolkit Viewer</strong> (<Link href="https://topperstoolkitviewer.netlify.app" className="text-primary hover:underline" target="_blank">https://topperstoolkitviewer.netlify.app</Link>). Purchasing a note grants you <strong>view-only access</strong> via the Viewer platform once the transaction is verified.
            </p>
        </div>

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Ownership of Content</h2>
            <p className="text-muted-foreground">
                All notes, study materials, PDFs, and any related resources are the sole property of <strong>Kuldeep Singh</strong>. Purchasing a product does <strong>not</strong> grant ownership rights.
            </p>
        </div>

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Delivery of Access</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access is provided <strong>only after payment verification</strong>.</li>
                <li>Verification may take <strong>up to 1–2 hours</strong> depending on seller availability.</li>
                <li>A transaction is considered <strong>successful only when confirmed by the buyer on the seller’s WhatsApp</strong>.</li>
                <li>If payment is made but confirmation is not sent within the required time, delivery may be delayed.</li>
            </ul>
        </div>
        
        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Refund Policy</h2>
            <p className="text-muted-foreground mb-2">Refunds are granted <strong>only under the following conditions</strong>:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Technical Glitch:</strong> If a technical error occurs on our side, we will fix it within <strong>3 hours</strong> of it being reported.</li>
                <li><strong>Mistaken Order:</strong> If you placed an order by mistake, contact the seller on WhatsApp within <strong>15 minutes</strong> of purchase.</li>
                <li>All refund decisions are at the discretion of the Owner and Seller.</li>
                <li>Refunds are <strong>not</strong> provided for violations of these Terms.</li>
            </ul>
        </div>

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Prohibited Activities</h2>
            <p className="text-muted-foreground mb-2">Strictly prohibited actions include:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Downloading or saving any notes.</li>
                <li>Taking screenshots or screen recordings.</li>
                <li>Printing the content.</li>
                <li>Sharing your account with others.</li>
                <li>Redistributing, selling, or publishing the notes in any form.</li>
            </ul>
        </div>

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Enforcement</h2>
            <p className="text-muted-foreground mb-2">If you engage in any <strong>unauthorized activity</strong>, the Owner and Seller reserve the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Temporarily suspend or permanently ban your account.</li>
                <li>Remove access to purchased notes without refund.</li>
                <li>Pursue legal action if necessary.</li>
                <li>Decisions on enforcement are final and made solely at the discretion of the Owner/Seller.</li>
            </ul>
        </div>
        
        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Agreement Requirement</h2>
            <p className="text-muted-foreground">
                You must explicitly agree to these Terms before making a purchase. A checkbox confirmation is required at checkout or account registration.
            </p>
        </div>

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Availability</h2>
            <p className="text-muted-foreground">
                Our services are designed for high availability. In rare cases, downtime may occur, with a maximum expected outage of <strong>1 hour</strong>.
            </p>
        </div>

        <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact</h2>
            <p className="text-muted-foreground">
                For any questions regarding these Terms, contact the Seller: <br />
                <a href="mailto:kuldeepsingh012011@gmail.com" className="text-primary hover:underline">kuldeepsingh012011@gmail.com</a> | WhatsApp: +91 77540 00411
            </p>
        </div>

      </div>
    </div>
  );
}
