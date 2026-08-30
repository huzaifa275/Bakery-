import React, { useState, useMemo } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Star, 
  MessageSquare, 
  Plus, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  ThumbsUp, 
  Search, 
  Filter, 
  Sparkles, 
  Award,
  Package,
  Calendar,
  AlertCircle,
  Check
} from 'lucide-react';
import { CustomerReview } from '../../types';

export const ReviewsView: React.FC = () => {
  const { 
    reviews, 
    products, 
    submitReview, 
    voteHelpfulReview, 
    lastCompletedOrder,
    addToast 
  } = useBakery();

  // Filters & Sorting
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'helpful'>('newest');

  // Modal & Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('Lyon');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [orderNumber, setOrderNumber] = useState(lastCompletedOrder?.orderNumber || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // Voted tracking locally to avoid spamming
  const [votedReviews, setVotedReviews] = useState<Record<string, boolean>>({});

  // Public reviews: strictly only those that are approved (or default approved)
  const publicReviews = useMemo(() => {
    return reviews.filter(r => r.isApproved === true || r.status === 'approved');
  }, [reviews]);

  // Dynamic genuine stats computed strictly from approved customer reviews
  const stats = useMemo(() => {
    const total = publicReviews.length;
    if (total === 0) {
      return {
        total: 0,
        average: '0.0',
        verifiedCount: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const sum = publicReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    const average = (sum / total).toFixed(1);
    const verifiedCount = publicReviews.filter(r => r.isVerifiedPurchase).length;

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    publicReviews.forEach(r => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      distribution[rounded] = (distribution[rounded] || 0) + 1;
    });

    return { total, average, verifiedCount, distribution };
  }, [publicReviews]);

  // Filtered & Sorted Display Reviews
  const displayedReviews = useMemo(() => {
    return publicReviews
      .filter(rev => {
        if (selectedRating !== 'all' && Math.round(rev.rating) !== selectedRating) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchAuthor = rev.author.toLowerCase().includes(q);
          const matchTitle = (rev.title || '').toLowerCase().includes(q);
          const matchComment = rev.comment.toLowerCase().includes(q);
          const matchCity = (rev.city || '').toLowerCase().includes(q);
          const matchProduct = (rev.productName || '').toLowerCase().includes(q);
          if (!matchAuthor && !matchTitle && !matchComment && !matchCity && !matchProduct) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Featured always elevated
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;

        if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'highest') return b.rating - a.rating;
        if (sortBy === 'lowest') return a.rating - b.rating;
        if (sortBy === 'helpful') return (b.helpfulVotes || 0) - (a.helpfulVotes || 0);
        return 0;
      });
  }, [publicReviews, selectedRating, searchQuery, sortBy]);

  const handleOpenFormWithOrder = () => {
    if (lastCompletedOrder?.orderNumber && !orderNumber) {
      setOrderNumber(lastCompletedOrder.orderNumber);
      if (lastCompletedOrder.customerName && !author) {
        setAuthor(lastCompletedOrder.customerName);
      }
    }
    setSubmissionSuccess(null);
    setIsFormOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) {
      addToast('Please provide your name and review comment', 'error');
      return;
    }

    setIsSubmitting(true);
    const prod = products.find(p => p.id === selectedProductId);

    const result = await submitReview({
      author: author.trim(),
      city: city.trim() || 'Lyon',
      rating,
      title: title.trim(),
      comment: comment.trim(),
      productId: selectedProductId || undefined,
      productName: prod ? prod.name : undefined,
      orderNumber: orderNumber.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmissionSuccess(result.message || 'Your review has been submitted for moderation.');
      setTitle('');
      setComment('');
      setAuthor('');
      setOrderNumber('');
    }
  };

  const handleVoteHelpful = (id: string) => {
    if (votedReviews[id]) {
      addToast('You have already marked this review as helpful', 'info');
      return;
    }
    setVotedReviews(prev => ({ ...prev, [id]: true }));
    voteHelpfulReview(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C49258]/15 border border-[#C49258]/30 text-[#A87438] text-xs uppercase tracking-widest font-semibold">
          <MessageSquare className="w-3.5 h-3.5 text-[#C49258]" />
          Authentic Guest Reviews
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A16]">
          What Our Guests Say
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6E65] font-light max-w-lg mx-auto leading-relaxed">
          Honest feedback from morning regulars, weekend visitors, and celebratory feast hosts. Every note reflects real oven batches.
        </p>
      </div>

      {/* Ratings Overview Bar - Truly Derived from Database */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E8DFD5] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs">
        
        {/* Left Score Summary */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full lg:w-auto text-center sm:text-left">
          <div className="flex flex-col items-center">
            <span className="font-display text-5xl sm:text-6xl font-bold text-[#1F1A16] leading-none">
              {stats.average}
            </span>
            <div className="flex text-amber-400 my-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(Number(stats.average)) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-[#7A6E65] font-medium">
              Based on {stats.total} verified review{stats.total !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Star Distribution Breakdown */}
          <div className="border-t sm:border-t-0 sm:border-l border-[#E8DFD5] pt-4 sm:pt-0 sm:pl-8 space-y-1.5 w-full sm:w-64">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stats.distribution[stars] || 0;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <button
                  key={stars}
                  onClick={() => setSelectedRating(selectedRating === stars ? 'all' : stars)}
                  className={`w-full flex items-center gap-2 text-xs transition-colors group cursor-pointer ${
                    selectedRating === stars ? 'text-[#1F1A16] font-bold' : 'text-[#7A6E65] hover:text-[#1F1A16]'
                  }`}
                >
                  <span className="w-6 text-right font-medium">{stars} ★</span>
                  <div className="flex-1 bg-[#E8DFD5] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        selectedRating === stars ? 'bg-[#C49258]' : 'bg-amber-400 group-hover:bg-[#C49258]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-[10px] text-[#A89F95]">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
          <button
            onClick={handleOpenFormWithOrder}
            className="w-full sm:w-auto bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C49258]" />
            <span>Leave a Customer Review</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E8DFD5] flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#7A6E65] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews by baker, pastry, city..."
            className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl pl-9 pr-8 py-2 text-xs text-[#1F1A16] placeholder-[#A89F95] focus:outline-none focus:border-[#C49258]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6E65] hover:text-[#1F1A16]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Star Filter Pills */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedRating('all')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                selectedRating === 'all'
                  ? 'bg-[#1F1A16] text-[#FAF7F2] border-[#1F1A16]'
                  : 'bg-[#FAF7F2] text-[#7A6E65] border-[#DCD1C4] hover:border-[#C49258]'
              }`}
            >
              All Stars
            </button>
            {[5, 4, 3].map(num => (
              <button
                key={num}
                onClick={() => setSelectedRating(selectedRating === num ? 'all' : num)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1 cursor-pointer ${
                  selectedRating === num
                    ? 'bg-[#1F1A16] text-[#FAF7F2] border-[#1F1A16]'
                    : 'bg-[#FAF7F2] text-[#7A6E65] border-[#DCD1C4] hover:border-[#C49258]'
                }`}
              >
                <span>{num}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-3 py-1.5 text-xs text-[#1F1A16] font-medium focus:outline-none focus:border-[#C49258]"
          >
            <option value="newest">Sort: Newest</option>
            <option value="highest">Sort: Highest Rating</option>
            <option value="lowest">Sort: Lowest Rating</option>
            <option value="helpful">Sort: Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews Grid */}
      {displayedReviews.length === 0 ? (
        <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] p-12 text-center space-y-4">
          <MessageSquare className="w-12 h-12 text-[#C49258] mx-auto opacity-60" />
          <h3 className="font-display text-xl font-bold text-[#1F1A16]">
            No reviews found
          </h3>
          <p className="text-xs text-[#7A6E65] max-w-md mx-auto">
            {searchQuery || selectedRating !== 'all' 
              ? 'Try resetting the search or filter options.'
              : 'Be the first to share your experience from Maison Éloise.'}
          </p>
          <button
            onClick={handleOpenFormWithOrder}
            className="inline-flex items-center gap-2 bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C49258]" />
            <span>Write a Review</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedReviews.map((rev) => (
            <div
              key={rev.id}
              className={`bg-[#FFFFFF] p-6 rounded-2xl border transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 relative ${
                rev.isFeatured ? 'border-[#C49258] ring-1 ring-[#C49258]/30 bg-gradient-to-b from-[#FAF7F2]/40 to-[#FFFFFF]' : 'border-[#E8DFD5]'
              }`}
            >
              {/* Featured Ribbon if applicable */}
              {rev.isFeatured && (
                <div className="absolute -top-3 right-4 bg-[#C49258] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Featured Note
                </div>
              )}

              <div className="space-y-3">
                {/* Stars and Date */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-medium text-[#7A6E65] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#A89F95]" />
                    {rev.date}
                  </span>
                </div>

                {/* Title */}
                {rev.title && (
                  <h4 className="font-display text-base font-bold text-[#1F1A16] leading-snug">
                    "{rev.title}"
                  </h4>
                )}

                {/* Comment Body */}
                <p className="text-xs text-[#4A3F35] font-light leading-relaxed whitespace-pre-line">
                  {rev.comment}
                </p>
              </div>

              {/* Footer: Author, Product, Verified badge & Helpful button */}
              <div className="pt-4 border-t border-[#F4EFEA] space-y-3">
                <div className="flex justify-between items-end text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#1F1A16]">{rev.author}</span>
                      {rev.isVerifiedPurchase && (
                        <span className="inline-flex items-center text-blue-700" title="Verified Customer Purchase">
                          <ShieldCheck className="w-3.5 h-3.5 fill-blue-100" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#7A6E65]">
                      {rev.city || 'Lyon'}
                      {rev.isVerifiedPurchase && (
                        <span className="text-blue-700 font-medium"> • Verified Order</span>
                      )}
                    </div>
                  </div>

                  {rev.productName && (
                    <span className="text-[10px] text-[#A87438] font-medium bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DFD5] max-w-[130px] truncate">
                      {rev.productName}
                    </span>
                  )}
                </div>

                {/* Helpful Button */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-[#7A6E65]">
                  <button
                    type="button"
                    onClick={() => handleVoteHelpful(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      votedReviews[rev.id]
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium'
                        : 'bg-[#FAF7F2] text-[#7A6E65] border-[#E8DFD5] hover:text-[#1F1A16] hover:border-[#C49258]'
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${votedReviews[rev.id] ? 'fill-emerald-600' : ''}`} />
                    <span>{votedReviews[rev.id] ? 'Helpful' : 'Helpful'}</span>
                    {(rev.helpfulVotes || 0) > 0 && (
                      <span className="font-mono text-[10px] bg-white px-1.5 py-0.2 rounded border border-[#E8DFD5]">
                        {(rev.helpfulVotes || 0) + (votedReviews[rev.id] ? 1 : 0)}
                      </span>
                    )}
                  </button>

                  {rev.orderNumber && (
                    <span className="text-[10px] font-mono text-[#A89F95]">
                      Ref: #{rev.orderNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================= */}
      {/* SUBMIT REVIEW MODAL */}
      {/* ======================================================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-[#1F1A16]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-5 right-5 text-[#7A6E65] hover:text-[#1F1A16]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#C49258]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Share Your Experience</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1F1A16]">
                Write a Guest Review
              </h3>
              <p className="text-xs text-[#7A6E65]">
                Your honest feedback helps our bakers maintain artisanal quality.
              </p>
            </div>

            {submissionSuccess ? (
              <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-emerald-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-lg font-bold text-[#1F1A16]">
                    Review Submitted Successfully
                  </h4>
                  <p className="text-xs text-[#7A6E65] leading-relaxed">
                    {submissionSuccess}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    Our bakery moderators review submissions before they appear live on the storefront. Thank you for supporting our craft!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="w-full bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Camille Dupont"
                      required
                      className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Lyon"
                      className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                    />
                  </div>
                </div>

                {/* Rating Selection */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                    Overall Star Rating (1–5) *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          rating >= num
                            ? 'bg-amber-400 border-amber-500 text-[#1F1A16] shadow-xs'
                            : 'bg-[#FFFFFF] border-[#DCD1C4] text-[#7A6E65] hover:border-[#C49258]'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${rating >= num ? 'fill-[#1F1A16]' : ''}`} />
                        <span>{num}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Product selection */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                      Item Enjoyed (Optional)
                    </label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                    >
                      <option value="">General Bakery Experience</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Order Reference */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1 flex items-center justify-between">
                      <span>Order # (Optional)</span>
                      <span className="text-[9px] text-[#A87438]">Verified Badge</span>
                    </label>
                    <input
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="e.g. MSH-8942"
                      className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs font-mono text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                    Headline / Summary
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sublime crust and heavenly crumb"
                    className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                    Your Review *
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the aroma, texture, freshness, or pick-up service..."
                    rows={4}
                    required
                    className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  />
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD5] text-[11px] text-[#7A6E65]">
                  <p className="flex items-center gap-1.5 text-[#1F1A16] font-semibold mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Bakery Transparency Guarantee
                  </p>
                  Reviews are authenticated against real orders and moderated to prevent spam and ensure genuine customer experiences.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Submitting to Moderation...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
