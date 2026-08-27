import React from 'react';
import ContentEditor from '../components/ContentEditor';
import { blogApi } from '../api/adminApi';

const schema = {
  title: 'Blog Post',
  pluralTitle: 'Blog Posts',
  previewPath: (item) => `/blog/${item.slug}`,
  fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'e.g., ai-first-architecture' },
    { key: 'category', label: 'Category', type: 'select', options: [
      { value: 'AI & Engineering', label: 'AI & Engineering' },
      { value: 'Cloud & Infra', label: 'Cloud & Infra' },
      { value: 'DevOps', label: 'DevOps' },
      { value: 'Digital Transformation', label: 'Digital Transformation' }
    ] },
    { key: 'author', label: 'Author', type: 'text', default: 'Boostr Netwave Team' },
    { key: 'excerpt', label: 'Excerpt', type: 'textarea', required: true },
    { key: 'content', label: 'Content (HTML)', type: 'textarea', required: true },
    { key: 'coverImage', label: 'Cover Image', type: 'image' },
    { key: 'readTime', label: 'Read Time (mins)', type: 'number', default: 5 },
    { key: 'isPublished', label: 'Published', type: 'toggle', onLabel: 'Published', offLabel: 'Draft', default: false },
    { key: 'seoTitle', label: 'SEO Title', type: 'text' },
    { key: 'seoDescription', label: 'SEO Description', type: 'textarea' },
  ],
  columns: [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'isPublished', label: 'Status', type: 'toggle' },
    { key: 'publishedAt', label: 'Published At', type: 'date' },
  ],
};

export default function AdminBlog() {
  return <ContentEditor schema={schema} api={blogApi} />;
}
