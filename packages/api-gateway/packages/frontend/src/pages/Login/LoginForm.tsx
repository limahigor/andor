import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "font-awesome/css/font-awesome.min.css";
import "material-design-icons/iconfont/material-icons.css";
import "./LoginForm.css";
import "./utils.css";

const LoginForm: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [setErrorMessage] = useState("");

	const gatewayUrl = "http://localhost:5050/api/login";

	const navigate = useNavigate();
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token){
			navigate("/");
		}
	}, [navigate]);

	const handleLoginSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		try {
			const response = await fetch(gatewayUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			if (response.ok) {
				const data = await response.json();
				console.log("Login realizado com sucesso: ", data);
				localStorage.setItem("token", data);

				window.location.href = "/";
			} else {
				const errorData = await response.json();
				setErrorMessage(errorData.message || "Erro ao fazer login");
				alert("Login nao realizado " + errorData.name);
			}
			console.log("Login realizado com sucesso: ");
		} catch (error) {
			console.error("Erro na requisição:", error);
			setErrorMessage("Falha na conexão com o servidor.");
		}
	};

	return (
		<div className="limiter">
			<div className="container-login100">
				<div className="wrap-login100">
					<form className="login100-form validate-form">
						<span className="login100-form-title p-b-26">
							Welcome
						</span>
						<span className="login100-form-title p-b-48">
							<i className="zmdi zmdi-font"></i>
						</span>

						<div className="wrap-input100 validate-input">
							<input
								className="input100"
								type="text"
								name="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
							<span className="focus-input100" data-placeholder="Username"></span>
						</div>

						<div className="wrap-input100 validate-input" data-validate="Enter password">
							<span className="btn-show-pass">
								<i className="zmdi zmdi-eye"></i>
							</span>
							<input
								className="input100"
								type="password"
								name="pass"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<span className="focus-input100" data-placeholder="Password"></span>
						</div>

						<div className="container-login100-form-btn">
							<div className="wrap-login100-form-btn">
								<div className="login100-form-bgbtn"></div>
								<button type="submit" className="login100-form-btn" onClick={handleLoginSubmit}>
									Login
								</button>
							</div>
						</div>

						<div className="text-center p-t-115">
							<span className="txt1">
								Don’t have an account?
							</span>

							<Link className="txt2" to="/signup">
								Sign Up
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
