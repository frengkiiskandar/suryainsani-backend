import iklan from "../models/IklanModels.js";
import fs from "fs";

export const getIklan = async (req, res) => {
  try {
    const response = await iklan.findAll();
    if (!response || response.length === 0)
      return res.status(404).json({ msg: "data masih kosong" });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const getIklanById = async (req, res) => {
  try {
    const response = await iklan.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!response) return res.status(404).json({ msg: "data kosong" });

    res.status(200).json({ msg: "data ditemukan", response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const getIklanIsActive = async (req, res) => {
  try {
    const response = await iklan.findOne({
      where: {
        is_active: true,
      },
    });
    if (!response) return res.json(404).json({ msg: "tidak ada iklan aktif" });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

// buat toggle untuk aktifkan hanya satu iklan
export const toggleIklanActive = async (req, res) => {
  try {
    await iklan.update(
      {
        is_active: false,
      },
      {
        where: {},
      },
    );

    // setelah itu update aja langsung anjay
    await iklan.update(
      {
        is_active: true,
      },
      {
        where: {
          id: req.params.id,
        },
      },
    );
    res.status(200).json({ msg: "iklan berhasil di aktifkan" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const createIklan = async (req, res) => {
  try {
    const { nama, title, deskripsi, start_date, end_date, is_active } =
      req.body;
    if (!req.file) return res.status(400).json({ msg: "masukkan gambar" });

    const data = await iklan.create({
      nama,
      deskripsi,
      title,
      start_date,
      end_date,
      is_active,
      image: req.file.path,
      userId: req.userId,
    });
    res.status(201).json({ msg: "iklan berhasil dibuat", data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const deleteIklan = async (req, res) => {
  try {
    const data = await iklan.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!data) return res.status(404).json({ msg: "iklan tidak ditemukan" });

    fs.unlinkSync(data.image);
    const response = await iklan.destroy({
      where: {
        id: data.id,
      },
    });
    return res.status(200).json({ msg: "iklan berhasil di hapus" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};
