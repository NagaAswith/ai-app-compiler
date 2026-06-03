var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { f as Subscribable, p as pendingThenable, g as resolveEnabled, s as shallowEqualObjects, h as resolveStaleTime, n as noop, i as environmentManager, k as isValidTimeout, t as timeUntilStale, l as timeoutManager, m as focusManager, o as fetchState, q as replaceData, u as notifyManager, v as hashKey, w as getDefaultState, r as reactExports, x as shouldThrowError, y as useQueryClient, z as useInternetIdentity, A as createActorWithConfig, B as Record, T as Text, D as Bool, O as Opt, V as Vec, N as Nat, E as Service, F as Func, H as HttpAgent, G as Actor } from "./index-XVEsl6Ym.js";
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actor = await createActorWithConfig(createActor2, {
        agentOptions: { identity }
      });
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
const RepairAction = Record({
  "field": Text,
  "description": Text,
  "repair_type": Text
});
const ApiEndpoint = Record({
  "method": Text,
  "response_type": Text,
  "path": Text,
  "role": Opt(Text),
  "auth_required": Bool,
  "request_body": Opt(Text)
});
const ApiSchema = Record({ "endpoints": Vec(ApiEndpoint) });
const AuthSchema = Record({
  "protected_routes": Vec(Text),
  "strategy": Text,
  "providers": Vec(Text),
  "session_type": Text
});
const FieldType = Text;
const FieldName = Text;
const EntityField = Record({
  "field_type": FieldType,
  "name": FieldName,
  "unique": Bool,
  "required": Bool
});
const Relationship = Record({
  "field": FieldName,
  "rel_type": Text,
  "target": Text
});
const Entity = Record({
  "name": Text,
  "fields": Vec(EntityField),
  "relationships": Vec(Relationship)
});
const DbColumn = Record({
  "constraints": Vec(Text),
  "name": Text,
  "col_type": Text
});
const DbTable = Record({
  "foreign_keys": Vec(Text),
  "name": Text,
  "indexes": Vec(Text),
  "columns": Vec(DbColumn)
});
const DatabaseSchema = Record({ "tables": Vec(DbTable) });
const AppName = Text;
const Page = Record({
  "name": Text,
  "role": Opt(Text),
  "components": Vec(Text),
  "route": Text,
  "auth_required": Bool
});
const Role = Record({
  "permissions": Vec(Text),
  "name": Text,
  "parent_role": Opt(Text)
});
const BusinessRule = Record({
  "action": Text,
  "description": Text,
  "rule_id": Text,
  "condition": Text
});
const AppConfig = Record({
  "api": ApiSchema,
  "auth": AuthSchema,
  "entities": Vec(Entity),
  "database": DatabaseSchema,
  "app_name": AppName,
  "pages": Vec(Page),
  "roles": Vec(Role),
  "business_rules": Vec(BusinessRule)
});
const RepairResult = Record({
  "repairs_made": Vec(RepairAction),
  "is_valid": Bool,
  "final_config": AppConfig
});
const RefinementChange = Record({
  "affected_field": Text,
  "description": Text,
  "change_type": Text
});
const RefinementResult = Record({
  "changes_made": Vec(RefinementChange),
  "config": AppConfig
});
const UiComponent = Record({
  "name": Text,
  "component_type": Text,
  "props": Vec(Text)
});
const UiPage = Record({
  "page_name": Text,
  "role": Opt(Text),
  "layout": Text,
  "components": Vec(UiComponent),
  "route": Text,
  "auth_required": Bool
});
const UiSchema = Record({
  "navigation": Vec(Text),
  "pages": Vec(UiPage)
});
const SchemaGenerationResult = Record({
  "auth_schema": AuthSchema,
  "api_schema": ApiSchema,
  "ui_schema": UiSchema,
  "database_schema": DatabaseSchema
});
const RoleHierarchyEntry = Record({
  "permissions": Vec(Text),
  "role_name": Text,
  "parent_role": Opt(Text)
});
const ArchitectureLayer = Record({
  "name": Text,
  "description": Text
});
const ArchitectureModel = Record({
  "pattern": Text,
  "layers": Vec(ArchitectureLayer)
});
const UserFlow = Record({
  "steps": Vec(Text),
  "flow_name": Text
});
const SystemDesignResult = Record({
  "application_structure": Vec(Text),
  "role_hierarchy": Vec(RoleHierarchyEntry),
  "architecture_model": ArchitectureModel,
  "user_flows": Vec(UserFlow)
});
const IntentExtractionResult = Record({
  "apis": Vec(ApiEndpoint),
  "entities": Vec(Entity),
  "assumptions": Vec(Text),
  "pages": Vec(Page),
  "roles": Vec(Role),
  "business_rules": Vec(BusinessRule)
});
const ValidationError = Record({
  "field": Opt(Text),
  "message": Text,
  "severity": Text,
  "error_code": Text
});
const ValidationResult = Record({
  "errors": Vec(ValidationError),
  "is_valid": Bool,
  "warnings": Vec(ValidationError),
  "config": Opt(AppConfig)
});
const CompileResult = Record({
  "repair": Opt(RepairResult),
  "refinement": Opt(RefinementResult),
  "error_message": Opt(Text),
  "schemas": Opt(SchemaGenerationResult),
  "design": Opt(SystemDesignResult),
  "processing_time_ms": Nat,
  "intent": Opt(IntentExtractionResult),
  "assumptions": Vec(Text),
  "success": Bool,
  "validation": Opt(ValidationResult),
  "final_config": Opt(AppConfig)
});
const DeploymentCheck = Record({
  "detail": Text,
  "check_name": Text,
  "passed": Bool
});
const DeploymentReport = Record({
  "status": Text,
  "warnings": Vec(Text),
  "checks": Vec(DeploymentCheck),
  "readiness_score": Nat
});
const FailureType = Record({
  "type_name": Text,
  "count": Nat
});
const MetricsResult = Record({
  "failure_types": Vec(FailureType),
  "total_compilations": Nat,
  "repairs_made_total": Nat,
  "successful_compilations": Nat,
  "average_processing_time_ms": Nat,
  "validation_errors_total": Nat
});
Service({
  "compile": Func([Text], [CompileResult], []),
  "execute": Func([Text], [DeploymentReport], []),
  "getMetrics": Func([], [MetricsResult], ["query"]),
  "repair": Func([Text], [RepairResult], []),
  "runBenchmark": Func([Nat], [CompileResult], []),
  "validate": Func([Text], [ValidationResult], [])
});
const idlFactory = ({ IDL }) => {
  const RepairAction2 = IDL.Record({
    "field": IDL.Text,
    "description": IDL.Text,
    "repair_type": IDL.Text
  });
  const ApiEndpoint2 = IDL.Record({
    "method": IDL.Text,
    "response_type": IDL.Text,
    "path": IDL.Text,
    "role": IDL.Opt(IDL.Text),
    "auth_required": IDL.Bool,
    "request_body": IDL.Opt(IDL.Text)
  });
  const ApiSchema2 = IDL.Record({ "endpoints": IDL.Vec(ApiEndpoint2) });
  const AuthSchema2 = IDL.Record({
    "protected_routes": IDL.Vec(IDL.Text),
    "strategy": IDL.Text,
    "providers": IDL.Vec(IDL.Text),
    "session_type": IDL.Text
  });
  const FieldType2 = IDL.Text;
  const FieldName2 = IDL.Text;
  const EntityField2 = IDL.Record({
    "field_type": FieldType2,
    "name": FieldName2,
    "unique": IDL.Bool,
    "required": IDL.Bool
  });
  const Relationship2 = IDL.Record({
    "field": FieldName2,
    "rel_type": IDL.Text,
    "target": IDL.Text
  });
  const Entity2 = IDL.Record({
    "name": IDL.Text,
    "fields": IDL.Vec(EntityField2),
    "relationships": IDL.Vec(Relationship2)
  });
  const DbColumn2 = IDL.Record({
    "constraints": IDL.Vec(IDL.Text),
    "name": IDL.Text,
    "col_type": IDL.Text
  });
  const DbTable2 = IDL.Record({
    "foreign_keys": IDL.Vec(IDL.Text),
    "name": IDL.Text,
    "indexes": IDL.Vec(IDL.Text),
    "columns": IDL.Vec(DbColumn2)
  });
  const DatabaseSchema2 = IDL.Record({ "tables": IDL.Vec(DbTable2) });
  const AppName2 = IDL.Text;
  const Page2 = IDL.Record({
    "name": IDL.Text,
    "role": IDL.Opt(IDL.Text),
    "components": IDL.Vec(IDL.Text),
    "route": IDL.Text,
    "auth_required": IDL.Bool
  });
  const Role2 = IDL.Record({
    "permissions": IDL.Vec(IDL.Text),
    "name": IDL.Text,
    "parent_role": IDL.Opt(IDL.Text)
  });
  const BusinessRule2 = IDL.Record({
    "action": IDL.Text,
    "description": IDL.Text,
    "rule_id": IDL.Text,
    "condition": IDL.Text
  });
  const AppConfig2 = IDL.Record({
    "api": ApiSchema2,
    "auth": AuthSchema2,
    "entities": IDL.Vec(Entity2),
    "database": DatabaseSchema2,
    "app_name": AppName2,
    "pages": IDL.Vec(Page2),
    "roles": IDL.Vec(Role2),
    "business_rules": IDL.Vec(BusinessRule2)
  });
  const RepairResult2 = IDL.Record({
    "repairs_made": IDL.Vec(RepairAction2),
    "is_valid": IDL.Bool,
    "final_config": AppConfig2
  });
  const RefinementChange2 = IDL.Record({
    "affected_field": IDL.Text,
    "description": IDL.Text,
    "change_type": IDL.Text
  });
  const RefinementResult2 = IDL.Record({
    "changes_made": IDL.Vec(RefinementChange2),
    "config": AppConfig2
  });
  const UiComponent2 = IDL.Record({
    "name": IDL.Text,
    "component_type": IDL.Text,
    "props": IDL.Vec(IDL.Text)
  });
  const UiPage2 = IDL.Record({
    "page_name": IDL.Text,
    "role": IDL.Opt(IDL.Text),
    "layout": IDL.Text,
    "components": IDL.Vec(UiComponent2),
    "route": IDL.Text,
    "auth_required": IDL.Bool
  });
  const UiSchema2 = IDL.Record({
    "navigation": IDL.Vec(IDL.Text),
    "pages": IDL.Vec(UiPage2)
  });
  const SchemaGenerationResult2 = IDL.Record({
    "auth_schema": AuthSchema2,
    "api_schema": ApiSchema2,
    "ui_schema": UiSchema2,
    "database_schema": DatabaseSchema2
  });
  const RoleHierarchyEntry2 = IDL.Record({
    "permissions": IDL.Vec(IDL.Text),
    "role_name": IDL.Text,
    "parent_role": IDL.Opt(IDL.Text)
  });
  const ArchitectureLayer2 = IDL.Record({
    "name": IDL.Text,
    "description": IDL.Text
  });
  const ArchitectureModel2 = IDL.Record({
    "pattern": IDL.Text,
    "layers": IDL.Vec(ArchitectureLayer2)
  });
  const UserFlow2 = IDL.Record({
    "steps": IDL.Vec(IDL.Text),
    "flow_name": IDL.Text
  });
  const SystemDesignResult2 = IDL.Record({
    "application_structure": IDL.Vec(IDL.Text),
    "role_hierarchy": IDL.Vec(RoleHierarchyEntry2),
    "architecture_model": ArchitectureModel2,
    "user_flows": IDL.Vec(UserFlow2)
  });
  const IntentExtractionResult2 = IDL.Record({
    "apis": IDL.Vec(ApiEndpoint2),
    "entities": IDL.Vec(Entity2),
    "assumptions": IDL.Vec(IDL.Text),
    "pages": IDL.Vec(Page2),
    "roles": IDL.Vec(Role2),
    "business_rules": IDL.Vec(BusinessRule2)
  });
  const ValidationError2 = IDL.Record({
    "field": IDL.Opt(IDL.Text),
    "message": IDL.Text,
    "severity": IDL.Text,
    "error_code": IDL.Text
  });
  const ValidationResult2 = IDL.Record({
    "errors": IDL.Vec(ValidationError2),
    "is_valid": IDL.Bool,
    "warnings": IDL.Vec(ValidationError2),
    "config": IDL.Opt(AppConfig2)
  });
  const CompileResult2 = IDL.Record({
    "repair": IDL.Opt(RepairResult2),
    "refinement": IDL.Opt(RefinementResult2),
    "error_message": IDL.Opt(IDL.Text),
    "schemas": IDL.Opt(SchemaGenerationResult2),
    "design": IDL.Opt(SystemDesignResult2),
    "processing_time_ms": IDL.Nat,
    "intent": IDL.Opt(IntentExtractionResult2),
    "assumptions": IDL.Vec(IDL.Text),
    "success": IDL.Bool,
    "validation": IDL.Opt(ValidationResult2),
    "final_config": IDL.Opt(AppConfig2)
  });
  const DeploymentCheck2 = IDL.Record({
    "detail": IDL.Text,
    "check_name": IDL.Text,
    "passed": IDL.Bool
  });
  const DeploymentReport2 = IDL.Record({
    "status": IDL.Text,
    "warnings": IDL.Vec(IDL.Text),
    "checks": IDL.Vec(DeploymentCheck2),
    "readiness_score": IDL.Nat
  });
  const FailureType2 = IDL.Record({ "type_name": IDL.Text, "count": IDL.Nat });
  const MetricsResult2 = IDL.Record({
    "failure_types": IDL.Vec(FailureType2),
    "total_compilations": IDL.Nat,
    "repairs_made_total": IDL.Nat,
    "successful_compilations": IDL.Nat,
    "average_processing_time_ms": IDL.Nat,
    "validation_errors_total": IDL.Nat
  });
  return IDL.Service({
    "compile": IDL.Func([IDL.Text], [CompileResult2], []),
    "execute": IDL.Func([IDL.Text], [DeploymentReport2], []),
    "getMetrics": IDL.Func([], [MetricsResult2], ["query"]),
    "repair": IDL.Func([IDL.Text], [RepairResult2], []),
    "runBenchmark": IDL.Func([IDL.Nat], [CompileResult2], []),
    "validate": IDL.Func([IDL.Text], [ValidationResult2], [])
  });
};
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async compile(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.compile(arg0);
        return from_candid_CompileResult_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.compile(arg0);
      return from_candid_CompileResult_n1(this._uploadFile, this._downloadFile, result);
    }
  }
  async execute(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.execute(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.execute(arg0);
      return result;
    }
  }
  async getMetrics() {
    if (this.processError) {
      try {
        const result = await this.actor.getMetrics();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMetrics();
      return result;
    }
  }
  async repair(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.repair(arg0);
        return from_candid_RepairResult_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.repair(arg0);
      return from_candid_RepairResult_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async runBenchmark(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.runBenchmark(arg0);
        return from_candid_CompileResult_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.runBenchmark(arg0);
      return from_candid_CompileResult_n1(this._uploadFile, this._downloadFile, result);
    }
  }
  async validate(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.validate(arg0);
        return from_candid_ValidationResult_n41(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.validate(arg0);
      return from_candid_ValidationResult_n41(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_ApiEndpoint_n11(_uploadFile, _downloadFile, value) {
  return from_candid_record_n12(_uploadFile, _downloadFile, value);
}
function from_candid_ApiSchema_n8(_uploadFile, _downloadFile, value) {
  return from_candid_record_n9(_uploadFile, _downloadFile, value);
}
function from_candid_AppConfig_n6(_uploadFile, _downloadFile, value) {
  return from_candid_record_n7(_uploadFile, _downloadFile, value);
}
function from_candid_CompileResult_n1(_uploadFile, _downloadFile, value) {
  return from_candid_record_n2(_uploadFile, _downloadFile, value);
}
function from_candid_IntentExtractionResult_n38(_uploadFile, _downloadFile, value) {
  return from_candid_record_n39(_uploadFile, _downloadFile, value);
}
function from_candid_Page_n15(_uploadFile, _downloadFile, value) {
  return from_candid_record_n16(_uploadFile, _downloadFile, value);
}
function from_candid_RefinementResult_n21(_uploadFile, _downloadFile, value) {
  return from_candid_record_n22(_uploadFile, _downloadFile, value);
}
function from_candid_RepairResult_n4(_uploadFile, _downloadFile, value) {
  return from_candid_record_n5(_uploadFile, _downloadFile, value);
}
function from_candid_RoleHierarchyEntry_n35(_uploadFile, _downloadFile, value) {
  return from_candid_record_n36(_uploadFile, _downloadFile, value);
}
function from_candid_Role_n18(_uploadFile, _downloadFile, value) {
  return from_candid_record_n19(_uploadFile, _downloadFile, value);
}
function from_candid_SchemaGenerationResult_n24(_uploadFile, _downloadFile, value) {
  return from_candid_record_n25(_uploadFile, _downloadFile, value);
}
function from_candid_SystemDesignResult_n32(_uploadFile, _downloadFile, value) {
  return from_candid_record_n33(_uploadFile, _downloadFile, value);
}
function from_candid_UiPage_n29(_uploadFile, _downloadFile, value) {
  return from_candid_record_n30(_uploadFile, _downloadFile, value);
}
function from_candid_UiSchema_n26(_uploadFile, _downloadFile, value) {
  return from_candid_record_n27(_uploadFile, _downloadFile, value);
}
function from_candid_ValidationError_n44(_uploadFile, _downloadFile, value) {
  return from_candid_record_n45(_uploadFile, _downloadFile, value);
}
function from_candid_ValidationResult_n41(_uploadFile, _downloadFile, value) {
  return from_candid_record_n42(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n13(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n20(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_RefinementResult_n21(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n23(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_SchemaGenerationResult_n24(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n3(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_RepairResult_n4(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n31(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_SystemDesignResult_n32(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n37(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_IntentExtractionResult_n38(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n40(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_ValidationResult_n41(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n46(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_AppConfig_n6(_uploadFile, _downloadFile, value[0]);
}
function from_candid_record_n12(_uploadFile, _downloadFile, value) {
  return {
    method: value.method,
    response_type: value.response_type,
    path: value.path,
    role: record_opt_to_undefined(from_candid_opt_n13(_uploadFile, _downloadFile, value.role)),
    auth_required: value.auth_required,
    request_body: record_opt_to_undefined(from_candid_opt_n13(_uploadFile, _downloadFile, value.request_body))
  };
}
function from_candid_record_n16(_uploadFile, _downloadFile, value) {
  return {
    name: value.name,
    role: record_opt_to_undefined(from_candid_opt_n13(_uploadFile, _downloadFile, value.role)),
    components: value.components,
    route: value.route,
    auth_required: value.auth_required
  };
}
function from_candid_record_n19(_uploadFile, _downloadFile, value) {
  return {
    permissions: value.permissions,
    name: value.name,
    parent_role: record_opt_to_undefined(from_candid_opt_n13(_uploadFile, _downloadFile, value.parent_role))
  };
}
function from_candid_record_n2(_uploadFile, _downloadFile, value) {
  return {
    repair: record_opt_to_undefined(from_candid_opt_n3(_uploadFile, _downloadFile, value.repair)),
    refinement: record_opt_to_undefined(from_candid_opt_n20(_uploadFile, _downloadFile, value.refinement)),
    error_message: record_opt_to_undefined(from_candid_opt_n13(_uploadFile, _downloadFile, value.error_message)),
    schemas: record_opt_to_undefined(from_candid_opt_n23(_uploadFile, _downloadFile, value.schemas)),
    design: record_opt_to_undefined(from_candid_opt_n31(_uploadFile, _downloadFile, value.design)),
    processing_time_ms: value.processing_time_ms,
    intent: record_opt_to_undefined(from_candid_opt_n37(_uploadFile, _downloadFile, value.intent)),
    assumptions: value.assumptions,
    success: value.success,
    validation: record_opt_to_undefined(from_candid_opt_n40(_uploadFile, _downloadFile, value.validation)),
    final_config: record_opt_to_undefined(from_candid_opt_n46(_uploadFile, _downloadFile, value.final_config))
  };
}
function from_candid_record_n22(_uploadFile, _downloadFile, value) {
  return {
    changes_made: value.changes_made,
    config: from_candid_AppConfig_n6(_uploadFile, _downloadFile, value.config)
  };
}
function from_candid_record_n25(_uploadFile, _downloadFile, value) {
  return {
    auth_schema: value.auth_schema,
    api_schema: from_candid_ApiSchema_n8(_uploadFile, _downloadFile, value.api_schema),
    ui_schema: from_candid_UiSchema_n26(_uploadFile, _downloadFile, value.ui_schema),
    database_schema: value.database_schema
  };
}
function from_candid_record_n27(_uploadFile, _downloadFile, value) {
  return {
    navigation: value.navigation,
    pages: from_candid_vec_n28(_uploadFile, _downloadFile, value.pages)
  };
}
function from_candid_record_n30(_uploadFile, _downloadFile, value) {
  return {
    page_name: value.page_name,
    role: record_opt_to_undefined(from_candid_opt_n13(_uploadFile, _downloadFile, value.role)),
    layout: value.layout,
    components: value.components,
    route: value.route,
    auth_required: value.auth_required
  };
}
function from_candid_record_n33(_uploadFile, _downloadFile, value) {
  return {
    application_structure: value.application_structure,
    role_hierarchy: from_candid_vec_n34(_uploadFile, _downloadFile, value.role_hierarchy),
    architecture_model: value.architecture_model,
    user_flows: value.user_flows
  };
}
function from_candid_record_n36(_uploadFile, _downloadFile, value) {
  return {
    permissions: value.permissions,
    role_name: value.role_name,
    parent_role: record_opt_to_undefined(from_candid_opt_n13(_uploadFile, _downloadFile, value.parent_role))
  };
}
function from_candid_record_n39(_uploadFile, _downloadFile, value) {
  return {
    apis: from_candid_vec_n10(_uploadFile, _downloadFile, value.apis),
    entities: value.entities,
    assumptions: value.assumptions,
    pages: from_candid_vec_n14(_uploadFile, _downloadFile, value.pages),
    roles: from_candid_vec_n17(_uploadFile, _downloadFile, value.roles),
    business_rules: value.business_rules
  };
}
function from_candid_record_n42(_uploadFile, _downloadFile, value) {
  return {
    errors: from_candid_vec_n43(_uploadFile, _downloadFile, value.errors),
    is_valid: value.is_valid,
    warnings: from_candid_vec_n43(_uploadFile, _downloadFile, value.warnings),
    config: record_opt_to_undefined(from_candid_opt_n46(_uploadFile, _downloadFile, value.config))
  };
}
function from_candid_record_n45(_uploadFile, _downloadFile, value) {
  return {
    field: record_opt_to_undefined(from_candid_opt_n13(_uploadFile, _downloadFile, value.field)),
    message: value.message,
    severity: value.severity,
    error_code: value.error_code
  };
}
function from_candid_record_n5(_uploadFile, _downloadFile, value) {
  return {
    repairs_made: value.repairs_made,
    is_valid: value.is_valid,
    final_config: from_candid_AppConfig_n6(_uploadFile, _downloadFile, value.final_config)
  };
}
function from_candid_record_n7(_uploadFile, _downloadFile, value) {
  return {
    api: from_candid_ApiSchema_n8(_uploadFile, _downloadFile, value.api),
    auth: value.auth,
    entities: value.entities,
    database: value.database,
    app_name: value.app_name,
    pages: from_candid_vec_n14(_uploadFile, _downloadFile, value.pages),
    roles: from_candid_vec_n17(_uploadFile, _downloadFile, value.roles),
    business_rules: value.business_rules
  };
}
function from_candid_record_n9(_uploadFile, _downloadFile, value) {
  return {
    endpoints: from_candid_vec_n10(_uploadFile, _downloadFile, value.endpoints)
  };
}
function from_candid_vec_n10(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ApiEndpoint_n11(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n14(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Page_n15(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n17(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Role_n18(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n28(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_UiPage_n29(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n34(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_RoleHierarchyEntry_n35(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n43(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ValidationError_n44(_uploadFile, _downloadFile, x));
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
function useCompile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (prompt) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.compile(prompt);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    }
  });
}
function useExecute() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (configJson) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.execute(configJson);
    }
  });
}
function useMetrics() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getMetrics();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
}
function useRunBenchmark() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (index) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.runBenchmark(BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    }
  });
}
export {
  useExecute as a,
  useRunBenchmark as b,
  useMetrics as c,
  useCompile as u
};
