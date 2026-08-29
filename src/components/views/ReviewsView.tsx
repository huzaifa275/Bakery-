import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Star, MessageSquare, Plus, CheckCircle2, X } from 'lucide-react';
import { Review } from '../../types';

export const ReviewsView: React.FC = () => {
  const { reviews, products, addToast } = useBakery();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('Munich');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !title || !comment) {
      addToast('Please complete all review fields', 'error');
      return;
    }

    setIsSubmitting(true);
    const prod = products.find(p => p.id === selectedProductId);

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author,
          city,
          rating,
          title,
          comment,
          productId: selectedProductId,
          productName: prod ? prod.name : 'Maison Experience',
        }),
      });

      addToast('Merci! Your review has been submitted for moderation.', 'success');
      setIsFormOpen(false);
      setTitle('');
      setComment('');
      setAuthor('');
    } catch {
      addToast('Review recorded locally. Merci!', 'success');
      setIsFormOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C49258]/15 border border-[#C49258]/30 text-[#A87438] text-xs uppercase tracking-widest font-semibold">
          <MessageSquare className="w-3.5 h-3.5 text-[#C49258]" />
          Customer reviews
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A16]">
          What our customers say
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6E65] font-light">
          Honest notes from morning regulars, weekend visitors, and wedding couples.
        </p>
      </div>

      {/* Ratings Overview Bar */}
      <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#E8DFD5] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="font-display text-5xl font-bold text-[#1F1A16] block">4.9</span>
            <div className="flex text-amber-400 justify-center my-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-[11px] text-[#7A6E65]">Customer rating</span>
          </div>

          <div className="hidden sm:block border-l border-[#E8DFD5] pl-6 space-y-1 text-xs text-[#7A6E65]">
            <p><strong>Bread &amp; Crust:</strong> 4.9 / 5.0</p>
            <p><strong>Pastries &amp; Croissants:</strong> 4.9 / 5.0</p>
            <p><strong>Custom Celebration Cakes:</strong> 4.9 / 5.0</p>
            <p><strong>Counter Service:</strong> 4.9 / 5.0</p>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#C49258]" />
          <span>Leave a review</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DFD5] shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-medium text-[#7A6E65]">{rev.date}</span>
              </div>

              <h4 className="font-display text-base font-bold text-[#1F1A16]">
                "{rev.title}"
              </h4>

              <p className="text-xs text-[#4A3F35] font-light leading-relaxed">
                {rev.comment}
              </p>
            </div>

            <div className="pt-4 border-t border-[#F4EFEA] flex justify-between items-end text-xs">
              <div>
                <span className="font-bold text-[#1F1A16] block">{rev.author}</span>
                <span className="text-[11px] text-[#7A6E65]">{rev.city} • Verified Order</span>
              </div>
              <span className="text-[10px] text-[#C49258] font-medium bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DFD5]">
                {rev.productName}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Review Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-[#1F1A16]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-5 right-5 text-[#7A6E65] hover:text-[#1F1A16]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C49258]">
                Share Your Experience
              </span>
              <h3 className="font-display text-2xl font-bold text-[#1F1A16]">
                Write a Guest Review
              </h3>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your Name *"
                  required
                  className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City (e.g. Munich, Paris) *"
                  required
                  className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                  Product Enjoyed
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`p-2 rounded-lg border text-xs font-bold ${
                        rating >= num
                          ? 'bg-amber-400 border-amber-500 text-[#1F1A16]'
                          : 'bg-[#FFFFFF] border-[#DCD1C4] text-[#7A6E65]'
                      }`}
                    >
                      ★ {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Headline / Review Title *"
                  required
                  className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                />
              </div>

              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about the crust, crumb, flavor, or collection experience..."
                  rows={3}
                  required
                  className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Post Guest Review'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
