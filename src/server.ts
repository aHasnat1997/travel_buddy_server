import { Rocket } from "./app";
import config from "./config";

(function launchpad() {
  const port = config.PORT as string;
  const rocket = new Rocket();
  try {
    rocket.load();
    rocket.initiate();
    rocket.launch(port);
  } catch (error) {
    console.log(error);
  }
})();