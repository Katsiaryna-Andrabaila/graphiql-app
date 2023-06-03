import { Button } from '@mantine/core';
import { useErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  const { resetBoundary } = useErrorBoundary();

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <Button onClick={resetBoundary}>Try again</Button>
    </div>
  );
}

export { ErrorFallback };
