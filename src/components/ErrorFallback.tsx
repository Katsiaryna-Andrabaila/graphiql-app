import { useErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }: {error: Error}) {
  const { resetBoundary } = useErrorBoundary();

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button onClick={(resetBoundary)}>Try again</button>
    </div>
  );
}

export {ErrorFallback}