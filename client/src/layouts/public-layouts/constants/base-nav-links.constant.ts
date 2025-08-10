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
    title: "home",
    textContent: "Home",
  },
  {
    id: 1,
    to: "/news",
    title: "news",
    textContent: "News",
  },
  {
    id: 2,
    to: "/dashboard",
    title: "dashboard",
    textContent: "Dashboard",
  },
] satisfies ReadonlyArray<BaseNavLinks>;
