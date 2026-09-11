import Link from 'next/link';
import AdminGuard from '@/frontend/components/admin/AdminGuard';
import Navbar from '@/frontend/components/common/Navbar';
import Footer from '@/frontend/components/common/Footer';

const sections = [
  { href: '/admin/products/new', title: 'Products', text: 'Add products with photos to the catalogue.' },
  { href: '/admin/categories', title: 'Categories', text: 'Organize the catalogue, including subcategories like Fire Alarm under BMS.' },
  { href: '/admin/projects', title: 'Projects', text: 'Publish case studies with images and short videos.' },
  { href: '/admin/partners', title: 'Partners', text: 'Manage the partners shown on the Partners page.' },
  { href: '/admin/clients', title: 'Clients', text: 'Manage the "Our Clients" logo strip.' },
  { href: '/admin/jobs', title: 'Careers', text: 'Post and close job openings.' },
];

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <div className="min-h-screen flex flex-col bg-muted/30 text-foreground">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
          <h1 className="text-3xl font-bold mb-2">Admin</h1>
          <p className="text-muted-foreground mb-8">
            This area is not linked from the public site — bookmark it. Content you publish here shows
            up on the public pages immediately.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {sections.map((s) => (
              <Link key={s.href} href={s.href} className="border border-border bg-card rounded-lg p-6 hover:border-primary transition">
                <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </Link>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </AdminGuard>
  );
}
