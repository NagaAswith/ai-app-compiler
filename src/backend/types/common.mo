module {
  public type AppName = Text;
  public type FieldName = Text;
  public type FieldType = Text;
  public type Timestamp = Int;

  // Entity field definition
  public type EntityField = {
    name : FieldName;
    field_type : FieldType;
    required : Bool;
    unique : Bool;
  };

  // Entity relationship
  public type Relationship = {
    rel_type : Text; // "has_many", "belongs_to", "has_one"
    target : Text;
    field : FieldName;
  };

  // Entity
  public type Entity = {
    name : Text;
    fields : [EntityField];
    relationships : [Relationship];
  };

  // Role
  public type Role = {
    name : Text;
    permissions : [Text];
    parent_role : ?Text;
  };

  // Page
  public type Page = {
    name : Text;
    route : Text;
    components : [Text];
    auth_required : Bool;
    role : ?Text;
  };

  // Database column
  public type DbColumn = {
    name : Text;
    col_type : Text;
    constraints : [Text];
  };

  // Database table
  public type DbTable = {
    name : Text;
    columns : [DbColumn];
    indexes : [Text];
    foreign_keys : [Text];
  };

  // Database schema
  public type DatabaseSchema = {
    tables : [DbTable];
  };

  // API endpoint
  public type ApiEndpoint = {
    path : Text;
    method : Text;
    auth_required : Bool;
    role : ?Text;
    request_body : ?Text;
    response_type : Text;
  };

  // API schema
  public type ApiSchema = {
    endpoints : [ApiEndpoint];
  };

  // Auth schema
  public type AuthSchema = {
    strategy : Text;
    providers : [Text];
    session_type : Text;
    protected_routes : [Text];
  };

  // Business rule
  public type BusinessRule = {
    rule_id : Text;
    description : Text;
    condition : Text;
    action : Text;
  };

  // The canonical final app config
  public type AppConfig = {
    app_name : AppName;
    entities : [Entity];
    roles : [Role];
    pages : [Page];
    database : DatabaseSchema;
    api : ApiSchema;
    auth : AuthSchema;
    business_rules : [BusinessRule];
  };

  // Failure types for metrics
  public type FailureType = {
    type_name : Text;
    count : Nat;
  };
};
