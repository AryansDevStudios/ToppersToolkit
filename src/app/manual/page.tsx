
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, BookOpen, Search, ShoppingCart, Printer, UploadCloud, Library } from "lucide-react";
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ManualPage() {
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold font-headline text-center mb-4">User Manual</h1>
      <p className="text-muted-foreground text-center mb-12">A guide to using the Topper's Toolkit website.</p>

      <div className="space-y-8">

        {/* Section 1: Browsing Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-6 w-6 text-primary" />
              <span>1. Browsing for Notes</span>
            </CardTitle>
            <CardDescription>How to find the study materials you need.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Start on the homepage to see all available subjects like Science, SST, and Maths.
            </p>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="font-semibold">Select a Subject</h4>
                <p className="text-sm text-muted-foreground">Click on a subject card to view its subcategories (e.g., Physics, Chemistry).</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="font-semibold">Choose a Subcategory</h4>
                <p className="text-sm text-muted-foreground">From the subject page, click on a subcategory to see all the available chapters.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Adding Items to Cart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <span>2. Adding Items to Your Cart</span>
            </CardTitle>
            <CardDescription>Understanding formats and selecting materials.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Inside each chapter, you'll find different types of note materials.
            </p>
            <Alert>
              <BookOpen className="h-4 w-4" />
              <AlertTitle>PDF vs. Printed</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>PDF:</strong> A digital version you can access online through our secure <a href="https://topperstoolkitviewer.netlify.app/" className="text-primary underline">Library</a>. You cannot download or print it.</li>
                  <li><strong>Printed:</strong> A physical, hard-copy booklet that will be delivered to you.</li>
                </ul>
              </AlertDescription>
            </Alert>
            <p>Simply click the <strong>"Add to Cart"</strong> button for any item you wish to purchase. Once in the cart, you can select your preferred format (PDF or Printed) if both are available.</p>
          </CardContent>
        </Card>

        {/* Section 3: Print on Demand */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="h-6 w-6 text-primary" />
              <span>3. Using the "Print on Demand" Service</span>
            </CardTitle>
            <CardDescription>How to get your own documents printed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you have your own PDF or document that you need printed, our "Print on Demand" service is for you.
            </p>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <UploadCloud className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="font-semibold">Step 1: Upload to Wormhole</h4>
                <p className="text-sm text-muted-foreground">Click the "Go to Wormhole.app" button to securely upload your file(s) in a new tab and generate a share link.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="font-semibold">Step 2: Submit the Form</h4>
                <p className="text-sm text-muted-foreground">Return to our site, paste the Wormhole link, fill in your details, and submit the form. We will contact you on WhatsApp to confirm the final price based on page count.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Section 4: Checkout & Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-6 w-6 text-primary" />
              <span>4. Checkout and Accessing Notes</span>
            </CardTitle>
            <CardDescription>Finalizing your order and viewing your materials.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <h4 className="font-semibold">Placing Your Order</h4>
               <p className="text-muted-foreground">
                When you're ready, go to your cart. Fill in your name, class, and WhatsApp number. Choose a payment method (Cash on Delivery or UPI) and place your order.
              </p>
              <Separator />
               <h4 className="font-semibold">Accessing Digital Notes</h4>
              <p className="text-muted-foreground">
                After your order for a digital (PDF) note is confirmed, you will be given access to view it on our secure <a href="https://topperstoolkitviewer.netlify.app/" className="text-primary font-semibold hover:underline">Library platform</a>. Please note that access may take 1-2 hours to be granted as it is a manual process.
              </p>
               <Alert variant="destructive">
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    All digital notes are view-only. Downloading, printing, or sharing them is strictly prohibited as per our <Link href="/terms" className="underline">Terms and Conditions</Link>.
                  </AlertDescription>
                </Alert>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
