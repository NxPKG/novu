import { Progress, Text, useMantineTheme } from '@mantine/core';
import { IIntegratedProvider } from '../IntegrationsStorePage';
import { colors } from '../../../design-system';

import { useMessageCount } from '../../../api/hooks/integrations/useMessageCount';
export const UsageMeter = ({ provider }: { provider: IIntegratedProvider }) => {
  const { data, loading } = useMessageCount(provider.providerId);

  if (loading) {
    return null;
  }
  if (!provider?.limits?.hardLimit) return null;
  const theme = useMantineTheme();

  const messageCount = data?.messageCount as number;
  const hardLimit: number = provider?.limits?.hardLimit;
  const usedPerc = (messageCount * 1000) / hardLimit;
  const hlColor = theme.colorScheme === 'dark' ? colors.B30 : colors.B60;
  const label = `Used ${messageCount}/${provider?.limits?.hardLimit}`;

  return (
    <>
      <Text>{label}</Text>
      <Progress
        color={colors.horizontal}
        size={12}
        sections={[
          { value: usedPerc, color: colors.horizontal },
          { value: 100 - usedPerc, color: hlColor },
        ]}
      />
    </>
  );
};
//<MultiMarkSlider />
