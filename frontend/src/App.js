import React, { useState } from "react";
import axios from "axios"; // If you choose axios. If not, you can use fetch API instead.

const App = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Axios version
      const response = await axios.post("http://127.0.0.1:8001/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("File uploaded successfully", response.data);

      // Fetch version (alternative)
      // const response = await fetch("http://127.0.0.1:8001/upload", {
      //   method: "POST",
      //   body: formData,
      // });
      // const data = await response.json();
      // console.log("File uploaded successfully", data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Upload Your File</h2>
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
          <div className="card-actions justify-end">
            <button
              onClick={handleUpload}
              className="btn btn-primary mt-4"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
