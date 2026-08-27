import React from 'react';
import ContentEditor from '../components/ContentEditor';
import { careersApi } from '../api/adminApi';

const schema = {
  title: 'Job Listing',
  pluralTitle: 'Careers',
  fields: [
    { key: 'title',           label: 'Job Title',        type: 'text',     required: true },
    { key: 'slug',            label: 'Slug (URL)',        type: 'text',     required: true },
    { key: 'department',      label: 'Department',       type: 'text',     required: true, placeholder: 'e.g. Engineering, Marketing' },
    { key: 'location',        label: 'Location',         type: 'text',     default: 'Bhubaneswar, Odisha, India' },
    { key: 'type',            label: 'Employment Type',  type: 'select',   options: [{ value: 'Full-time', label: 'Full-time' }, { value: 'Part-time', label: 'Part-time' }, { value: 'Internship', label: 'Internship' }, { value: 'Contract', label: 'Contract' }, { value: 'Remote', label: 'Remote' }], default: 'Full-time' },
    { key: 'experience',      label: 'Experience Required', type: 'text',  placeholder: 'e.g. 2-4 years' },
    { key: 'description',     label: 'Job Description',  type: 'textarea', required: true },
    { key: 'isOpen',          label: 'Accepting Applications', type: 'toggle', onLabel: 'Open', offLabel: 'Closed', default: true },
    { key: 'seoTitle',        label: 'SEO Title',        type: 'text' },
    { key: 'seoDescription',  label: 'SEO Description',  type: 'textarea' },
  ],
  columns: [
    { key: 'title',      label: 'Position' },
    { key: 'department', label: 'Department' },
    { key: 'type',       label: 'Type' },
    { key: 'isOpen',     label: 'Status', type: 'toggle' },
  ],
};

export default function AdminCareers() {
  return <ContentEditor schema={schema} api={careersApi} />;
}
