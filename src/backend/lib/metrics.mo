import Pipeline "../types/pipeline";
import Common "../types/common";
import Array "mo:core/Array";

module {

  // Record a compile attempt
  public func recordCompile(
    state : Pipeline.MetricsState,
    success : Bool,
    processing_time_ms : Nat,
    failure_type : ?Text
  ) {
    state.total_compilations += 1;
    if (success) { state.successful_compilations += 1 };
    state.total_processing_time_ms += processing_time_ms;
    switch (failure_type) {
      case null {};
      case (?t) {
        if (t == "vague") { state.failure_type_vague += 1 }
        else if (t == "missing") { state.failure_type_missing += 1 }
        else if (t == "contradictory") { state.failure_type_contradictory += 1 }
        else if (t == "validation") { state.failure_type_validation += 1 }
        else { state.failure_type_repair += 1 };
      };
    };
  };

  // Record validation errors count
  public func recordValidationErrors(
    state : Pipeline.MetricsState,
    error_count : Nat
  ) {
    state.validation_errors_total += error_count;
  };

  // Record repairs made count
  public func recordRepairs(
    state : Pipeline.MetricsState,
    repair_count : Nat
  ) {
    state.repairs_made_total += repair_count;
  };

  // Read current metrics as a shareable result
  public func getMetrics(
    state : Pipeline.MetricsState
  ) : Pipeline.MetricsResult {
    let avg : Nat = if (state.total_compilations > 0) {
      state.total_processing_time_ms / state.total_compilations
    } else { 0 };
    var failure_types : [Common.FailureType] = [];
    if (state.failure_type_vague > 0) {
      failure_types := failure_types.concat([{ type_name = "vague"; count = state.failure_type_vague }]);
    };
    if (state.failure_type_missing > 0) {
      failure_types := failure_types.concat([{ type_name = "missing"; count = state.failure_type_missing }]);
    };
    if (state.failure_type_contradictory > 0) {
      failure_types := failure_types.concat([{ type_name = "contradictory"; count = state.failure_type_contradictory }]);
    };
    if (state.failure_type_validation > 0) {
      failure_types := failure_types.concat([{ type_name = "validation"; count = state.failure_type_validation }]);
    };
    if (state.failure_type_repair > 0) {
      failure_types := failure_types.concat([{ type_name = "repair"; count = state.failure_type_repair }]);
    };
    {
      total_compilations = state.total_compilations;
      successful_compilations = state.successful_compilations;
      validation_errors_total = state.validation_errors_total;
      repairs_made_total = state.repairs_made_total;
      average_processing_time_ms = avg;
      failure_types;
    };
  };

  // Build initial zeroed MetricsState (used in migration)
  public func initState() : Pipeline.MetricsState {
    {
      var total_compilations = 0;
      var successful_compilations = 0;
      var validation_errors_total = 0;
      var repairs_made_total = 0;
      var total_processing_time_ms = 0;
      var failure_type_vague = 0;
      var failure_type_missing = 0;
      var failure_type_contradictory = 0;
      var failure_type_validation = 0;
      var failure_type_repair = 0;
    };
  };
};
