import React from "react";
import "../styles/Workspace.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import RecommendedForYouDesigns from "./RecommendedForYouDesigns";
import Upload from "./Upload";
import Trash from "./Trash";
import Explore from "./Explore";
import Favorites from "./Favorites";

function Workspace() {
  return (
    <div className="Workspace">
      <div className="innerWorkspace">
        <Router>
          <Switch>
            <Route path="/dashboard/trash">
              <Trash />
            </Route>
            <Route path="/dashboard/explore">
              <Explore />
            </Route>
            <Route path="/dashboard/upload">
              <Upload />
            </Route>
            <Route path="/dashboard/favorites">
              <Favorites />
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
