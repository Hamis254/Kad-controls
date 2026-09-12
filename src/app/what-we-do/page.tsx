import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';
import GetQuoteButton from '@/frontend/components/common/GetQuoteButton';
import { BatteryCharging, Cpu, Gauge, Fuel, Wind, Sun, Wrench, Lightbulb, Video } from 'lucide-react';

const coreServices = [
  { icon: Wrench, title: 'Low voltage distribution panels', text: 'Design, build and installation of LV distribution panels.' },
  { icon: Cpu, title: 'Motor control centres (MCC)', text: 'Multi-motor starter panels with overload protection.' },
  { icon: BatteryCharging, title: 'UPS & inverter systems', text: 'Supply and installation of UPS and inverter systems.' },
  { icon: Gauge, title: 'Power quality analysis', text: 'Power quality analysis — analyzers also available for hire.' },
  { icon: Gauge, title: 'Power factor banks', text: 'Supply and installation of power factor correction banks.' },
  { icon: Cpu, title: 'Variable speed drive (VSD) panels', text: 'Variable speed drive panels for motor control.' },
  { icon: Sun, title: 'Solar PV systems', text: 'Supply and installation of solar PV systems.' },
  { icon: Wind, title: 'HVAC systems', text: 'Supply, installation and commissioning of heating, ventilation and air conditioning systems.' },
  { icon: Wrench, title: 'Automatic change overs', text: 'Supply and installation of automatic change-over systems.' },
  { icon: Cpu, title: 'PLC, HMI & SCADA projects', text: 'Programmable logic controller, HMI and SCADA projects.' },
  { icon: Wrench, title: 'RMUs, VCBs & transformers', text: 'Supply, installation and commissioning of ring main units, vacuum circuit breakers and transformers.' },
  { icon: Video, title: 'CCTV, access control & alarms', text: 'Supply and installation of CCTV, access control, electric fence and alarm systems.' },
  { icon: Fuel, title: 'Diesel generator sets', text: 'Supply, installation and commissioning of diesel generator sets.' },
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
];

export default function WhatWeDoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
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
        <section className="max-w-5xl mx-auto px-6 py-16 sm:px-10 lg:px-12">
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
        </section>

        {/* Core services */}
        <section className="bg-secondary px-6 py-16 sm:px-10 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-10">Core Services</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {coreServices.map(({ icon: Icon, title, text }) => (
                <div key={title} className="border border-border bg-card rounded-lg p-6">
                  <Icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lighting */}
        <section className="max-w-6xl mx-auto px-6 py-16 sm:px-10 lg:px-12">
          <div className="flex items-center gap-2 justify-center mb-10">
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
        </section>

        {/* Training */}
        <section className="bg-secondary px-6 py-16 sm:px-10 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-2">Our Training Section</h2>
            <p className="text-center text-muted-foreground mb-10">
              Short courses for anyone who needs to maintain, program or calibrate industrial control and instrumentation systems.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trainingCourses.map((course) => (
                <div key={course.code} className="border border-border bg-card rounded-lg p-6">
                  <span className="text-sm font-semibold text-accent">{course.code}</span>
                  <h3 className="font-semibold text-lg mt-1 mb-3">{course.title}</h3>
                  {course.basis && (
                    <p className="text-sm text-muted-foreground mb-3">{course.basis}</p>
                  )}
                  <ul className="text-sm text-foreground/80 space-y-1">
                    <li><span className="font-medium">Duration:</span> {course.duration}</li>
                    <li><span className="font-medium">Audience:</span> {course.audience}</li>
                  </ul>
                  <GetQuoteButton className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                    Send Enquiry
                  </GetQuoteButton>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-accent px-6 py-16 text-center sm:px-10">
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