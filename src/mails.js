export default {
  Seller: {
    0: {
      id: 0,
      from: "Admin",
      to: "You",
      title: "Order id:",
      content: "1 cardigan from Best Buy 50% off",
      completed: false,
      reply: [
        {
          id: 0,
          from: "You",
          to: "Admin",
          title: "Order Confirmed",
          content: "I can pick it up by 5pm today"
        },
        {
          id: 1,
          from: "You",
          to: "Admin",
          title: "Item Purchased",
          content: "maybe add photographic evidence?"
        }
      ]
    },
    1: {
      id: 1,
      from: "zuck@facebook.com",
      to: "TeamWoz@Woz.org",
      title: "Do you know PHP?",
      content: "Dear Woz.  We are in need of a PHP expert.  Fast.  Zuck x"
    }
  },
  Buyer: {
    0: {
      id: 0,
      from: "ChEaPFl1ghTZ@hotmail.com",
      to: "TeamWoz@Woz.org",
      title: "WaNt CHEEp FlitZ",
      content: "Theyre CheEp",
      completed: false
    },
    1: {
      id: 1,
      from: "NiKEAIRJordanZ@hotmail.com",
      to: "TeamWoz@Woz.org",
      title: "JorDanz For SAle",
      content: "Theyre REELY CheEp",
      completed: false
    }
  }
};
