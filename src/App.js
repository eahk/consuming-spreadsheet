import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

/* spreadsheet endpoint */
const appScript =
  "https://script.google.com/macros/s/AKfycbx0IZddRzOVl3d8TQnV9XcXAVHCIl8iH_Y3ZKDM_G1ddT-iS-Cv/exec";
const corsAnyWhere = "https://cors-anywhere.small-service.gpeastasia.org/";
/* endpoint */

function App() {
  const [appState, setAppState] = useState({
    loading: false,
    ip: "",
    repos: null,
    reposData: null,
    questionnaireData: null,
  });
  /* template data */
  /* the object must follow the same name on the spreadsheet */
  let templateData = {
    rows: [
      {
        ip: "192.168.1.1",
        question1: "true",
        question2: "false",
        question3: "false",
      },
    ],
  };

  const handleClick = () => {
    console.log("click");
    try {
      let postData = templateData;
      axios
        .post(corsAnyWhere + appScript + `?sheetName=questionnaire`, postData, {
          headers: { "Content-Type": "text/plain;charset=utf-8" },
        })
        .then((repos) => {
          console.log(repos);
          console.log("data submitted");
          updateData();
        });
    } catch (err) {
      console.log(err);
    }
  };
  const updateData = () => {
    axios
      .get(corsAnyWhere + appScript + "?sheetName=questionnaire")
      .then((repos) => {
        // console.log(repos);
        let questionnaireData = repos.data.values;
        questionnaireData.shift();
        console.log(questionnaireData);
        //
        setAppState({ questionnaireData: questionnaireData });
        //
        setAppState({ loading: false });
      });
  };
  useEffect(() => {
    setAppState({ loading: true });
    //
    try {
      let ipRes = axios.get("https://api.ipify.org?format=json");
      let ipDetected = ipRes.data.ip;
      setAppState({ ip: ipDetected });
      console.log(ipDetected);
      // on local env
      /*
      if (process.env.NODE_ENV === "dev") {
        this.appScript = this.corsAnyWhere + this.appScript;
      }
      */
      // this.appScript = this.corsAnyWhere + this.appScript;
    } catch (err) {
      console.log(err);
    }
    //
    updateData();
  }, [setAppState]);
  return (
    <div className="App">
      <hr />
      <button className="submit" onClick={() => handleClick()}>
        Submit + 1
      </button>
      {appState.loading && <h2>Loading</h2>}
      {!appState.loading && <h2>Fetched</h2>}
      <hr />
    </div>
  );
}

export default App;

/* references */
/*
const getSummary = () => {
  try {
    let summaryRef = axios.get(this.appScript + "?sheetName=votes_summary");
    this.summary = summaryRef.data.values;
    // remove sheet header
    this.summary.shift();
    // console.log(this.summary);
  } catch (err) {
    console.log(err);
  }
};

const submitDecision = (value) => {
  try {
    let postData = {
      rows: [
        {
          ip: this.ip,
          category: value.category,
          brand: value.brand,
        },
      ],
    };

    axios.post(this.appScript + `?sheetName=votes`, postData, {
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    });
  } catch (err) {
    console.log(err);
  }
};
*/
