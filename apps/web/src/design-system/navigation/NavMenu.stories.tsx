import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { Activity, Bolt, Settings, Team } from '../icons';
import { NavMenu } from './NavMenu';

export default {
  title: 'Menus/NavigationMenu',
  component: NavMenu,
  argTypes: {},
} as ComponentMeta<typeof NavMenu>;

const menuItems = [
  { icon: <Bolt />, link: '/0', label: 'Notifications' },
  { icon: <Activity />, link: '/1', label: 'Activity Feed' },
  { icon: <Settings />, link: '/2', label: 'Settings' },
  {
    icon: <Team />,
    link: '/3',
    label: 'Team Members',
  },
];

const Template: ComponentStory<typeof NavMenu> = ({ ...args }) => (
  <MemoryRouter initialEntries={['/0']}>
    <NavMenu {...args} menuItems={menuItems} />{' '}
  </MemoryRouter>
);

export const Default = Template.bind({});
Default.args = {};
