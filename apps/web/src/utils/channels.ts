import { ChannelTypeEnum, StepTypeEnum } from '@novu/shared';
import React, { MouseEvent as ReactMouseEvent } from 'react';
import { Node } from 'react-flow-renderer';
import {
  ChatFilled,
  DelayAction,
  DigestAction,
  EmailFilled,
  InAppFilled,
  PushFilled,
  SmsFilled,
} from '../design-system/icons';

export enum NodeTypeEnum {
  CHANNEL = 'channel',
  ACTION = 'action',
}

interface IChannelDefinition {
  tabKey: StepTypeEnum | ChannelTypeEnum;
  label: string;
  description: string;
  Icon: React.FC<any>;
  testId: string;
  channelType: StepTypeEnum;
  type: NodeTypeEnum;
}

export const CHANNEL_TYPE_TO_STRING: Record<ChannelTypeEnum, string> = {
  [ChannelTypeEnum.IN_APP]: 'In-App',
  [ChannelTypeEnum.EMAIL]: 'Email',
  [ChannelTypeEnum.SMS]: 'SMS',
  [ChannelTypeEnum.CHAT]: 'Chat',
  [ChannelTypeEnum.PUSH]: 'Push',
};

export const channels: IChannelDefinition[] = [
  {
    tabKey: ChannelTypeEnum.IN_APP,
    label: 'In-App',
    description: 'Send notifications to the in-app notification center',
    Icon: InAppFilled,
    testId: 'inAppSelector',
    channelType: StepTypeEnum.IN_APP,
    type: NodeTypeEnum.CHANNEL,
  },
  {
    tabKey: ChannelTypeEnum.EMAIL,
    label: 'Email',
    description: 'Send using one of our email integrations',
    Icon: EmailFilled,
    testId: 'emailSelector',
    channelType: StepTypeEnum.EMAIL,
    type: NodeTypeEnum.CHANNEL,
  },
  {
    tabKey: ChannelTypeEnum.SMS,
    label: 'SMS',
    description: "Send an SMS directly to the user's phone",
    Icon: SmsFilled,
    testId: 'smsSelector',
    channelType: StepTypeEnum.SMS,
    type: NodeTypeEnum.CHANNEL,
  },
  {
    tabKey: StepTypeEnum.DIGEST,
    label: 'Digest',
    description: 'Aggregate events triggered to one notification',
    Icon: DigestAction,
    testId: 'digestSelector',
    channelType: StepTypeEnum.DIGEST,
    type: NodeTypeEnum.ACTION,
  },
  {
    tabKey: StepTypeEnum.DELAY,
    label: 'Delay',
    description: 'Delay before trigger of next event',
    Icon: DelayAction,
    testId: 'delaySelector',
    channelType: StepTypeEnum.DELAY,
    type: NodeTypeEnum.ACTION,
  },
  {
    tabKey: ChannelTypeEnum.CHAT,
    label: 'Chat',
    description: 'Send a chat message',
    Icon: ChatFilled,
    testId: 'chatSelector',
    channelType: StepTypeEnum.CHAT,
    type: NodeTypeEnum.CHANNEL,
  },
  {
    tabKey: ChannelTypeEnum.PUSH,
    label: 'Push',
    description: "Send an Push Notification to a user's device",
    Icon: PushFilled,
    testId: 'pushSelector',
    channelType: StepTypeEnum.PUSH,
    type: NodeTypeEnum.CHANNEL,
  },
];

export const getChannel = (channelKey?: string): IChannelDefinition | undefined => {
  return channels.find((channel) => channel.tabKey === channelKey);
};

export const computeNodeActualPosition = (node: Node<any>, nodes: Array<Node<any>>, xSum = 0, ySum = 0) => {
  if (node.parentNode) {
    const parent = nodes.find(({ id }) => id === node.parentNode);
    if (parent) {
      const { actualPosition } = computeNodeActualPosition(parent, nodes, xSum, ySum);
      xSum += actualPosition.x;
      ySum += actualPosition.y;
    }
  }

  return {
    ...node,
    actualPosition: {
      x: node.position.x + xSum,
      y: node.position.y + ySum,
    },
  };
};

export const triggerFromReplaceHandle = (e: ReactMouseEvent) => {
  return !!(e.target as HTMLElement).closest('.node-swap-trigger-wrapper');
};

// The default node height would be used if `node.height` is `null`.
const defaultNodeHeight = 80;
// Determines the overlap needed for a swap.
const margin = 8;

/**
 * Calculates the offset position of the node to be swapped. This calculation helps determine
 * if the node's position is close enough to trigger a swap operation.
 *
 * @param nodeId Node ID of the node to be swapped.
 * @param node Node.
 * @param isUpward Determines if the swap direction.
 */
export const getOffsetPosition = (nodeId: string, node: Node, isUpward: boolean) => {
  if (nodeId !== node.id) return node;

  const height = node.height ?? defaultNodeHeight;
  const computedOffset = isUpward ? height - margin : 0 - height + margin;

  return {
    ...node,
    position: { ...node.position, y: node.position.y + computedOffset },
  };
};
