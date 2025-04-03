import "./setup"
import SetupPage from "./setup"
import DashboardPage from "./dashboard"
import {BrowserRouter, Routes, Route} from "react-router-dom";
import TalkToZen from "./talktozen";

export default function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/setup" element={<SetupPage/>}/>
                <Route path="/dashboard" element={<DashboardPage/>}/>
                <Route path="/talktozen" element={<TalkToZen />} />
            </Routes>
        </BrowserRouter>
    )
}