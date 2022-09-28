import React from 'react';
import { Grid } from '@mantine/core';
import { Title } from '../../../design-system';
import { IIntegratedProvider } from '../IntegrationsStorePage';
import { ProviderCard } from './ProviderCard';

export function ChannelGroup({
  title,
  providers,
  onProviderClick,
}: {
  providers: IIntegratedProvider[];
  title: string;
  onProviderClick: (visible: boolean, create: boolean, provider: IIntegratedProvider) => void;
}) {
  function handlerOnConnectClick(visible: boolean, create: boolean, provider: IIntegratedProvider) {
    onProviderClick(visible, create, provider);
  }

  return (
    <Grid mb={50}>
      <Grid.Col span={12} data-test-id={`integration-group-${title.toLowerCase()}`}>
        <Title size={2}>{title}</Title>
      </Grid.Col>
      {providers.map((provider) => (
        <Grid.Col sm={6} md={3} xs={4} key={provider.providerId}>
          <ProviderCard provider={provider} onConnectClick={handlerOnConnectClick} />
        </Grid.Col>
      ))}
    </Grid>
  );
}
