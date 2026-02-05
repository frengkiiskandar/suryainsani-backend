import dokter from "../models/DokterModels.js";
import fs from "fs";
import { Op } from "sequelize";

export const getDokter = async (req, res) => {
  const {bagian} = req.query
  try {
    const condition = bagian ? {
      bagian :{
        [Op.like] : `%${bagian}%`
      }
    } : {}

    const response = await dokter.findAll({
      where : condition
    });
    if(!response) return res.status(404).json({msg:"data dokter kosong"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const createDokter = async (req, res) => {
  const { nama, bagian, kontak, email } = req.body;
  if (!req.file)
    return res
      .status(400)
      .json({ msg: "masukkan foto dokter (jpg/jpeg/webp/png)" });
  try {
    const response = await dokter.create({
      nama,
      kontak,
      bagian,
      email,
      image: req.file.path,
    });
    res.status(201).json({ msg: "dokter berhasil ditambahkan ", response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const getDokterById = async (req, res) => {
  try {
    const response = await dokter.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!response)
      return res.status(404).json({ msg: "dokter tidak ditemukan" });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const updateDokter = async (req, res) => {
  const { nama, bagian, kontak, email } = req.body;
  try {
    const response = await dokter.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!response) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ msg: "dokter tidak ditemukan" });
    }

    if (req.file) {
      if (response.image && fs.existsSync(response.image)) {
        fs.unlinkSync(response.image);
      }
    }
    const updatedDokter = await dokter.update(
      {
        nama: nama ?? response.nama,
        bagian: bagian ?? response.bagian,
        kontak: kontak ?? response.kontak,
        email: email ?? response.email,
        image: req.file ? req.file.path : response.image,
      },
      {
        where: {
          id: req.params.id,
        },
      },
    );
    res.status(200).json({ msg: "dokter berhasil di ubah", updatedDokter });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const deleteDokter = async (req, res) => {
  try {
    const response = await dokter.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!response)
      return res.status(404).json({ msg: "dokter tidak ditemukan" });

      fs.unlinkSync(response.image);

    const deletedDokter = await dokter.destroy({
      where: {
        id: response.id,
      },
    });
    return res
      .status(200)
      .json({ msg: "dokter berhasil dihapus", deletedDokter });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};
