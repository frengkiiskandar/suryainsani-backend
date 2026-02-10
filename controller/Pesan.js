import pesan from "../models/PesanModels.js";

import { Op } from "sequelize";

export const getPesan = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 20 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const condition = search
      ? {
          [Op.or]: [
            { nama: { [Op.like]: `%${search}%` } },
            { subjek: { [Op.like]: `%${search}%` } },
            { pesan: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const result = await pesan.findAndCountAll({
      where: condition,
      limit: limitNumber,
      offset,
      order: [["updatedAt", "DESC"]],
    });

    if (result.count === 0) {
      return res.status(404).json({ msg: "pesan kosong" });
    }

    res.status(200).json({
      totalData: result.count,
      totalPage: Math.ceil(result.count / limitNumber),
      currentPage: pageNumber,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const getPesanById = async (req, res) => {
  try {
    const findPesan = await pesan.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!findPesan)
      return res.status(404).json({ msg: "pesan tidak ditemukan" });
    res.status(200).json(findPesan);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const updatePesanByTelp = async (req, res) => {
  const { telp, subjek, message } = req.body;
  try {
    const findPesan = await pesan.findOne({
      where: {
        telp: telp,
      },
    });
    if (!findPesan)
      return res.status(404).json({
        msg: "pesan tidak ditemukan. gunakan no telp yang pernah dipakai untuk mengirim pesan ..",
      });

    const updatePesan = await pesan.update(
      {
        subjek,
        pesan: message,
      },
      {
        where: {
          telp: findPesan.telp,
        },
      },
    );
    res.status(200).json({
      msg: "pesan diperbaharui. Terimkasih atas feedbacknya",
      updatePesan,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const createPesan = async (req, res) => {
  const { nama, email, telp, subjek, message } = req.body;
  try {
    const findUser = await pesan.findOne({
      where: {
        [Op.or]: [{ telp: telp }, { email: email }],
      },
    });
    if (findUser)
      return res.status(400).json({
        msg: "Pesan sudah pernah dikirim, edit untuk mengirim ulang ?",
      });
    await pesan.create({
      nama,
      email,
      telp,
      subjek,
      pesan: message,
    });
    res.status(201).json({ msg: "pesan berhasil dikirim" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};

export const deletePesan = async (req, res) => {
  try {
    const response = await pesan.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!response)
      return res.status(404).json({ msg: "pesan tidak ditemukan" });
    res.status(200).json({ msg: "pesan berhasil dihapus" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "terjadi kesalahan pada server" });
  }
};
