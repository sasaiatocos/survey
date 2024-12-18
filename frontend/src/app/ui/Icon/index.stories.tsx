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

export const Account = storyFactory('account');
export const Alarm = storyFactory('alert');
export const Attention = storyFactory('attention');
export const Gear = storyFactory('gear');
export const Home = storyFactory('home');
export const Login = storyFactory('login');
export const Logout = storyFactory('logout');
export const PaperPlane = storyFactory('paper_plane');
export const Register = storyFactory('register');
export const Search = storyFactory('search');
export const Trash = storyFactory('trash');
export const Write = storyFactory('write');
export const Admin = storyFactory('admin');
export const Result = storyFactory('result');