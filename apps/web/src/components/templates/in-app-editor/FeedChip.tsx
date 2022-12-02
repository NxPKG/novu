import React from 'react';
import styled from '@emotion/styled';
import { ColorScheme, useMantineTheme } from '@mantine/core';
import { IFeedEntity } from '@novu/shared';
import { colors, shadows } from '../../../design-system';
import { DotsHorizontal } from '../../../design-system/icons';
import { useEnvController } from '../../../store/use-env-controller';

interface IFeedItemProps {
  showFeed: boolean;
  index: number;
  setOpened: (hover: boolean) => void;
  item: IFeedEntity;
  feedIndex: number;
  onEditClick: () => void;
  field: any;
  setValue: (key: string, value: string, options: { shouldDirty: boolean }) => void;
}

export function FeedChip(props: IFeedItemProps) {
  const { colorScheme } = useMantineTheme();
  const { readonly } = useEnvController();

  const selectedItem = props.field.value === props.item._id;

  return (
    <Wrapper
      selectedItem={selectedItem}
      showFeed={props.showFeed}
      colorScheme={colorScheme}
      readonly={readonly}
      data-test-id={`feed-button-${props.feedIndex}${selectedItem ? '-checked' : ''}`}
      onClick={() => {
        props.setValue(`steps.${props.index}.template.feedId`, props?.item?._id || '', { shouldDirty: true });
      }}
    >
      <div>{props.item?.name}</div>
      <DotsHorizontal
        onClick={(e) => {
          if (props.showFeed) {
            e.stopPropagation();
            props.onEditClick();
          }
        }}
        style={{
          color: colorScheme === 'dark' ? colors.white : colors.B80,
          cursor: `${props.showFeed ? 'pointer' : 'default'}`,
        }}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div<{ colorScheme: ColorScheme; showFeed: boolean; selectedItem: boolean; readonly: boolean }>`
  ${({ showFeed, readonly }) =>
    (!showFeed || readonly) &&
    `
    pointer-events: none;
    opacity: 0.4;  
  `}

  padding: 0 15px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 45px;
  border-radius: 7px;
  cursor: default;
  justify-content: space-between;
  box-shadow: ${({ colorScheme }) => (colorScheme === 'dark' ? shadows.dark : shadows.medium)};
  background: ${({ colorScheme }) => (colorScheme === 'dark' ? colors.B17 : colors.white)};

  ${({ selectedItem, colorScheme }) =>
    selectedItem &&
    `
     background: ${
       colorScheme === 'dark'
         ? `linear-gradient(0deg, ${colors.B20} 0%, ${colors.B20} 100%)`
         : `linear-gradient(0deg, ${colors.white} 0%, ${colors.white} 100%)`
     } padding-box,
    ${colors.horizontal} border-box`};
  border: 1px solid transparent;
`;
