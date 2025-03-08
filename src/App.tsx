import { Provider } from "react-redux";
import MainPageLayout from "./components/layout/MainPageLayout";
import { store } from "./store/store";

function App() {
    return <MainPageLayout />;
}

const Root: React.FC = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

export default Root;
