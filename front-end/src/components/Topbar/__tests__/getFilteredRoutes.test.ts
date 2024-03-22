import { GetUserQuery } from "@/graphql/generated/types";
import { checkRouteAccess, getFilteredRoutes } from "../getFilteredRoutes";
import { Route, SubRoute } from "../types";

interface CheckRouteAccessTest {
  description: string;
  route: Route | SubRoute;
  hasUser: boolean;
  result: boolean;
}

const user: GetUserQuery["getMe"] = {
  id: "user1",
  email: "user1@test.fr",
  firstName: "john",
  lastName: "doe",
  favourites: [],
  isAdmin: false,
};

describe("la fonction checkRouteAccess", () => {
  it.each([
    {
      description:
        "pour une route avec requiredAuth = undefined et user = null => doit retourner true",
      route: { requiredAuth: undefined, label: "route1", route: "/route1" },
      hasUser: false,
      result: true,
    },
    {
      description:
        "pour une route avec requiredAuth = false et user = null => doit retourner true",
      route: { requiredAuth: false, label: "route1", route: "/route1" },
      hasUser: false,
      result: true,
    },
    {
      description:
        "pour une route avec requiredAuth = true et user = null => doit retourner false",
      route: { requiredAuth: true, label: "route1", route: "/route1" },
      hasUser: false,
      result: false,
    },
    {
      description:
        "pour une route avec requiredAuth = false et user != null => doit retourner false",
      route: { requiredAuth: false, label: "route1", route: "/route1" },
      hasUser: true,
      result: false,
    },
    {
      description:
        "pour une route avec requiredAuth = undefined et user != null => doit retourner true",
      route: { requiredAuth: undefined, label: "route1", route: "/route1" },
      hasUser: true,
      result: true,
    },
    {
      description:
        "pour une route avec requiredAuth = true et user != null => doit retourner true",
      route: { requiredAuth: true, label: "route1", route: "/route1" },
      hasUser: true,
      result: true,
    },
  ])("$description", ({ route, hasUser, result }: CheckRouteAccessTest) => {
    expect(checkRouteAccess(route, hasUser ? user : null)).toBe(result);
  });
});

describe("la fonction getFilteredRoutes", () => {
  const routes: Route[] = [
    { label: "Route1", route: "/route1" },
    { label: "Route2", route: "/route2", requiredAuth: true },
    { label: "Route3", route: "/route3", requiredAuth: false },
    {
      label: "Route4",
      route: [
        {
          label: "Route4.1",
          link: "/route4.1",
          requiredAuth: false,
        },
        {
          label: "Route4.2",
          link: "/route4.2",
          requiredAuth: true,
        },
      ],
    },
  ];
  it("doit retourner les bonnes routes si un user est connecté", () => {
    const filtereRoutes = getFilteredRoutes(routes, user);
    expect(filtereRoutes).toEqual([
      { label: "Route1", route: "/route1" },
      { label: "Route2", route: "/route2", requiredAuth: true },
      {
        label: "Route4",
        route: [
          {
            label: "Route4.2",
            link: "/route4.2",
            requiredAuth: true,
          },
        ],
      },
    ]);
  });

  it("doit retourner les bonnes routes si un n'est pas est connecté", () => {
    const filtereRoutes = getFilteredRoutes(routes, null);
    expect(filtereRoutes).toEqual([
      { label: "Route1", route: "/route1" },
      { label: "Route3", route: "/route3", requiredAuth: false },
      {
        label: "Route4",
        route: [
          {
            label: "Route4.1",
            link: "/route4.1",
            requiredAuth: false,
          },
        ],
      },
    ]);
  });
});
