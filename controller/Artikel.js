import artikel from "../models/ArtikelModels.js";
import fs from "fs";

export const getArtikel = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const result = await artikel.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });
    res.json({
      totalData: result.count,
      totalPage: Math.ceil(result.count / limit),
      currentPage: page,
      data: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const getArtikelById = async (req, res) => {
  try {
    const data = await artikel.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!data) return res.status(404).json({ msg: "data tidak ditemukan" });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

export const createArtikel = async (req, res) => {
  const { judul, kategori, deskripsi, tanggal } = req.body;
  try {
    if (!judul || !kategori || !deskripsi)
      return res.status(400).json({ msg: "harap isi field" });
    if (!req.file) return res.status(400).json({ msg: "masukkan file gambar" });

    const dataArtikel = await artikel.create({
      judul,
      kategori,
      deskripsi,
      tanggal: tanggal ? new Date(tanggal) : new Date(),
      gambar: req.file.path,
      userId: req.userId,
      createdBy: req.userName,
    });
    res.status(201).json({ msg: "data berhasil dibuat", dataArtikel });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const updateArtikel = async (req, res) => {
  const { judul, jenis, deskripsi, tanggal } = req.body;
  try {
    const dataArtikel = await artikel.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!dataArtikel)
      return res.status(404).json({ msg: "artikel tidak ditemukan" });

    if (req.file) {
      if (dataArtikel.gambar && fs.existsSync(dataArtikel.gambar)) {
        fs.unlinkSync(dataArtikel.gambar);
      }
    }

    const update = await artikel.update(
      {
        judul: judul ?? dataArtikel.judul,
        jenis: jenis ?? dataArtikel.jenis,
        deskripsi: deskripsi ?? dataArtikel.deskripsi,
        tanggal: tanggal ?? dataArtikel.tanggal,
        gambar: req.file ? req.file.path : dataArtikel.gambar,
        createdBy: req.userName,
        userId: req.userId,
      },
      {
        where: {
          id: dataArtikel.id,
        },
      },
    );
    res.status(200).json({ msg: "artikel berhasil diupdate", update });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const deleteArtikel = async (req, res) => {
  try {
    const data = await artikel.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!data) return res.status(404).json({ msg: "artikel tidak ditemukan" });

    if (data.gambar && fs.existsSync(data.gambar)) {
      fs.unlinkSync(data.gambar);
    }

    await artikel.destroy({
      where: {
        id: data.id,
      },
    });
    res.status(200).json({ msg: "artikel berhasil dihapus" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};
