import { Logger } from '@nestjs/common';

import { InMemoryProviderService } from './in-memory-provider.service';
import {
  getClusterProvider,
  getSingleInstanceProvider,
  InMemoryProviderConfig,
  IProviderCluster,
  IProviderRedis,
  IProviders,
  IRedisProviderConfig,
  isProviderAllowed,
} from './providers';
import {
  IEnvironmentConfigOptions,
  InMemoryProviderEnum,
  InMemoryProviderClient,
  IProviderClusterConfigOptions,
  ScanStream,
} from './types';

import { GetIsInMemoryClusterModeEnabled } from '../../usecases';

const LOG_CONTEXT = 'CacheInMemoryProviderService';

export class CacheInMemoryProviderService {
  public inMemoryProviderService: InMemoryProviderService;
  public isCluster: boolean;
  private getIsInMemoryClusterModeEnabled: GetIsInMemoryClusterModeEnabled;
  private loadedProvider: IProviderCluster | IProviderRedis;

  constructor() {
    this.getIsInMemoryClusterModeEnabled =
      new GetIsInMemoryClusterModeEnabled();

    const { provider, config } = this.selectProvider();
    this.loadedProvider = provider;
    this.isCluster = this.loadedProvider.isCluster;

    this.inMemoryProviderService = new InMemoryProviderService(
      this.loadedProvider,
      config,
      this.isCluster
    );
  }

  private getCacheConfigOptions(): IProviderClusterConfigOptions {
    const enableAutoPipelining =
      process.env.REDIS_CACHE_ENABLE_AUTOPIPELINING === 'true';
    /*
     *  Disabled in Prod as affects performance
     */
    const showFriendlyErrorStack = process.env.NODE_ENV !== 'production';

    return {
      enableAutoPipelining,
      showFriendlyErrorStack,
    };
  }

  private getCacheProvider(): IEnvironmentConfigOptions {
    const providerId = process.env.CACHE_PROVIDER_ID;
    const host = process.env.CACHE_HOST;
    const password = process.env.CACHE_PASSWORD;
    const ports = process.env.CACHE_PORTS;
    const username = process.env.CACHE_USERNAME;

    return {
      providerId,
      host,
      password,
      ports,
      username,
    };
  }

  /**
   * New way of selecting provider with priority to select through environment variables
   * and fallback to the previous way retro compatible
   */
  private selectProvider(): {
    provider: IProviders;
    config: InMemoryProviderConfig;
  } {
    const { providerId, host, password, ports, username } =
      this.getCacheProvider();

    if (isProviderAllowed(providerId)) {
      const envProvider = getClusterProvider(
        providerId as InMemoryProviderEnum
      );

      const envProviderConfig = envProvider.getConfig(
        { host, ports, username, password },
        this.getCacheConfigOptions()
      );

      if (envProvider.validate(envProviderConfig)) {
        return {
          provider: envProvider,
          config: envProviderConfig,
        };
      }
    }

    return this.selectProviderRetroCompatible();
  }

  /**
   * Rules for the provider selection:
   * - For our self hosted users we assume all of them have a single node Redis
   * instance. Only if they have set up the Cluster mode and the right config
   * will execute a different provider.
   * - For Novu we will use Elasticache. We fallback to a Redis Cluster configuration
   * if Elasticache not configured properly. If Redis Cluster is wrong too, we will
   * fall back to Redis single instance.
   */
  private selectProviderRetroCompatible(): {
    provider: IProviders;
    config: IRedisProviderConfig | InMemoryProviderConfig;
  } {
    if (this.isClusterMode()) {
      const providerIds = [
        InMemoryProviderEnum.ELASTICACHE,
        InMemoryProviderEnum.REDIS_CLUSTER,
      ];

      let selectedProvider = undefined;
      let selectedProviderConfig = undefined;
      for (const providerId of providerIds) {
        const clusterProvider = getClusterProvider(providerId);
        const clusterProviderConfig = clusterProvider.getConfig(
          undefined,
          this.getCacheConfigOptions()
        );

        if (clusterProvider.validate(clusterProviderConfig)) {
          selectedProvider = clusterProvider;
          selectedProviderConfig = clusterProviderConfig;
          break;
        }
      }

      if (selectedProvider) {
        return {
          provider: selectedProvider,
          config: selectedProviderConfig,
        };
      }
    }

    const singleInstance = getSingleInstanceProvider();

    return {
      provider: singleInstance,
      config: singleInstance.getConfig(undefined, this.getCacheConfigOptions()),
    };
  }

  private isClusterMode(): boolean {
    const isClusterModeEnabled = this.getIsInMemoryClusterModeEnabled.execute();

    Logger.log(
      `Cluster mode ${
        isClusterModeEnabled ? 'IS' : 'IS NOT'
      } enabled for ${LOG_CONTEXT}`,
      LOG_CONTEXT
    );

    return isClusterModeEnabled;
  }

  public async initialize(): Promise<void> {
    await this.inMemoryProviderService.delayUntilReadiness();
  }

  public getClient(): InMemoryProviderClient {
    return this.inMemoryProviderService.inMemoryProviderClient;
  }

  public getClientStatus(): string {
    return this.getClient().status;
  }

  public getTtl(): number {
    return this.inMemoryProviderService.inMemoryProviderConfig.ttl;
  }

  public inMemoryScan(pattern: string): ScanStream {
    return this.inMemoryProviderService.inMemoryScan(pattern);
  }

  public isReady(): boolean {
    return this.inMemoryProviderService.isClientReady();
  }

  public providerInUseIsInClusterMode(): boolean {
    return this.loadedProvider.provider !== InMemoryProviderEnum.REDIS;
  }

  public async shutdown(): Promise<void> {
    await this.inMemoryProviderService.shutdown();
  }
}
