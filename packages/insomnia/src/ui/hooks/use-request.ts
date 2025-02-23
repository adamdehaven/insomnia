
import { useFetcher, useParams } from 'react-router-dom';

import type { GrpcRequest } from '../../models/grpc-request';
import type { GrpcRequestMeta } from '../../models/grpc-request-meta';
import type { Request } from '../../models/request';
import type { RequestGroup } from '../../models/request-group';
import type { RequestGroupMeta } from '../../models/request-group-meta';
import type { RequestMeta } from '../../models/request-meta';
import type { Settings } from '../../models/settings';
import type { WebSocketRequest } from '../../models/websocket-request';
import type { WorkspaceMeta } from '../../models/workspace-meta';

export const useRequestPatcher = () => {
  const { organizationId, projectId, workspaceId } = useParams<{ organizationId: string; projectId: string; workspaceId: string }>();
  const fetcher = useFetcher();
  return (requestId: string, patch: Partial<GrpcRequest> | Partial<Request> | Partial<WebSocketRequest>) => {
    fetcher.submit(JSON.stringify(patch), {
      action: `/organization/${organizationId}/project/${projectId}/workspace/${workspaceId}/debug/request/${requestId}/update`,
      method: 'post',
      encType: 'application/json',
    });
  };
};

export const useRequestMetaPatcher = () => {
  const { organizationId, projectId, workspaceId } = useParams<{ organizationId: string; projectId: string; workspaceId: string }>();
  const fetcher = useFetcher();
  return (requestId: string, patch: Partial<GrpcRequestMeta> | Partial<RequestMeta>) => {
    fetcher.submit(patch, {
      action: `/organization/${organizationId}/project/${projectId}/workspace/${workspaceId}/debug/request/${requestId}/update-meta`,
      method: 'post',
      encType: 'application/json',
    });
  };
};

export const useRequestGroupPatcher = () => {
  const { organizationId, projectId, workspaceId } = useParams<{ organizationId: string; projectId: string; workspaceId: string }>();
  const fetcher = useFetcher();
  return (requestGroupId: string, patch: Partial<RequestGroup>) => {
    fetcher.submit(JSON.stringify(patch), {
      action: `/organization/${organizationId}/project/${projectId}/workspace/${workspaceId}/debug/request-group/${requestGroupId}/update`,
      method: 'post',
      encType: 'application/json',
    });
  };
};

export const useRequestGroupMetaPatcher = () => {
  const { organizationId, projectId, workspaceId } = useParams<{ organizationId: string; projectId: string; workspaceId: string }>();
  const fetcher = useFetcher();
  return (requestGroupId: string, patch: Partial<RequestGroupMeta>) => {
    fetcher.submit(patch, {
      action: `/organization/${organizationId}/project/${projectId}/workspace/${workspaceId}/debug/request-group/${requestGroupId}/update-meta`,
      method: 'post',
      encType: 'application/json',
    });
  };
};

export const useSettingsPatcher = () => {
  const fetcher = useFetcher();
  return (patch: Partial<Settings>) => {
    fetcher.submit(JSON.stringify(patch), {
      action: '/settings/update',
      method: 'post',
      encType: 'application/json',
    });
  };
};

export const useWorkspaceMetaPatcher = () => {
  const { organizationId, projectId } = useParams<{ organizationId: string; projectId: string }>();
  const fetcher = useFetcher();
  return (workspaceId: string, patch: Partial<WorkspaceMeta>) => {
    fetcher.submit(patch, {
      action: `/organization/${organizationId}/project/${projectId}/workspace/${workspaceId}/update-meta`,
      method: 'post',
      encType: 'application/json',
    });
  };
};

export type CreateRequestType = 'HTTP' | 'gRPC' | 'GraphQL' | 'WebSocket' | 'Event Stream' | 'From Curl';
