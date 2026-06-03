// TypeScript types mirroring Motoko backend types

// ─── Primitive aliases ────────────────────────────────────────────────────
export type AppName = string;
export type FieldName = string;
export type FieldType = string;

// ─── Core domain types ───────────────────────────────────────────────────
export interface EntityField {
  name: FieldName;
  field_type: FieldType;
  required: boolean;
  unique: boolean;
}

export interface Relationship {
  field: FieldName;
  target: string;
  rel_type: string;
}

export interface Entity {
  name: string;
  fields: EntityField[];
  relationships: Relationship[];
}

export interface Role {
  name: string;
  permissions: string[];
  parent_role?: string;
}

export interface Page {
  name: string;
  route: string;
  components: string[];
  auth_required: boolean;
  role?: string;
}

export interface BusinessRule {
  rule_id: string;
  description: string;
  condition: string;
  action: string;
}

// ─── Schema types ────────────────────────────────────────────────────────
export interface DbColumn {
  name: string;
  col_type: string;
  constraints: string[];
}

export interface DbTable {
  name: string;
  columns: DbColumn[];
  indexes: string[];
  foreign_keys: string[];
}

export interface DatabaseSchema {
  tables: DbTable[];
}

export interface ApiEndpoint {
  path: string;
  method: string;
  request_body?: string;
  response_type: string;
  auth_required: boolean;
  role?: string;
}

export interface ApiSchema {
  endpoints: ApiEndpoint[];
}

export interface AuthSchema {
  strategy: string;
  providers: string[];
  session_type: string;
  protected_routes: string[];
}

export interface UiComponent {
  name: string;
  component_type: string;
  props: string[];
}

export interface UiPage {
  page_name: string;
  route: string;
  layout: string;
  components: UiComponent[];
  auth_required: boolean;
  role?: string;
}

export interface UiSchema {
  pages: UiPage[];
  navigation: string[];
}

// ─── AppConfig ───────────────────────────────────────────────────────────
export interface AppConfig {
  app_name: AppName;
  entities: Entity[];
  roles: Role[];
  pages: Page[];
  database: DatabaseSchema;
  api: ApiSchema;
  auth: AuthSchema;
  business_rules: BusinessRule[];
}

// ─── Pipeline stage results ──────────────────────────────────────────────
export interface IntentExtractionResult {
  entities: Entity[];
  roles: Role[];
  pages: Page[];
  business_rules: BusinessRule[];
  apis: ApiEndpoint[];
  assumptions: string[];
}

export interface ArchitectureLayer {
  name: string;
  description: string;
}

export interface ArchitectureModel {
  pattern: string;
  layers: ArchitectureLayer[];
}

export interface UserFlow {
  flow_name: string;
  steps: string[];
}

export interface RoleHierarchyEntry {
  role_name: string;
  parent_role?: string;
  permissions: string[];
}

export interface SystemDesignResult {
  architecture_model: ArchitectureModel;
  user_flows: UserFlow[];
  role_hierarchy: RoleHierarchyEntry[];
  application_structure: string[];
}

export interface SchemaGenerationResult {
  ui_schema: UiSchema;
  api_schema: ApiSchema;
  database_schema: DatabaseSchema;
  auth_schema: AuthSchema;
}

export interface RefinementChange {
  change_type: string;
  affected_field: string;
  description: string;
}

export interface RefinementResult {
  config: AppConfig;
  changes_made: RefinementChange[];
}

export interface ValidationError {
  error_code: string;
  message: string;
  field?: string;
  severity: string;
}

export interface ValidationResult {
  is_valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  config?: AppConfig;
}

export interface RepairAction {
  repair_type: string;
  field: string;
  description: string;
}

export interface RepairResult {
  is_valid: boolean;
  repairs_made: RepairAction[];
  final_config: AppConfig;
}

export interface DeploymentCheck {
  check_name: string;
  passed: boolean;
  detail: string;
}

export interface DeploymentReport {
  status: string;
  readiness_score: bigint;
  checks: DeploymentCheck[];
  warnings: string[];
}

export interface CompileResult {
  success: boolean;
  processing_time_ms: bigint;
  assumptions: string[];
  intent?: IntentExtractionResult;
  design?: SystemDesignResult;
  schemas?: SchemaGenerationResult;
  refinement?: RefinementResult;
  validation?: ValidationResult;
  repair?: RepairResult;
  final_config?: AppConfig;
  error_message?: string;
}

export interface FailureType {
  type_name: string;
  count: bigint;
}

export interface MetricsResult {
  total_compilations: bigint;
  successful_compilations: bigint;
  validation_errors_total: bigint;
  repairs_made_total: bigint;
  average_processing_time_ms: bigint;
  failure_types: FailureType[];
}

// ─── Pipeline enums ──────────────────────────────────────────────────────
export enum PipelineStage {
  INTENT = "INTENT",
  DESIGN = "DESIGN",
  SCHEMAS = "SCHEMAS",
  REFINEMENT = "REFINEMENT",
  VALIDATION = "VALIDATION",
  REPAIR = "REPAIR",
  RUNTIME = "RUNTIME",
}

export enum PipelineStageStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  SKIPPED = "SKIPPED",
}

// ─── UI-level pipeline stage metadata ───────────────────────────────────
export interface PipelineStageInfo {
  stage: PipelineStage;
  label: string;
  description: string;
  status: PipelineStageStatus;
  duration_ms?: number;
}
