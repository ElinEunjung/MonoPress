interface BaseNavLinks {
  id: number;
  to: string;
  title: string;
  textContent: string;
}

export const baseNavLinks = [
  {
    id: 0,
    to: "/",
    title: "hjem",
    textContent: "Hjem",
  },
  {
    id: 1,
    to: "/dashboard",
    title: "dashboard",
    textContent: "Dashboard",
  },
] satisfies ReadonlyArray<BaseNavLinks>;
