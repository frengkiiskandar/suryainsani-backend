import mutu from "../models/mutuModels.js";
import fs from "fs";

export const getMutu = async (req, res) => {
  try {
    const response = await mutu.findAll();
    if (!response) return res.json(404).json({ msg: "data tidak ditemukan" });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const createMutu = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "masukkan file gambar" });
    const createdMutu = await mutu.create({
      image: req.file.path,
      userId: req.userId,
    });
    res
      .status(201)
      .json({ msg: "capaian mutu berhasil di upload", createdMutu });
  } catch (error) {
    console.log(error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const deleteMutu = async (req, res) => {
  try {
    const data = await mutu.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!data) return res.status(404).json({ msg: "data tidak ditemukan" });

    fs.unlinkSync(data.image);
    await mutu.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).json({ msg: "data capaian mutu berhasil dihapus" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};
