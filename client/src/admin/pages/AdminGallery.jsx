import React from 'react';
import ContentEditor from '../components/ContentEditor';
import { galleryApi } from '../api/adminApi';

/**
 * Admin Gallery Editor
 *
 * Each Gallery record = ONE photo in the "Moments That Shape the Journey" masonry
 * section on the homepage. Fill in the image URL, a short alt text (caption shown
 * on hover), the category, and the display order.
 *
 * Schema matches the Gallery Mongoose model exactly:
 *   image, alt, category, order, isVisible
 */
const schema = {
  title: 'Gallery Photo',
  pluralTitle: 'Gallery',
  fields: [
    {
      key: 'image',
      label: 'Image URL',
      type: 'image',
      required: true,
      placeholder: 'Paste an image URL or upload a file',
    },
    {
      key: 'alt',
      label: 'Caption / Alt Text',
      type: 'text',
      required: true,
      placeholder: 'e.g. Team at Startup Odisha Awards 2024',
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: 'Culture',    label: 'Culture' },
        { value: 'Work',       label: 'Work' },
        { value: 'Events',     label: 'Events' },
        { value: 'Awards',     label: 'Awards' },
        { value: 'Leadership', label: 'Leadership' },
      ],
      default: 'Culture',
    },
    {
      key: 'order',
      label: 'Display Order (lower = first)',
      type: 'number',
      default: 0,
    },
    {
      key: 'isVisible',
      label: 'Show on Homepage',
      type: 'toggle',
      onLabel: 'Visible',
      offLabel: 'Hidden',
      default: true,
    },
  ],
  columns: [
    { key: 'alt',       label: 'Caption' },
    { key: 'category',  label: 'Category' },
    { key: 'order',     label: 'Order' },
    { key: 'isVisible', label: 'Visible', type: 'toggle' },
  ],
};

export default function AdminGallery() {
  return <ContentEditor schema={schema} api={galleryApi} />;
}

