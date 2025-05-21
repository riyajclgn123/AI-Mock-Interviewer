import { useState } from "react";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { Button, Text, Group, Container } from "@mantine/core";
import { IconUpload, IconFile } from "@tabler/icons-react";
import api from "../../config/axios";

export const PdfUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await api.post("/api/upload-resume", formData);

      console.log("Upload success:", response.data);
      alert("Resume uploaded! AI will use it to tailor your questions.");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container>
      <Dropzone
        onDrop={(files) => setFile(files[0])}
        onReject={(files) => console.log("Rejected files", files)}
        maxSize={5 * 1024 ** 2}
        accept={[MIME_TYPES.pdf]}
      >
        <Group justify="center"  style={{ minHeight: 150 }}>
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
      <Button
        mt="md"
        onClick={handleUpload}
        disabled={!file || uploading}
        loading={uploading}
      >
        Upload Resume
      </Button>
    </Container>
  );
};

