import React from 'react';
import ContentEditor from '../components/ContentEditor';
import { testimonialsApi } from '../api/adminApi';

const schema = {
  title: 'Testimonial',
  fields: [
    { key: 'name',    label: 'Client Name',    type: 'text',     required: true },
    { key: 'role',    label: 'Role / Title',   type: 'text',     required: true, placeholder: 'e.g. CEO, Founder' },
    { key: 'company', label: 'Company',        type: 'text' },
    { key: 'avatar',  label: 'Photo URL',      type: 'url' },
    { key: 'quote',   label: 'Testimonial',    type: 'textarea', required: true, placeholder: 'Must be a real, verified quote.' },
    { key: 'rating',  label: 'Star Rating (1–5)', type: 'number', default: 5 },
    { key: 'order',   label: 'Display Order',  type: 'number', default: 0 },
    { key: 'isVisible', label: 'Visible',      type: 'toggle', onLabel: 'Visible', offLabel: 'Hidden', default: true },
  ],
  columns: [
    { key: 'name',    label: 'Name' },
    { key: 'company', label: 'Company' },
    { key: 'rating',  label: 'Rating' },
    { key: 'isVisible', label: 'Visible', type: 'toggle' },
  ],
};

export default function AdminTestimonials() {
  return <ContentEditor schema={schema} api={testimonialsApi} />;
}
