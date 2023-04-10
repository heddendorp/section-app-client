export function transitionHelper({
  skipTransition = false,
  classNames = [],
  updateDOM,
}: {
  skipTransition?: boolean;
  classNames?: string[];
  updateDOM: () => void;
}) {
  if (skipTransition || !(document as any).startViewTransition) {
    const updateCallbackDone = Promise.resolve(updateDOM()).then(() => {});
    const ready = Promise.reject(Error('View transitions unsupported'));

    // Avoid spamming the console with this error unless the promise is used.
    ready.catch(() => {});

    return {
      ready,
      updateCallbackDone,
      finished: updateCallbackDone,
      skipTransition: () => {},
    };
  }

  document.documentElement.classList.add(...classNames);

  const transition = (document as any).startViewTransition(updateDOM);

  transition.finished.finally(() =>
    document.documentElement.classList.remove(...classNames)
  );

  return transition;
}
