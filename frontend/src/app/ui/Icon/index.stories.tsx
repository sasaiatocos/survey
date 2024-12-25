import { Icon, type Props } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  component: Icon,
  args: {
    type: 'home',
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

function storyFactory(type: Props['type']): Story {
  return { args: { type } };
}

export const Admin = storyFactory('admin');
export const Alarm = storyFactory('alert');
export const Close = storyFactory('close');
export const Home = storyFactory('home');
export const Plus = storyFactory('plus');
export const Result = storyFactory('result');
export const Write = storyFactory('write');
export const Register = storyFactory('register');
export const Search = storyFactory('search');