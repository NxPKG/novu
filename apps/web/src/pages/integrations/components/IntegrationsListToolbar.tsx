import styled from '@emotion/styled';
import { Button, Text } from '../../../design-system';

const IntegrationsListToolbarHolder = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ButtonStyled = styled(Button)`
  margin-left: -8px;
`;

const PlusSquare = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  max-width: 24px;
  height: 24px;
  padding: 0;
  font-size: 18px;
  font-weight: 700;
  border-radius: 4px;
`;

export const IntegrationsListToolbar = ({ areIntegrationsLoading }: { areIntegrationsLoading: boolean }) => {
  return (
    <IntegrationsListToolbarHolder>
      <ButtonStyled id="add-provider" disabled={areIntegrationsLoading} data-test-id="add-provider" variant="subtle">
        <PlusSquare data-square>+</PlusSquare>
        <Text gradient>Add a provider</Text>
      </ButtonStyled>
    </IntegrationsListToolbarHolder>
  );
};
