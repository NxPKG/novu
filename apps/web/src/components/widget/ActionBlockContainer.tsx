import React from 'react';
import {
  darkButtonStyle,
  IMessageButton,
  lightButtonStyle,
  ButtonTypeEnum,
  IMessageAction,
  MessageActionStatusEnum,
} from '@novu/shared';
import { ColorScheme, TextInput, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import styled from '@emotion/styled';
import { RemoveCircle } from '../../design-system/icons/general/RemoveCircle';
import { Button, colors } from '../../design-system';

export function ActionBlockContainer({
  onButtonAddClickHandle,
  onRemoveTemplate,
  isButtonsTemplateSelected,
  onChange,
  value,
}: {
  onButtonAddClickHandle: () => void;
  onRemoveTemplate: () => void;
  isButtonsTemplateSelected: boolean;
  onChange: (data: any) => void;
  value: IMessageAction;
}) {
  return (
    <>
      {isButtonsTemplateSelected ? (
        <SelectedButtonTemplate onChange={onChange} value={value} onRemoveTemplate={onRemoveTemplate} />
      ) : (
        <AddButtonSection onButtonAddClick={onButtonAddClickHandle} />
      )}
    </>
  );
}

interface ISelectedButtonTemplateProps {
  value: IMessageAction;
  onRemoveTemplate: () => void;
  onChange: (actions: any) => void;
}

function SelectedButtonTemplate(props: ISelectedButtonTemplateProps) {
  const dark = useMantineTheme().colorScheme === 'dark';
  const buttonStyle = dark ? darkButtonStyle : lightButtonStyle;

  function handleOnButtonContentChange(data: any, buttonIndex: number) {
    const currentButtonsValue = props?.value?.buttons ? [...props?.value?.buttons] : [];

    if (currentButtonsValue) {
      if (currentButtonsValue[buttonIndex]) {
        currentButtonsValue[buttonIndex].content = data.target.value;
        const newAction = { buttons: currentButtonsValue, status: MessageActionStatusEnum.PENDING };
        props.onChange(newAction);
      }
    }
  }

  const lastButtonType = props?.value?.buttons
    ? props?.value?.buttons[props.value.buttons.length - 1]?.type
    : ButtonTypeEnum.PRIMARY;

  const buttons = props.value?.buttons;

  return (
    <>
      <TemplateContainerWrap>
        <TemplateContainer>
          {buttons?.map((button: IMessageButton, buttonIndex: number) => {
            const buttonText = button?.content ? button?.content : '';

            return (
              <NotificationButton background={buttonStyle[button.type].backGroundColor} fullWidth key={buttonIndex}>
                <ButtonInput
                  color={buttonStyle[button.type].fontColor}
                  value={buttonText}
                  onChange={(data) => {
                    handleOnButtonContentChange(data, buttonIndex);
                  }}
                />
              </NotificationButton>
            );
          })}
          <DeleteIcon buttonStyle={buttonStyle[lastButtonType]}>
            <RemoveCircle onClick={props.onRemoveTemplate} />
          </DeleteIcon>
        </TemplateContainer>
      </TemplateContainerWrap>
    </>
  );
}

function AddButtonSection({ onButtonAddClick }: { onButtonAddClick?: () => void }) {
  const { colorScheme } = useMantineColorScheme();

  return (
    <AddButtonTemplateButton colorScheme={colorScheme} data-test-id="control-add" onClick={onButtonAddClick}>
      <span>+ Add Action</span>
    </AddButtonTemplateButton>
  );
}

const AddButtonTemplateButton = styled.div<{ colorScheme: ColorScheme }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  border: 1px dashed;
  border-radius: 7px;
  margin: 15px 0 15px 0;
  color: ${({ colorScheme }) => (colorScheme === 'dark' ? colors.B80 : colors.B40)};
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
`;

const TemplateContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 15px -15px;
`;

const TemplateContainerWrap = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  border: none;
`;

const NotificationButton = styled(Button)<{ background }>`
  background: ${({ background }) => background};
  height: 30px;
  position: relative;
  cursor: default;
  justify-content: center;
  display: flex;
  margin-left: 5px;
  margin-right: 5px;
  text-align-last: center;
  border: none;
  box-shadow: none;
`;

const DeleteIcon = styled.div<{ buttonStyle }>`
  align-content: center;
  position: absolute;
  align-items: center;
  height: 14px;
  top: 8px;
  right: 14px;
  cursor: pointer;
  path {
    fill: ${({ buttonStyle }) => buttonStyle.removeCircleColor};
  }
`;

const ButtonInput = styled(TextInput)<{ color }>`
  display: flex;
  align-content: center;
  text-align: center;
  border: none;
  cursor: none;
  input {
    border: transparent;
    background: transparent;
    color: ${({ color }) => color};
    font-weight: 700;
    height: 30px;
  }
`;
