import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import "./login.css";

const Login = () => {
     const [login, setLogin] = useState("");
     const [password, setPassword] = useState("");
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate();

     const loginUser = async () => {
          setLoading(true);
          try {
               const { data } = await axios.post("https://i-ash-server.vercel.app/api/login", {
                    login,
                    password,
               });

               localStorage.setItem("token", data.token);
               setTimeout(() => {
                    navigate("/");
                    window.location.reload();
               }, 1500);
          } catch (error) {
               console.error("Ошибка авторизации:", error);
               alert("❌ Ошибка: неверный логин или пароль!");
          } finally {
               // Спиннер будет показываться минимум 2 секунды
               setTimeout(() => {
                    setLoading(false);
               }, 2000);
          }
     };

     return (
          <div className="login">
               <form
                    className="form"
                    onSubmit={(e) => {
                         e.preventDefault();
                         loginUser();
                    }}
               >
                    <h2>Вход</h2>
                    <label>Логин</label>
                    <input
                         type="text"
                         value={login}
                         onChange={(e) => setLogin(e.target.value)}
                         placeholder="Введите логин"
                         required
                    />

                    <label>Пароль</label>
                    <input
                         type="password"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder="Введите пароль"
                         required
                    />

                    <button type="submit" disabled={loading}>
                         {loading ? (
                              <RotatingLines
                                   strokeColor="white"
                                   strokeWidth="5"
                                   animationDuration="0.75"
                                   width="24"
                                   visible={true}
                              />
                         ) : (
                              "Войти"
                         )}
                    </button>
               </form>
          </div>
     );
};

export default Login;
