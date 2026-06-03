import Map "mo:core/Map";

module {
  type OldActor = {};

  type MetricsState = {
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

  type NewActor = {
    metricsState : MetricsState;
  };

  public func migration(_old : OldActor) : NewActor {
    let metricsState : MetricsState = {
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
    { metricsState };
  };
};
