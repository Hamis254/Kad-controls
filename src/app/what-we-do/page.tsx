import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';
import GetQuoteButton from '@/frontend/components/common/GetQuoteButton';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

const coreServices = [
  { title: 'Low voltage distribution panels', text: 'Design, build and installation of LV distribution panels.' },
  { title: 'Motor control centres (MCC)', text: 'Multi-motor starter panels with overload protection.' },
  { title: 'UPS & inverter systems', text: 'Supply and installation of UPS and inverter systems.' },
  { title: 'Power quality analysis', text: 'Power quality analysis — analyzers also available for hire.' },
  { title: 'Power factor banks', text: 'Supply and installation of power factor correction banks.' },
  { title: 'Variable speed drive (VSD) panels', text: 'Variable speed drive panels for motor control.' },
  { title: 'Solar PV systems', text: 'Supply and installation of solar PV systems.' },
  { title: 'HVAC systems', text: 'Supply, installation and commissioning of heating, ventilation and air conditioning systems.' },
  { title: 'Automatic change overs', text: 'Supply and installation of automatic change-over systems.' },
  { title: 'PLC, HMI & SCADA projects', text: 'Programmable logic controller, HMI and SCADA projects.' },
  { title: 'RMUs, VCBs & transformers', text: 'Supply, installation and commissioning of ring main units, vacuum circuit breakers and transformers.' },
  { title: 'CCTV, access control & alarms', text: 'Supply and installation of CCTV, access control, electric fence and alarm systems.' },
  { title: 'Diesel generator sets', text: 'Supply, installation and commissioning of diesel generator sets.' },
];

const lightingGroups = [
  {
    title: 'Industrial & warehouse lighting',
    items: [
      'Industrial and warehouse interior lighting solutions',
      'Hi-bay LED warehouse lighting (new & retrofit)',
      'Hi-bay fluorescent lighting (new & retrofit)',
      'High Intensity Discharge (HID) lighting — new & retrofit',
      'Food & beverage industry rated lighting (GMP compliant)',
      'Oil & gas listed lighting (XP, oil & dust tight)',
      'Lighting audits with payback analysis (ROI)',
    ],
  },
  {
    title: 'Commercial & office lighting',
    items: [
      'Interior architectural lighting — incandescent, fluorescent and LED',
      'Direct/indirect lighting',
      'Atmosphere lighting',
      'Classroom lighting',
      'Dimming & lighting control systems',
      'Retail store lighting',
      'Low voltage lighting solutions',
      'Decorative lighting',
    ],
  },
  {
    title: 'Exterior lighting',
    items: [
      'Parking lot / pole lighting — maintenance, repair, installation & retrofit',
      'Municipal street lighting',
      'Parking garage lighting',
      'HID, metal halide, high pressure sodium, mercury vapour & LED lighting',
      'Underground cable repair or replacement',
      'Emergency service for downed poles (vehicle, wind & storm damage)',
    ],
  },
];

const process = [
  { step: '01', title: 'Design', text: 'We assess your requirements and design the solution around them, not a generic template.' },
  { step: '02', title: 'Supply', text: 'We supply the panels, systems and components the design calls for.' },
  { step: '03', title: 'Install', text: 'Our own technical team carries out the installation on site.' },
  { step: '04', title: 'Commission', text: 'We test, commission and hand over a working system, with support after.' },
];

const trainingCourses = [
  {
    code: '01',
    title: 'PLC Programming & Troubleshooting',
    basis: "Based on Siemens' S7-300/400",
    duration: '10 days (5 days basic, 5 days advanced)',
    audience: 'Anyone needing to maintain or program a PLC system',
  },
  {
    code: '02',
    title: 'VFD Programming & Troubleshooting',
    basis: "Based on Siemens' Micromaster 440 / Sinamics",
    duration: '5 days',
    audience: 'Anyone needing to maintain or program a VFD',
  },
  {
    code: '03',
    title: 'SCADA Programming & Troubleshooting',
    basis: "Based on Siemens' WinCC Flexible",
    duration: '5 days',
    audience: 'Anyone needing to maintain or program a SCADA system',
  },
  {
    code: '04',
    title: 'Process Measurements Training',
    basis: null,
    duration: '3 days',
    audience: 'Instrumentation technicians',
  },
  {
    code: '05',
    title: 'Sensor Calibration Training',
    basis: null,
    duration: '3 days',
    audience: 'Instrumentation technicians',
  },
  {
    code: '06',
    title: 'Pneumatic Systems Training',
    basis: null,
    duration: '2 days',
    audience: 'Instrumentation technicians',
  },
  {
    code: '07',
    title: 'Motor Control Centre (MCC) Maintenance & Troubleshooting',
    basis: 'Hands-on with live MCC panels and overload protection setups',
    duration: '4 days',
    audience: 'Electricians and technicians responsible for motor control panels',
  },
  {
    code: '08',
    title: 'Power Quality Analysis & Correction',
    basis: 'Using our own power quality analyzers on real load profiles',
    duration: '3 days',
    audience: 'Facility engineers and technicians managing power factor and harmonics',
  },
  {
    code: '09',
    title: 'Solar PV Installation & Maintenance',
    basis: 'Covers array sizing, wiring, inverters and fault-finding',
    duration: '5 days',
    audience: 'Electricians moving into solar installation and maintenance work',
  },
  {
    code: '10',
    title: 'UPS & Inverter Systems Maintenance',
    basis: null,
    duration: '3 days',
    audience: 'Technicians responsible for standby power systems',
  },
  {
    code: '11',
    title: 'Electrical Safety & Lockout-Tagout (LOTO)',
    basis: 'Practical isolation drills on our training panels',
    duration: '2 days',
    audience: 'Anyone working on or near live electrical systems',
  },
  {
    code: '12',
    title: 'CCTV & Access Control Systems',
    basis: 'Hands-on installation, configuration and fault-finding',
    duration: '3 days',
    audience: 'Security systems installers and facility technicians',
  },
];

