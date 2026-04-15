import "./LoginPage.css";
import { useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";
import QMIcon from "/qm.svg?url";
import EmailIcon from "../assets/login_page/envelope.svg";
import PasswordIcon from "../assets/login_page/lock.svg";
import EyeIcon from "../assets/login_page/eye.svg";
import EyeCrossedIcon from "../assets/login_page/eye-crossed.svg";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setErrorMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorMessage(error.message);
        }

        const { data: userRow, error: userError } = await supabase
            .from("users")
            .select("status")
            .eq("email", email)
            .single();

        if (userError) {
            setErrorMessage(userError.message);
            await supabase.auth.signOut();
            return;
        }

        if (userRow?.status === "disabled") {
            await supabase.auth.signOut();
            return;
        }
    }

    return (
        <form className="LoginForm" onSubmit={handleLogin}>
            <img src={QMIcon} alt="" className="LogoIcon" />

            <h1 className="FormTitle">Q-Resolve</h1>

            <div className="InputContainer">
                <img src={EmailIcon} alt="" className="InputIcon LeftIcon" />
                <input
                    id="EmailInput"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="EMAIL"
                />
            </div>

            <div className="InputContainer">
                <img src={PasswordIcon} alt="" className="InputIcon LeftIcon" />
                <input
                    id="PasswordInput"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="PASSWORD"
                />
                <button
                    type="button"
                    className="EyeButton"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <img
                        src={showPassword ? EyeCrossedIcon : EyeIcon}
                        alt=""
                        className="InputIcon RightIcon"
                    />
                </button>
            </div>

            <div className="InputButton">
                <button id="LogInButton" type="submit">
                    LOGIN
                </button>
            </div>

            <div className="OutputData">
                {errorMessage && <p>{errorMessage}</p>}
            </div>
        </form>
    );
};

export default LoginPage;
