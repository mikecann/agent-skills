type User = {
  preferredName?: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  age: number;
};

export function getDisplayLabel(user: User | null) {
  let label = "Anonymous";

  if (user) {
    if (user.isVerified) {
      if (user.age >= 18) {
        if (user.preferredName) {
          label = user.preferredName;
        } else {
          if (user.firstName && user.lastName) {
            label = `${user.firstName} ${user.lastName}`;
          } else {
            label = "Anonymous";
          }
        }
      } else {
        label = "Anonymous";
      }
    } else {
      label = "Anonymous";
    }
  } else {
    label = "Anonymous";
  }

  return label;
}
