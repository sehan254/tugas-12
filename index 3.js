const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get("/menu", async (req, res) => {
  try {
    const menu = await prisma.menu.findMany();
    res.status(200).json({ message: "menu berhasil ditampilkan", menu });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addMenu", async (req, res) => {
  const { no, nama_menu, tipe_menu, harga_menu, rekomendasi } = req.body;

  try {
    const menuExists = await prisma.menu.findUnique({
      where: { no },
    });

    if (menuExists) {
      return res.status(400).json({ error: "menu sudah ada" });
    }

    const menu = await prisma.menu.create({
      data: {
        no,
        nama_menu,
        tipe_menu,
        harga_menu,
        rekomendasi,
      },
    });

    res.status(201).json({ message: "menu sudah di tambahkan", menu });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/updateMenu/:no", async (req, res) => {
  const no = parseInt(req.params.no);
  const { nama_menu, tipe_menu, harga_menu, rekomendasi  } = req.body;

  try {
    const isExists = await prisma.menu.findUnique({
      where: { no },
    });

    if (!isExists) {
      return res.status(400).json({ error: "menu tidak di temukan" });
    }

    const updateMenu = await prisma.menu.update({
      where: { no },
      data: {
        no,
        nama_menu,
        tipe_menu,
        harga_menu,
        rekomendasi,
      },
    });

    res.status(202).json({ message: "menu sudah di update", updateMenu});
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deleteMenu/:no", async (req, res) => {
  const no = parseInt(req.params.no);

  try {
    const isExists = await prisma.menu.findUnique({
      where: { no },
    });
    if (!isExists) {
      return res.json({ error: "menu tidak di temukan" });
    }
    const deleteMenu = await prisma.menu.delete({
      where: { no },
    });
    res.status(202).json({ message: "Menu berhasil di hapus" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});


module.exports = app;