import { createStyles } from '@mantine/core';
import styled from '@emotion/styled';
import { colors, shadows, Text } from '../../../design-system';

export default createStyles((theme, _params, getRef) => {
  const dark = theme.colorScheme === 'dark';

  return {
    itemBulletWithChild: {
      ref: getRef('itemBulletWithChild'),
      color: colors.B60,
      fontSize: '20px',
      fontWeight: 700,
    },
    itemBullet: {
      ref: getRef('itemBullet'),
      backgroundColor: `${dark ? colors.B17 : colors.B98} !important`,
      borderRadius: '40px',
      border: 'none',
    },
    itemBody: {
      ref: getRef('itemBody'),
      padding: '20px',
      backgroundColor: `${dark ? colors.B17 : colors.B98} !important`,
      borderRadius: '7px',
    },
    itemActive: {
      [`& .${getRef('itemBullet')}`]: {
        backgroundColor: `${dark ? colors.B20 : colors.BGLight} !important`,
        boxShadow: dark ? shadows.dark : shadows.medium,
      },
      [`& .${getRef('itemBody')}`]: {
        backgroundColor: `${dark ? colors.B20 : colors.BGLight} !important`,
        boxShadow: dark ? shadows.dark : shadows.medium,
      },
      [`& .${getRef('itemBulletWithChild')}`]: {
        color: dark ? colors.white : colors.B40,
      },
    },
  };
});

export const StyledTitle = styled(Text)<{ active?: boolean }>`
  font-weight: 700;
  font-size: 16px;
`;

export const StyledDescription = styled(Text)`
  font-weight: 400;
  font-size: 14px;
  color: ${colors.B60};
`;

export const ActiveWrapper = styled.div<{ active: boolean; dark: boolean }>`
  ${({ active, dark }) => {
    return (
      !active &&
      `
      ${StyledTitle} {
        color: ${colors.B60};
      }
      ${StyledDescription} {
        color: ${dark ? colors.B40 : colors.B70};
      }
    `
    );
  }};
`;
