import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTranscriptFileNames } from "../../api/client";

export function HomePage() {
  const [transcriptFiles, setTranscriptFiles] = useState<Array<string>>([]);

  useEffect(() => {
    void getTranscriptFileNames().then(setTranscriptFiles);
  }, []);

  return (
    <div>
      TRANSCRIPTION
      <br />
      <br />
      <ul>
        {transcriptFiles.map((file) => (
          <li key={file}>
            <Link to={`/transcript/${file}`}>{file}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
