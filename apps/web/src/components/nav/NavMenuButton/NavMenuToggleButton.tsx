import { IconArrowDropUp, IconArrowDropDown } from '@novu/design-system';
import { FC, PropsWithChildren, useState } from 'react';
import { Test } from '@novu/novui';
import { css } from '@novu/novui/styled-system/css';
import { Flex, HStack } from '@novu/novui/styled-system/jsx';
import { INavMenuButtonProps, rawButtonBaseStyles } from './NavMenuButton.shared';

type INavMenuToggleButtonProps = Omit<INavMenuButtonProps, 'rightSide'>;

export const NavMenuToggleButton: FC<PropsWithChildren<INavMenuToggleButtonProps>> = ({
  testId,
  icon,
  label,
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <>
      <button className={css(rawButtonBaseStyles)} data-test-id={testId} onClick={handleClick}>
        <HStack justifyContent={'space-between'} w="inherit">
          <HStack gap="75">
            {icon}
            <span>{label}</span>
            <Test />
          </HStack>
          {isOpen ? <IconArrowDropUp /> : <IconArrowDropDown />}
        </HStack>
      </button>
      <Flex direction={'column'} pl="150">
        {!isOpen ? null : children}
      </Flex>
    </>
  );
};
