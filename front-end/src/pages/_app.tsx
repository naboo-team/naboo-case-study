import { Topbar } from "@/components";
import { AuthProvider, SnackbarProvider } from "@/contexts";
import { routes } from "@/routes";
import { graphqlClient } from "@/graphql/apollo";
import { mantineTheme } from "@/utils";
import { ApolloProvider } from "@apollo/client";
import { Container, MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import { FavoritesProvider } from "@/contexts/favoriteContext";
import { useAuth } from "@/hooks";

export default function App({ Component, pageProps }: AppProps) {
  const { user } = useAuth();
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={mantineTheme}>
      <SnackbarProvider>
        <ApolloProvider client={graphqlClient}>
          <AuthProvider>
            <FavoritesProvider userId={user?.id}>
              <Topbar routes={routes} />
              <Container>
                <Component {...pageProps} />
              </Container>
            </FavoritesProvider>
          </AuthProvider>
        </ApolloProvider>
      </SnackbarProvider>
    </MantineProvider>
  );
}
