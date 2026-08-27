import React from 'react';
import ContentEditor from '../components/ContentEditor';
import { galleryApi } from '../api/adminApi';

const schema = {
  title: 'Gallery Event',
  pluralTitle: 'Gallery Events',
  fields: [
    { key: 'title',     label: 'Event Title', type: 'text',    required: true },
    { key: 'date',      label: 'Event Date',  type: 'date' },
    { key: 'location',  label: 'Location',    type: 'text' },
    { key: 'category',  label: 'Category',    type: 'select', options: [{ value: 'Culture', label: 'Culture' }, { value: 'Work', label: 'Work' }, { value: 'Events', label: 'Events' }, { value: 'Awards', label: 'Awards' }, { value: 'Leadership', label: 'Leadership' }], default: 'Culture' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'images',    label: 'Images (JSON Array: [{ "url": "...", "alt": "..." }])', type: 'json' },
    { key: 'isFeatured', label: 'Featured Event', type: 'toggle', default: false },
    { key: 'order',     label: 'Display Order', type: 'number', default: 0 },
    { key: 'isVisible', label: 'Visible',     type: 'toggle', onLabel: 'Visible', offLabel: 'Hidden', default: true },
  ],
  columns: [
    { key: 'title',     label: 'Title' },
    { key: 'category',  label: 'Category' },
    { key: 'isFeatured', label: 'Featured', type: 'toggle' },
    { key: 'order',     label: 'Order' },
    { key: 'isVisible', label: 'Visible', type: 'toggle' },
  ],
};

export default function AdminGallery() {
  return <ContentEditor schema={schema} api={galleryApi} />;
}
