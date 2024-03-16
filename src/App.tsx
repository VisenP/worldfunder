import "./App.css";

import { ConnectKitButton } from "connectkit";

import { MainPage } from "./pages/MainPage.tsx";

function App() {
    return (
        <div className={"w-full h-full flex flex-col"}>
            <div className={"flex w-full justify-end"}>
                <ConnectKitButton />
            </div>
            <MainPage />
        </div>
    );
}

export default App;
