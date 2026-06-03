import Pipeline "types/pipeline";
import PipelineMixin "mixins/pipeline-api";

actor {
  let metricsState : Pipeline.MetricsState;
  include PipelineMixin(metricsState);
};

