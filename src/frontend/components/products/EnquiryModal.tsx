'use client';

import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

/* shadcn UI Primitives */
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EnquiryModalProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

export default function EnquiryModal({ productId, productName, onClose }: EnquiryModalProps) {
  const [form, setForm] = useState({ 
    subject: `Enquiry: ${productName}`, 
    message: '', 
    email: '', 
    phone: '' 
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, ...form }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md w-[95vw] rounded-xl">
        {done ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
            <div className="rounded-full bg-emerald-500/10 p-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <DialogHeader className="flex flex-col items-center">
              <DialogTitle className="text-xl">Enquiry Sent</DialogTitle>
              <DialogDescription className="text-center pt-2">
                Thanks — our sales team has received your enquiry about <strong className="text-foreground">{productName}</strong> and will get back to you shortly.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={onClose} className="w-full mt-4" size="lg">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Send an Enquiry</DialogTitle>
              <DialogDescription>
                About: <span className="font-medium text-foreground">{productName}</span>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <Input 
                required 
                type="text" 
                placeholder="Subject" 
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                disabled={submitting}
              />
              
              <Textarea 
                required 
                placeholder="Tell us what you need (quantity, specs, timeline, etc.)" 
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4} 
                className="resize-none"
                disabled={submitting}
              />
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input 
                  required 
                  type="email" 
                  placeholder="Your email address" 
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={submitting}
                />
                <Input 
                  type="tel" 
                  placeholder="Phone (optional)" 
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  disabled={submitting}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <p>{error}</p>
                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-0 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {submitting ? 'Sending...' : 'Submit Enquiry'}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}