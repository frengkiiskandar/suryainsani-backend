import dokter from "../models/DokterModels.js";
import jadwaldokter from "../models/JadwalDokterModels.js";

export const getJadwalDokter = async (req, res) => {
  try {
    const response = await jadwaldokter.findAll();
    if (response.length === 0)
      return res.status(400).json({ msg: "jadwal dokter masih kosong" });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

// updata yang belm di push
export const getJadwalById = async (req, res) => {
  const { jadwalId } = req.params;
  try {
    const findJadwal = await jadwaldokter.findOne({
      where: {
        id: jadwalId,
      },
    });
    if (!findJadwal)
      return res.status(404).json({ msg: "jadwal  tidak ditemukan.." });
    res.status(200).json(findJadwal);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const getJadwalDokterByIdDokter = async (req, res) => {
  const { dokterId } = req.params;
  try {
    const response = await jadwaldokter.findAll({
      where: {
        dokter_id: dokterId,
      },
      include: {
        model: dokter,
        attributes: ["nama", "image", "kontak", "email", "bagian"],
      },
    });
    if (!response || response.length === 0)
      return res.status(404).json({ msg: "jadwal dokter tidak ditemukan" });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const createJadwalDokter = async (req, res) => {
  const { hari, jam_mulai, jam_selesai } = req.body;
  try {
    const dataDokter = await dokter.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!dataDokter)
      return res.status(404).json({ msg: "dokter tidak ditemukan " });

    const cekHari = await jadwaldokter.findOne({
      where: {
        dokter_id: dataDokter.id,
        hari: hari,
      },
    });
    if (cekHari)
      return res
        .status(400)
        .json({ msg: `hari ${hari} udah dibuat brow...  cek dulu !` });

    const createdJadwalDokter = await jadwaldokter.create({
      hari,
      jam_mulai,
      jam_selesai,
      dokter_id: dataDokter.id,
    });
    res
      .status(201)
      .json({ msg: "jadwal dokter berhasil dibuat ..", createdJadwalDokter });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const updateJadwalDokter = async (req, res) => {
  const {  jam_mulai, jam_selesai } = req.body;
  try {
    const dataJadwal = await jadwaldokter.findByPk(req.params.id);
    if (!dataJadwal)
      return res.status(404).json({ msg: "data jadwal tidak ditemukan" });

    // dataJadwal.hari = hari ?? dataJadwal.hari;
    dataJadwal.jam_mulai = jam_mulai ?? dataJadwal.jam_mulai;
    dataJadwal.jam_selesai = jam_selesai ?? dataJadwal.jam_selesai;

    await dataJadwal.save();

    return res.status(200).json({
      msg: "data berhasil diubah",
      data: dataJadwal,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const deleteJadwalDokter = async (req, res) => {
  try {
    const data = await jadwaldokter.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!data) return res.status(404).json({ msg: "jadwal tidak ditemukan" });
    await jadwaldokter.destroy({
      where: {
        id: data.id,
      },
    });
    return res.status(200).json({ msg: "jadwal berhasil dihapus" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};
