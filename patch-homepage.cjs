const fs = require('fs');

let content = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

// 1. Add user prop
content = content.replace('interface HomePageProps {', 'import { supabase } from "../supabase";\n\ninterface HomePageProps {\n  user: any;');
content = content.replace('({ products, reviews, settings, onProduct })', '({ user, products, reviews, settings, onProduct })');

// 2. Add ReviewForm component logic at the top of HomePage
const reviewLogic = `
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmittingReview(true);
    
    try {
      const newReview = {
        id: crypto.randomUUID(),
        name: user?.email?.split('@')[0] || 'Anonymous',
        rating: reviewRating,
        text: reviewText,
        date: new Date().toISOString().split('T')[0],
      };
      await supabase.from('reviews').insert([newReview]);
      setReviewText("");
      setReviewRating(5);
      setShowReviewForm(false);
      alert("Review submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };
`;
content = content.replace('const [search, setSearch] = useState("");', 'const [search, setSearch] = useState("");' + reviewLogic);

// 3. Add the Review Form UI at the bottom of testimonials
const reviewFormUI = `
      <div className="mt-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Client Testimonials</h2>
          <div className="w-16 h-1 bg-[#C9A84C] mx-auto rounded-full mb-6" />
          <p className="text-[#9AA0B4] mb-8">Verified feedback from our global community</p>
          
          <button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="btn-outline px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase"
          >
            {showReviewForm ? 'Cancel' : 'Leave a Review'}
          </button>
        </div>

        <AnimatePresence>
          {showReviewForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-xl mx-auto mb-16 overflow-hidden"
            >
              <form onSubmit={handleSubmitReview} className="card p-8 border border-[#C9A84C]/20">
                <div className="mb-6">
                  <label className="block text-xs text-[#6A7090] font-bold tracking-widest uppercase mb-3">Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button 
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-3xl focus:outline-none transition-transform hover:scale-110"
                      >
                        <span className={star <= reviewRating ? "text-[#C9A84C]" : "text-white/10"}>★</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-8">
                  <label className="block text-xs text-[#6A7090] font-bold tracking-widest uppercase mb-3">Your Review</label>
                  <textarea 
                    rows={4}
                    className="admin-input py-4 px-5 text-sm w-full resize-none"
                    placeholder="Share your experience with VaultShop..."
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={submittingReview}
                  className="btn-gold w-full py-4 rounded-xl text-[12px] font-black tracking-[0.2em] uppercase"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-8">
            {reviews.map((r, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={r.id} 
                className="card p-8 relative group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-xl overflow-hidden border border-[#C9A84C]/20">
                    {r.avatar ? <img src={r.avatar} className="w-full h-full object-cover" alt="" /> : "👤"}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{r.name}</div>
                    <div className="flex text-[10px] text-[#C9A84C] mt-1">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
                  </div>
                </div>
                <p className="text-sm text-[#9AA0B4] leading-relaxed italic">"{r.text}"</p>
                <div className="text-[10px] text-[#5A607A] mt-6 font-mono tracking-widest uppercase">{r.date}</div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-[#5A607A] py-10">No reviews yet. Be the first to leave one!</div>
        )}
      </div>
`;

content = content.replace(/\{reviews\.length > 0 && \([\s\S]*?(?=      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4)/, reviewFormUI);

fs.writeFileSync('src/components/HomePage.tsx', content);
