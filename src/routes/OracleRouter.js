const express = require("express");

const oracleService = require("..\\services\\OracleService.js");

const router = express.Router();

router.delete("/otps", async (req, res, next) => {
  try {
    await oracleService.deleteOtps();
    res.status(200).send("Oracle identity OTP(s) are successfully deleted.");
  } catch (err) {
    next(new Error("Oracle identity OTP(s) could not be deleted."));
  }
});

router.get("/otp", async (req, res, next) => {
  try {
    const otp = await oracleService.getOtp();
    res.status(200).json({ otp });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
