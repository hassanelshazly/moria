import React from "react";
import CallToAction from "../components/CallToAction";
import Grid from "@material-ui/core/Grid";
import Posts from "../components/Posts";

import { useStateValue } from "../state/store";
import { setDialog } from "../state/actions";

function App() {
  const [{ user }, dispatch] = useStateValue();

  const handleAction = () => {
    if (user) dispatch(setDialog("create-post"));
    else dispatch(setDialog("sign-in"));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CallToAction
          headerTitle="Moria Social Media Platform"
          subheaderTitle="Connect with the people you care about"
          subtitle="Sign in now and start posting"
          primaryActionText={user ? "Post" : "Sign in"}
          handlePrimaryAction={handleAction}
        />
      </Grid>
      <Grid item xs={12}>
        <Posts />
      </Grid>
    </Grid>
  );
}

export default App;
