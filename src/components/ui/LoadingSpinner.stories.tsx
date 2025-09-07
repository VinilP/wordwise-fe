import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    text: {
      control: { type: 'text' },
    },
    'aria-label': {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Loading...',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    text: 'Loading...',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    text: 'Loading books...',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    text: 'Processing your request...',
  },
};

export const WithoutText: Story = {
  args: {
    text: '',
  },
};

export const CustomAriaLabel: Story = {
  args: {
    text: 'Loading data',
    'aria-label': 'Loading books from the library',
  },
};

export const CustomClassName: Story = {
  args: {
    text: 'Loading...',
    className: 'border border-gray-300 rounded-lg p-4',
  },
};

