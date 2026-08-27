import React from 'react';
import ContentEditor from '../components/ContentEditor';
import { servicesApi } from '../api/adminApi';

const schema = {
  title: 'Service',
  pluralTitle: 'Services',
  titleKey: 'title',
  fields: [
    { key: 'title',            label: 'Title',             type: 'text',     required: true },
    { key: 'slug',             label: 'Slug (URL)',         type: 'text',     required: true, placeholder: 'e.g. software-development' },
    { key: 'shortDescription', label: 'Short Description', type: 'textarea', required: true },
    { key: 'longDescription',  label: 'Long Description',  type: 'textarea' },
    { key: 'icon',             label: 'Icon (Font Awesome class)', type: 'text', placeholder: 'e.g. fa-code' },
    { key: 'image',            label: 'Image URL',         type: 'url' },
    { key: 'order',            label: 'Display Order',     type: 'number', default: 0 },
    { key: 'isVisible',        label: 'Visible on site',   type: 'toggle', onLabel: 'Visible', offLabel: 'Hidden', default: true },
    { key: 'seoTitle',         label: 'SEO Title',         type: 'text' },
    { key: 'seoDescription',   label: 'SEO Description',   type: 'textarea' },
  ],
  columns: [
    { key: 'order', label: '#' },
    { key: 'title', label: 'Title' },
    { key: 'shortDescription', label: 'Description', truncate: true },
    { key: 'isVisible', label: 'Visible', type: 'toggle' },
  ],
};

export default function AdminServices() {
  return <ContentEditor schema={schema} api={servicesApi} />;
}
