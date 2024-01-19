import { useAuth } from "@/hooks";
import { Burger, Container, Group, Header, Switch } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { MenuItem } from "./MenuItem";
import { useTopbarStyles } from "./Topbar.styles";
import { getFilteredRoutes } from "./getFilteredRoutes";
import { Route } from "./types";
import { useDebugMode } from "@/hooks/useDebugMode";

interface TopbarProps {
  routes: Route[];
}

export function Topbar({ routes }: TopbarProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useTopbarStyles();
  const { user } = useAuth();
  const filteredRoutes = getFilteredRoutes(routes, user);
  const [isDebugMode, toggleDebugMode] = useDebugMode();

  return (
    <Header height={56} className={classes.header}>
      <Container>
        <div className={classes.inner}>
          <Link href="/" className={classes.mainLink}>
            <h1 className={classes.title}>Candidator</h1>
          </Link>
          <Group spacing={5} className={classes.links}>
            {filteredRoutes.map((route) => (
              <MenuItem key={route.label} {...route} />
            ))}
            {
            <Switch checked={isDebugMode} onChange={toggleDebugMode} label='Debug mode'/> 
            }
          </Group>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
            color="#fff"
          />
        </div>
      </Container>
    </Header>
  );
}
