import { useEffect, useState } from 'react';

export function ValidationMessage({
  error,
  isSubmitting,
}: {
  error: string | undefined;
  isSubmitting: boolean;
}) {
  const [show, setShow] = useState(!!error);

  useEffect(() => {
    const id = setTimeout(() => {
      const hasError = !!error;
      setShow(hasError && !isSubmitting);
    });
    return () => clearTimeout(id);
  }, [error, isSubmitting]);

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        height: show ? '1em' : 0,
        transition: 'all 300ms ease-in-out',
      }}
      className="text-red-600"
    >
      {error}
    </div>
  );
}
