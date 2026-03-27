type User = {
  name: string;
  role: "admin" | "member";
};

type Props = {
  user: User | null;
  hasError: boolean;
  isSaving: boolean;
};

declare function saveDraft(args: { userName: string }): Promise<void>;
declare const toast: {
  success(message: string): void;
  error(message: string): void;
};
declare function ErrorBanner(args: { onRetry: () => void }): JSX.Element;
declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    div: { children?: unknown };
    button: { onClick?: () => void; children?: unknown; disabled?: boolean };
  }
}

export function UserPanel({ user, hasError, isSaving }: Props) {
  const handleRetry = () => {
    saveDraft({ userName: user!.name })
      .then(() => toast.success("Saved"))
      .catch(() => toast.error("Failed"));
  };

  const open = hasError;

  if (user) {
    return (
      <div>
        {open && <ErrorBanner onRetry={handleRetry} />}
        <div>{user.name}</div>
        <button onClick={handleRetry} disabled={isSaving}>
          Retry
        </button>
      </div>
    );
  } else {
    return <div>No user</div>;
  }
}
