import React, { useState, useMemo } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Star, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2, 
  Edit3, 
  Award, 
  Search, 
  Filter, 
  Check, 
  X, 
  AlertCircle,
  ThumbsUp,
  ShieldCheck,
  Package,
  Calendar,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  Plus
} from 'lucide-react';
import { CustomerReview, ReviewStatus } from '../../types';

export const AdminReviews: React.FC = () => {
  const { 
    reviews, 
    products, 
    orders, 
    approveReview, 
    rejectReview, 
    toggleFeatureReview, 
    updateReview, 
    deleteReview, 
    refreshReviews,
    addToast 
  } = useBakery();

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');

  // Edit Modal State
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);
  const [editForm, setEditForm] = useState<Partial<CustomerReview>>({});

  // New Review Modal State (for recording direct atelier feedback)
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    author: '',
    city: 'Lyon',
    rating: 5,
    title: '',
    comment: '',
    productName: '',
    orderNumber: '',
    isVerifiedPurchase: true,
    isApproved: true,
    isFeatured: false,
    adminNotes: ''
  });

  // Calculate Real Dynamic Metrics strictly from the actual database
  const metrics = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter(r => r.status === 'pending' || (!r.isApproved && r.status !== 'rejected')).length;
    const approvedList = reviews.filter(r => r.isApproved === true || r.status === 'approved');
    const approved = approvedList.length;
    const rejected = reviews.filter(r => r.status === 'rejected').length;
    const featured = reviews.filter(r => r.isFeatured).length;
    const verified = reviews.filter(r => r.isVerifiedPurchase).length;

    const sumApprovedRatings = approvedList.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
    const avgRating = approved > 0 ? (sumApprovedRatings / approved).toFixed(2) : '0.00';

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    approvedList.forEach(r => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      distribution[rounded] = (distribution[rounded] || 0) + 1;
    });

    return {
      total,
      pending,
      approved,
      rejected,
      featured,
      verified,
      avgRating,
      distribution
    };
  }, [reviews]);

  // Filtered & Sorted reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter(rev => {
        // Status filter
        if (statusFilter === 'pending') {
          if (rev.status !== 'pending' && (rev.isApproved || rev.status === 'rejected')) return false;
        } else if (statusFilter === 'approved') {
          if (!rev.isApproved && rev.status !== 'approved') return false;
        } else if (statusFilter === 'rejected') {
          if (rev.status !== 'rejected') return false;
        }

        // Rating filter
        if (ratingFilter !== 'all' && Math.round(rev.rating) !== ratingFilter) {
          return false;
        }

        // Verified filter
        if (verifiedFilter === 'verified' && !rev.isVerifiedPurchase) return false;
        if (verifiedFilter === 'unverified' && rev.isVerifiedPurchase) return false;

        // Featured filter
        if (featuredFilter === 'featured' && !rev.isFeatured) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchAuthor = rev.author.toLowerCase().includes(q);
          const matchTitle = (rev.title || '').toLowerCase().includes(q);
          const matchComment = rev.comment.toLowerCase().includes(q);
          const matchCity = (rev.city || '').toLowerCase().includes(q);
          const matchProduct = (rev.productName || '').toLowerCase().includes(q);
          const matchOrder = (rev.orderNumber || rev.orderId || '').toLowerCase().includes(q);
          if (!matchAuthor && !matchTitle && !matchComment && !matchCity && !matchProduct && !matchOrder) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'highest') return b.rating - a.rating;
        if (sortBy === 'lowest') return a.rating - b.rating;
        if (sortBy === 'helpful') return (b.helpfulVotes || 0) - (a.helpfulVotes || 0);
        return 0;
      });
  }, [reviews, statusFilter, ratingFilter, verifiedFilter, featuredFilter, searchQuery, sortBy]);

  // Batch actions
  const handleApproveAllPending = async () => {
    const pendingList = reviews.filter(r => r.status === 'pending' || (!r.isApproved && r.status !== 'rejected'));
    if (pendingList.length === 0) {
      addToast('No pending reviews to approve', 'info');
      return;
    }
    for (const rev of pendingList) {
      await approveReview(rev.id);
    }
    addToast(`Approved ${pendingList.length} pending reviews`, 'success');
  };

  const handleOpenEdit = (rev: CustomerReview) => {
    setEditingReview(rev);
    setEditForm({
      author: rev.author,
      city: rev.city,
      rating: rev.rating,
      title: rev.title,
      comment: rev.comment,
      productName: rev.productName,
      isVerifiedPurchase: rev.isVerifiedPurchase,
      isFeatured: rev.isFeatured,
      isApproved: rev.isApproved,
      status: rev.status || (rev.isApproved ? 'approved' : 'pending'),
      adminNotes: rev.adminNotes || ''
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    await updateReview(editingReview.id, editForm);
    setEditingReview(null);
  };

  const handleCreateDirectReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.author || !newReviewForm.comment) {
      addToast('Author and review text are required', 'error');
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newReviewForm,
        })
      });
      if (res.ok) {
        const data = await res.json();
        // If created as pre-approved by admin
        if (newReviewForm.isApproved && data.review?.id) {
          await approveReview(data.review.id);
        }
        addToast('Review added to bakery ledger', 'success');
        setIsCreateOpen(false);
        setNewReviewForm({
          author: '',
          city: 'Lyon',
          rating: 5,
          title: '',
          comment: '',
          productName: '',
          orderNumber: '',
          isVerifiedPurchase: true,
          isApproved: true,
          isFeatured: false,
          adminNotes: ''
        });
        refreshReviews();
      }
    } catch {
      addToast('Error saving review', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8DFD5] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#C49258]/15 text-[#A87438]">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h2 className="font-display text-2xl font-bold text-[#1F1A16]">
              Customer Reviews Moderation
            </h2>
          </div>
          <p className="text-xs text-[#7A6E65] mt-1">
            Real guest notes, stone hearth ratings, and verified order authentication.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refreshReviews()}
            className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE8DD] text-[#1F1A16] border border-[#DCD1C4] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          {metrics.pending > 0 && (
            <button
              type="button"
              onClick={handleApproveAllPending}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Approve All ({metrics.pending})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C49258]" />
            <span>Record Guest Note</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total */}
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E8DFD5] shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A6E65] mb-1">
            Total Reviews
          </div>
          <div className="font-display text-2xl font-bold text-[#1F1A16]">
            {metrics.total}
          </div>
          <div className="text-[10px] text-[#A89F95] mt-0.5">Recorded in database</div>
        </div>

        {/* Pending Moderation (High Attention) */}
        <div className={`p-4 rounded-2xl border shadow-xs transition-colors ${
          metrics.pending > 0 
            ? 'bg-amber-50/70 border-amber-300' 
            : 'bg-[#FFFFFF] border-[#E8DFD5]'
        }`}>
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center justify-between mb-1">
            <span>Pending Review</span>
            {metrics.pending > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
          </div>
          <div className="font-display text-2xl font-bold text-amber-900">
            {metrics.pending}
          </div>
          <div className="text-[10px] text-amber-700 mt-0.5">Requires approval</div>
        </div>

        {/* Approved & Live */}
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E8DFD5] shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
            Live on Store
          </div>
          <div className="font-display text-2xl font-bold text-emerald-800">
            {metrics.approved}
          </div>
          <div className="text-[10px] text-[#7A6E65] mt-0.5">Published publicly</div>
        </div>

        {/* Real Average Rating */}
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E8DFD5] shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A6E65] mb-1">
            Average Rating
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-display text-2xl font-bold text-[#1F1A16]">{metrics.avgRating}</span>
            <div className="flex text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="text-[10px] text-[#7A6E65] mt-0.5">From approved reviews</div>
        </div>

        {/* Verified Purchases */}
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E8DFD5] shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700 mb-1">
            Verified Orders
          </div>
          <div className="font-display text-2xl font-bold text-blue-900">
            {metrics.verified}
          </div>
          <div className="text-[10px] text-[#7A6E65] mt-0.5">Linked to order history</div>
        </div>

        {/* Featured Reviews */}
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E8DFD5] shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#A87438] mb-1">
            Featured
          </div>
          <div className="font-display text-2xl font-bold text-[#A87438]">
            {metrics.featured}
          </div>
          <div className="text-[10px] text-[#7A6E65] mt-0.5">Pinned to storefront</div>
        </div>
      </div>

      {/* Rating Breakdown Strip */}
      <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8DFD5] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F1A16] block">
            Approved Star Distribution
          </span>
          <span className="text-[11px] text-[#7A6E65]">
            Strictly derived from live genuine customer ratings
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = metrics.distribution[stars] || 0;
            const pct = metrics.approved > 0 ? Math.round((count / metrics.approved) * 100) : 0;
            return (
              <div 
                key={stars} 
                onClick={() => setRatingFilter(ratingFilter === stars ? 'all' : stars)}
                className={`flex items-center gap-2 cursor-pointer px-2.5 py-1.5 rounded-xl border transition-all ${
                  ratingFilter === stars 
                    ? 'bg-[#1F1A16] text-[#FAF7F2] border-[#1F1A16]' 
                    : 'bg-[#FFFFFF] border-[#E8DFD5] hover:border-[#C49258]'
                }`}
              >
                <div className="flex items-center gap-1 text-xs font-bold">
                  <span>{stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="w-12 sm:w-16 bg-[#E8DFD5] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-semibold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E8DFD5] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-[#7A6E65] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search author, text, city, order ID..."
              className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1F1A16] placeholder-[#A89F95] focus:outline-none focus:border-[#C49258]"
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

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-3 py-2 text-xs text-[#1F1A16] font-medium focus:outline-none focus:border-[#C49258]"
            >
              <option value="all">All Moderation Statuses</option>
              <option value="pending">Pending Moderation ({metrics.pending})</option>
              <option value="approved">Approved &amp; Live ({metrics.approved})</option>
              <option value="rejected">Rejected / Archived ({metrics.rejected})</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div>
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value as any)}
              className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-3 py-2 text-xs text-[#1F1A16] font-medium focus:outline-none focus:border-[#C49258]"
            >
              <option value="all">All Verification Statuses</option>
              <option value="verified">Verified Purchase Only ({metrics.verified})</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-3 py-2 text-xs text-[#1F1A16] font-medium focus:outline-none focus:border-[#C49258]"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest">Sort: Highest Rating</option>
              <option value="lowest">Sort: Lowest Rating</option>
              <option value="helpful">Sort: Most Helpful Votes</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges */}
        {(statusFilter !== 'all' || ratingFilter !== 'all' || verifiedFilter !== 'all' || featuredFilter !== 'all' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F4EFEA] text-xs">
            <span className="text-[11px] font-bold text-[#7A6E65] uppercase">Active filters:</span>
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#DCD1C4] text-[#1F1A16]">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {ratingFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#DCD1C4] text-[#1F1A16]">
                Rating: {ratingFilter}★
                <button onClick={() => setRatingFilter('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {verifiedFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#DCD1C4] text-[#1F1A16]">
                Verified: {verifiedFilter}
                <button onClick={() => setVerifiedFilter('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={() => {
                setStatusFilter('all');
                setRatingFilter('all');
                setVerifiedFilter('all');
                setFeaturedFilter('all');
                setSearchQuery('');
              }}
              className="text-[11px] text-[#A87438] underline font-semibold ml-2 hover:text-[#1F1A16]"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#7A6E65] px-1">
          <span>Showing <strong>{filteredReviews.length}</strong> reviews</span>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] p-12 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-[#C49258] mx-auto opacity-70" />
            <h3 className="font-display text-lg font-bold text-[#1F1A16]">
              No reviews match the selected filter
            </h3>
            <p className="text-xs text-[#7A6E65] max-w-sm mx-auto">
              Try adjusting your search query or reset the moderation filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredReviews.map((rev) => {
              const isPending = rev.status === 'pending' || (!rev.isApproved && rev.status !== 'rejected');
              const isRejected = rev.status === 'rejected';
              const isApproved = rev.isApproved === true || rev.status === 'approved';

              return (
                <div
                  key={rev.id}
                  className={`bg-[#FFFFFF] rounded-2xl border p-5 sm:p-6 transition-all shadow-xs space-y-4 ${
                    isPending 
                      ? 'border-amber-400/80 bg-amber-50/20 ring-1 ring-amber-300/50' 
                      : isRejected
                      ? 'border-red-200 opacity-75'
                      : rev.isFeatured
                      ? 'border-[#C49258] bg-[#FAF7F2]/40'
                      : 'border-[#E8DFD5]'
                  }`}
                >
                  {/* Top Bar: Status Badges & Quick Action Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F4EFEA] pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Status Badge */}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pending Moderation
                        </span>
                      )}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] font-bold uppercase tracking-wider">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Live &amp; Approved
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 border border-red-300 text-red-900 text-[11px] font-bold uppercase tracking-wider">
                          <XCircle className="w-3 h-3 text-red-600" />
                          Rejected / Hidden
                        </span>
                      )}

                      {/* Verified Badge */}
                      {rev.isVerifiedPurchase ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          Verified Purchase {rev.orderNumber ? `(#${rev.orderNumber})` : ''}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px]">
                          Unverified Submission
                        </span>
                      )}

                      {/* Featured Badge */}
                      {rev.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C49258]/20 border border-[#C49258]/40 text-[#8F5F28] text-[11px] font-bold">
                          <Sparkles className="w-3 h-3 text-[#C49258]" />
                          Featured on Store
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Approve Button */}
                      {!isApproved && (
                        <button
                          type="button"
                          onClick={() => approveReview(rev.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                          title="Approve and publish publicly"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}

                      {/* Reject Button */}
                      {!isRejected && (
                        <button
                          type="button"
                          onClick={() => rejectReview(rev.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                          title="Reject and hide from storefront"
                        >
                          <X className="w-3.5 h-3.5 text-stone-500" />
                          <span>Reject</span>
                        </button>
                      )}

                      {/* Feature / Unfeature Button */}
                      <button
                        type="button"
                        onClick={() => toggleFeatureReview(rev.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          rev.isFeatured 
                            ? 'bg-[#C49258] text-[#FAF7F2] border-[#C49258]' 
                            : 'bg-[#FAF7F2] text-[#7A6E65] border-[#DCD1C4] hover:border-[#C49258] hover:text-[#1F1A16]'
                        }`}
                        title="Toggle featured status on storefront"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>{rev.isFeatured ? 'Featured' : 'Feature'}</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(rev)}
                        className="p-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE8DD] text-[#7A6E65] hover:text-[#1F1A16] border border-[#DCD1C4] transition-colors cursor-pointer"
                        title="Edit review details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Permanently delete review by "${rev.author}"?`)) {
                            deleteReview(rev.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-[#1F1A16]">{rev.rating}.0 / 5.0</span>
                      </div>
                      <div className="text-[11px] text-[#7A6E65] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#A89F95]" />
                        <span>{rev.date}</span>
                      </div>
                    </div>

                    {rev.title && (
                      <h4 className="font-display text-base font-bold text-[#1F1A16]">
                        "{rev.title}"
                      </h4>
                    )}

                    <p className="text-xs sm:text-sm text-[#4A3F35] font-light leading-relaxed whitespace-pre-line bg-[#FAF7F2]/50 p-3 rounded-xl border border-[#F4EFEA]">
                      {rev.comment}
                    </p>
                  </div>

                  {/* Review Metadata & Linked Order */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-[#7A6E65]">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="font-bold text-[#1F1A16]">{rev.author}</span>
                        {rev.city && <span className="text-[#7A6E65]"> • {rev.city}</span>}
                      </div>

                      {rev.productName && (
                        <span className="text-[11px] text-[#A87438] bg-[#FAF7F2] px-2.5 py-0.5 rounded-md border border-[#E8DFD5] font-medium flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {rev.productName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-[11px]">
                      {rev.helpfulVotes !== undefined && rev.helpfulVotes > 0 && (
                        <span className="flex items-center gap-1 text-[#7A6E65]">
                          <ThumbsUp className="w-3.5 h-3.5 text-[#A89F95]" />
                          <span>{rev.helpfulVotes} found helpful</span>
                        </span>
                      )}
                      {rev.adminNotes && (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Note: {rev.adminNotes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================= */}
      {/* EDIT MODAL */}
      {/* ======================================================= */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-[#1F1A16]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingReview(null)}
              className="absolute top-5 right-5 text-[#7A6E65] hover:text-[#1F1A16]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C49258]">
                Review Moderation
              </span>
              <h3 className="font-display text-2xl font-bold text-[#1F1A16]">
                Edit Customer Review
              </h3>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.author || ''}
                    onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
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
                    value={editForm.city || ''}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                    Star Rating (1–5)
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, rating: num })}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${
                          (editForm.rating || 5) >= num
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
                  <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                    Product Enjoyed
                  </label>
                  <input
                    type="text"
                    value={editForm.productName || ''}
                    onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
                    placeholder="e.g. Sourdough Loaf"
                    className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                  Review Headline / Title
                </label>
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                  Review Text *
                </label>
                <textarea
                  value={editForm.comment || ''}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  rows={4}
                  required
                  className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                />
              </div>

              {/* Status & Verification Toggles */}
              <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E8DFD5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1F1A16]">Moderation Status</span>
                  <select
                    value={editForm.status || (editForm.isApproved ? 'approved' : 'pending')}
                    onChange={(e) => {
                      const st = e.target.value as ReviewStatus;
                      setEditForm({
                        ...editForm,
                        status: st,
                        isApproved: st === 'approved'
                      });
                    }}
                    className="bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-3 py-1.5 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  >
                    <option value="approved">Approved &amp; Published</option>
                    <option value="pending">Pending Moderation</option>
                    <option value="rejected">Rejected / Hidden</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F4EFEA]">
                  <span className="text-xs font-semibold text-[#1F1A16]">Verified Purchase</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editForm.isVerifiedPurchase)}
                      onChange={(e) => setEditForm({ ...editForm, isVerifiedPurchase: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#DCD1C4] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C49258]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F4EFEA]">
                  <span className="text-xs font-semibold text-[#1F1A16]">Featured on Storefront</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editForm.isFeatured)}
                      onChange={(e) => setEditForm({ ...editForm, isFeatured: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#DCD1C4] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C49258]"></div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                  Internal Atelier Notes (Admin only)
                </label>
                <input
                  type="text"
                  value={editForm.adminNotes || ''}
                  onChange={(e) => setEditForm({ ...editForm, adminNotes: e.target.value })}
                  placeholder="e.g. Verified against counter receipt #8902"
                  className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-5 py-2.5 rounded-xl border border-[#DCD1C4] text-[#7A6E65] hover:text-[#1F1A16] font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* RECORD DIRECT GUEST NOTE MODAL */}
      {/* ======================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-[#1F1A16]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-5 right-5 text-[#7A6E65] hover:text-[#1F1A16]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C49258]">
                Counter &amp; Atelier Feedback
              </span>
              <h3 className="font-display text-2xl font-bold text-[#1F1A16]">
                Record Customer Review
              </h3>
              <p className="text-xs text-[#7A6E65]">
                Log a direct in-store note, guestbook entry, or authenticated order review.
              </p>
            </div>

            <form onSubmit={handleCreateDirectReview} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={newReviewForm.author}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, author: e.target.value })}
                    placeholder="e.g. Marie Laurent"
                    required
                    className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                    City / Branch
                  </label>
                  <input
                    type="text"
                    value={newReviewForm.city}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, city: e.target.value })}
                    placeholder="e.g. Lyon"
                    className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                    Rating (1–5) *
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewReviewForm({ ...newReviewForm, rating: num })}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${
                          newReviewForm.rating >= num
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
                  <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                    Product / Bake
                  </label>
                  <select
                    value={newReviewForm.productName}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, productName: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  >
                    <option value="">General Bakery Experience</option>
                    {products.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    value={newReviewForm.title}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, title: e.target.value })}
                    placeholder="e.g. Best baguette in town"
                    className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                    Order Reference (Optional)
                  </label>
                  <input
                    type="text"
                    value={newReviewForm.orderNumber}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, orderNumber: e.target.value })}
                    placeholder="e.g. MSH-2026-9041"
                    className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs font-mono text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                  Customer Review Comment *
                </label>
                <textarea
                  value={newReviewForm.comment}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                  rows={3}
                  placeholder="Details on flavor, crust, crumb, or service..."
                  required
                  className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#DCD1C4] text-[#7A6E65] hover:text-[#1F1A16] font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Submit &amp; Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
