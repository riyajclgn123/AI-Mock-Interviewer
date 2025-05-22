import { useEffect, useState } from "react";
import { useUser } from "../../authentication/use-auth";
import { Card, Text, Title, Stack, Divider } from "@mantine/core";
import axios from "axios";
import { EnvVars } from "../../config/env-vars";

export const HistoryPage = () => {
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<{ questions: string[]; answers: string[] }[]>([]);
  const userId = JSON.parse(localStorage.getItem("user") || "{}")?.userId;

  useEffect(() => {
    const fetch = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(`${EnvVars.apiBaseUrl}/history/${userId}`);
        setHistory(res.data.history || []);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.id]);

  if (loading) return <Text>Loading history...</Text>;
  if (!history.length) return <Text>No interview history found.</Text>;

  return (
    <div>
      <Title order={2} mb="lg">Your Interview History</Title>
      {history.map((entry, i) => (
        <Card key={i} shadow="sm" radius="md" my="md" padding="lg" withBorder>
          <Title order={4} mb="sm">Session #{i + 1}</Title>
          <Divider mb="sm" />
          <Stack >
            {entry.questions.map((q, idx) => (
              <div key={idx}>
                <Text fw={600} size="md" c="blue.7">Q{idx + 1}: {q}</Text>
                <Text size="md" c="white">A{idx + 1}: {entry.answers[idx]}</Text>
              </div>
            ))}
          </Stack>
        </Card>
      ))}
    </div>
  );
};
