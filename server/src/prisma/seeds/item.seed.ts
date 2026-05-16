import { prisma } from "../../lib/prisma";

const seedItemsData = [
  {
    title: "Mechanical Keyboard",
    description: "Compact keyboard with tactile switches",
    price: 129,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Wireless Mouse",
    description: "Lightweight mouse with rechargeable battery",
    price: 79,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "USB-C Hub",
    description: "Multi-port hub for laptop setup",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=800&q=80",
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
