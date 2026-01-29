import galeri from "../models/GaleriModels.js";
import fs from "fs";

export const getDataGaleri = async (req, res) => {
  try {
    const page = parseInt(req.query.page ) || 1
    const limit = parseInt(req.query.limit) || 12

    const offset = (page -1) * limit
    const result = await galeri.findAndCountAll({
      limit : limit,
      offset :offset,
      order : [["createdAt", "DESC"]]
    })
    res.json({
      totaldata : result.count,
      totalPage : Math.ceil(result.count/limit),
      currentPage : page,
      data : result.rows
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const getGaleriById = async (req, res) => {
  try {
    const response = await galeri.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!response) res.status(404).json({ msg: "data tidak ditemukan" });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const createGaleri = async (req, res) => {
  const { nama, jenis_kegiatan, deskripsi, tanggal } = req.body;
  try {
    if (!req.file)
      return res.status(400).json({ msg: "masukkkan file gambar" });

    const data = await galeri.create({
      nama,
      jenis_kegiatan,
      deskripsi,
      tanggal,
      gambar: req.file.path,
      userId: req.userId,
    });
    res.status(201).json({ msg: "berhasil menambahkan data", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const updateGaleri = async (req, res) => {
  const { nama, jenis_kegiatan, deskripsi, tanggal } = req.body;
  try {
    const dataGaleri = await galeri.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!dataGaleri){
      if(req.file && fs.existsSync(req.file.path)){
        fs.unlinkSync(req.file.path)
      }

      return res.status(404).json({ msg: "data tidak ditemukan" });
    }

    if (req.file) {
      // jika user ada upload gambar
      if (dataGaleri.gambar && fs.existsSync(dataGaleri.gambar)) {
        fs.unlinkSync(dataGaleri.gambar);
      }
    }

    const updateGaleri = await galeri.update(
      {
        nama: nama ?? dataGaleri.nama,
        jenis_kegiatan: jenis_kegiatan ?? dataGaleri.jenis_kegiatan,
        deskripsi: deskripsi ?? dataGaleri.deskripsi,
        tanggal: tanggal ?? dataGaleri.tanggal,
        gambar: req.file ? req.file.path : dataGaleri.gambar,
        userId: req.userId,
      },
      {
        where: {
          id: dataGaleri.id,
        },
      },
    );
    res.status(200).json({ msg: "data berhasil diperbaharui", updateGaleri });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const deleteGaleri = async (req, res) => {
  try {
    const data = await galeri.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!data) return res.status(404).json({ msg: "data tidak di temukan !" });

    // ==hapus file yang ada di dalam folder
    fs.unlinkSync(data.gambar);

    const deleteData = await galeri.destroy({
      where: {
        id: data.id,
      },
    });
    return res.status(200).json({ msg: "data berhasil dihapus", deleteData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};
