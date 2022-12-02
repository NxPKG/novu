import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Copy } from '../icons';
import { Input } from './Input';

export default {
  title: 'Inputs/Input',
  component: Input,
  argTypes: {
    value: {
      table: {
        disable: true,
      },
    },
    onChange: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = ({ ...args }) => <Input {...args} />;

export const PrimaryUse = Template.bind({});
PrimaryUse.args = {
  label: 'Notification Name',
  placeholder: 'Notification name goes here...',
};

export const WithDescription = Template.bind({});
WithDescription.args = {
  label: 'Notification Name',
  description: 'Will be used as identifier',
  placeholder: 'Notification name goes here...',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  label: 'Notification Name',
  value: 'e297cdd6cf29ea8f566c06da18ccf151',
  rightSection: <Copy />,
};

export const Error = Template.bind({});
Error.args = {
  label: 'Your Email',
  value: 'NotGood@email.com',
  error: 'Not Good!',
};
