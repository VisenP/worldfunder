import "./App.css";

import { ConnectKitButton } from "connectkit";

import { MainPage } from "./pages/MainPage.tsx";

function App() {
    return (
        <div
            className={
                "w-full h-full flex flex-col bg-gradient-to-b from-sky-50 to-sky-100 p-5 rounded-xl"
            }
        >
            <div className={"flex w-full justify-end"}>
                <ConnectKitButton />
            </div>
            <MainPage />
        </div>
    );
}

export default App;
