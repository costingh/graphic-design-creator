import React from "react";
import "../styles/Workspace.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import RecommendedForYouDesigns from "./RecommendedForYouDesigns";
import Upload from "./Upload";
import Folders from "./Folders";
import Trash from "./Trash";

function Workspace() {
  return (
    <div className="Workspace">
      <h1>All public designs</h1>
      <div className="innerWorkspace">
        <Router>
          <Switch>
            <Route path="/dashboard/trash">
              <Trash />
            </Route>
            <Route path="/dashboard/upload">
              <Upload />
            </Route>
            <Route path="/dashboard/folders">
              <Folders />
            </Route>
            <Route path="/dashboard">
              <RecommendedForYouDesigns />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default Workspace;
