'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';

const inputCls =
  'h-12 w-full border border-ink/15 bg-ivory px-4 text-sm text-ink placeholder:text-graphite/45 transition-colors focus:border-ink focus:outline-none';

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Production: POST to /api/contact (or a CRM / Zendesk / email service).
    setSent(true);
  }

  if (sent) {
    return (
      <div className="grid h-full min-h-[320px] place-items-center border border-line bg-champagne/40 p-10 text-center">
        <div>
          <h2 className="font-serif text-3xl text-ink">Thank you.</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-graphite/75">
            Your message has reached the atelier. We reply to every note within one business day.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-[0.68rem] uppercase tracking-luxe text-graphite">Name</label>
          <input id="name" name="name" required autoComplete="name" className={inputCls} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-[0.68rem] uppercase tracking-luxe text-graphite">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputCls} placeholder="you@email.com" />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="mb-2 block text-[0.68rem] uppercase tracking-luxe text-graphite">Subject</label>
        <select id="subject" name="subject" className={inputCls}>
          <option>Styling advice</option>
          <option>Bespoke commission</option>
          <option>Care & repairs</option>
          <option>Order enquiry</option>
          <option>Something else</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-[0.68rem] uppercase tracking-luxe text-graphite">Message</label>
        <textarea id="message" name="message" required rows={5} className={`${inputCls} h-auto py-3`} placeholder="How can we help?" />
      </div>
      <Button type="submit" className="w-full sm:w-auto">Send message</Button>
    </form>
  );
}
