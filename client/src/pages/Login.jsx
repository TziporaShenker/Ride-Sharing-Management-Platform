import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserContext } from "../App"; // נייבא את הקונטקסט
import NavigationMenu from "../components/NavigationMenu";
const theme = createTheme();

function Login() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState(""); // State to hold email for forgot password
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // נשתמש ב-useContext כדי לגשת ל-setUser

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const url = "http://localhost:3000/login";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // This is important to include cookies
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 409) {
            throw new Error("incorrect password or user name");
          }
          return response.json().then((data) => {
            throw new Error(data.message);
          });
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        console.log("data");
        console.log(data);
        setError("");
        navigate("/home");
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  const handleSignupNavigate = () => {
    navigate("/signup");
  };
  const forgotPassword = (event) => {
    event.preventDefault();
    const email = event.target.getAttribute("data-email");
    const url = "http://localhost:3000/forgotPassword";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      credentials: "include",
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("An email with reset instructions has been sent.");
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <NavigationMenu />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)} // Update email state
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
            >
              Log In
            </Button>

            <Grid container>
              <Grid item xs>
                <Link
                  onClick={forgotPassword}
                  data-email={email}
                  variant="body2"
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  component="button"
                  onClick={handleSignupNavigate}
                  variant="body2"
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
