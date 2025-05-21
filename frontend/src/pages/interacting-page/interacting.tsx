import { useAuth } from "../../authentication/use-auth";
import { Button } from "@mantine/core";
import { PdfUploadPage } from "./pdfupload";

export const InteractingPage = () => {
  
  
  return (
    <div>
        <div>
           <h1>Welcome!</h1>
      <p>AI speaks and have conversation over here.</p>
        </div>
      <div>
        <PdfUploadPage />
      </div>

      
    </div>
  );
};