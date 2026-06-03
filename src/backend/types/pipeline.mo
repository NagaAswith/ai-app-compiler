import Common "common";

module {
  // Stage 1: Intent Extraction
  public type IntentExtractionResult = {
    entities : [Common.Entity];
    roles : [Common.Role];
    pages : [Common.Page];
    business_rules : [Common.BusinessRule];
    apis : [Common.ApiEndpoint];
    assumptions : [Text];
  };

  // Stage 2: System Design
  public type ArchitectureLayer = {
    name : Text; // "presentation", "business", "data"
    description : Text;
  };

  public type ArchitectureModel = {
    layers : [ArchitectureLayer];
    pattern : Text; // "MVC", "MVVM", etc.
  };

  public type UserFlow = {
    flow_name : Text;
    steps : [Text];
  };

  public type RoleHierarchyEntry = {
    role_name : Text;
    parent_role : ?Text;
    permissions : [Text];
  };

  public type SystemDesignResult = {
    architecture_model : ArchitectureModel;
    user_flows : [UserFlow];
    role_hierarchy : [RoleHierarchyEntry];
    application_structure : [Text]; // module names
  };

  // Stage 3: Schema Generation
  public type UiComponent = {
    name : Text;
    component_type : Text;
    props : [Text];
  };

  public type UiPage = {
    page_name : Text;
    route : Text;
    components : [UiComponent];
    layout : Text;
    auth_required : Bool;
    role : ?Text;
  };

  public type UiSchema = {
    pages : [UiPage];
    navigation : [Text];
  };

  public type SchemaGenerationResult = {
    ui_schema : UiSchema;
    api_schema : Common.ApiSchema;
    database_schema : Common.DatabaseSchema;
    auth_schema : Common.AuthSchema;
  };

  // Stage 4: Refinement
  public type RefinementChange = {
    change_type : Text; // "missing_ref_resolved", "duplicate_removed", "naming_fixed", "relation_repaired"
    description : Text;
    affected_field : Text;
  };

  public type RefinementResult = {
    config : Common.AppConfig;
    changes_made : [RefinementChange];
  };

  // Stage 5: Validation
  public type ValidationError = {
    error_code : Text;
    message : Text;
    field : ?Text;
    severity : Text; // "error", "warning"
  };

  public type ValidationResult = {
    is_valid : Bool;
    errors : [ValidationError];
    warnings : [ValidationError];
    config : ?Common.AppConfig;
  };

  // Stage 6: Repair
  public type RepairAction = {
    repair_type : Text; // "added_missing_key", "removed_unknown_field", "coerced_type", "removed_dangling_ref"
    description : Text;
    field : Text;
  };

  public type RepairResult = {
    repairs_made : [RepairAction];
    final_config : Common.AppConfig;
    is_valid : Bool;
  };

  // Deployment check
  public type DeploymentCheck = {
    check_name : Text;
    passed : Bool;
    detail : Text;
  };

  public type DeploymentReport = {
    status : Text; // "ready", "partial", "failed"
    checks : [DeploymentCheck];
    readiness_score : Nat; // 0-100
    warnings : [Text];
  };

  // Full pipeline result
  public type CompileResult = {
    success : Bool;
    intent : ?IntentExtractionResult;
    design : ?SystemDesignResult;
    schemas : ?SchemaGenerationResult;
    refinement : ?RefinementResult;
    validation : ?ValidationResult;
    repair : ?RepairResult;
    final_config : ?Common.AppConfig;
    error_message : ?Text;
    processing_time_ms : Nat;
    assumptions : [Text];
  };

  // Metrics
  public type MetricsResult = {
    total_compilations : Nat;
    successful_compilations : Nat;
    validation_errors_total : Nat;
    repairs_made_total : Nat;
    average_processing_time_ms : Nat;
    failure_types : [Common.FailureType];
  };

  // Internal mutable metrics state (not shared directly)
  public type MetricsState = {
    var total_compilations : Nat;
    var successful_compilations : Nat;
    var validation_errors_total : Nat;
    var repairs_made_total : Nat;
    var total_processing_time_ms : Nat;
    var failure_type_vague : Nat;
    var failure_type_missing : Nat;
    var failure_type_contradictory : Nat;
    var failure_type_validation : Nat;
    var failure_type_repair : Nat;
  };
};
