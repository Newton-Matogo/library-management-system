import { useState } from "react";

function SpaceBookingPage() {
  const [space, setSpace] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");

    if (endTime <= startTime) {
      setMessage("End time must be later than start time.");
      return;
    }

    setMessage(
      `Booking details recorded: ${space} on ${date}, from ${startTime} to ${endTime}.`,
    );
  };

  return (
    <main>
      <h1>Book a Study Space</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="space">Choose a space</label>
          <select
            id="space"
            value={space}
            onChange={(event) => setSpace(event.target.value)}
            required
          >
            <option value="">Select a space</option>
            <option value="Study Room 1">Study Room 1</option>
            <option value="Study Room 2">Study Room 2</option>
            <option value="Meeting Room">Meeting Room</option>
          </select>
        </div>

        <div>
          <label htmlFor="date">Booking date</label>
          <input
            id="date"
            type="date"
            min={today}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="startTime">Start time</label>
          <input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="endTime">End time</label>
          <input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            required
          />
        </div>

        <button type="submit">Submit Booking</button>
      </form>

      {message && <p role="status">{message}</p>}
    </main>
  );
}

export default SpaceBookingPage;
