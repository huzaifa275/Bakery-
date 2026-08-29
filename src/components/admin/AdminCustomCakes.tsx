import React, { useState, useEffect } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Sparkles, 
  Calendar, 
  Users, 
  Layers, 
  DollarSign, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Heart
} from 'lucide-react';
import { CustomCakeRequest } from '../../types';

export const AdminCustomCakes: React.FC = () => {
  const { addToast } = useBakery();
  const [cakeRequests, setCakeRequests] = useState<CustomCakeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCake, setSelectedCake] = useState<CustomCakeRequest | null>(null);

  const fetchCakes = async () => {
    try {
      const res = await fetch('/api/custom-cakes');
      const data = await res.json();
      if (data.success && Array.isArray(data.customCakeRequests)) {
        setCakeRequests(data.customCakeRequests);
      }
    } catch {
      // Sample mock data for preview if empty
      setCakeRequests([
        {
          id: 'cake-req-101',
          customerName: 'Éléonore de Montmirail',
          customerEmail: 'eleonore@montmirail.fr',
          customerPhone: '+33 6 45 89 12 30',
          eventDate: '2026-09-18',
          eventType: 'Wedding',
          guestCount: 85,
          tierCount: 3,
          flavorProfile: 'Madagascar Vanilla Bean & Wild Raspberry Confit',
          frostingType: 'Swiss Meringue Buttercream (Textured Stucco)',
          budgetRange: '€450 - €600',
          dietaryRestrictions: ['Nut-Free'],
          customInscription: 'Pour Toujours • E & L',
          referenceImages: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'],
          status: 'under_review',
          notes: 'Wants gold leaf accents and fresh white garden roses on the second tier.',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  const updateCakeStatus = async (cakeId: string, newStatus: CustomCakeRequest['status']) => {
    try {
      await fetch(`/api/custom-cakes/${cakeId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setCakeRequests(prev => prev.map(c => c.id === cakeId ? { ...c, status: newStatus } : c));
      if (selectedCake?.id === cakeId) {
        setSelectedCake(prev => prev ? { ...prev, status: newStatus } : null);
      }
      addToast(`Cake enquiry status updated to ${newStatus}`, 'success');
    } catch {
      setCakeRequests(prev => prev.map(c => c.id === cakeId ? { ...c, status: newStatus } : c));
      addToast(`Cake enquiry status updated locally`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#2C2420]">Custom Cake Atelier Inquiries</h2>
        <p className="text-xs text-[#8C827A]">
          Manage bespoke celebration tiers, wedding tastings, custom inscriptions, and pastry chef quotes
        </p>
      </div>

      {/* Grid of Cake Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cakeRequests.length === 0 ? (
          <div className="col-span-2 bg-white rounded-3xl border border-[#EBE3D7] p-12 text-center text-[#8C827A]">
            <Sparkles className="w-8 h-8 mx-auto text-[#C49258] mb-2" />
            <p className="text-sm font-medium text-[#2C2420]">No bespoke cake inquiries at this moment.</p>
            <p className="text-xs text-[#8C827A] mt-1">New submissions via the Cake Atelier Studio will appear here automatically.</p>
          </div>
        ) : (
          cakeRequests.map(cake => (
            <div 
              key={cake.id}
              className="bg-white rounded-3xl border border-[#EBE3D7] p-6 shadow-sm space-y-4 hover:border-[#C49258] transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold text-[#2C2420]">{cake.eventType} Cake</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      cake.status === 'submitted' || cake.status === 'under_review' ? 'bg-[#FFF8EE] text-[#B7791F]' :
                      cake.status === 'quoted' || cake.status === 'in_production' ? 'bg-[#FAF5FF] text-[#6B46C1]' :
                      'bg-[#F0FFF4] text-[#22543D]'
                    }`}>
                      {cake.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-[#5A5047] font-semibold">{cake.customerName}</div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-bold text-[#C49258]">{cake.budgetRange || 'Flexible Budget'}</span>
                  <div className="text-[10px] text-[#8C827A]">{new Date(cake.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-[#FAF8F5] p-3 rounded-2xl border border-[#EDE4D8]">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-[#8C827A] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#C49258]" /> Event Date
                  </span>
                  <span className="font-semibold text-[#2C2420]">{cake.eventDate}</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-[#8C827A] flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#C49258]" /> Guests
                  </span>
                  <span className="font-semibold text-[#2C2420]">{cake.guestCount} servings</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-[#8C827A] flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#C49258]" /> Tiers
                  </span>
                  <span className="font-semibold text-[#2C2420]">{cake.tierCount} Tiers</span>
                </div>
              </div>

              {/* Flavors & Details */}
              <div className="text-xs space-y-1.5 text-[#5A5047]">
                <div>
                  <strong className="text-[#2C2420]">Flavors:</strong> {cake.flavorProfile || 'Chef Signature Pairing'}
                </div>
                {cake.customInscription && (
                  <div>
                    <strong className="text-[#2C2420]">Inscription:</strong> <span className="font-serif italic text-[#C49258]">"{cake.customInscription}"</span>
                  </div>
                )}
                {cake.notes && (
                  <div className="text-[11px] text-[#7A6E65] bg-white p-2.5 rounded-xl border border-[#EBE3D7]">
                    "{cake.notes}"
                  </div>
                )}
              </div>

              {/* Customer Contact & Status Actions */}
              <div className="pt-2 border-t border-[#F2EDE4] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-[#8C827A]">
                  <a href={`mailto:${cake.customerEmail}`} className="hover:text-[#2C2420] flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#C49258]" />
                    <span>Email</span>
                  </a>
                  <a href={`tel:${cake.customerPhone}`} className="hover:text-[#2C2420] flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#C49258]" />
                    <span>Call</span>
                  </a>
                </div>

                <div className="flex items-center gap-1.5">
                  {cake.status !== 'approved_quoted' && cake.status !== 'in_production' && cake.status !== 'completed' && (
                    <button
                      onClick={() => updateCakeStatus(cake.id, 'approved_quoted')}
                      className="bg-[#2C2420] hover:bg-[#3D332D] text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Send Quote
                    </button>
                  )}
                  {cake.status === 'approved_quoted' && (
                    <button
                      onClick={() => updateCakeStatus(cake.id, 'in_production')}
                      className="bg-[#6B46C1] hover:bg-[#553C9A] text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Begin Production
                    </button>
                  )}
                  {cake.status === 'in_production' && (
                    <button
                      onClick={() => updateCakeStatus(cake.id, 'completed')}
                      className="bg-[#22543D] hover:bg-[#1C4532] text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
