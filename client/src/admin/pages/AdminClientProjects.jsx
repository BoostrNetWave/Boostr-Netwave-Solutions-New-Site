import React from 'react';
import ContentEditor from '../components/ContentEditor';
import { clientProjectsApi } from '../api/adminApi';

const schema = {
  title: 'Client Project',
  pluralTitle: 'Client Projects',
  previewPath: (item) => `/case-studies/${item.slug}`,
  fields: [
    { key: 'title',       label: 'Project Title',  type: 'text',     required: true },
    { key: 'slug',        label: 'Slug (URL)',      type: 'text',     required: true },
    { key: 'client',      label: 'Client Name',    type: 'text' },
    { key: 'category',    label: 'Industry',       type: 'text',     placeholder: 'e.g. FinTech, EdTech, Retail' },
    { key: 'location',    label: 'Location',       type: 'text' },
    { key: 'description', label: 'Short Summary',  type: 'textarea', required: true },
    { key: 'challenge',   label: 'The Challenge',  type: 'textarea', placeholder: 'What problem did the client have?' },
    { key: 'solution',    label: 'Our Solution',   type: 'textarea', placeholder: 'What did we build?' },
    { key: 'result',      label: 'The Result',     type: 'textarea', placeholder: 'Measurable outcomes achieved.' },
    { key: 'image',       label: 'Hero Image URL', type: 'url' },
    { key: 'liveUrl',     label: 'Live URL',       type: 'url' },
    { key: 'isFeatured',  label: 'Featured on homepage', type: 'toggle', onLabel: 'Featured', offLabel: 'Not featured', default: false },
    { key: 'order',       label: 'Display Order',  type: 'number', default: 0 },
    { key: 'isVisible',   label: 'Visible',        type: 'toggle', onLabel: 'Visible', offLabel: 'Hidden', default: true },
    { key: 'seoTitle',       label: 'SEO Title',       type: 'text' },
    { key: 'seoDescription', label: 'SEO Description', type: 'textarea' },
  ],
  columns: [
    { key: 'order', label: '#' },
    { key: 'title', label: 'Project' },
    { key: 'client', label: 'Client' },
    { key: 'category', label: 'Industry' },
    { key: 'isFeatured', label: 'Featured', type: 'toggle' },
    { key: 'isVisible', label: 'Visible', type: 'toggle' },
  ],
};

export default function AdminClientProjects() {
  return <ContentEditor schema={schema} api={clientProjectsApi} />;
}
