import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <section className="bg-primary text-primary-foreground px-6 py-16 sm:px-10 lg:px-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent mb-4">Get in touch</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Contact Us</h1>
          <p className="mt-6 max-w-xl mx-auto text-primary-foreground/80">
            Have a question, or want a quote for a design-supply-install-commission project? Reach us
            directly, or use the enquiry/quotation forms on any product page.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16 sm:px-10 lg:px-12 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex gap-4">
              <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Kenya (Head Office)</h3>
                <p className="text-muted-foreground">
                  Kad Controls Ltd,<br />
                  Prabhaki Industrial Park, Godown C3,<br />
                  Babadogo, Nairobi<br />
                  P.O Box 8953-00200, Nairobi, Kenya
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground">
                  <a href="tel:+254772600242" className="hover:text-primary">+254 772 600 242</a>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">
                  <a href="mailto:info@kadcontrols.co.ke" className="hover:text-primary">info@kadcontrols.co.ke</a>
                </p>
              </div>
            </div>

            <div className="flex gap-4 border-t border-border pt-6">
              <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Uganda</h3>
                <p className="text-muted-foreground">
                  Kad Controls Uganda Ltd,<br />
                  Regency Plaza, Lugogo Bypass,<br />
                  P.O. Box 175375, Kampala, Uganda<br />
                  Tel: <a href="tel:+256764686974" className="hover:text-primary">0764 686 974</a>
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <a href="https://www.facebook.com/KAD-Controls-Limited-348235419330444" className="text-muted-foreground hover:text-primary text-sm underline">Facebook</a>
              <a href="https://www.linkedin.com/in/kad-controls-limited-33bb00112/" className="text-muted-foreground hover:text-primary text-sm underline">LinkedIn</a>
              <a href="https://www.instagram.com/KADcontrols" className="text-muted-foreground hover:text-primary text-sm underline">Instagram</a>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-border h-80 lg:h-auto">
            <iframe
              title="Kad Controls Ltd location"
              src="https://maps.google.com/maps?q=Prabhaki%20Industrial%20Park%2C%20Babadogo%2C%20Nairobi%2C%20Kenya&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              className="border-0"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
