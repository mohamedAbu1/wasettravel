import React from "react";
import { Button, IconButton } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

export default function ActionsComponent({
  t,
  loginWithGoogle,
  handleSubmit,
  loading,
  handleLoginOpen,
}) {
  return (
    <>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
        <IconButton onClick={loginWithGoogle}>
          <FcGoogle size={26} />
        </IconButton>
      </div>

      <motion.div whileHover={{ scale: 1.05 }} style={{ marginTop: "16px" }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: "linear-gradient(to right, #c9a34a, #eab308)",
            color: "#fff",
            fontWeight: "700",
            padding: "14px",
            borderRadius: "14px",
          }}
        >
          {loading ? t("Creating") : t("SignUp")}
        </Button>
      </motion.div>

      <Button
        variant="text"
        fullWidth
        onClick={handleLoginOpen}
        style={{
          marginTop: "8px",
          color: "#c9a34a",
          fontWeight: "600",
          textTransform: "none",
        }}
      >
        {t("Alreadyhaveanaccount?Login")}
      </Button>
    </>
  );
}
