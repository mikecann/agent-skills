type User = {
  name: string;
};

type Props = {
  user: User | null;
  hasError: boolean;
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
  }
}

export function UserPanel({ user, hasError }: Props) {
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
      </div>
    );
  } else {
    return <div>No user</div>;
  }
}
