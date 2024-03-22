import { Topbar } from "@/components";
import { AuthProvider, SnackbarProvider } from "@/contexts";
import { routes } from "@/routes";
import { graphqlClient } from "@/graphql/apollo";
import { mantineTheme } from "@/utils";
import { ApolloProvider } from "@apollo/client";
import { Container, MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import { UserProvider } from "@/contexts/userContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={mantineTheme}>
      <SnackbarProvider>
        <ApolloProvider client={graphqlClient}>
          <AuthProvider>
            <UserProvider>
              <Topbar routes={routes} />
              <Container>
                <Component {...pageProps} />
              </Container>
            </UserProvider>
          </AuthProvider>
        </ApolloProvider>
      </SnackbarProvider>
    </MantineProvider>
  );
}
