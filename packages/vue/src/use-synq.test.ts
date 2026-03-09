import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { h, defineComponent } from 'vue';
import { useSynq } from './use-synq';
import { s } from '@synq/core';

describe('useSynq', () => {
  let router: ReturnType<typeof createRouter>;

  beforeEach(async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', name: 'home', component: { template: '<div />' } }],
    });
    await router.push({ path: '/', query: { name: 'Test', count: '10' } });
  });

  it('parses query params into reactive state', async () => {
    const schema = { name: s.string(), count: s.number(0) };
    let state: { name: string; count: number } | undefined;

    const TestComp = defineComponent({
      setup() {
        const { state: s } = useSynq(schema);
        state = s;
        return () => h('div', {}, []);
      },
    });

    const wrapper = mount(TestComp, {
      global: {
        plugins: [router],
      },
    });

    await router.isReady();

    expect(state).toBeDefined();
    expect(state!.name).toBe('Test');
    expect(state!.count).toBe(10);
    wrapper.unmount();
  });

  it('updates URL when state changes (replace)', async () => {
    const schema = { name: s.string(), count: s.number(0) };
    let state: { name: string; count: number } | undefined;
    const replaceSpy = vi.spyOn(router, 'replace');

    const TestComp = defineComponent({
      setup() {
        const { state: s } = useSynq(schema);
        state = s;
        return () => h('div', {}, []);
      },
    });

    mount(TestComp, {
      global: {
        plugins: [router],
      },
    });

    await router.isReady();

    expect(state).toBeDefined();
    state!.name = 'Updated';
    state!.count = 99;

    await new Promise((r) => setTimeout(r, 0));

    expect(replaceSpy).toHaveBeenCalled();
    const replaceCall = replaceSpy.mock.calls[replaceSpy.mock.calls.length - 1][0] as { query: Record<string, string> };
    expect(replaceCall.query).toMatchObject({ name: 'Updated', count: '99' });
  });

  it('syncs state when route query changes', async () => {
    const schema = { name: s.string() };
    let state: { name: string } | undefined;

    const TestComp = defineComponent({
      setup() {
        const { state: s } = useSynq(schema);
        state = s;
        return () => h('div', {}, []);
      },
    });

    const wrapper = mount(TestComp, {
      global: {
        plugins: [router],
      },
    });

    await router.isReady();
    expect(state!.name).toBe('Test');

    await router.push({ path: '/', query: { name: 'NewValue' } });
    await new Promise((r) => setTimeout(r, 0));

    expect(state!.name).toBe('NewValue');
    wrapper.unmount();
  });
});
