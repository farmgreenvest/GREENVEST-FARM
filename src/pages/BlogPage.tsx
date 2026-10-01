import React, { useState } from 'react';
import { BlogPost } from '../types/index.ts';
import { HERO_IMAGE } from '../data/initialData.ts';
import { safeImageSrc } from '../utils/safeImage.ts';
import { Search, ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';

interface BlogPageProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ posts, onSelectPost }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const publishedPosts = posts.filter((p) => p.status === 'published');
  const categories = ['All', ...Array.from(new Set(publishedPosts.map((p) => p.category)))];

  const filteredPosts = publishedPosts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <div className="space-y-12 sm:space-y-16 py-8">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#075E2B]/10 text-[#075E2B] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#075E2B]" />
            <span>Greenvest Agricultural Journal</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#075E2B]">
            Agricultural Insights & Market Intelligence
          </h1>

          <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
            In-depth analysis, field agronomy reports, commodity pricing dynamics, and technology trends shaping the modern African agribusiness landscape.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mt-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search articles by topic, author, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#075E2B]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-[#F7F3E8] rounded-2xl border border-neutral-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#075E2B] text-white shadow-sm'
                    : 'text-neutral-700 hover:bg-neutral-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            onClick={() => onSelectPost(featuredPost)}
            className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12 group"
          >
            <div className="lg:col-span-7 h-72 lg:h-[420px] overflow-hidden relative bg-neutral-100">
              <img
                src={safeImageSrc(featuredPost.featuredImage, HERO_IMAGE)!}
                alt={featuredPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-[#075E2B] text-[#F4B400] text-xs font-bold px-3 py-1 rounded-md shadow">
                Featured Analysis
              </span>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="font-semibold text-[#075E2B]">{featuredPost.category}</span>
                  <span>·</span>
                  <span>{featuredPost.publicationDate}</span>
                  <span>·</span>
                  <span>{featuredPost.readTime}</span>
                </div>

                <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#263238] group-hover:text-[#075E2B] transition-colors leading-snug">
                  {featuredPost.title}
                </h2>

                <p className="text-sm text-neutral-600 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {featuredPost.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-800 block">
                    {featuredPost.author.name}
                  </span>
                  <span className="text-[11px] text-neutral-500 block">
                    {featuredPost.author.role}
                  </span>
                </div>

                <span className="text-xs font-bold text-[#075E2B] flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid of Other Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-6">
          Latest Agricultural Reports & Columns
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="h-48 overflow-hidden relative bg-neutral-100">
                <img
                  src={safeImageSrc(post.featuredImage, HERO_IMAGE)!}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#075E2B]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                    <span>{post.publicationDate}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="font-serif-display text-xl font-bold text-[#263238] group-hover:text-[#075E2B] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-700 font-medium truncate max-w-[180px]">
                    By {post.author.name}
                  </span>
                  <span className="font-bold text-[#075E2B] flex items-center gap-1 shrink-0">
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
