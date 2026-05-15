import { prisma } from "../../lib/prisma";

const seedItemsData = [
  {
    title: "Mechanical Keyboard",
    description: "Compact keyboard with tactile switches",
    price: 129,
    image: "https://example.com/images/keyboard.jpg",
  },
  {
    title: "Wireless Mouse",
    description: "Lightweight mouse with rechargeable battery",
    price: 79,
    image: "https://example.com/images/mouse.jpg",
  },
  {
    title: "USB-C Hub",
    description: "Multi-port hub for laptop setup",
    price: 49,
    image: "https://example.com/images/hub.jpg",
  },
];

export const seedItems = async () => {
  for (const item of seedItemsData) {
    const existingItem = await prisma.item.findFirst({
      where: { title: item.title },
    });

    if (existingItem) {
      await prisma.item.update({
        where: { id: existingItem.id },
        data: item,
      });
      continue;
    }

    await prisma.item.create({
      data: item,
    });
  }
};
