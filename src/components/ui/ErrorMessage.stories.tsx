import type { Meta, StoryObj } from '@storybook/react';
import { ErrorMessage } from './ErrorMessage';

const meta: Meta<typeof ErrorMessage> = {
  title: 'UI/ErrorMessage',
  component: ErrorMessage,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'inline', 'banner'],
    },
    error: {
      control: { type: 'text' },
    },
    id: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    error: 'Something went wrong',
  },
};

export const Inline: Story = {
  args: {
    error: 'This field is required',
    variant: 'inline',
  },
};

export const Banner: Story = {
  args: {
    error: 'Unable to connect to the server. Please try again later.',
    variant: 'banner',
  },
};

export const LongErrorMessage: Story = {
  args: {
    error: 'This is a very long error message that demonstrates how the component handles longer text content and ensures proper wrapping and readability.',
    variant: 'banner',
  },
};

export const WithCustomId: Story = {
  args: {
    error: 'Validation error',
    id: 'error-1',
  },
};

export const WithCustomClassName: Story = {
  args: {
    error: 'Custom styled error',
    className: 'border-l-4 border-red-500 pl-4',
  },
};

export const NetworkError: Story = {
  args: {
    error: 'Network error: Unable to connect to the server',
    variant: 'banner',
  },
};

export const ValidationError: Story = {
  args: {
    error: 'Please enter a valid email address',
    variant: 'inline',
  },
};

