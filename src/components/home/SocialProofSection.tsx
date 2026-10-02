import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Star, ShieldCheck, MessageSquareQuote, ArrowRight, PenLine } from 'lucide-react';

export const SocialProofSection: React.FC = () => {
  const { reviews, setActiveView } = useBakery();

  // Strictly genuine approved reviews from database
  const approvedReviews = reviews.filter(r => r.isApproved === true || r.status === 'approved');

  // Prioritize featured approved reviews, then 5-star, then 4-star, etc.
  const sortedReviews = [...approvedReviews].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return b.rating - a.rating;
  });

  const displayReviews = sortedReviews.slice(0, 4);

  const totalReviewsCount = approvedReviews.length;
  const avgRating = totalReviewsCount > 0
    ? (approvedReviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / totalReviewsCount).toFixed(1)
    : '5.0';

  return (
    <section 
      id="reviews"
      aria-label="Customer testimonials"
      className="py-16 sm:py-24 bg-[#FDFBF7] border-b border-stone-200/60 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A373]/15 text-[#C86D51] text-xs font-semibold uppercase tracking-widest">
              <Star className="w-3.5 h-3.5 fill-[#C86D51] text-[#C86D51]" />
              <span>Real Customer Stories</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1E1511]">
              Loved by Our Regulars
            </h2>

            <p className="text-xs sm:text-sm text-[#5D5047] font-light max-w-lg">
              Every review comes from real neighborhood customers and authentic verified orders.
            </p>
          </div>

          {/* Genuine Stats Badge */}
          {totalReviewsCount > 0 && (
            <div className="flex items-center gap-4 bg-[#FFFFFF] p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-500 justify-end">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#7A6E65] mt-0.5">
                  <strong className="text-[#1E1511] font-semibold">{avgRating}/5</strong> based on {totalReviewsCount} {totalReviewsCount === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              <div className="w-px h-10 bg-stone-200" />

              <button
                type="button"
                onClick={() => setActiveView('reviews')}
                className="px-3.5 py-2 rounded-xl bg-[#F7F3EB] hover:bg-[#EFE8DD] text-[#1E1511] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PenLine className="w-3.5 h-3.5 text-[#C86D51]" />
                <span>Write Review</span>
              </button>
            </div>
          )}
        </div>

        {/* Testimonials Grid */}
        {displayReviews.length === 0 ? (
          <div className="text-center py-12 bg-[#F7F3EB] rounded-3xl p-8 space-y-3 border border-stone-200/60">
            <MessageSquareQuote className="w-8 h-8 text-[#C86D51] mx-auto opacity-70" />
            <h3 className="font-display text-lg font-semibold text-[#1E1511]">No Reviews Yet</h3>
            <p className="text-xs text-[#7A6E65]">Be the first customer to share your thoughts after your morning bakery visit.</p>
            <button
              type="button"
              onClick={() => setActiveView('reviews')}
              className="px-4 py-2 bg-[#1E1511] text-[#FDFBF7] text-xs font-semibold rounded-xl hover:bg-[#C86D51] transition-colors"
            >
              Submit First Review
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayReviews.map((review) => {
              // Create initials for avatar
              const initials = review.author
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={review.id}
                  className="bg-[#FFFFFF] rounded-2xl p-6 border border-stone-200/80 shadow-2xs hover:shadow-md hover:border-[#D4A373]/50 transition-all duration-300 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Stars & Verified Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>

                      {review.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Review Title */}
                    {review.title && (
                      <h4 className="font-display text-base font-semibold text-[#1E1511] line-clamp-1">
                        "{review.title}"
                      </h4>
                    )}

                    {/* Review Comment */}
                    <p className="text-xs text-[#5D5047] font-normal leading-relaxed line-clamp-4">
                      {review.comment}
                    </p>
                  </div>

                  {/* Customer Avatar & Attribution */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#F7F3EB] border border-stone-200 text-[#1E1511] text-xs font-bold flex items-center justify-center">
                        {initials}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#1E1511] block leading-tight">
                          {review.author}
                        </span>
                        <span className="text-[10px] text-[#7A6E65]">
                          {review.city || 'Neighbourhood Guest'}
                        </span>
                      </div>
                    </div>

                    {review.productName && (
                      <span className="text-[9px] text-[#A87438] bg-[#F7F3EB] px-2 py-0.5 rounded border border-stone-200 max-w-[90px] truncate" title={review.productName}>
                        {review.productName}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Reviews CTA */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setActiveView('reviews')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C86D51] hover:text-[#1E1511] transition-colors group cursor-pointer"
          >
            <span>View All Authentic Reviews ({totalReviewsCount})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
