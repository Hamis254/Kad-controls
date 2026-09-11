/**
 * Demo/real content seed — gives the storefront realistic Kad Controls-style inventory
 * (solar, panels, automation, PLCs, BMS/fire alarm) with real photo URLs so it looks
 * populated for a demo/presentation instead of showing an empty catalogue. Also seeds
 * the real partners (14), clients (12) and completed projects (9) pulled directly from
 * Kad Controls' own company profile brochure.
 *
 * Run with: npx tsx scripts/seed.ts   (requires DATABASE_URL in .env.local)
 *
 * Product photos are hotlinked from Unsplash's free-to-use source for placeholder
 * purposes only — replace with your own product photography before going live.
 * Project photos from the brochure aren't hosted anywhere yet, so they're not
 * attached here — add them via /admin/projects once you have hosted image URLs.
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

// Imported dynamically (after dotenv is configured above) because db/client.ts reads
// DATABASE_URL at module-load time, and static imports would otherwise run first.
async function main() {
  const { db } = await import('../src/backend/db/client');
  const { categories, productImages, products, users, partners, clients, projects } = await import('../src/backend/db/schema');

  console.log('Seeding categories...');
  const [solar, panels, automation, plcs, bms] = await db
    .insert(categories)
    .values([
      { name: 'Solar Systems', slug: 'solar-systems', description: 'Complete solar power systems, inverters and batteries.', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800' },
      { name: 'Custom Panels', slug: 'custom-panels', description: 'Custom-built electrical distribution and control panels.', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800' },
      { name: 'Automation Control Panels', slug: 'automation-control-panels', description: 'Automation and process-control panel builds.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800' },
      { name: 'PLCs', slug: 'plcs', description: 'Programmable logic controllers and accessories.', image: 'https://images.unsplash.com/photo-1580983230786-4e6d3fd6f8b0?w=800' },
      {
        name: 'Building Management Systems',
        slug: 'building-management-systems',
        description: 'Supply, installation and commissioning of building management systems (BMS) — centralized monitoring and control of a facility\u2019s electrical, mechanical and safety systems.',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800',
      },
    ])
    .returning();

  const [fireAlarm] = await db
    .insert(categories)
    .values([
      {
        name: 'Fire Alarm Systems',
        slug: 'fire-alarm-systems',
        parentId: bms.id,
        description: 'Supply and installation of fire alarm systems — detection, alarm panels and sounders — as an authorized distributor of Mavili Fire Alarm Systems. Covers design, installation, testing and commissioning to keep a site compliant and its occupants safe.',
        image: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800',
      },
    ])
    .returning();

  console.log('Seeding an admin account (sign in with Google using this email to get admin rights)...');
  await db
    .insert(users)
    .values({ email: 'admin@kadcontrols.example', name: 'Kad Controls Admin', role: 'admin' })
    .onConflictDoNothing();

  console.log('Seeding products...');
  const productRows = await db
    .insert(products)
    .values([
      {
        name: '5kVA Hybrid Solar Inverter System',
        shortDescription: 'Complete hybrid inverter, MPPT controller and battery bank.',
        description: 'A 5kVA hybrid solar inverter system sized for small commercial or residential loads, including MPPT charge controller, battery bank and mounting hardware. Installed and commissioned by our technical team.',
        price: '185000.00',
        categoryId: solar.id,
        sku: 'SOL-HYB-5KVA',
        stock: 12,
      },
      {
        name: '10kVA Solar System with Lithium Battery Bank',
        shortDescription: 'High-capacity system for offices and light industry.',
        description: 'A 10kVA solar power system with lithium battery storage, designed for offices, workshops, and light industrial loads that need reliable backup power.',
        price: '420000.00',
        categoryId: solar.id,
        sku: 'SOL-LI-10KVA',
        stock: 6,
      },
      {
        name: 'Custom Electrical Distribution Panel',
        shortDescription: 'Built-to-spec distribution board, IP54 enclosure.',
        description: 'A custom-fabricated electrical distribution panel built to your load schedule, housed in an IP54-rated enclosure with labeled breakers and busbars.',
        price: '68000.00',
        categoryId: panels.id,
        sku: 'PNL-DIST-STD',
        stock: 8,
      },
      {
        name: 'Motor Control Center (MCC) Panel',
        shortDescription: 'Multi-motor starter panel with overload protection.',
        description: 'A motor control center panel housing multiple motor starters with thermal overload protection, built for industrial pump and fan control applications.',
        price: '145000.00',
        categoryId: panels.id,
        sku: 'PNL-MCC-4WAY',
        stock: 4,
      },
      {
        name: 'PLC-Based Automation Control Panel',
        shortDescription: 'Turnkey automation panel with HMI touchscreen.',
        description: 'A complete automation control panel built around a programmable logic controller with an HMI touchscreen interface, configured for your specific process.',
        price: '210000.00',
        categoryId: automation.id,
        sku: 'AUTO-PLC-HMI',
        stock: 3,
      },
      {
        name: 'Water Pumping Automation Panel',
        shortDescription: 'Level-sensor driven automatic pump control panel.',
        description: 'An automation panel for borehole and water tank pumping systems, using level sensors to start/stop pumps automatically and protect against dry-running.',
        price: '95000.00',
        categoryId: automation.id,
        sku: 'AUTO-PUMP-LVL',
        stock: 9,
      },
      {
        name: 'Siemens S7-1200 Compact PLC',
        shortDescription: 'Compact PLC unit for small-to-medium automation tasks.',
        description: 'A compact programmable logic controller suited to small and medium automation projects, supplied with the I/O modules your application needs.',
        price: '58000.00',
        categoryId: plcs.id,
        sku: 'PLC-S7-1200',
        stock: 15,
      },
      {
        name: 'Modular PLC with Expansion I/O',
        shortDescription: 'Expandable PLC for larger control system builds.',
        description: 'A modular PLC platform that scales with expansion I/O modules — the right fit for larger control system builds that may need to grow over time.',
        price: '132000.00',
        categoryId: plcs.id,
        sku: 'PLC-MOD-EXP',
        stock: 5,
      },
      {
        name: 'Addressable Fire Alarm System',
        shortDescription: 'Mavili addressable fire detection and alarm panel, supplied and installed.',
        description: 'A complete addressable fire alarm system — control panel, smoke/heat detectors, call points and sounders — supplied as an authorized distributor of Mavili Fire Alarm Systems. Design, installation, testing and commissioning included, sized to your building\u2019s zoning requirements.',
        price: '0.00',
        categoryId: fireAlarm.id,
        sku: 'BMS-FIRE-ADDR',
        stock: 20,
      },
      {
        name: 'Conventional Fire Alarm Panel & Detector Set',
        shortDescription: 'Entry-level conventional fire alarm panel with zoned detectors.',
        description: 'A conventional (zoned) fire alarm panel with smoke detectors, heat detectors and manual call points — a cost-effective fire detection option for smaller premises. Supplied, installed and commissioned by our technical team.',
        price: '0.00',
        categoryId: fireAlarm.id,
        sku: 'BMS-FIRE-CONV',
        stock: 20,
      },
    ])
    .returning();

  console.log('Attaching product photos...');
  const photoByCategory: Record<string, string[]> = {
    [solar.id]: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1200',
    ],
    [panels.id]: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200',
      'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=1200',
    ],
    [automation.id]: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200',
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200',
    ],
    [plcs.id]: [
      'https://images.unsplash.com/photo-1580983230786-4e6d3fd6f8b0?w=1200',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
    ],
    [fireAlarm.id]: [
      'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=1200',
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200',
    ],
  };

  for (const product of productRows) {
    const urls = photoByCategory[product.categoryId] ?? [];
    if (urls.length === 0) continue;
    await db.insert(productImages).values(
      urls.map((url, idx) => ({ productId: product.id, url, alt: product.name, order: idx }))
    );
  }

  console.log(`Seeded ${productRows.length} products across 5 categories (including Fire Alarm Systems under BMS).`);

  // ---------------------------------------------------------------------
  // Partners, clients and projects — real content from Kad Controls' own
  // company profile brochure.
  // ---------------------------------------------------------------------

  console.log('Seeding partners...');
  await db.insert(partners).values([
    {
      name: 'Siemens',
      role: 'Siemens Partner',
      description: 'Industrial automation, digitalization and energy management — Factory & Process Automation, Motion Control, PLCs (S7-1500/S7-1200), HMI/SCADA (WinCC, PCS 7), and Digital Industries Software.',
      order: 1,
    },
    {
      name: 'Schneider Electric Systems',
      role: 'Authorized systems integrator',
      description: 'Energy management, Building Management Systems (BMS), industrial automation, power monitoring and EcoStruxure architecture & platforms.',
      order: 2,
    },
    {
      name: 'Danfoss',
      role: 'Authorized partner',
      description: 'Energy-efficient solutions in HVAC, refrigeration, drives and industrial automation — VLT® and VACON® drives, DrivePro® lifecycle services.',
      order: 3,
    },
    {
      name: 'Festo',
      role: 'Official partner',
      description: 'Automation, motion control and pneumatic solutions — pneumatic & electric automation, motion control, custom system integration, Industry 4.0.',
      order: 4,
    },
    {
      name: 'Mavili Fire Alarm Systems',
      role: 'Authorized distributor',
      description: 'Conventional and addressable fire and gas detection systems (Maxlogic & Mavigard), compliant with EN 54 and NFPA standards.',
      order: 5,
    },
    {
      name: 'Endress+Hauser',
      role: 'Authorized distributor',
      description: 'Process automation and instrumentation — level, flow, pressure and temperature measurement, liquid & gas analysis, tank gauging.',
      order: 6,
    },
    {
      name: 'ifm electronic',
      role: 'Partner',
      description: 'Sensor technology and industrial automation — proximity, pressure, flow and temperature sensors, IIoT and condition monitoring.',
      order: 7,
    },
    {
      name: 'Portwest',
      role: 'Official partner',
      description: 'Personal protective equipment, workwear and safety gear across East Africa — hi-vis clothing, gloves, footwear, head & hearing protection.',
      order: 8,
    },
    {
      name: 'DEHN',
      role: 'Authorized partner',
      description: 'Lightning and surge protection, earthing systems and safety equipment for critical infrastructure.',
      order: 9,
    },
    {
      name: 'LEDVANCE',
      role: 'Partner',
      description: 'Advanced lighting solutions — LED lamps & luminaires, smart lighting controls, EV chargers, and solar panels/inverters/batteries.',
      order: 10,
    },
    {
      name: 'Unitronics',
      role: 'Official partner',
      description: 'All-in-one PLC + HMI platforms — UniStream®, Vision™ Series, Jazz® & M91™, and VFDs.',
      order: 11,
    },
    { name: 'CNC Electric', role: 'Partner', order: 12 },
    { name: 'Rock Fall', role: 'Safety footwear partner', order: 13 },
    { name: 'STD Transformator', role: 'Partner — "Smart Designs for Efficiency"', order: 14 },
  ]);

  console.log('Seeding clients...');
  await db.insert(clients).values([
    { name: 'Unilever Kenya Ltd', order: 1 },
    { name: 'Unilever Tea Kenya Ltd', order: 2 },
    { name: 'BAT Kenya Ltd', order: 3 },
    { name: 'Kenya Wine Agencies Ltd', order: 4 },
    { name: 'Bamburi Cement', order: 5 },
    { name: 'Tetra Pak Ltd', order: 6 },
    { name: 'Pembe Flour Mills', order: 7 },
    { name: 'Mama Millers Ltd', order: 8 },
    { name: 'Komaza Forestry Ltd', order: 9 },
    { name: 'Burundi Cement Company', order: 10 },
    { name: 'Browns Plantation PLC', order: 11 },
    { name: 'Unilever Ltd Ethiopia', order: 12 },
  ]);

  console.log('Seeding projects...');
  await db.insert(projects).values([
    {
      title: 'RMU, Transformer & Wheat Mill Installation',
      clientName: 'Mama Millers Ltd',
      summary: 'Supply, installation and commissioning of RMU, 2MVA transformer and LV distribution boards.',
      description: 'Supply, installation and commissioning of RMU, 2MVA transformer, Low Voltage Distribution Boards, and installation of a 200T/24HRs wheat mill and edible oil refinery plant.',
    },
    {
      title: 'RMU, Transformer, Generator & Fire Alarm Installation',
      clientName: 'Komaza Forestry Ltd',
      summary: 'RMU, 2MVA transformer, LV boards, 250KVA generator, CCTV, fire alarm and lighting.',
      description: 'Supply, installation and commissioning of RMU, 2MVA transformer, Low Voltage Distribution Boards, 250KVA diesel generator set, CCTV, fire alarm system, lighting system and clean power inverters.',
    },
    {
      title: 'VCB Switchgear Installation',
      clientName: 'Unilever Kenya Ltd',
      summary: 'Supply, installation and commissioning of VCB 17.5KV, 630A PIX RM by Schneider Electric Systems.',
      description: 'Supply, installation and commissioning of VCB 17.5KV, 630A PIX RM switchgear by Schneider Electric Systems.',
    },
    {
      title: 'GMES Manufacturing Execution System (IoT)',
      clientName: 'British American Tobacco (BAT)',
      summary: 'Supply, installation and commissioning of GMES with SCADA/OPC integration.',
      description: 'Supply, installation and commissioning of GMES for BAT. GMES offers the opportunity to exchange data with other systems via SCADA — communication to and from the GMES Machine Integrator connects to an OPC server and takes data directly from the machines, interfacing for PMD production order execution and CRT inventory tracking.',
    },
    {
      title: 'Powder Soap Manufacturing PLC Upgrade',
      clientName: 'Unilever Kenya Ltd',
      summary: 'Plant automation — upgrade of the powder soap manufacturing PLC system (slurry making).',
      description: 'Plant automation project: upgrade of the powder soap manufacturing PLC system (slurry making).',
    },
    {
      title: 'Alcohol Filling Plant PLC Upgrade',
      clientName: 'Kenya Wine Agencies Ltd',
      summary: 'Plant automation — upgraded the alcohol filling plant from Siemens S5 to S7 PLC system.',
      description: 'Plant automation project: upgrade of the alcohol filling plant from a Siemens S5 to an S7 PLC system.',
    },
    {
      title: 'Ball Mill Closed-Circuiting',
      clientName: 'Burundi Cement Company',
      summary: 'Plant automation — closed circuiting of the ball mill (BUCECO Phase 3).',
      description: 'Plant automation project: closed circuiting of the ball mill as part of BUCECO Phase 3.',
    },
    {
      title: 'Plant Automation, Siemens PLC System',
      clientName: 'Browns Plantation PLC',
      summary: 'Plant automation based on a Siemens PLC system.',
      description: 'Plant automation project based on a Siemens PLC system.',
    },
    {
      title: 'Energy Management System',
      clientName: 'Unilever Ltd Ethiopia',
      summary: 'Supply, installation and commissioning of an EMS based on Schneider Electric Power Monitoring Expert.',
      description: 'Energy Management System: supply, installation and commissioning of an EMS based on Schneider Electric Power Monitoring Expert.',
    },
  ]);

  console.log(`Done — seeded 14 partners, 12 clients and 9 projects from the company brochure.`);
  console.log('Note: project photos from the brochure aren\'t hosted anywhere yet, so none were attached — add them via /admin/projects once you have hosted image URLs.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
