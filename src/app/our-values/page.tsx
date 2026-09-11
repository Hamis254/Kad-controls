import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';

const values = [
  {
    title: 'We respect the individual',
    text: 'People who are treated with respect and given responsibility respond by giving their best.',
  },
  {
    title: 'Safety is our culture',
    text: 'Keeping our employees and our clients\u2019 projects safe comes first. We work towards accident-free projects.',
  },
  {
    title: 'We are frugal',
    text: 'We guard and conserve the company\u2019s resources with the same care we\u2019d use for our own.',
  },
  {
    title: 'Committed to clients',
    text: 'We feel a sense of urgency on anything client-related. We own problems and stay responsive.',
  },
  {
    title: 'Innovative solutions',
    text: 'Our team stays proficient in the most advanced technologies, methods and processes in the industrial, engineering, construction and maintenance sector.',
  },
  {
    title: 'Quality is a standard',
    text: 'We aim to continually improve through focused teamwork, pride in our work, and quality-controlled systems.',
  },
  {
    title: 'We believe in the Golden Rule',
    text: 'In all our dealings, we strive to be friendly, courteous, fair and compassionate.',
  },
];

export default function OurValuesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <section className="bg-primary text-primary-foreground px-6 py-16 sm:px-10 lg:px-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent mb-4">What we stand for</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Our Corporate Values</h1>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-16 sm:px-10 lg:px-12 space-y-10">
          {values.map((value) => (
            <div key={value.title} className="border-l-4 border-accent pl-6">
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-foreground/80">{value.text}</p>
            </div>
          ))}
          <p className="text-center text-muted-foreground pt-6">
            Our company leaders, management and employees make these values visible every day.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
