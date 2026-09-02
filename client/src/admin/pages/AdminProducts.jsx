import React from 'react';
import ContentEditor from '../components/ContentEditor';
import { productsApi } from '../api/adminApi';

const schema = {
  title: 'Product',
  pluralTitle: 'Products (Proprietary)',
  fields: [
    { key: 'title',           label: 'Product Name',      type: 'text',     required: true },
    { key: 'slug',            label: 'Slug (URL)',         type: 'text',     required: true },
    { key: 'tagline',         label: 'Tagline',           type: 'text' },
    { key: 'description',     label: 'Description',       type: 'textarea', required: true },
    { key: 'longDescription', label: 'Full Page Content', type: 'textarea' },
    { key: 'category',        label: 'Category',          type: 'text',     placeholder: 'e.g. SaaS Platform' },
    { key: 'status',          label: 'Status',            type: 'select',   options: [{ value: 'live', label: 'Live' }, { value: 'beta', label: 'Beta' }, { value: 'coming-soon', label: 'Coming Soon' }], default: 'live' },
    { key: 'liveUrl',         label: 'Live URL',          type: 'url' },
    { key: 'logo',            label: 'Logo',              type: 'image' },
    { key: 'heroImage',       label: 'Hero Image (Screenshot)', type: 'image' },
    { key: 'imageAlt',        label: 'Image Alt Text',    type: 'text' },
    { key: 'order',           label: 'Display Order',     type: 'number', default: 0 },
    { key: 'isVisible',       label: 'Visible on site',   type: 'toggle', onLabel: 'Visible', offLabel: 'Hidden', default: true },
    { key: 'seoTitle',        label: 'SEO Title',         type: 'text' },
    { key: 'seoDescription',  label: 'SEO Description',   type: 'textarea' },
  ],
  columns: [
    { key: 'order', label: '#' },
    { key: 'title', label: 'Product' },
    { key: 'tagline', label: 'Tagline', truncate: true },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'isVisible', label: 'Visible', type: 'toggle' },
  ],
};

export default function AdminProducts() {
  return <ContentEditor schema={schema} api={productsApi} />;
}
