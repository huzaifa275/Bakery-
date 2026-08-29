import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { branches, addToast, setIsAssistantOpen } = useBakery();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    setSent(true);
    addToast('Merci! Your message has been sent to our concierge.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C49258]/15 border border-[#C49258]/30 text-[#A87438] text-xs uppercase tracking-widest font-semibold">
          <Mail className="w-3.5 h-3.5 text-[#C49258]" />
          Service Concierge &amp; Relations
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A16]">
          Get in Touch With Our Atelier
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6E65] font-light">
          Have a question about wild fermentation, custom celebration cakes, corporate gifting, or wholesale partnership?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Information & Concierge */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#E8DFD5] space-y-6">
            <h3 className="font-display text-xl font-bold text-[#1F1A16]">
              Direct Atelier Contacts
            </h3>

            <div className="space-y-4 text-xs text-[#4A3F35]">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C49258] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1F1A16] block">Central Reservation &amp; Cake Desk</strong>
                  <span>+49 (0) 89 2102 8490 (Munich)</span> <br />
                  <span>+33 (0) 1 42 68 99 00 (Paris)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C49258] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1F1A16] block">General Enquiries &amp; Orders</strong>
                  <span>concierge@maisonsainthonore.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C49258] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1F1A16] block">Concierge Hours</strong>
                  <span>Monday to Saturday: 07:00 – 19:30</span> <br />
                  <span>Sunday: 08:00 – 16:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Concierge Box */}
          <div className="bg-[#1F1A16] text-[#FAF7F2] p-8 rounded-3xl border border-[#C49258]/30 space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E6C594]">
              Instant Assistance
            </span>
            <h4 className="font-display text-lg font-bold">
              Speak with our AI Pastry Sommelier
            </h4>
            <p className="text-xs text-[#D8CEBE] font-light">
              Get immediate answers regarding sourdough allergens, lead times, cake sizing, and flavor pairings 24/7.
            </p>
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="bg-[#C49258] hover:bg-[#A87438] text-[#191512] px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Launch Pastry Concierge</span>
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#FFFFFF] p-8 sm:p-10 rounded-3xl border border-[#E8DFD5] shadow-xs">
          {sent ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EFE8DD] text-[#C49258] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-[#C49258]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1F1A16]">
                Message Delivered
              </h3>
              <p className="text-xs text-[#7A6E65] max-w-sm mx-auto">
                Merci, {name}. Our guest relations team will respond to your email at {email} within 4 to 6 business hours.
              </p>
              <button
                onClick={() => setSent(false)}
                className="bg-[#1F1A16] text-[#FAF7F2] px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-display text-xl font-bold text-[#1F1A16] mb-2">
                Send Us a Note
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Madame / Monsieur..."
                    required
                    className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    required
                    className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                  Subject / Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                >
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="Custom Cake Consultation">Custom Cake Consultation</option>
                  <option value="Wedding / Gala Catering">Wedding / Gala Catering</option>
                  <option value="Corporate Gift Hampers">Corporate Gift Hampers</option>
                  <option value="Wholesale Flour & Bread Supply">Wholesale Flour &amp; Bread Supply</option>
                  <option value="Press & Media">Press &amp; Media Relations</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                  Your Message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How may our bakers assist you today?"
                  rows={4}
                  required
                  className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-[#C49258]" />
                <span>Transmit Message</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
