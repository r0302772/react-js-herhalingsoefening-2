import {Route, Routes} from "react-router-dom";
import Home from "./pages/home/home.jsx";
import User from "./pages/user/user.jsx";
import Login from "./pages/login/login.jsx";
import Group from "./pages/group/group.jsx";
import Chat from "./pages/chat/chat.jsx";

const Routing = () => {
    return (
        <Routes>
            <Route path={'/'} element={<Home/>}/>
            <Route path={'/user'} element={<User/>}/>
            <Route path={'/login'} element={<Login/>}/>
            <Route path={'/groups'} element={<Group/>}/>
            <Route path={'/chat'} element={<Chat/>}/>
        </Routes>
    )
}

export default Routing;
