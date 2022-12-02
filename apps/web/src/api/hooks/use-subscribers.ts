import { useQuery } from 'react-query';
import { ISubscriber } from '@novu/shared';
import { getSubscribersList } from '../subscribers';
import { useEnvController } from '../../store/use-env-controller';

export function useSubscribers(page = 0, limit = 10) {
  const { environment } = useEnvController();
  const { data, isLoading } = useQuery<{ data: ISubscriber[]; totalCount: number; pageSize: number }>(
    ['subscribersList', environment?._id, page, limit],
    () => getSubscribersList(page, limit),
    {
      keepPreviousData: true,
    }
  );

  return {
    subscribers: data?.data,
    loading: isLoading,
    totalCount: data?.totalCount,
    pageSize: data?.pageSize,
  };
}
