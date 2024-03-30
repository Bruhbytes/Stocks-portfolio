import React, { useState } from "react";

function ModifiedButton() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    closeModal(); // Close the modal after form submission
  };

  return (
    <>
      <button
        onClick={openModal}
        style={{
          fontSize: "17px",
          borderRadius: "12px",
          background:
            "linear-gradient(180deg, rgb(56, 56, 56) 0%, rgb(36, 36, 36) 66%, rgb(41, 41, 41) 100%)",
          color: "rgb(218, 218, 218)",
          border: "none",
          padding: "2px",
          fontWeight: "700",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "0",
            pointerEvents: "none",
            background:
              "repeating-conic-gradient(rgb(48, 47, 47) 0.0000001%, rgb(51, 51, 51) 0.000104%) 60% 60%/600% 600%",
            filter: "opacity(10%) contrast(105%)",
            WebkitFilter: "opacity(10%) contrast(105%)",
          }}
        ></div>
        <span
          style={{
            borderRadius: "10px",
            padding: "0.8em 1.3em",
            paddingRight: "1.2em",
            textShadow: "0px 0px 20px #4b4b4b",
            width: "120px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "inherit",
            transition: "all 0.3s",
            backgroundColor: "rgb(29, 29, 29)",
            backgroundImage:
              "radial-gradient(at 95% 89%, rgb(15, 15, 15) 0px, transparent 50%), radial-gradient(at 0% 100%, rgb(17, 17, 17) 0px, transparent 50%), radial-gradient(at 0% 0%, rgb(29, 29, 29) 0px, transparent 50%)",
          }}
        >
          Add Symbol
          <path
            strokeWidth="9"
            stroke="currentColor"
            d="M44.25 36.3612L17.25 51.9497C11.5833 55.2213 4.5 51.1318 4.50001 44.5885L4.50001 13.4115C4.50001 6.86824 11.5833 2.77868 17.25 6.05033L44.25 21.6388C49.9167 24.9104 49.9167 33.0896 44.25 36.3612Z"
          ></path>
        </span>
      </button>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            zIndex: 100,
          }}
        >
          <h2>Modal Title</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter symbol" />
            <button type="submit">Submit</button>
          </form>
          <button onClick={closeModal}>Close</button>
        </div>
      )}
    </>
  );
}

export default ModifiedButton;
