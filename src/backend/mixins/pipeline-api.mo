import Pipeline "../types/pipeline";
import Common "../types/common";
import PipelineLib "../lib/pipeline";
import MetricsLib "../lib/metrics";
import Array "mo:core/Array";

mixin (metricsState : Pipeline.MetricsState) {

  public shared func compile(prompt : Text) : async Pipeline.CompileResult {
    let result = PipelineLib.runPipeline(prompt);
    let failure_type : ?Text = if (result.success) { null } else { ?("validation") };
    MetricsLib.recordCompile(metricsState, result.success, result.processing_time_ms, failure_type);
    switch (result.validation) {
      case null {};
      case (?v) { MetricsLib.recordValidationErrors(metricsState, v.errors.size()) };
    };
    switch (result.repair) {
      case null {};
      case (?r) { MetricsLib.recordRepairs(metricsState, r.repairs_made.size()) };
    };
    result;
  };

  public shared func validate(config_json : Text) : async Pipeline.ValidationResult {
    switch (PipelineLib.parseConfig(config_json)) {
      case null {
        {
          is_valid = false;
          errors = [{ error_code = "invalid_json"; message = "Could not parse config JSON — missing required keys"; field = null; severity = "error" }];
          warnings = [];
          config = null;
        };
      };
      case (?config) {
        PipelineLib.validate(config);
      };
    };
  };

  public shared func repair(config_json : Text) : async Pipeline.RepairResult {
    switch (PipelineLib.parseConfig(config_json)) {
      case null {
        let default_config : Common.AppConfig = {
          app_name = "";
          entities = [];
          roles = [];
          pages = [];
          database = { tables = [] };
          api = { endpoints = [] };
          auth = { strategy = ""; providers = []; session_type = ""; protected_routes = [] };
          business_rules = [];
        };
        let validation = PipelineLib.validate(default_config);
        let rep = PipelineLib.repair(default_config, validation.errors);
        {
          repairs_made = [{ repair_type = "json_parse_error"; description = "Could not parse input JSON — using minimal default config"; field = "config" }].concat(rep.repairs_made);
          final_config = rep.final_config;
          is_valid = rep.is_valid;
        };
      };
      case (?config) {
        let validation = PipelineLib.validate(config);
        PipelineLib.repair(config, validation.errors);
      };
    };
  };

  public shared func execute(config_json : Text) : async Pipeline.DeploymentReport {
    switch (PipelineLib.parseConfig(config_json)) {
      case null {
        {
          status = "failed";
          checks = [{ check_name = "json_parse"; passed = false; detail = "Could not parse config JSON" }];
          readiness_score = 0;
          warnings = ["Input JSON could not be parsed — provide a valid app config"];
        };
      };
      case (?config) {
        PipelineLib.executeDeployment(config);
      };
    };
  };

  public query func getMetrics() : async Pipeline.MetricsResult {
    MetricsLib.getMetrics(metricsState);
  };

  public shared func runBenchmark(prompt_index : Nat) : async Pipeline.CompileResult {
    let prompt = PipelineLib.getBenchmarkPrompt(prompt_index);
    await compile(prompt);
  };
};
