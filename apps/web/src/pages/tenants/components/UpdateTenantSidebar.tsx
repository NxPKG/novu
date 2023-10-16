import { useEffect, useState } from 'react';
import { ActionIcon, Group, Stack } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

import { ITenantEntity, IUpdateTenantDto } from '@novu/shared';

import { Button, colors, NameInput, Sidebar, Text, Title, Tooltip, Modal } from '../../../design-system';
import { getTenantByIdentifier, deleteTenant, updateTenant } from '../../../api/tenants';
import { errorMessage, successMessage } from '../../../utils/notifications';
import { QueryKeys } from '../../../api/query.keys';
import { TenantFormCommonFields } from './TenantFormCommonFields';
import { Trash, WarningIcon } from '../../../design-system/icons';
import styled from '@emotion/styled';

const TrashButton = styled(Group)`
  text-align: center;
  border-radius: 8px;
  width: 20px;
  height: 32px;
  margin-bottom: 8px;
  color: ${({ theme }) => (theme.colorScheme === 'dark' ? colors.B60 : colors.B30)};

  &:hover {
    background: ${({ theme }) => (theme.colorScheme === 'dark' ? colors.B30 : colors.B85)};
    color: ${({ theme }) => (theme.colorScheme === 'dark' ? colors.white : colors.B30)};
  }
`;

export interface ITenantForm {
  identifier: string;
  name: string;
  data?: string;
}
export const defaultFormValues = {
  identifier: '',
  name: '',
  data: '',
};
export function UpdateTenantSidebar({
  isOpened,
  tenantIdentifier,
  onClose,
}: {
  isOpened: boolean;
  tenantIdentifier: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [isModalOpened, setModalIsOpened] = useState(false);

  const { data: tenant, isLoading: isLoadingTenant } = useQuery<ITenantEntity>(
    [QueryKeys.getTenantByIdentifier(tenantIdentifier)],
    () => getTenantByIdentifier(tenantIdentifier),
    {
      enabled: !!tenantIdentifier,
    }
  );

  const { mutateAsync: updateTenantMutate, isLoading: isLoadingUpdate } = useMutation<
    ITenantEntity,
    { error: string; message: string; statusCode: number },
    { identifier: string; data: IUpdateTenantDto }
  >(({ identifier, data }) => updateTenant(identifier, data), {
    onSuccess: async () => {
      await queryClient.refetchQueries({
        predicate: ({ queryKey }) => queryKey.includes(QueryKeys.tenantsList),
      });
      successMessage('Tenant has been updated!');
    },
    onError: (e: any) => {
      errorMessage(e.message || 'Unexpected error');
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
    reset,
  } = useForm<ITenantForm>({
    shouldUseNativeValidation: false,
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (!tenant) return;

    reset({ name: tenant.name, identifier: tenant.identifier, data: JSON.stringify(tenant.data, null, 2) });
  }, [reset, tenant]);

  const onUpdateTenant = async (form) => {
    await updateTenantMutate({
      identifier: tenantIdentifier,
      data: { ...form, ...(form.data ? { data: JSON.parse(form.data) } : {}) },
    });

    onClose();
  };

  const { mutateAsync: deleteTenantMutate, isLoading: isLoadingDelete } = useMutation<
    ITenantEntity,
    { error: string; message: string; statusCode: number },
    { identifier: string }
  >(({ identifier }) => deleteTenant(identifier), {
    onSuccess: async () => {
      await queryClient.refetchQueries({
        predicate: ({ queryKey }) => queryKey.includes(QueryKeys.tenantsList),
      });
      successMessage(`The tenant ${tenant?.name} is deleted`);
    },
    onError: (e: any) => {
      errorMessage(e.message || 'Unexpected error');
    },
  });

  const onDeleteTenant = async (identifier) => {
    await deleteTenantMutate({
      identifier: identifier,
    });

    onClose();
  };

  if (!tenant) {
    return null;
  }

  return (
    <>
      <Sidebar
        isOpened={isOpened}
        onClose={onClose}
        isLoading={isLoadingTenant}
        onSubmit={(e) => {
          handleSubmit(onUpdateTenant)(e);
          e.stopPropagation();
        }}
        customHeader={
          <Stack h={80}>
            <Group position="apart" spacing={120}>
              <Controller
                control={control}
                name="name"
                defaultValue=""
                render={({ field }) => {
                  return (
                    <NameInput
                      {...field}
                      value={field.value}
                      data-test-id="tenant-title-name"
                      placeholder="Enter tenant name"
                      ml={-10}
                    />
                  );
                }}
              />
              <Tooltip label={'Delete tenant'} position="bottom">
                <ActionIcon
                  onClick={() => {
                    setModalIsOpened(true);
                  }}
                  data-test-id="tenant-delete-btn"
                  variant="transparent"
                >
                  <TrashButton>
                    <Trash />
                  </TrashButton>
                </ActionIcon>
              </Tooltip>
            </Group>
          </Stack>
        }
        customFooter={
          <Group position="apart" w="100%">
            <Stack spacing={0}>
              <Text size={'sm'} color={colors.B40}>
                Updated at {format(new Date(tenant.updatedAt), 'dd/MM/yyyy HH:mm')}
              </Text>
              <Text size={'sm'} color={colors.B40}>
                Created at {format(new Date(tenant.createdAt), 'dd/MM/yyyy HH:mm')}
              </Text>
            </Stack>
            <Button
              disabled={!isDirty || !isValid || isLoadingUpdate}
              submit
              loading={isLoadingUpdate}
              data-test-id="update-tenant-sidebar-submit"
            >
              Update
            </Button>
          </Group>
        }
      >
        <TenantFormCommonFields control={control} />
      </Sidebar>
      <Modal
        title={
          <Group spacing={8}>
            <WarningIcon color="#EAA900" width={'23'} height={'20'} />
            <Title size={2} color="#EAA900">
              Delete tenant {tenant.name}?
            </Title>
          </Group>
        }
        opened={isModalOpened}
        onClose={() => setModalIsOpened(false)}
        data-test-id="delete-tenant-modal"
      >
        <Text mb={30} size="lg" color={colors.B60}>
          {'Deleting the tenant will lead to its context being unavailable during trigger event execution.'}
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={() => setModalIsOpened(false)}>
            Cancel
          </Button>
          <Button onClick={() => onDeleteTenant(tenant.identifier)}>{'Delete tenant'}</Button>
        </Group>
      </Modal>
    </>
  );
}
