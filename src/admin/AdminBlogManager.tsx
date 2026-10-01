import React, { useState } from 'react';
import { BlogPost, MediaAsset } from '../types/index.ts';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  BookOpen,
  Image as ImageIcon,
  CheckCircle,
} from 'lucide-react';
import { HERO_IMAGE, AGRONOMISTS_IMAGE, CROP_HARVEST_IMAGE, AGRO_PROCESSING_IMAGE } from '../data/initialData.ts';
import { ImageUploadField } from '../components/ImageUploadField.tsx';
import { safeImageSrc } from '../utils/safeImage.ts';

interface AdminBlogManagerProps {
  posts: BlogPost[];
  onPostsUpdated: (posts: BlogPost[]) => void;
}

export const AdminBlogManager: React.FC<AdminBlogManagerProps> = ({
  posts,
  onPostsUpdated,
}) => {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [mediaList] = useState<MediaAsset[]>(GreenvestDB.getMediaAssets());

  // Editor form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [featuredImage, setFeaturedImage] = useState(HERO_IMAGE);
  const [category, setCategory] = useState('Sustainability');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('Dr. Adebayo Adeleke');
  const [authorRole, setAuthorRole] = useState('Chief Agronomy Officer');
  const [tagsString, setTagsString] = useState('Food Security, Sustainable Farming');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const categories = ['All', 'Sustainability', 'Value Chain', 'Innovation', 'Community', 'Industrialization', 'Agritech'];

  const handleOpenCreate = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setFeaturedImage(HERO_IMAGE);
    setCategory('Sustainability');
    setExcerpt('');
    setContent('');
    setAuthorName('Dr. Adebayo Adeleke');
    setAuthorRole('Chief Agronomy Officer, Greenvest Farms');
    setTagsString('Food Security, African Agriculture, Sustainability');
    setStatus('published');
    setSeoTitle('');
    setSeoDescription('');
    setEditorOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setFeaturedImage(post.featuredImage);
    setCategory(post.category);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setAuthorName(post.author.name);
    setAuthorRole(post.author.role);
    setTagsString(post.tags.join(', '));
    setStatus(post.status);
    setSeoTitle(post.seoTitle || '');
    setSeoDescription(post.seoDescription || '');
    setEditorOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-')
      );
    }
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const postToSave: BlogPost = {
      id: editingPost ? editingPost.id : 'post-' + Date.now(),
      title,
      slug: slug || 'post-' + Date.now(),
      featuredImage,
      category,
      excerpt,
      content,
      tags,
      author: {
        name: authorName,
        role: authorRole,
      },
      publicationDate: editingPost ? editingPost.publicationDate : 'September 2026',
      readTime: `${Math.max(3, Math.ceil(content.split(' ').length / 200))} min read`,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      status,
      views: editingPost?.views || Math.floor(250 + Math.random() * 500),
    };

    GreenvestDB.savePost(postToSave);
    onPostsUpdated(GreenvestDB.getPosts());
    setEditorOpen(false);
  };

  const handleDelete = (id: string, postTitle: string) => {
    if (confirm(`Are you sure you want to permanently delete the post: "${postTitle}"?`)) {
      GreenvestDB.deletePost(id);
      onPostsUpdated(GreenvestDB.getPosts());
    }
  };

  const filtered = posts.filter((p) => {
    const matchesCat = filterCategory === 'All' || p.category === filterCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#075E2B]">
            Editorial & Journalism Engine
          </span>
          <h2 className="font-serif-display text-3xl font-bold text-[#263238]">
            Manage Blog Posts & Agribusiness Intelligence
          </h2>
          <p className="text-xs text-neutral-500">
            Create, edit, change images, publish, or delete any article across the Greenvest journal.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#F4B400]" />
          <span>Add New Blog Post</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search articles by title, author, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#075E2B]"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-100 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterCategory === cat ? 'bg-white text-[#075E2B] shadow-sm' : 'text-neutral-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts List / Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <BookOpen className="w-8 h-8 text-neutral-400 mx-auto" />
            <p className="text-sm font-semibold text-neutral-700">No blog posts found.</p>
            <button
              onClick={handleOpenCreate}
              className="text-xs text-[#075E2B] font-bold underline cursor-pointer"
            >
              Click here to write and publish a new post
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F3E8] border-b border-neutral-200 text-neutral-600 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="p-4">Post Title & Image</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-neutral-50">
                    <td className="p-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={safeImageSrc(post.featuredImage, HERO_IMAGE)!}
                          alt={post.title}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover bg-neutral-200 shrink-0 border border-neutral-200"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-[#263238] block text-sm leading-tight line-clamp-1">
                            {post.title}
                          </span>
                          <span className="text-[11px] text-neutral-400 font-mono truncate block mt-0.5">
                            /{post.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-[#075E2B]">{post.category}</td>
                    <td className="p-4 text-neutral-700">{post.author.name}</td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          post.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : post.status === 'draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>

                    <td className="p-4 tabular-nums font-semibold text-neutral-700">
                      {post.views?.toLocaleString() || 500}
                    </td>

                    <td className="p-4 text-neutral-500 whitespace-nowrap">
                      {post.publicationDate}
                    </td>

                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="px-2.5 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold inline-flex items-center gap-1 cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                {editingPost ? 'Edit Blog Post' : 'Compose New Blog Post'}
              </h3>
              <button onClick={() => setEditorOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter an engaging headline"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl font-mono focus:ring-2 focus:ring-[#075E2B]"
                  />
                </div>
              </div>

              {/* Image Picker */}
              <ImageUploadField
                label="Article Featured Image"
                value={featuredImage}
                onChange={setFeaturedImage}
                helperText="Upload an article photograph directly from your computer, choose from media library, or enter a URL."
                category="Blog & Research"
                recommendedAspect="16:9 Landscape"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white focus:ring-2 focus:ring-[#075E2B]"
                  >
                    <option>Sustainability</option>
                    <option>Value Chain</option>
                    <option>Innovation</option>
                    <option>Community</option>
                    <option>Industrialization</option>
                    <option>Agritech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Publication Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white focus:ring-2 focus:ring-[#075E2B]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Article Summary / Excerpt *
                </label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short paragraph displayed on the card and search previews..."
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Full Article Body (Markdown / Text Paragraphs) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the full in-depth article content here..."
                  className="w-full p-3 font-mono text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Author Role</label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsString}
                  onChange={(e) => setTagsString(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#075E2B] text-white font-bold text-xs hover:bg-[#064e24] shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#F4B400]" />
                  <span>{editingPost ? 'Save Edits' : 'Publish Blog Post'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
