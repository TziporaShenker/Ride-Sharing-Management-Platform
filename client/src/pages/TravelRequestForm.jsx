import React, { useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  Box,
  Container,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  Grid,
  FormGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const TravelRequestForm = () => {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    travelTime: "",
    travelDate: "",
    numberOfPassengers: 1,
    isAlone: false,
    frequency: "",
    status: "התקבלה",
    travelType: "חד פעמי",
    recurringDays: [],
    recurringDuration: "",
    endDate: "",
  });

  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "numberOfPassengers" && (value !== "1" && value !== "2")) {
      setError("Number of passengers must be 1 or 2");
    } else {
      setError(""); 
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDayChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => {
      const recurringDays = checked
        ? [...prevFormData.recurringDays, name]
        : prevFormData.recurringDays.filter((day) => day !== name);

      return { ...prevFormData, recurringDays };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const travelDate = new Date(`${formData.travelDate}T${formData.travelTime}`);

    if (travelDate < currentDate) {
      setError("Travel date and time must be in the future");
      return;
    }

    if (formData.travelType === "קבוע" && formData.endDate) {
      const endDate = new Date(formData.endDate);
      if (endDate < currentDate) {
        setError("End date must be in the future");
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:3000/travelRequests", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create travel request");
      }

      const data = await response.json();
      console.log("Travel request created successfully:", data);

      setIsSubmitted(true);
      setOpenDialog(true);

      setFormData({
        origin: "",
        destination: "",
        travelTime: "",
        travelDate: "",
        numberOfPassengers: 1,
        isAlone: false,
        frequency: "",
        status: "התקבלה",
        travelType: "חד פעמי",
        recurringDays: [],
        recurringDuration: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Error creating travel request:", error.message);
      setError("Failed to create travel request");
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    window.location.href = "/"; 
  };

  return (
    <Container>
      {isSubmitted ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" color="success.main">
            Travel request submitted successfully!
          </Typography>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
         
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label="Origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label="Destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label="Travel Date"
                name="travelDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.travelDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label="Travel Time"
                name="travelTime"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.travelTime}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label="Number of Passengers"
                name="numberOfPassengers"
                type="number"
                value={formData.numberOfPassengers}
                onChange={handleChange}
                inputProps={{ min: 1, max: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="travelType-label">Travel Type</InputLabel>
                <Select
                  labelId="travelType-label"
                  name="travelType"
                  value={formData.travelType}
                  onChange={handleChange}
                  label="Travel Type"
                >
                  <MenuItem value="חד פעמי">One-time</MenuItem>
                  <MenuItem value="קבוע">Fixed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {formData.travelType === "קבוע" && (
            <>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="recurringDuration-label">Recurring Frequency</InputLabel>
                    <Select
                      labelId="recurringDuration-label"
                      name="recurringDuration"
                      value={formData.recurringDuration}
                      onChange={handleChange}
                      label="Recurring Frequency"
                    >
                      <MenuItem value="Daily">Daily</MenuItem>
                      <MenuItem value="Weekly">Weekly</MenuItem>
                      <MenuItem value="Monthly">Monthly</MenuItem>
                      <MenuItem value="Select Days in a Week">Select Days in a Week</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    name="endDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              {formData.recurringDuration === "Select Days in a Week" && (
                <>
                  <Typography variant="subtitle2">Select Days</Typography>
                  <FormGroup row>
                    {["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"].map((day) => (
                      <FormControlLabel
                        key={day}
                        control={
                          <Checkbox
                            name={day}
                            checked={formData.recurringDays.includes(day)}
                            onChange={handleDayChange}
                          />
                        }
                        label={day}
                      />
                    ))}
                  </FormGroup>
                </>
              )}
            </>
          )}
          <FormControlLabel
            control={
              <Checkbox
                name="isAlone"
                checked={formData.isAlone}
                onChange={handleChange}
              />
            }
            label="Alone"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Submit Request
          </Button>
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleOutlineIcon color="success" />
            Travel request submitted successfully!
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Travel request submitted successfully!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TravelRequestForm;
