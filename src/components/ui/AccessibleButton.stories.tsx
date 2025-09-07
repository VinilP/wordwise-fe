import type { Meta, StoryObj } from '@storybook/react';
import { AccessibleButton } from './AccessibleButton';

const meta: Meta<typeof AccessibleButton> = {
  title: 'UI/AccessibleButton',
  component: AccessibleButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    loading: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    children: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    children: 'Delete',
    variant: 'danger',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Cancel',
    variant: 'ghost',
  },
};

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Large',
    size: 'lg',
  },
};

export const Loading: Story = {
  args: {
    children: 'Save',
    loading: true,
    loadingText: 'Saving...',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const LoadingDisabled: Story = {
  args: {
    children: 'Submit',
    loading: true,
    disabled: true,
    loadingText: 'Processing...',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <AccessibleButton variant="primary">Primary</AccessibleButton>
        <AccessibleButton variant="secondary">Secondary</AccessibleButton>
        <AccessibleButton variant="danger">Danger</AccessibleButton>
        <AccessibleButton variant="ghost">Ghost</AccessibleButton>
      </div>
      <div className="flex gap-2">
        <AccessibleButton size="sm">Small</AccessibleButton>
        <AccessibleButton size="md">Medium</AccessibleButton>
        <AccessibleButton size="lg">Large</AccessibleButton>
      </div>
      <div className="flex gap-2">
        <AccessibleButton loading>Loading</AccessibleButton>
        <AccessibleButton disabled>Disabled</AccessibleButton>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    children: 'Click me',
    onClick: () => alert('Button clicked!'),
  },
};

