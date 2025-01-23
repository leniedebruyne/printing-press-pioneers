#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const inputDir = path.resolve("printing-press-pioneers/public/avif");
const outputDir = path.resolve("printing-press-pioneers/public/avif/converted");

try {
  // Controleer of de input directory bestaat
  const stats = await fs.stat(inputDir);
  if (!stats.isDirectory()) {
    console.error(`${inputDir} is geen geldige map.`);
    process.exit(1);
  }

  // Zorg ervoor dat de output directory bestaat
  await fs.mkdir(outputDir, { recursive: true });

  // Lees alle bestanden in de input directory
  const files = await fs.readdir(inputDir);

  const conversionPromises = files.map(async (file) => {
    const inputFile = path.join(inputDir, file);
    const outputFile = path.join(outputDir, `${path.parse(file).name}.avif`);

    try {
      // Controleer of het een bestand is
      const fileStats = await fs.lstat(inputFile);
      if (!fileStats.isFile()) {
        console.log(`⏩ ${file} is geen bestand, overslaan...`);
        return;
      }

      // Converteer het bestand naar AVIF
      await sharp(inputFile).toFormat("avif").toFile(outputFile);
      console.log(`✅ ${file} is geconverteerd naar ${outputFile}`);
    } catch (err) {
      console.error(`❌ Fout bij het verwerken van ${file}:`, err);
    }
  });

  // Wacht tot alle conversies voltooid zijn
  await Promise.all(conversionPromises);
  console.log("🎉 Alle bestanden zijn geconverteerd naar AVIF.");
} catch (err) {
  console.error(`❌ Er is een fout opgetreden:`, err);
  process.exit(1);
}

