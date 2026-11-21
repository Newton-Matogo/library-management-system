import { useEffect, useState } from "react";

function SpaceBookingPage() {
  const [spaces, setSpaces] = useState([]);
  const [spaceId, setSpaceId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingSpaces, setFetchingSpaces] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  // Load available spaces from the backend
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/spaces`);

        if (!response.ok) {
          throw new Error("Could not load library spaces.");
        }

        const data = await response.json();
        setSpaces(data);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setFetchingSpaces(false);
      }
    };

    fetchSpaces();
  }, []);

  // Submit booking to the backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (endTime <= startTime) {
      setMessage("End time must be later than start time.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in before booking a space.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          spaceId,
          startTime: new Date(`${date}T${startTime}:00`).toISOString(),
          endTime: new Date(`${date}T${endTime}:00`).toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Booking failed.",
        );
      }

      setMessage("Your space booking was successfully submitted!");

      setSpaceId("");
      setDate("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Book a Study Space</h1>

      {fetchingSpaces ? (
        <p>Loading available spaces...</p>
      ) : spaces.length === 0 ? (
        <p>No library spaces are currently available.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="space">Choose a space</label>
            <select
              id="space"
              value={spaceId}
              onChange={(event) => setSpaceId(event.target.value)}
              required
            >
              <option value="">Select a space</option>

              {spaces.map((space) => (
                <option key={space.id} value={space.id}>
                  {space.name} (Capacity: {space.capacity})
                </option>
              ))}
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

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Booking"}
          </button>
        </form>
      )}

      {message && <p role="status">{message}</p>}
    </main>
  );
}

export default SpaceBookingPage;
