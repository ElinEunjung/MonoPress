interface BaseNavLinks {
  id: number;
  to: string;
  title: string;
  textContent: string;
  component: "Link" | "a" | "button";
}

export const baseNavLinks = [
  {
    id: 0,
    to: "/",
    title: "home",
    textContent: "Home",
    component: "Link",
  },
  {
    id: 1,
    to: "/news",
    title: "news",
    textContent: "News",
    component: "Link",
  },
  {
    id: 2,
    to: "/dashboard",
    title: "dashboard",
    textContent: "Dashboard",
    component: "Link",
  },
] as const satisfies ReadonlyArray<BaseNavLinks>;
