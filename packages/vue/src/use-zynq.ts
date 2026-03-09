import { reactive, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ZynqEngine, Schema, InferState } from '@zynq/core';
import { VueRouterAdapter } from './adapter';

export function useZynq<S extends Schema>(schema: S) {
  const router = useRouter();
  const route = useRoute();

  const adapter = new VueRouterAdapter(router, route);
  const engine = new ZynqEngine(schema, adapter);

  const state = reactive(engine.parse()) as InferState<S>;

  let isInternalUpdate = false;

  watch(
    state,
    (newState) => {
      if (isInternalUpdate) return;

      const currentUrlParams = route.query;
      const nextUrlParams = engine.serialize(newState);

      if (isEqual(currentUrlParams, nextUrlParams)) return;

      engine.commit(newState, 'replace');
    },
    { deep: true },
  );

  watch(
    () => route.query,
    () => {
      const freshState = engine.parse();

      isInternalUpdate = true;
      Object.assign(state, freshState);

      Promise.resolve().then(() => {
        isInternalUpdate = false;
      });
    },
    { deep: true },
  );

  return { state };
}

function isEqual(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}
