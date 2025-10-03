import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // ⚠️ service role key -> backend only
);

// ✅ Multer for file uploads (stored temporarily in /uploads)
const upload = multer({ dest: "uploads/" });

// ================== ROUTES ==================

// Register a team (saves to unapproved_registrations)
app.post("/register", upload.single("file"), async (req, res) => {
  try {
    const { teamName, teamSize, members, transactionId, eventTitle, competitionType } = req.body; // added competitionType
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // ✅ Build file name
    const fileName = `proofs/${Date.now()}_${file.originalname}`;
    const fileBuffer = fs.readFileSync(file.path);

    // ✅ Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("xl-web")
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // ✅ Get file public URL
    const { data: publicUrlData } = supabase.storage
      .from("xl-web")
      .getPublicUrl(fileName);

    let proofUrl = publicUrlData?.publicUrl;

    // ✅ Insert into unapproved_registrations
    const { data, error } = await supabase
      .from("unapproved_registrations")
      .insert([
        {
          event_title: eventTitle,
          team_name: teamName,
          team_size: teamSize,
          members: JSON.parse(members),
          transaction_id: transactionId,
          proof_url: proofUrl,
          competition_type: competitionType, // NEW FIELD
        },
      ])
      .select();

    if (error) throw error;

    res.json({ success: true, data });

    fs.unlinkSync(file.path); // cleanup
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Approve a registration
app.post("/approve/:id", async (req, res) => {
  try {
    const registrationId = req.params.id;

    // 1️⃣ Fetch the unapproved registration
    const { data: unapproved, error: fetchError } = await supabase
      .from("unapproved_registrations")
      .select("*")
      .eq("id", registrationId)
      .single();

    if (fetchError || !unapproved) {
      return res.status(404).json({ error: "Registration not found" });
    }

    // 2️⃣ Insert into approved_registrations
    const { data: approved, error: approveError } = await supabase
      .from("approved_registrations")
      .insert([
        {
          event_title: unapproved.event_title,
          team_name: unapproved.team_name,
          team_size: unapproved.team_size,
          members: unapproved.members,
          transaction_id: unapproved.transaction_id,
          proof_url: unapproved.proof_url,
          competition_type: unapproved.competition_type, // NEW FIELD
        },
      ])
      .select();

    if (approveError) throw approveError;

    // 3️⃣ Delete from unapproved_registrations
    await supabase
      .from("unapproved_registrations")
      .delete()
      .eq("id", registrationId);

    res.json({ success: true, approved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// List all unapproved registrations
app.get("/unapproved", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("unapproved_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// List all approved registrations
app.get("/approved", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("approved_registrations")
      .select("*")
      .order("approved_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () =>
  console.log("🚀 Server running on http://localhost:4000")
);
