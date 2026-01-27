// API Types based on OpenAPI spec

export interface ApiError {
  error: string;
  code: number;
  details?: Record<string, unknown>;
}

export interface Pagination {
  limit: number;
  offset: number;
  has_more: boolean;
  next_offset: number | null;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Session {
  token: string;
  user: User;
}

export interface PersonalAccessToken {
  id: string;
  name: string;
  token?: string; // Only returned on creation
  last_used_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  is_default: boolean;
  sharing_type: 'private' | 'internal' | 'public';
  owner_id: string;
  scopes_count?: number;
  cards_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Scope {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  position: number;
  cards_count: number;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  workspace_id: string;
  scope_id: string;
  github_repo_id: string | null;
  name: string;
  content: string;
  position: number;
  github_repo: GithubRepoSummary | null;
  created_at: string;
  updated_at: string;
}

export interface GithubRepoSummary {
  id: string;
  repository_name: string;
  repository_full_name: string;
  sync_state: string;
}

export interface GithubNamespace {
  id: string;
  installation_id: string;
  name: string;
  github_account_type: 'User' | 'Organization';
  github_account_login: string;
  repos_count: number;
  created_at: string;
}

export interface GithubRepo {
  id: string;
  github_namespace_id: string;
  repository_id: number;
  repository_name: string;
  repository_full_name: string;
  default_branch: string;
  sync_state: 'unknown' | 'good_config' | 'bad_config' | 'no_config' | 'failed';
  last_synced_at: string | null;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: Pagination;
}

// Request types
export interface CreateWorkspaceRequest {
  workspace: {
    name: string;
    description?: string;
    sharing_type?: 'private' | 'internal' | 'public';
  };
}

export interface UpdateWorkspaceRequest {
  workspace: {
    name?: string;
    description?: string;
    sharing_type?: 'private' | 'internal' | 'public';
  };
}

export interface CreateScopeRequest {
  scope: {
    name: string;
    description?: string;
    position?: number;
  };
}

export interface UpdateScopeRequest {
  scope: {
    name?: string;
    description?: string;
    position?: number;
  };
}

export interface CreateCardRequest {
  name: string;
  content?: string;
  scope_id?: string;
  github_repo_id?: string;
  position?: number;
}

export interface UpdateCardRequest {
  name?: string;
  content?: string;
  scope_id?: string;
  position?: number;
}

export interface BulkCardOperation {
  action: 'create' | 'update' | 'delete';
  id?: string;
  github_repo_id?: string;
  scope_id?: string;
  name?: string;
  content?: string;
  position?: number;
  attributes?: UpdateCardRequest;
}

export interface OrganizeWorkspaceRequest {
  scopes?: Array<{ id: string; position: number }>;
  cards?: Array<{ id: string; scope_id?: string; position: number }>;
}
