import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RefinementResult {
    changes_made: Array<RefinementChange>;
    config: AppConfig;
}
export interface Relationship {
    field: FieldName;
    rel_type: string;
    target: string;
}
export interface MetricsResult {
    failure_types: Array<FailureType>;
    total_compilations: bigint;
    repairs_made_total: bigint;
    successful_compilations: bigint;
    average_processing_time_ms: bigint;
    validation_errors_total: bigint;
}
export interface AppConfig {
    api: ApiSchema;
    auth: AuthSchema;
    entities: Array<Entity>;
    database: DatabaseSchema;
    app_name: AppName;
    pages: Array<Page>;
    roles: Array<Role>;
    business_rules: Array<BusinessRule>;
}
export interface RepairAction {
    field: string;
    description: string;
    repair_type: string;
}
export interface UiPage {
    page_name: string;
    role?: string;
    layout: string;
    components: Array<UiComponent>;
    route: string;
    auth_required: boolean;
}
export type AppName = string;
export interface ArchitectureLayer {
    name: string;
    description: string;
}
export interface DeploymentCheck {
    detail: string;
    check_name: string;
    passed: boolean;
}
export interface AuthSchema {
    protected_routes: Array<string>;
    strategy: string;
    providers: Array<string>;
    session_type: string;
}
export interface Role {
    permissions: Array<string>;
    name: string;
    parent_role?: string;
}
export interface UserFlow {
    steps: Array<string>;
    flow_name: string;
}
export interface SchemaGenerationResult {
    auth_schema: AuthSchema;
    api_schema: ApiSchema;
    ui_schema: UiSchema;
    database_schema: DatabaseSchema;
}
export interface RepairResult {
    repairs_made: Array<RepairAction>;
    is_valid: boolean;
    final_config: AppConfig;
}
export interface FailureType {
    type_name: string;
    count: bigint;
}
export interface Page {
    name: string;
    role?: string;
    components: Array<string>;
    route: string;
    auth_required: boolean;
}
export interface Entity {
    name: string;
    fields: Array<EntityField>;
    relationships: Array<Relationship>;
}
export interface DbTable {
    foreign_keys: Array<string>;
    name: string;
    indexes: Array<string>;
    columns: Array<DbColumn>;
}
export interface DatabaseSchema {
    tables: Array<DbTable>;
}
export interface CompileResult {
    repair?: RepairResult;
    refinement?: RefinementResult;
    error_message?: string;
    schemas?: SchemaGenerationResult;
    design?: SystemDesignResult;
    processing_time_ms: bigint;
    intent?: IntentExtractionResult;
    assumptions: Array<string>;
    success: boolean;
    validation?: ValidationResult;
    final_config?: AppConfig;
}
export interface BusinessRule {
    action: string;
    description: string;
    rule_id: string;
    condition: string;
}
export interface UiComponent {
    name: string;
    component_type: string;
    props: Array<string>;
}
export interface ApiSchema {
    endpoints: Array<ApiEndpoint>;
}
export interface DeploymentReport {
    status: string;
    warnings: Array<string>;
    checks: Array<DeploymentCheck>;
    readiness_score: bigint;
}
export type FieldName = string;
export interface ArchitectureModel {
    pattern: string;
    layers: Array<ArchitectureLayer>;
}
export interface DbColumn {
    constraints: Array<string>;
    name: string;
    col_type: string;
}
export interface RoleHierarchyEntry {
    permissions: Array<string>;
    role_name: string;
    parent_role?: string;
}
export interface IntentExtractionResult {
    apis: Array<ApiEndpoint>;
    entities: Array<Entity>;
    assumptions: Array<string>;
    pages: Array<Page>;
    roles: Array<Role>;
    business_rules: Array<BusinessRule>;
}
export interface UiSchema {
    navigation: Array<string>;
    pages: Array<UiPage>;
}
export interface ValidationError {
    field?: string;
    message: string;
    severity: string;
    error_code: string;
}
export interface RefinementChange {
    affected_field: string;
    description: string;
    change_type: string;
}
export type FieldType = string;
export interface ValidationResult {
    errors: Array<ValidationError>;
    is_valid: boolean;
    warnings: Array<ValidationError>;
    config?: AppConfig;
}
export interface SystemDesignResult {
    application_structure: Array<string>;
    role_hierarchy: Array<RoleHierarchyEntry>;
    architecture_model: ArchitectureModel;
    user_flows: Array<UserFlow>;
}
export interface ApiEndpoint {
    method: string;
    response_type: string;
    path: string;
    role?: string;
    auth_required: boolean;
    request_body?: string;
}
export interface EntityField {
    field_type: FieldType;
    name: FieldName;
    unique: boolean;
    required: boolean;
}
export interface backendInterface {
    compile(prompt: string): Promise<CompileResult>;
    execute(config_json: string): Promise<DeploymentReport>;
    getMetrics(): Promise<MetricsResult>;
    repair(config_json: string): Promise<RepairResult>;
    runBenchmark(prompt_index: bigint): Promise<CompileResult>;
    validate(config_json: string): Promise<ValidationResult>;
}
