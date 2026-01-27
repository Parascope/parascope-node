import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  ApiResponse,
  ApiError,
  Workspace,
  Scope,
  Card,
  GithubNamespace,
  GithubRepo,
  PersonalAccessToken,
  Session,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  CreateScopeRequest,
  UpdateScopeRequest,
  CreateCardRequest,
  UpdateCardRequest,
  BulkCardOperation,
  OrganizeWorkspaceRequest,
} from './types';

export interface ParascopeClientConfig {
  token: string;
  baseURL?: string;
}

export class ParascopeClient {
  private client: AxiosInstance;

  constructor(config: ParascopeClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL || 'https://app.parascope.dev/api/v1',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
    });

    // Error handling interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.data) {
          const apiError = error.response.data;
          throw new Error(
            `API Error (${apiError.code}): ${apiError.error}${
              apiError.details ? '\n' + JSON.stringify(apiError.details, null, 2) : ''
            }`
          );
        }
        throw error;
      }
    );
  }

  // ===== Authentication =====

  async login(email: string, password: string): Promise<Session> {
    const response = await this.client.post<ApiResponse<Session>>('/sessions', {
      email,
      password,
    });
    return response.data.data;
  }

  async logout(): Promise<void> {
    await this.client.delete('/sessions');
  }

  // ===== Personal Access Tokens =====

  async listTokens(): Promise<PersonalAccessToken[]> {
    const response = await this.client.get<ApiResponse<PersonalAccessToken[]>>('/tokens');
    return response.data.data;
  }

  async createToken(name: string, expiresAt?: string): Promise<PersonalAccessToken> {
    const response = await this.client.post<ApiResponse<PersonalAccessToken>>('/tokens', {
      name,
      expires_at: expiresAt,
    });
    return response.data.data;
  }

  async revokeToken(id: string): Promise<void> {
    await this.client.delete(`/tokens/${id}`);
  }

  // ===== Workspaces =====

  async listWorkspaces(params?: {
    q?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Workspace[]>> {
    const response = await this.client.get<ApiResponse<Workspace[]>>('/workspaces', { params });
    return response.data;
  }

  async getWorkspace(id: string): Promise<Workspace> {
    const response = await this.client.get<ApiResponse<Workspace>>(`/workspaces/${id}`);
    return response.data.data;
  }

  async createWorkspace(request: CreateWorkspaceRequest): Promise<Workspace> {
    const response = await this.client.post<ApiResponse<Workspace>>('/workspaces', request);
    return response.data.data;
  }

  async updateWorkspace(id: string, request: UpdateWorkspaceRequest): Promise<Workspace> {
    const response = await this.client.patch<ApiResponse<Workspace>>(
      `/workspaces/${id}`,
      request
    );
    return response.data.data;
  }

  async deleteWorkspace(id: string): Promise<void> {
    await this.client.delete(`/workspaces/${id}`);
  }

  // ===== Scopes =====

  async listScopes(workspaceId: string): Promise<Scope[]> {
    const response = await this.client.get<ApiResponse<Scope[]>>(
      `/workspaces/${workspaceId}/scopes`
    );
    return response.data.data;
  }

  async createScope(workspaceId: string, request: CreateScopeRequest): Promise<Scope> {
    const response = await this.client.post<ApiResponse<Scope>>('/scopes', request, {
      params: { workspace_id: workspaceId },
    });
    return response.data.data;
  }

  async updateScope(id: string, request: UpdateScopeRequest): Promise<Scope> {
    const response = await this.client.patch<ApiResponse<Scope>>(`/scopes/${id}`, request);
    return response.data.data;
  }

  async deleteScope(id: string): Promise<void> {
    await this.client.delete(`/scopes/${id}`);
  }

  // ===== Cards =====

  async listCards(
    workspaceId: string,
    params?: {
      scope_id?: string;
      q?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<ApiResponse<Card[]>> {
    const response = await this.client.get<ApiResponse<Card[]>>(
      `/workspaces/${workspaceId}/cards`,
      { params }
    );
    return response.data;
  }

  async createCard(workspaceId: string, request: CreateCardRequest): Promise<Card> {
    const response = await this.client.post<ApiResponse<Card>>('/cards', request, {
      params: { workspace_id: workspaceId },
    });
    return response.data.data;
  }

  async updateCard(id: string, request: UpdateCardRequest): Promise<Card> {
    const response = await this.client.patch<ApiResponse<Card>>(`/cards/${id}`, request);
    return response.data.data;
  }

  async deleteCard(id: string): Promise<void> {
    await this.client.delete(`/cards/${id}`);
  }

  async bulkCards(
    workspaceId: string,
    operations: BulkCardOperation[]
  ): Promise<{ action: string; success: boolean; data?: Card; error?: string }[]> {
    const response = await this.client.post<
      ApiResponse<{ action: string; success: boolean; data?: Card; error?: string }[]>
    >('/cards/bulk', { operations }, { params: { workspace_id: workspaceId } });
    return response.data.data;
  }

  // ===== Organization =====

  async organizeWorkspace(
    workspaceId: string,
    request: OrganizeWorkspaceRequest
  ): Promise<{ message: string; scopes_updated: number; cards_updated: number }> {
    const response = await this.client.patch<
      ApiResponse<{ message: string; scopes_updated: number; cards_updated: number }>
    >(`/workspaces/${workspaceId}/organize`, request);
    return response.data.data;
  }

  // ===== GitHub =====

  async listGithubNamespaces(): Promise<GithubNamespace[]> {
    const response = await this.client.get<ApiResponse<GithubNamespace[]>>('/github/namespaces');
    return response.data.data;
  }

  async listGithubRepos(params?: {
    namespace_id?: string;
    q?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<GithubRepo[]>> {
    const response = await this.client.get<ApiResponse<GithubRepo[]>>('/github/repos', {
      params,
    });
    return response.data;
  }

  async syncGithubNamespace(
    installationId: string
  ): Promise<{ message: string; installation_id: string; namespace_id: string }> {
    const response = await this.client.post<
      ApiResponse<{ message: string; installation_id: string; namespace_id: string }>
    >('/github/sync', { installation_id: installationId });
    return response.data.data;
  }
}
