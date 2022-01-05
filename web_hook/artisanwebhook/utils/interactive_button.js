const productsButtons = (info, button, provider) => {
  let final_button = [];

  button.forEach((element) => {
    let btn;
    if (provider == "messengerpeople" || provider == "web") {
      btn = { type: "reply", reply: element };
    } else if (provider == "messagebird") {
      btn = { id: element.id, title: element.title, type: "reply" };
    }
    final_button.push(btn);
  });

  let message = {
    payload: {
      type: "interactive",
      interactive: {
        type: "button",
        header: {
          type: "text",
          text: "Welcome",
        },
        body: {
          text: info,
        },
        footer: {
          text: "To continue click your prefer option.",
        },
        action: {
          buttons: final_button,
        },
      },
    },
  };
  return message;
};

const listButtons = (question, options) => {
  let lists = {
    payload: {
      type: "interactive",
      interactive: {
        type: "list",
        body: {
          text: question,
        },
        action: {
          button: "Please choose",
          sections: [
            {
              rows: options,
            },
          ],
        },
      },
    },
  };

  return lists;
};

module.exports = {
  productsButtons,
  listButtons,
};