export default function WhatWeDoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-secondary text-foreground">
      <Navbar />

      <main className="flex-1">
        <section className="bg-primary text-primary-foreground px-6 py-16 sm:px-10 lg:px-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent mb-4">Our capabilities</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">What We Do</h1>
          <p className="mt-6 max-w-2xl mx-auto text-primary-foreground/80">
            A turn-key solution provider — we design, supply, install and commission, so you deal with
            one team from concept through to a working system.
          </p>
        </section>

        {/* Turn-key process */}
        <section className="w-full px-6 py-16 sm:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-[1600px]">
          <h2 className="text-2xl font-semibold text-center mb-2">Turn-key, start to finish</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
            One team handles every stage — no gaps between a designer, a supplier and an installer.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div key={p.step} className="border border-border bg-card rounded-lg p-6">
                <span className="text-3xl font-bold text-accent">{p.step}</span>
                <h3 className="font-semibold text-lg mt-3 mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

        <section className="w-full px-6 pt-0 pb-10 sm:px-10 lg:px-12 lg:pb-12">
          <div className="mx-auto w-full max-w-[1600px]">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-border bg-card rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Turnkey Projects</h3>
              <p className="text-sm text-muted-foreground">Full-scope work — design, supply, installation and commissioning, handled start to finish by our own team.</p>
            </div>
            <div className="border border-border bg-card rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Certified Panel Manufacturing</h3>
              <p className="text-sm text-muted-foreground">We are certified panel manufacturers, working to the standards of our technology partners including Siemens and Schneider Electric.</p>
            </div>
            <div className="border border-border bg-card rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Contract Labor Supply</h3>
              <p className="text-sm text-muted-foreground">Qualified technicians supplied to work on contracts already in progress — bringing our certified expertise to your site.</p>
            </div>
            <div className="border border-border bg-card rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Materials Supply</h3>
              <p className="text-sm text-muted-foreground">Electrical materials and components, supplied and ready when your project needs them.</p>
            </div>
          </div>
          </div>
        </section>

        {/* Core services */}
        <section className="w-full bg-secondary border-t border-border px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
          <div className="mx-auto w-full max-w-[1600px]">
            <h2 className="text-2xl font-semibold text-center mb-6">Core Services</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {coreServices.map(({ title, text }, index) => (
                <div key={title} className="border border-border bg-card rounded-lg p-6">
                  <span className="text-3xl font-bold text-accent">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="font-semibold text-lg mt-3 mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lighting */}
        <section className="w-full px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
          <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex items-center gap-2 justify-center mb-6">
            <Lightbulb className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Lighting Services</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {lightingGroups.map((group) => (
              <div key={group.title}>
                <h3 className="font-semibold text-lg mb-4">{group.title}</h3>
                <ul className="space-y-2 text-sm text-foreground/80">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-accent">—</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* Training */}
        <section className="w-full bg-secondary border-t border-border px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
          <div className="mx-auto w-full max-w-[1600px]">
            <h2 className="text-2xl font-semibold text-center mb-2">Our Training Section</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Every course is fully practical — trainees work hands-on with our own training kits and
              live equipment, not just slides. Each course ends with an assessment and a certificate of
              completion.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-5 mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1.5 text-xs font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 100% hands-on, practical sessions
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1.5 text-xs font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Training kits and live equipment provided
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1.5 text-xs font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Certificate of completion
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trainingCourses.map((course) => (
                <div key={course.code} className="border border-border bg-card rounded-lg p-6 flex flex-col">
                  <span className="text-sm font-semibold text-accent">{course.code}</span>
                  <h3 className="font-semibold text-lg mt-1 mb-3">{course.title}</h3>
                  {course.basis && (
                    <p className="text-sm text-muted-foreground mb-3">{course.basis}</p>
                  )}
                  <ul className="text-sm text-foreground/80 space-y-1">
                    <li><span className="font-medium">Duration:</span> {course.duration}</li>
                    <li><span className="font-medium">Audience:</span> {course.audience}</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    Practical, kit-based training — certificate issued on completion.
                  </p>
                  <GetQuoteButton className="mt-auto inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 self-start">
                    Book This Training
                  </GetQuoteButton>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-accent px-6 py-12 text-center sm:px-10">
          <h2 className="text-3xl font-semibold tracking-tight text-accent-foreground">Need one of these for your site?</h2>
          <GetQuoteButton className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90">
            Get a quote
          </GetQuoteButton>
        </section>
      </main>

      <Footer />
    </div>
  );
}