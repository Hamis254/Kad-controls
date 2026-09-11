import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';
import GetQuoteButton from '@/frontend/components/common/GetQuoteButton';
import { ShieldCheck, Leaf, Users, Wrench, Zap } from 'lucide-react';

const whyChooseUs = [
  { icon: ShieldCheck, title: 'Quality is our standard' },
  { icon: Zap, title: 'Innovative solutions' },
  { icon: ShieldCheck, title: 'Safety is our culture' },
  { icon: Leaf, title: 'Energy & environment consulting' },
  { icon: Users, title: 'Committed to clients' },
];

const services = [
  'Low voltage distribution panels',
  'Power factor banks',
  'Automatic change overs',
  'Motor control centres',
  'Variable speed drive panels',
  'PLC, HMI and SCADA projects',
  'Supply, installation and commissioning of RMUs, VCBs and transformers',
  'Building management systems (including fire alarm systems)',
  'Diesel generator sets — supply, installation & commissioning',
  'UPS and inverter systems',
  'Solar PV systems',
  'CCTV, access control, electric fence and alarm systems',
  'Power quality analysis (analyzers available for hire)',
  'HVAC — supply, installation and commissioning',
  'Industrial, commercial and exterior lighting',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <section className="bg-primary text-primary-foreground px-6 py-16 sm:px-10 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent mb-4">About us — Turn-key solution provider</p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Kad Controls Ltd</h1>
            <p className="font-tagline mt-4 text-2xl text-primary-foreground/85">&ldquo;For All Your Electrical Needs&rdquo;</p>
            <p className="mt-6 text-lg text-primary-foreground/80">
              We design, supply, install and commission — handling every stage of a project ourselves,
              so you deal with one accountable team instead of juggling a designer, a supplier and an
              installer.
            </p>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-8 sm:px-10 lg:px-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              ['16+', 'Years in business'],
              ['12+', 'Major clients served'],
              ['14+', 'Global technology partners'],
              ['24/7', 'On-call emergency support'],
            ].map(([stat, label]) => (
              <div key={label}>
                <p className="text-3xl font-bold text-primary">{stat}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16 sm:px-10 lg:px-12 space-y-4 text-foreground/80 leading-relaxed">
          <p>
            Kad Controls has grown into a leader in the electrical construction and maintenance field,
            built on the idea that a single-source turnkey electrical partner is the most cost-effective
            way to keep a plant running reliably.
          </p>
          <p>
            We&apos;re a family-owned and operated company with a track record of integrity and stability —
            the kind that keeps clients coming back for timely, dependable project delivery.
          </p>
          <blockquote className="border-l-4 border-accent pl-4 italic text-foreground">
            &ldquo;We will always uphold our company&apos;s commitment as a Leader in the Electrical and
            Maintenance Sector.&rdquo;
          </blockquote>
        </section>

        <section className="bg-secondary px-6 py-16 sm:px-10 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-10">Why choose us</h2>
            <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-5">
              {whyChooseUs.map(({ icon: Icon, title }) => (
                <div key={title} className="text-center">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-sm font-medium">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16 sm:px-10 lg:px-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" /> Our Services
          </h2>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-foreground/80">
            {services.map((service) => (
              <li key={service} className="flex gap-2">
                <span className="text-accent">—</span> {service}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-accent px-6 py-16 text-center sm:px-10">
          <h2 className="text-3xl font-semibold tracking-tight text-accent-foreground">
            Looking for an electrical construction &amp; maintenance consultant?
          </h2>
          <GetQuoteButton className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90">
            Get a quote
          </GetQuoteButton>
        </section>
      </main>

      <Footer />
    </div>
  );
}
