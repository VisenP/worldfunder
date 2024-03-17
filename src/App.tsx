import "./App.css";

import { ConnectKitButton } from "connectkit";

import img from "./assets/logo.webp";
import { MainPage } from "./pages/MainPage.tsx";

function App() {
    return (
        <div
            className={
                "w-full h-full flex flex-col bg-gradient-to-b from-sky-50 to-sky-100 p-5 rounded-xl"
            }
        >
            <div className={"flex w-full justify-between"}>
                <img src={img} className={"w-20 h-20 rounded-xl"} alt={""} />
                <ConnectKitButton />
            </div>
            <MainPage />
        </div>
    );
}

export default App;
