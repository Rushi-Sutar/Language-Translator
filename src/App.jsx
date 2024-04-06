import React, { useState, useEffect } from "react";
import "./App.css";
import { languageList } from "./languageList.js";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoCloudDownloadOutline } from "react-icons/io5";

function App() {
  const [languages, setLanguages] = useState(languageList);
  const [inputLanguage, setInputLanguage] = useState("auto");
  const [outputLanguage, setOutputLanguage] = useState("en");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [inputChars, setInputChars] = useState(0);

  useEffect(() => {
    translate(inputText);
  }, [inputText, inputLanguage, outputLanguage]);

  const handleInputTextChange = (e) => {
    const text = e.target.value.slice(0, 5000);
    setInputText(text);
    setInputChars(text.length);
  };

  const translate = async (text) => {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURIComponent(
        text
      )}`;
      const response = await fetch(url);
      const data = await response.json();
      setOutputText(data[0].map((item) => item[0]).join(""));
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const handleSwapLanguages = () => {
    setInputLanguage(outputLanguage);
    setOutputLanguage(inputLanguage);
    setInputText(outputText);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setInputText(text);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translated-to-${outputLanguage}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <h1 className="heading">Language Translator</h1>
      <div className={`container ${darkMode ? "dark" : ""}`}>
        <div className="card input-wrapper">
          <select
            className="DropDown"
            value={inputLanguage}
            onChange={(e) => setInputLanguage(e.target.value)}
          >
            {languages.map((language) => (
              <option
                key={language.code}
                value={language.code}
              >{`${language.name} (${language.native})`}</option>
            ))}
          </select>
          <textarea
            value={inputText}
            onChange={handleInputTextChange}
            cols="30"
            rows="10"
            placeholder="Enter your text here"
          ></textarea>
          <div className="chars">{inputChars} / 5000</div>
          <div className="upload-div">
            <label htmlFor="upload-document" className="upload-btn">
              <span>
                Choose File 
              </span>
              <IoCloudUploadOutline style={{fontSize:"18px", marginLeft:"10px",marginTop:'3px'}} />
              <input
                type="file" 
                id="upload-document"
                hidden
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>
        <div className="center">
          <div className="swap-position" onClick={handleSwapLanguages}>
            <span>&#8596;</span>
          </div>
        </div>
        <div className="card output-wrapper">
          <select
            className="DropDown"
            value={outputLanguage}
            onChange={(e) => setOutputLanguage(e.target.value)}
          >
            {languages.map((language) => (
              <option
                key={language.code}
                value={language.code}
              >{`${language.name} (${language.native})`}</option>
            ))}
          </select>
          <textarea
            value={outputText}
            cols="30"
            rows="10"
            placeholder="Translated text will appear here"
            disabled
          ></textarea>
          <div className="card-bottom">
            <button onClick={handleDownload}>
              <span>Download</span>
              <IoCloudDownloadOutline
                style={{fontSize: "18px", marginLeft:'10px',marginTop:'3px'}}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
