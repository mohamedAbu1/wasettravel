"use client";
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
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <IconButton
          onClick={loginWithGoogle}
          style={{
            width: "280px", // عرض كبير
            height: "56px", // ارتفاع مناسب
            borderRadius: "12px", // زوايا ناعمة
            background:
              "linear-gradient(to right, #4285F4, #34A853, #FBBC05, #EA4335)", // ألوان جوجل
            color: "#fff",
            fontWeight: "700",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.2)", // ظل احترافي
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <FcGoogle size={28} /> {/* أيقونة أكبر */}
          <span style={{ color: "#fff" }}>Sign in with Google</span>
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
