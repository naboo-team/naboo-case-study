import { City, EmptyData, PageTitle } from "@/components";
import { withApolloClient } from "@/graphql/apollo";
import {
  GetCitiesQuery,
  GetCitiesQueryVariables,
} from "@/graphql/generated/types";
import GetCities from "@/graphql/queries/city/getCities";
import { Flex } from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";

interface ExplorerProps {
  cities: GetCitiesQuery["getCities"];
}

export const getServerSideProps: GetServerSideProps<
  ExplorerProps
> = withApolloClient(async (client, context) => {
  const response = await client.query<
    GetCitiesQuery,
    GetCitiesQueryVariables
  >({
    query: GetCities,
  });
  return { props: { cities: response.data.getCities } }
});

export default function Explorer({ cities }: ExplorerProps) {
  return (
    <>
      <Head>
        <title>Explorer | CDTR</title>
      </Head>
      <PageTitle title="Trouvez une activité dans votre ville" />
      <Flex direction="column" gap="1rem">
        {cities.length > 0 ? (
          cities.map((city) => <City city={city} key={city} />)
        ) : (
          <EmptyData />
        )}
      </Flex>
    </>
  );
}
