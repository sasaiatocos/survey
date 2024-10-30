import { SurveyCard } from './';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: SurveyCard,
  args: {
    title: 'タイトル',
    expiredAt: 'yyyy/mm/dd'
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SurveyCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Wide: Story = {
  args: {},
};

export const Square: Story = {
  args: {
    ratio: 'square',
  },
};

export const Portrait: Story = {
  args: {
    ratio: 'portrait',
  },
};

export const ActionIcon: Story = {
  args: {
    actionIcon: {
      containerProps: {
        onClick: () => console.log('click'),
      },
      iconProps: {
        type: 'gear',
      },
    },
    showMeta: false,
  },
};

export const LineClamp2: Story = {
  args: {
    lineClamp: 2,
  },
};

export const LineClamp3: Story = {
  args: {
    lineClamp: 3,
  },
};

export const LineClamp4: Story = {
  args: {
    lineClamp: 4,
  },
};

export const NoRounded: Story = {
  args: {
    rounded: false,
  },
};