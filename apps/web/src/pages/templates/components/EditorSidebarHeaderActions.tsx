import { Group } from '@mantine/core';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FilterPartTypeEnum } from '@novu/shared';

import { Conditions, IConditions } from '../../../components/conditions';
import { Condition, ConditionPlus, ConditionsFile, Trash, VariantPlus } from '../../../design-system/icons';
import { useFilterPartsList } from '../hooks/useFilterPartsList';
import { useStepFormPath } from '../hooks/useStepFormPath';
import { IForm } from './formTypes';
import { When } from '../../../components/utils/When';
import { useStepInfoPath } from '../hooks/useStepInfoPath';
import { useTemplateEditorForm } from './TemplateEditorFormProvider';
import { useBasePath } from '../hooks/useBasePath';
import { ActionButton } from '../../../design-system/button/ActionButton';
import { useEnvController } from '../../../hooks';

export const EditorSidebarHeaderActions = () => {
  const { watch, setValue } = useFormContext<IForm>();
  const { addVariant } = useTemplateEditorForm();
  const { readonly: isReadonly } = useEnvController();
  const { stepUuid = '' } = useParams<{
    stepUuid: string;
  }>();
  const basePath = useBasePath();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [areConditionsOpened, setConditionsOpened] = useState(() => pathname.endsWith('/conditions'));

  const stepFormPath = useStepFormPath();
  const filterPartsList = useFilterPartsList();
  const { isUnderTheStepPath, isUnderVariantsListPath } = useStepInfoPath();

  const filters = watch(`${stepFormPath}.filters.0.children`);
  const conditions = watch(`${stepFormPath}.filters`);
  const name = watch(`${stepFormPath}.name`);

  const PlusIcon = isUnderVariantsListPath ? ConditionsFile : ConditionPlus;
  const ConditionsIcon = isUnderVariantsListPath ? ConditionsFile : Condition;
  const hasNoFilters = (filters && filters?.length === 0) || !filters;

  const onAddVariant = () => {
    const variant = addVariant(stepUuid);
    if (variant) {
      navigate(basePath + `/${variant?.template.type}/${stepUuid}/variants/${variant?.uuid}/conditions`);
    }
  };

  const updateConditions = (newConditions: IConditions[]) => {
    setValue(`${stepFormPath}.filters`, newConditions, { shouldDirty: true });
  };

  const onConditionsClose = () => {
    setConditionsOpened(false);

    const isConditionUrl = pathname.endsWith('/conditions');
    if (isConditionUrl) {
      const newPath = pathname.replace('/conditions', '');
      navigate(newPath, { replace: true });
    }
  };

  return (
    <>
      <Group noWrap spacing={12} ml={'auto'} sx={{ alignItems: 'flex-start' }}>
        <When truthy={isUnderTheStepPath || isUnderVariantsListPath}>
          <ActionButton tooltip="Add variant" onClick={onAddVariant} Icon={VariantPlus} />
        </When>
        <When truthy={hasNoFilters}>
          <ActionButton
            tooltip={`Add ${isUnderVariantsListPath ? 'group' : ''} conditions`}
            onClick={() => setConditionsOpened(true)}
            Icon={PlusIcon}
            data-test-id="editor-sidebar-add-conditions"
          />
        </When>
        <When truthy={!hasNoFilters}>
          <ActionButton
            tooltip={`Edit ${isUnderVariantsListPath ? 'group' : ''} conditions`}
            text={`${filters?.length ?? ''}`}
            onClick={() => setConditionsOpened(true)}
            Icon={ConditionsIcon}
            data-test-id="editor-sidebar-edit-conditions"
          />
        </When>
        <ActionButton tooltip="Delete step" onClick={() => {}} Icon={Trash} data-test-id="editor-sidebar-delete" />
      </Group>
      {areConditionsOpened && (
        <Conditions
          isOpened={areConditionsOpened}
          isReadonly={isReadonly}
          name={name ?? ''}
          onClose={onConditionsClose}
          updateConditions={updateConditions}
          conditions={conditions}
          filterPartsList={filterPartsList}
          defaultFilter={FilterPartTypeEnum.PAYLOAD}
        />
      )}
    </>
  );
};
