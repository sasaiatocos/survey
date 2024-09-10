import { GetLaunches } from "./components/api/GetLaunches";
import { WithApolloProvider } from "./providers/WithApolloProvider";

export default function Home() {
  return (
    <div>
      <h1>SpaceX Launches</h1>
      <p>---------------------</p>
      <WithApolloProvider>
        <GetLaunches />
      </WithApolloProvider>
    </div>
  );
}
