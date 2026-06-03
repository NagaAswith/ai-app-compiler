import { createActor } from "@/backend";
import type {
  CompileResult,
  DeploymentReport,
  MetricsResult,
  RepairResult,
  ValidationResult,
} from "@/types/compiler";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ─── useCompile ─────────────────────────────────────────────────────────
export function useCompile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<CompileResult, Error, string>({
    mutationFn: async (prompt: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.compile(prompt);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}

// ─── useValidate ────────────────────────────────────────────────────────
export function useValidate() {
  const { actor } = useActor(createActor);

  return useMutation<ValidationResult, Error, string>({
    mutationFn: async (configJson: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.validate(configJson);
    },
  });
}

// ─── useRepair ──────────────────────────────────────────────────────────
export function useRepair() {
  const { actor } = useActor(createActor);

  return useMutation<RepairResult, Error, string>({
    mutationFn: async (configJson: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.repair(configJson);
    },
  });
}

// ─── useExecute ─────────────────────────────────────────────────────────
export function useExecute() {
  const { actor } = useActor(createActor);

  return useMutation<DeploymentReport, Error, string>({
    mutationFn: async (configJson: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.execute(configJson);
    },
  });
}

// ─── useMetrics ─────────────────────────────────────────────────────────
export function useMetrics() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<MetricsResult>({
    queryKey: ["metrics"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getMetrics();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

// ─── useRunBenchmark ────────────────────────────────────────────────────
export function useRunBenchmark() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<CompileResult, Error, number>({
    mutationFn: async (index: number) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.runBenchmark(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}
