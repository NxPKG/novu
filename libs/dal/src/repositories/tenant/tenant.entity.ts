import { TenantCustomData } from '@novu/shared';
import { TenantId } from './types';
import { EnvironmentId } from '../environment';
import { TransformEntityToDbModel } from '../../types/helpers';
import { OrganizationId } from '../organization';

export class TenantEntity {
  _id: TenantId;

  identifier: string;

  name?: string;

  deleted?: boolean;

  createdAt: string;

  updatedAt: string;

  data?: TenantCustomData;

  _environmentId: EnvironmentId;

  _organizationId: OrganizationId;
}

export type TenantDBModel = TransformEntityToDbModel<TenantEntity>;
