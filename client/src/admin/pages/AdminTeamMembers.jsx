import React from 'react';
import ContentEditor from '../components/ContentEditor';
import { teamApi } from '../api/adminApi';

const schema = {
  title: 'Team Member',
  pluralTitle: 'Team Members',
  fields: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'role', label: 'Role/Title', type: 'text', required: true },
    { key: 'image', label: 'Photo URL', type: 'url' },
    { key: 'imageAlt', label: 'Image Alt Text', type: 'text' },
    { key: 'bio', label: 'Short Bio', type: 'textarea' },
    { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
    { key: 'twitter', label: 'Twitter/X URL', type: 'url' },
    { key: 'category', label: 'Category', type: 'select', options: [
      { value: 'Core Team', label: 'Core Team' },
      { value: 'Professionals', label: 'Professionals' },
      { value: 'Product Teams', label: 'Product Teams' },
      { value: 'Alliances', label: 'Alliances' },
    ], default: 'Core Team' },
    { key: 'isLeadership', label: 'Leadership Team', type: 'toggle', default: false },
    { key: 'order', label: 'Display Order', type: 'number', default: 0 },
    { key: 'isVisible', label: 'Visible', type: 'toggle', default: true },
  ],
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'isLeadership', label: 'Leadership', type: 'toggle' },
    { key: 'category', label: 'Category' },
    { key: 'order', label: 'Order' },
    { key: 'isVisible', label: 'Visible', type: 'toggle' },
  ],
};

export default function AdminTeamMembers() {
  return <ContentEditor schema={schema} api={teamApi} />;
}

