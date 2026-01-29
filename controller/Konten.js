import konten from "../models/KontenModels.js";
import users from "../models/UserModel.js";
import fs from "fs";

export const getKonten = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12

    const offset = (page-1) * limit
    const result = await konten.findAndCountAll({
      limit : limit,
      offset  :offset,
      order : [["createdAt" , "DESC"]]
    })
    
    res.json({
      totalData : result.count,
      totalPage : Math.ceil(result.count/limit),
      currentPage : page,
      data : result.rows
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const getKontenById = async (req, res) => {
  try {
    const dataKonten = await konten.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!dataKonten)
      return res.status(404).json({ msg: "data tidak ditemukan" });
    return res.status(200).json(dataKonten);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};
export const createKonten = async (req, res) => {
  const { judul, deskripsi, link,platform } = req.body;
  try {
    if (!req.file) return res.status(400).json({ msg: "masukkan gambar !" });

    const data = await konten.create({
      judul,
      deskripsi,
      platform,
      image: req.file.path,
      link,
      userId: req.userId,
    });
    return res.status(201).json({ msg: "konten berhasil dibuat", data });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const updateKonten = async (req, res) => {
  const { judul, deskripsi, link,platform } = req.body;
  try {
    const dataKonten = await konten.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!dataKonten) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ msg: "data tidak ditemukan !" });
    }

    if (req.file) {
      if (dataKonten.image && fs.existsSync(dataKonten.image)) {
        fs.unlinkSync(dataKonten.image);
      }
    }

    const updateKonten = await konten.update(
      {
        judul: judul ?? dataKonten.judul,
        deskripsi: deskripsi ?? dataKonten.deskripsi,
        link: link ?? dataKonten.link,
        platform : platform ?? dataKonten.platform,
        image: req.file ? req.file.path : dataKonten.image,
      },
      {
        where: {
          id: dataKonten.id,
        },
      },
    );
    res.status(200).json({ msg: "konten berhasil diupdate", updateKonten });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const deleteKonten = async (req, res) => {
  try {
    const dataKonten = await konten.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!dataKonten)
      return res.status(400).json({ msg: "data tidak ditemukan.." });
    await konten.destroy({
      where: {
        id: dataKonten.id,
      },
    });
    fs.unlinkSync(dataKonten.image);
    return res.status(200).json({ msg: "konten berhasil dihapus" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

users.hasMany(konten, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
konten.belongsTo(users, { foreignKey: "userId" });
