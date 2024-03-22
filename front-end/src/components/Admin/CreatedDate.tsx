import { Text } from "@mantine/core";
import React, { useContext } from "react";
import { AuthContext } from "@/contexts";

interface CreatedDateProps {
    date: string;
}

export function CreatedDate(props: CreatedDateProps) {
  const user = useContext(AuthContext);

  if (!user || !user.user?.isAdmin) return null;

  return (
    <Text size="sm" color="dimmed">
            Créé le { new Date(props.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) }
    </Text>
  );
}