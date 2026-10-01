import React from 'react';
import { BlogPost } from '../types/index.ts';
import { HERO_IMAGE } from '../data/initialData.ts';
import { safeImageSrc } from '../utils/safeImage.ts';
import { ArrowLeft, Clock, Calendar, User, Share2, Tag, ArrowRight } from 'lucide-react';

interface BlogPostDetailProps {
  post: BlogPost;
  allPosts: BlogPost[];
  onBack: () => void;
  onSelectPost: (post: BlogPost) => void;
}

export const BlogPostDetail: React.FC<BlogPostDetailProps> = ({
  post,
  allPosts,
  onBack,
  onSelectPost,
}) => {
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.status === 'published')
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back Link */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#075E2B] hover:text-[#2E8B57] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </button>
      </div>

      {/* Article Header */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <span className="font-bold text-[#075E2B] bg-[#075E2B]/10 px-2.5 py-1 rounded">
            {post.category}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {post.publicationDate}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
        </div>

        <h1 className="font-serif-display text-3xl sm:text-5xl font-bold text-[#075E2B] leading-tight text-balance">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
          {post.excerpt}
        </p>

        {/* Author Bio Row */}
        <div className="flex items-center justify-between pt-4 border-t border-b border-neutral-200 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#075E2B] text-white flex items-center justify-center font-bold text-sm">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <span className="text-xs font-bold text-[#263238] block">
                {post.author.name}
              </span>
              <span className="text-[11px] text-neutral-500 block">
                {post.author.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Article</span>
          </button>
        </div>
      </header>

      {/* Hero Featured Image */}
      <div className="rounded-3xl overflow-hidden shadow-lg border border-neutral-200 aspect-[16/9] bg-neutral-100">
        <img
          src={safeImageSrc(post.featuredImage, HERO_IMAGE)!}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body Content */}
      <div className="prose prose-lg max-w-none text-neutral-700 space-y-6 leading-relaxed text-sm sm:text-base">
        {post.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Tags */}
      <div className="pt-6 border-t border-neutral-200">
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
          Article Topics
        </span>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-medium bg-[#F7F3E8] border border-[#2E8B57]/20 text-[#075E2B] px-3 py-1 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pt-12 border-t border-neutral-200 space-y-6">
          <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
            Related Agricultural Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  onSelectPost(rel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="h-36 overflow-hidden">
                  <img
                    src={safeImageSrc(rel.featuredImage, HERO_IMAGE)!}
                    alt={rel.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold text-[#075E2B] uppercase">
                    {rel.category}
                  </span>
                  <h4 className="font-serif-display text-base font-bold text-[#263238] line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 line-clamp-2">
                    {rel.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
