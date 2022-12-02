import { QueryClient, QueryClientProvider } from 'react-query';
import { TestWrapper } from '../../../testing';
import { ActivityStatistics } from './ActivityStatistics';

describe('Activity Statistics Component Test', () => {
  const activityStatisticsComponentSelector = '[data-test-id="activity-stats-weekly-sent"]';
  const queryClient = new QueryClient();

  it('should Render the Activity Statistics Component', () => {
    cy.mount(
      <TestWrapper>
        <QueryClientProvider client={queryClient}>
          <ActivityStatistics></ActivityStatistics>
        </QueryClientProvider>
      </TestWrapper>
    );
  });

  it('should get the activity-stats-weekly-sent data test id', () => {
    cy.mount(
      <TestWrapper>
        <QueryClientProvider client={queryClient}>
          <ActivityStatistics></ActivityStatistics>
        </QueryClientProvider>
      </TestWrapper>
    );
    cy.intercept('GET', '/v1/activity', {
      body: {
        yearlySent: 1,
        monthlySent: 12,
        weeklySent: 52,
      },
    }).as('activityStatistics');

    cy.get(activityStatisticsComponentSelector);
  });
});
