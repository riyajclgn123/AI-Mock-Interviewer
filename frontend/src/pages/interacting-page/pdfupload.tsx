import { useState } from "react";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { Button, Text, Group, Container, Textarea } from "@mantine/core";
import { IconUpload, IconFile } from "@tabler/icons-react";
import axios from "axios";

export const PdfUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});

  const handleUpload = async () => {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  setUploading(true);

  try {
    const response = await axios.post("http://localhost:5000/upload-resume", formData);
    const resumeText = response.data.resumeText;

    const qRes = await axios.post("http://localhost:5000/generate-questions", {
      resumeText: resumeText,
    });

    setQuestions(qRes.data.questions);
    console.log("resumeText", resumeText);
  } catch (error) {
    console.error("Upload failed", error);
    alert("Upload failed. Check backend connection.");
  } finally {
    setUploading(false);
  }
};

 

  const submitAnswer = async (question: string) => {
    const answer = responses[question];
    await axios.post("http://localhost:5000/submit-response", { question, answer });
    alert("Response saved!");
  };

  return (
    <Container>
      <Dropzone
        onDrop={(files) => setFile(files[0])}
        onReject={(files) => console.log("Rejected files", files)}
        maxSize={5 * 1024 ** 2}
        accept={[MIME_TYPES.pdf]}
      >
        <Group justify="center" style={{ minHeight: 150 }}>
          {file ? (
            <>
              <IconFile size={40} />
              <Text>{file.name}</Text>
            </>
          ) : (
            <>
              <IconUpload size={40} />
              <Text>Drag & drop your resume here, or click to select</Text>
            </>
          )}
        </Group>
      </Dropzone>

      <Button mt="md" onClick={handleUpload} disabled={!file || uploading} loading={uploading}>
        Upload Resume
      </Button>

      {questions.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <Text size="lg" >
            Generated Interview Questions
          </Text>
          {questions.map((q, index) => (
            <div key={index} style={{ marginTop: "1rem" }}>
              <Text><strong>Q{index + 1}:</strong> {q}</Text>
              <Textarea
                placeholder="Type your answer here..."
                autosize
                minRows={2}
                value={responses[q] || ""}
                onChange={(e) => setResponses({ ...responses, [q]: e.currentTarget.value })}
              />
              <Button mt="xs" onClick={() => submitAnswer(q)}>
                Submit Answer
              </Button>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};
