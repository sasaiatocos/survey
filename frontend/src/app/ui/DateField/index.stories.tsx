import { DateField } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: DateField,
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};