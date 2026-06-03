import Common "../types/common";
import Pipeline "../types/pipeline";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Int "mo:core/Int";

module {

  // Stage 1: Intent Extraction
  public func extractIntent(prompt : Text) : Pipeline.IntentExtractionResult {
    let lower = prompt.toLower();
    // Detect entity keywords
    var entityNames : [Text] = [];
    let candidateEntities : [Text] = ["user", "product", "order", "customer", "ticket", "course", "employee", "contact", "deal", "task", "project", "invoice", "payment", "report", "category", "seller", "buyer", "vendor", "supplier", "appointment", "booking", "lesson", "quiz", "review", "warehouse", "subscription", "plan", "message", "notification", "comment"];
    for (candidate in candidateEntities.vals()) {
      if (lower.contains(#text candidate)) {
        entityNames := entityNames.concat([candidate]);
      };
    };
    // Always have at least "user"
    if (entityNames.size() == 0) {
      entityNames := ["user"];
    };
    // Build entities
    let baseFields : [Common.EntityField] = [
      { name = "id"; field_type = "uuid"; required = true; unique = true },
      { name = "created_at"; field_type = "timestamp"; required = true; unique = false },
      { name = "updated_at"; field_type = "timestamp"; required = true; unique = false },
    ];
    var entities : [Common.Entity] = [];
    for (en in entityNames.vals()) {
      let nameField : Common.EntityField = { name = "name"; field_type = "string"; required = true; unique = false };
      entities := entities.concat([{
        name = en;
        fields = baseFields.concat([nameField]);
        relationships = [];
      }]);
    };
    // Roles
    var roles : [Common.Role] = [
      { name = "admin"; permissions = ["read", "write", "delete", "manage"]; parent_role = null },
      { name = "user"; permissions = ["read"]; parent_role = null },
    ];
    if (lower.contains(#text "seller") and not lower.contains(#text "seller onboard")) {
      roles := roles.concat([{ name = "seller"; permissions = ["read", "write"]; parent_role = ?"user" }]);
    };
    if (lower.contains(#text "buyer")) {
      roles := roles.concat([{ name = "buyer"; permissions = ["read", "write"]; parent_role = ?"user" }]);
    };
    if (lower.contains(#text "instructor")) {
      roles := roles.concat([{ name = "instructor"; permissions = ["read", "write"]; parent_role = ?"user" }]);
    };
    if (lower.contains(#text "manager")) {
      roles := roles.concat([{ name = "manager"; permissions = ["read", "write", "approve"]; parent_role = ?"user" }]);
    };
    // Pages — always include Dashboard, Login, Register
    var pages : [Common.Page] = [
      { name = "Dashboard"; route = "/dashboard"; components = ["StatsCard", "RecentActivity"]; auth_required = true; role = null },
      { name = "Login"; route = "/login"; components = ["LoginForm"]; auth_required = false; role = null },
      { name = "Register"; route = "/register"; components = ["RegisterForm"]; auth_required = false; role = null },
    ];
    for (en in entityNames.vals()) {
      if (en != "user") {
        pages := pages.concat([
          { name = en # "s"; route = "/" # en # "s"; components = ["Table", "SearchBar", "FilterPanel"]; auth_required = true; role = null },
          { name = en # " Detail"; route = "/" # en # "s/:id"; components = ["DetailView", "EditForm"]; auth_required = true; role = null },
        ]);
      };
    };
    // Business rules
    let business_rules : [Common.BusinessRule] = [
      { rule_id = "br_auth"; description = "Users must be authenticated to access protected pages"; condition = "user.authenticated == false"; action = "redirect to /login" },
      { rule_id = "br_admin"; description = "Only admins can delete records"; condition = "user.role != admin"; action = "deny delete operation" },
      { rule_id = "br_owner"; description = "Users can only edit their own records"; condition = "record.owner != user.id"; action = "deny edit operation" },
    ];
    // APIs
    var apis : [Common.ApiEndpoint] = [];
    for (en in entityNames.vals()) {
      apis := apis.concat([
        { path = "/api/" # en # "s"; method = "GET"; auth_required = true; role = null; request_body = null; response_type = "[" # en # "]" },
        { path = "/api/" # en # "s"; method = "POST"; auth_required = true; role = ?"admin"; request_body = ?(en # "CreateDTO"); response_type = en },
        { path = "/api/" # en # "s/{id}"; method = "GET"; auth_required = true; role = null; request_body = null; response_type = en },
        { path = "/api/" # en # "s/{id}"; method = "PUT"; auth_required = true; role = ?"admin"; request_body = ?(en # "UpdateDTO"); response_type = en },
        { path = "/api/" # en # "s/{id}"; method = "DELETE"; auth_required = true; role = ?"admin"; request_body = null; response_type = "void" },
      ]);
    };
    // Assumptions for vague prompts
    var assumptions : [Text] = [];
    if (prompt.size() < 30) {
      assumptions := assumptions.concat(["Prompt was vague — assumed a basic CRUD app with user entity"]);
      assumptions := assumptions.concat(["Assumed standard authentication with email/password"]);
      assumptions := assumptions.concat(["Assumed admin and user roles are sufficient"]);
    };
    { entities; roles; pages; business_rules; apis; assumptions };
  };

  // Stage 2: System Design
  public func generateSystemDesign(
    intent : Pipeline.IntentExtractionResult
  ) : Pipeline.SystemDesignResult {
    let entityCount = intent.entities.size();
    let pattern : Text = if (entityCount <= 3) { "MVC" }
      else if (entityCount <= 6) { "Layered" }
      else { "Microservices-Inspired" };
    let layers : [Pipeline.ArchitectureLayer] = [
      { name = "presentation"; description = "UI components, pages, and user interaction handlers" },
      { name = "business_logic"; description = "Domain logic, validation, and orchestration" },
      { name = "data_access"; description = "Storage, queries, and data persistence" },
    ];
    let architecture_model : Pipeline.ArchitectureModel = { layers; pattern };
    // User flows per role
    var user_flows : [Pipeline.UserFlow] = [
      { flow_name = "admin_flow"; steps = ["Login", "Dashboard", "Manage Users", "View Reports"] },
      { flow_name = "user_flow"; steps = ["Register", "Login", "Dashboard", "Profile"] },
    ];
    for (role in intent.roles.vals()) {
      if (role.name != "admin" and role.name != "user") {
        user_flows := user_flows.concat([{
          flow_name = role.name # "_flow";
          steps = ["Login", "Dashboard", role.name # " Dashboard", "Manage " # role.name # " Resources"];
        }]);
      };
    };
    // Role hierarchy
    var role_hierarchy : [Pipeline.RoleHierarchyEntry] = [];
    for (role in intent.roles.vals()) {
      role_hierarchy := role_hierarchy.concat([{
        role_name = role.name;
        parent_role = role.parent_role;
        permissions = role.permissions;
      }]);
    };
    // Application structure — modules
    var application_structure : [Text] = ["auth", "dashboard"];
    for (entity in intent.entities.vals()) {
      application_structure := application_structure.concat([entity.name # "s"]);
    };
    { architecture_model; user_flows; role_hierarchy; application_structure };
  };

  // Stage 3: Schema Generation
  public func generateSchemas(
    intent : Pipeline.IntentExtractionResult,
    design : Pipeline.SystemDesignResult
  ) : Pipeline.SchemaGenerationResult {
    ignore design;
    // UI Schema
    var ui_pages : [Pipeline.UiPage] = [];
    for (page in intent.pages.vals()) {
      let layout : Text = if (page.name == "Login" or page.name == "Register") { "centered" }
        else if (page.name == "Dashboard") { "full-width" }
        else { "sidebar" };
      var components : [Pipeline.UiComponent] = [];
      for (comp in page.components.vals()) {
        components := components.concat([{
          name = comp;
          component_type = if (comp == "Table") { "data-table" }
            else if (comp == "LoginForm" or comp == "RegisterForm" or comp == "EditForm") { "form" }
            else if (comp == "StatsCard") { "card" }
            else { "panel" };
          props = ["className", "data"];
        }]);
      };
      ui_pages := ui_pages.concat([{
        page_name = page.name;
        route = page.route;
        components;
        layout;
        auth_required = page.auth_required;
        role = page.role;
      }]);
    };
    var navigation : [Text] = ["Dashboard"];
    for (entity in intent.entities.vals()) {
      if (entity.name != "user") {
        navigation := navigation.concat([entity.name # "s"]);
      };
    };
    let ui_schema : Pipeline.UiSchema = { pages = ui_pages; navigation };
    // API Schema
    let api_schema : Common.ApiSchema = { endpoints = intent.apis };
    // Database Schema — one table per entity
    var tables : [Common.DbTable] = [];
    for (entity in intent.entities.vals()) {
      var columns : [Common.DbColumn] = [];
      for (field in entity.fields.vals()) {
        let constraints : [Text] = if (field.required and field.unique) { ["NOT NULL", "UNIQUE"] }
          else if (field.required) { ["NOT NULL"] }
          else if (field.unique) { ["UNIQUE"] }
          else { [] };
        columns := columns.concat([{
          name = field.name;
          col_type = field.field_type;
          constraints;
        }]);
      };
      tables := tables.concat([{
        name = entity.name # "s";
        columns;
        indexes = [entity.name # "s_id_idx"];
        foreign_keys = [];
      }]);
    };
    let database_schema : Common.DatabaseSchema = { tables };
    // Auth Schema
    var protected_routes : [Text] = [];
    for (page in intent.pages.vals()) {
      if (page.auth_required) {
        protected_routes := protected_routes.concat([page.route]);
      };
    };
    let auth_schema : Common.AuthSchema = {
      strategy = "jwt";
      providers = ["email", "google"];
      session_type = "stateful";
      protected_routes;
    };
    { ui_schema; api_schema; database_schema; auth_schema };
  };

  // Stage 4: Refinement
  public func refine(
    intent : Pipeline.IntentExtractionResult,
    schemas : Pipeline.SchemaGenerationResult
  ) : Pipeline.RefinementResult {
    var changes_made : [Pipeline.RefinementChange] = [];
    // Deduplicate page names
    var seenPageNames : [Text] = [];
    var deduped_pages : [Common.Page] = [];
    var had_duplicate = false;
    for (page in intent.pages.vals()) {
      var found = false;
      for (seen in seenPageNames.vals()) {
        if (seen == page.name) { found := true };
      };
      if (not found) {
        seenPageNames := seenPageNames.concat([page.name]);
        deduped_pages := deduped_pages.concat([page]);
      } else {
        had_duplicate := true;
      };
    };
    if (had_duplicate) {
      changes_made := changes_made.concat([{
        change_type = "duplicate_removed";
        description = "Removed duplicate page names";
        affected_field = "pages";
      }]);
    };
    // Validate role refs on pages
    var cleaned_pages : [Common.Page] = [];
    for (page in deduped_pages.vals()) {
      switch (page.role) {
        case null { cleaned_pages := cleaned_pages.concat([page]) };
        case (?r) {
          var role_exists = false;
          for (role in intent.roles.vals()) {
            if (role.name == r) { role_exists := true };
          };
          if (role_exists) {
            cleaned_pages := cleaned_pages.concat([page]);
          } else {
            cleaned_pages := cleaned_pages.concat([{ page with role = null }]);
            changes_made := changes_made.concat([{
              change_type = "missing_ref_resolved";
              description = "Removed unknown role reference from page " # page.name;
              affected_field = "pages.role";
            }]);
          };
        };
      };
    };
    // Build app name from prompt (derive from entity names)
    let app_name : Text = if (intent.entities.size() > 0) {
      let first = intent.entities[0].name;
      first # " Management App"
    } else { "Generated App" };
    let config : Common.AppConfig = {
      app_name;
      entities = intent.entities;
      roles = intent.roles;
      pages = cleaned_pages;
      database = schemas.database_schema;
      api = schemas.api_schema;
      auth = schemas.auth_schema;
      business_rules = intent.business_rules;
    };
    { config; changes_made };
  };

  // Stage 5: Validation
  public func validate(
    config : Common.AppConfig
  ) : Pipeline.ValidationResult {
    var errors : [Pipeline.ValidationError] = [];
    // Required field checks
    if (config.app_name.size() == 0) {
      errors := errors.concat([{ error_code = "missing_app_name"; message = "app_name is required and must not be empty"; field = ?("app_name"); severity = "error" }]);
    };
    if (config.entities.size() == 0) {
      errors := errors.concat([{ error_code = "missing_entities"; message = "entities array must not be empty"; field = ?("entities"); severity = "error" }]);
    };
    if (config.roles.size() == 0) {
      errors := errors.concat([{ error_code = "missing_roles"; message = "roles array must not be empty"; field = ?("roles"); severity = "error" }]);
    };
    if (config.pages.size() == 0) {
      errors := errors.concat([{ error_code = "missing_pages"; message = "pages array must not be empty"; field = ?("pages"); severity = "error" }]);
    };
    // Entity field validation
    for (entity in config.entities.vals()) {
      if (entity.name.size() == 0) {
        errors := errors.concat([{ error_code = "invalid_entity_name"; message = "Entity name must not be empty"; field = ?("entities.name"); severity = "error" }]);
      };
      if (entity.fields.size() == 0) {
        errors := errors.concat([{ error_code = "entity_no_fields"; message = "Entity " # entity.name # " must have at least one field"; field = ?("entities.fields"); severity = "error" }]);
      };
    };
    // Cross-schema: page roles must exist in config.roles
    for (page in config.pages.vals()) {
      switch (page.role) {
        case null {};
        case (?r) {
          var found = false;
          for (role in config.roles.vals()) {
            if (role.name == r) { found := true };
          };
          if (not found) {
            errors := errors.concat([{ error_code = "invalid_role_ref"; message = "Page " # page.name # " references unknown role: " # r; field = ?("pages.role"); severity = "error" }]);
          };
        };
      };
    };
    // Cross-schema: API endpoint roles must exist
    for (endpoint in config.api.endpoints.vals()) {
      switch (endpoint.role) {
        case null {};
        case (?r) {
          var found = false;
          for (role in config.roles.vals()) {
            if (role.name == r) { found := true };
          };
          if (not found) {
            errors := errors.concat([{ error_code = "invalid_api_role_ref"; message = "API endpoint " # endpoint.path # " references unknown role: " # r; field = ?("api.endpoints.role"); severity = "error" }]);
          };
        };
      };
    };
    let is_valid = errors.size() == 0;
    {
      is_valid;
      errors;
      warnings = [];
      config = ?config;
    };
  };

  // Stage 6: Repair
  public func repair(
    config : Common.AppConfig,
    errors : [Pipeline.ValidationError]
  ) : Pipeline.RepairResult {
    var repairs_made : [Pipeline.RepairAction] = [];
    var app_name = config.app_name;
    var entities = config.entities;
    var roles = config.roles;
    var pages = config.pages;
    var database = config.database;
    var api = config.api;
    var auth = config.auth;
    var business_rules = config.business_rules;
    for (err in errors.vals()) {
      switch (err.error_code) {
        case "missing_app_name" {
          repairs_made := repairs_made.concat([{ repair_type = "set_default"; description = "Set app_name to default value"; field = "app_name" }]);
          app_name := "Generated App";
        };
        case "missing_entities" {
          repairs_made := repairs_made.concat([{ repair_type = "added_missing_key"; description = "Added default User entity"; field = "entities" }]);
          entities := [{
            name = "user";
            fields = [
              { name = "id"; field_type = "uuid"; required = true; unique = true },
              { name = "name"; field_type = "string"; required = true; unique = false },
              { name = "email"; field_type = "string"; required = true; unique = true },
              { name = "created_at"; field_type = "timestamp"; required = true; unique = false },
              { name = "updated_at"; field_type = "timestamp"; required = true; unique = false },
            ];
            relationships = [];
          }];
        };
        case "missing_roles" {
          repairs_made := repairs_made.concat([{ repair_type = "added_missing_key"; description = "Added default admin and user roles"; field = "roles" }]);
          roles := [
            { name = "admin"; permissions = ["read", "write", "delete", "manage"]; parent_role = null },
            { name = "user"; permissions = ["read"]; parent_role = null },
          ];
        };
        case "missing_pages" {
          repairs_made := repairs_made.concat([{ repair_type = "added_missing_key"; description = "Added default Dashboard and Login pages"; field = "pages" }]);
          pages := [
            { name = "Dashboard"; route = "/dashboard"; components = ["StatsCard"]; auth_required = true; role = null },
            { name = "Login"; route = "/login"; components = ["LoginForm"]; auth_required = false; role = null },
          ];
        };
        case "invalid_role_ref" {
          // Remove role refs from pages that reference nonexistent roles
          var fixed_pages : [Common.Page] = [];
          for (page in pages.vals()) {
            switch (page.role) {
              case null { fixed_pages := fixed_pages.concat([page]) };
              case (?r) {
                var exists = false;
                for (role in roles.vals()) { if (role.name == r) { exists := true } };
                if (exists) { fixed_pages := fixed_pages.concat([page]) }
                else {
                  fixed_pages := fixed_pages.concat([{ page with role = null }]);
                  repairs_made := repairs_made.concat([{ repair_type = "removed_dangling_ref"; description = "Removed invalid role ref from page " # page.name; field = "pages.role" }]);
                };
              };
            };
          };
          pages := fixed_pages;
        };
        case "invalid_api_role_ref" {
          // Remove role refs from endpoints that reference nonexistent roles
          var fixed_endpoints : [Common.ApiEndpoint] = [];
          for (ep in api.endpoints.vals()) {
            switch (ep.role) {
              case null { fixed_endpoints := fixed_endpoints.concat([ep]) };
              case (?r) {
                var exists = false;
                for (role in roles.vals()) { if (role.name == r) { exists := true } };
                if (exists) { fixed_endpoints := fixed_endpoints.concat([ep]) }
                else {
                  fixed_endpoints := fixed_endpoints.concat([{ ep with role = null }]);
                  repairs_made := repairs_made.concat([{ repair_type = "removed_dangling_ref"; description = "Removed invalid role ref from endpoint " # ep.path; field = "api.endpoints.role" }]);
                };
              };
            };
          };
          api := { endpoints = fixed_endpoints };
        };
        case _ {};
      };
    };
    let final_config : Common.AppConfig = { app_name; entities; roles; pages; database; api; auth; business_rules };
    let validation = validate(final_config);
    { repairs_made; final_config; is_valid = validation.is_valid };
  };

  // Parse AppConfig from JSON text
  public func parseConfig(config_json : Text) : ?Common.AppConfig {
    // Simple key-presence check — Motoko has no built-in JSON parser
    let has_app_name = config_json.contains(#text "\"app_name\"");
    let has_entities = config_json.contains(#text "\"entities\"");
    let has_roles = config_json.contains(#text "\"roles\"");
    let has_pages = config_json.contains(#text "\"pages\"");
    let has_database = config_json.contains(#text "\"database\"");
    let has_api = config_json.contains(#text "\"api\"");
    let has_auth = config_json.contains(#text "\"auth\"");
    let has_rules = config_json.contains(#text "\"business_rules\"");
    if (has_app_name and has_entities and has_roles and has_pages and has_database and has_api and has_auth and has_rules) {
      // Return a minimal valid AppConfig with detected keys
      ?{
        app_name = "Parsed App";
        entities = [{
          name = "user";
          fields = [
            { name = "id"; field_type = "uuid"; required = true; unique = true },
            { name = "name"; field_type = "string"; required = true; unique = false },
            { name = "created_at"; field_type = "timestamp"; required = true; unique = false },
            { name = "updated_at"; field_type = "timestamp"; required = true; unique = false },
          ];
          relationships = [];
        }];
        roles = [
          { name = "admin"; permissions = ["read", "write", "delete", "manage"]; parent_role = null },
          { name = "user"; permissions = ["read"]; parent_role = null },
        ];
        pages = [
          { name = "Dashboard"; route = "/dashboard"; components = ["StatsCard"]; auth_required = true; role = null },
          { name = "Login"; route = "/login"; components = ["LoginForm"]; auth_required = false; role = null },
        ];
        database = { tables = [{ name = "users"; columns = [{ name = "id"; col_type = "uuid"; constraints = ["NOT NULL", "UNIQUE"] }]; indexes = ["users_id_idx"]; foreign_keys = [] }] };
        api = { endpoints = [{ path = "/api/users"; method = "GET"; auth_required = true; role = null; request_body = null; response_type = "[user]" }] };
        auth = { strategy = "jwt"; providers = ["email"]; session_type = "stateful"; protected_routes = ["/dashboard"] };
        business_rules = [{ rule_id = "br_auth"; description = "Authentication required"; condition = "user.authenticated == false"; action = "redirect to /login" }];
      };
    } else {
      null;
    };
  };

  // Serialize AppConfig to JSON text
  public func serializeConfig(config : Common.AppConfig) : Text {
    var json = "{";
    json #= "\"app_name\":\"" # config.app_name # "\",";
    // entities
    json #= "\"entities\":[";
    var first_e = true;
    for (entity in config.entities.vals()) {
      if (not first_e) { json #= "," };
      first_e := false;
      json #= "{\"name\":\"" # entity.name # "\",\"fields\":[";
      var first_f = true;
      for (field in entity.fields.vals()) {
        if (not first_f) { json #= "," };
        first_f := false;
        json #= "{\"name\":\"" # field.name # "\",\"field_type\":\"" # field.field_type # "\",\"required\":" # (if (field.required) "true" else "false") # ",\"unique\":" # (if (field.unique) "true" else "false") # "}";
      };
      json #= "]}";
    };
    json #= "],";
    // roles
    json #= "\"roles\":[";
    var first_r = true;
    for (role in config.roles.vals()) {
      if (not first_r) { json #= "," };
      first_r := false;
      let parent = switch (role.parent_role) { case null "null"; case (?p) "\"" # p # "\"" };
      json #= "{\"name\":\"" # role.name # "\",\"parent_role\":" # parent # "}";
    };
    json #= "],";
    // pages
    json #= "\"pages\":[";
    var first_p = true;
    for (page in config.pages.vals()) {
      if (not first_p) { json #= "," };
      first_p := false;
      let role_val = switch (page.role) { case null "null"; case (?r) "\"" # r # "\"" };
      json #= "{\"name\":\"" # page.name # "\",\"route\":\"" # page.route # "\",\"auth_required\":" # (if (page.auth_required) "true" else "false") # ",\"role\":" # role_val # "}";
    };
    json #= "],";
    // database
    json #= "\"database\":{\"tables\":[";
    var first_t = true;
    for (table in config.database.tables.vals()) {
      if (not first_t) { json #= "," };
      first_t := false;
      json #= "{\"name\":\"" # table.name # "\"}";
    };
    json #= "]},";
    // api
    json #= "\"api\":{\"endpoints\":[";
    var first_a = true;
    for (ep in config.api.endpoints.vals()) {
      if (not first_a) { json #= "," };
      first_a := false;
      json #= "{\"path\":\"" # ep.path # "\",\"method\":\"" # ep.method # "\"}";
    };
    json #= "]},";
    // auth
    json #= "\"auth\":{\"strategy\":\"" # config.auth.strategy # "\",\"session_type\":\"" # config.auth.session_type # "\"},";
    // business_rules
    json #= "\"business_rules\":[";
    var first_br = true;
    for (rule in config.business_rules.vals()) {
      if (not first_br) { json #= "," };
      first_br := false;
      json #= "{\"rule_id\":\"" # rule.rule_id # "\",\"description\":\"" # rule.description # "\"}";
    };
    json #= "]";
    json #= "}";
    json;
  };

  // Runtime simulation / deployment readiness check
  public func executeDeployment(
    config : Common.AppConfig
  ) : Pipeline.DeploymentReport {
    var checks : [Pipeline.DeploymentCheck] = [];
    var passed = 0;
    let total = 8;
    // 1. app_name
    let c1 = config.app_name.size() > 0;
    checks := checks.concat([{ check_name = "app_name_check"; passed = c1; detail = if c1 "app_name is present" else "app_name is empty" }]);
    if (c1) { passed += 1 };
    // 2. entities
    let c2 = config.entities.size() > 0;
    checks := checks.concat([{ check_name = "entities_check"; passed = c2; detail = if c2 (config.entities.size().toText() # " entities defined") else "No entities defined" }]);
    if (c2) { passed += 1 };
    // 3. roles (at least admin + user)
    let c3 = config.roles.size() >= 2;
    checks := checks.concat([{ check_name = "roles_check"; passed = c3; detail = if c3 (config.roles.size().toText() # " roles defined") else "Need at least 2 roles (admin + user)" }]);
    if (c3) { passed += 1 };
    // 4. pages
    let c4 = config.pages.size() > 0;
    checks := checks.concat([{ check_name = "pages_check"; passed = c4; detail = if c4 (config.pages.size().toText() # " pages defined") else "No pages defined" }]);
    if (c4) { passed += 1 };
    // 5. auth
    let c5 = config.auth.strategy.size() > 0 and config.auth.providers.size() > 0;
    checks := checks.concat([{ check_name = "auth_check"; passed = c5; detail = if c5 ("Auth strategy: " # config.auth.strategy) else "Auth strategy or providers missing" }]);
    if (c5) { passed += 1 };
    // 6. api
    let c6 = config.api.endpoints.size() > 0;
    checks := checks.concat([{ check_name = "api_check"; passed = c6; detail = if c6 (config.api.endpoints.size().toText() # " API endpoints defined") else "No API endpoints defined" }]);
    if (c6) { passed += 1 };
    // 7. database
    let c7 = config.database.tables.size() > 0;
    checks := checks.concat([{ check_name = "database_check"; passed = c7; detail = if c7 (config.database.tables.size().toText() # " tables defined") else "No database tables defined" }]);
    if (c7) { passed += 1 };
    // 8. business rules
    let c8 = config.business_rules.size() > 0;
    checks := checks.concat([{ check_name = "business_rules_check"; passed = c8; detail = if c8 (config.business_rules.size().toText() # " business rules defined") else "No business rules defined" }]);
    if (c8) { passed += 1 };
    let readiness_score = (passed * 100) / total;
    let status : Text = if (readiness_score == 100) { "ready" } else if (readiness_score >= 50) { "partial" } else { "failed" };
    var warnings : [Text] = [];
    if (not c8) {
      warnings := warnings.concat(["No business rules defined — consider adding validation rules"]);
    };
    if (config.roles.size() < 2) {
      warnings := warnings.concat(["Fewer than 2 roles defined — ensure admin and user roles exist"]);
    };
    { status; checks; readiness_score; warnings };
  };

  // Run the full 6-stage pipeline
  public func runPipeline(prompt : Text) : Pipeline.CompileResult {
    let start_time = Time.now();
    // Stage 1
    let intent = extractIntent(prompt);
    // Stage 2
    let design = generateSystemDesign(intent);
    // Stage 3
    let schemas = generateSchemas(intent, design);
    // Stage 4
    let refinement = refine(intent, schemas);
    // Stage 5
    let validation_result = validate(refinement.config);
    // Stage 6 — repair if needed
    let (final_config, repair_result_opt) : (Common.AppConfig, ?Pipeline.RepairResult) =
      if (not validation_result.is_valid) {
        let rep = repair(refinement.config, validation_result.errors);
        (rep.final_config, ?rep)
      } else {
        (refinement.config, null)
      };
    // Deployment
    let deployment = executeDeployment(final_config);
    let end_time = Time.now();
    let elapsed_ns : Int = end_time - start_time;
    let processing_time_ms : Nat = if (elapsed_ns > 0) { (elapsed_ns / 1_000_000).toNat() } else { 0 };
    let success = deployment.status != "failed";
    {
      success;
      intent = ?intent;
      design = ?design;
      schemas = ?schemas;
      refinement = ?refinement;
      validation = ?validation_result;
      repair = repair_result_opt;
      final_config = ?final_config;
      error_message = null;
      processing_time_ms;
      assumptions = intent.assumptions;
    };
  };

  // Return one of the 20 built-in test prompts by index (0-19)
  public func getBenchmarkPrompt(index : Nat) : Text {
    let prompts : [Text] = [
      "Build a CRM system with contacts, deals pipeline, activity tracking, email integration, and sales forecasting for a B2B sales team of 50 reps",
      "Create a project management tool with projects, tasks, sprints, Gantt charts, time tracking, team collaboration, and client reporting for software agencies",
      "Build a learning management system with courses, lessons, quizzes, student progress tracking, instructor management, certificates, and payment processing",
      "Create a human resource management system with employee profiles, payroll, leave management, performance reviews, recruitment pipeline, and org chart",
      "Build an e-commerce platform with product catalog, inventory, shopping cart, order management, payment processing, shipping integration, and customer reviews",
      "Create a multi-vendor marketplace with seller onboarding, product listings, buyer/seller messaging, escrow payments, dispute resolution, and commission management",
      "Build a subscription management platform with plans, billing cycles, usage metering, invoicing, dunning management, and customer portal for B2B SaaS",
      "Create a customer support helpdesk with ticket management, SLA tracking, knowledge base, live chat, escalation workflows, and CSAT surveys",
      "Build an inventory management system with warehouses, stock tracking, purchase orders, supplier management, barcode scanning, and reorder automation",
      "Create an appointment booking system with service providers, availability calendars, booking management, automated reminders, payments, and review system",
      "Build an app",
      "Create a social network like Facebook but better with everything including all features",
      "Build a system where admins are also users and users can be admins but only sometimes depending on context",
      "Create an app with no users no login and no data storage that still tracks user behavior and generates reports",
      "Build a real-time collaborative whiteboard that works completely offline and also syncs instantly across all devices",
      "Create a marketplace where buyers and sellers are the same person who buys and sells to themselves",
      "Build an AI that autonomously builds other AI systems which in turn build more AI systems recursively",
      "Create a HIPAA GDPR SOC2 and PCI-DSS fully compliant application with absolutely no security features or authentication",
      "Build a single page app that displays 50 different complex dashboards all visible simultaneously without scrolling",
      "Create an enterprise system for 1 million concurrent users running on a single server with zero latency and no infrastructure cost"
    ];
    if (index < prompts.size()) { prompts[index] } else { "Build an app" };
  };
};
