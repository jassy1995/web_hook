/* eslint-disable curly */
const express = require("express");
const cors = require("cors");

const app = express();
require("dotenv").config();
// var corsOptions = {
//   origin: "http://localhost:8081"
// };

const {
  Stage,
  ArtisanComplete,
  CustomerComplete,
  sequelize,
} = require("./models");
const {
  welcomeResponse,
  getAllQuestionsKeys,
  getRightQuestions,
  initContrastToInstance,
  saveOnlyNeedValues,
  getIndexedValue,
} = require("./utils/chat");
const { searchUser, registerUser, getLgas, getStates } = require("./services");

const db = sequelize;
// for dev db.sync({ force: true }).then(() => {
// 	console.log("Drop and re-sync db.");
// });
db.sync();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple route
app.post("/api/artisan", async (req, res) => {
  const { phoneNumber: id, response: message } = req.body;

  try {
    // check if there is a stage process
    // console.log(Stage, typeof Stage);
    // Stage.findOne({
    // 	where: { id },
    // })
    // 	.then((data) => console.log("data", data))
    // 	.catch((err) => console.log("err", err));

    const stageResponse = await Stage.findOne({
      where: { id },
    });

    // check for atisan here based on menu to return it seems you have registered
    if (!stageResponse) {
      // fill greetings and respond with the first message
      await Stage.create({ id });

      return res.send(welcomeResponse);
    }
    const existedUserStage = stageResponse.dataValues;
    // console.log("origig", existedUserStage);

    if (existedUserStage.menu === 1) {
      const artisan = await searchUser({ search: id });

      // the artisan I just registered is not being found this can only means
      // maybe the key register is looking if phone_number as opposed to user_id
      // toggle this for menu one and two
      if (artisan.status)
        return res.send({
          message: "Thank you, it seems you have already registered with us",
        });
    }

    // handle here for menu two check old useer and new user cases

    // after got to chat.js for common cases with menu one and menu 2 to know api reuest to use

    const existedStageKeys = Object.keys(existedUserStage);
    const nullStageKeys = existedStageKeys.filter(
      (key) => existedUserStage[key] === null
    );

    const nextStep = nullStageKeys[0];
    const nextStepSuccessor = nullStageKeys[1];
    if (message === "restart") {
      await Stage.destroy({ where: { id } });
      return res.send(welcomeResponse);
    }

    if (nextStep) {
      // for future explicit actions
      const allQuestionsKeys = getAllQuestionsKeys();

      // classic for loop to harness return and break
      // initialize right response for db
      for (let index = 0; index < allQuestionsKeys.length; index++) {
        const questionKey = allQuestionsKeys[index];

        if (nextStep === "menu") {
          // existedUserStage[nextStep] = Number(message);

          stageResponse.menu = message;
          initContrastToInstance(Number(message), stageResponse);

          break;
        }
        // menu type to be checked in any case both menu has picture in the
        // future, the same for artisan
        if (nextStep === "picture") {
          existedUserStage[nextStep] = message;
          const { id, menu } = existedUserStage;
          saveOnlyNeedValues(menu, existedUserStage);
          const newArtisanComplete = { ...existedUserStage, user_id: id };

          await ArtisanComplete.create(newArtisanComplete);
          await registerUser(newArtisanComplete);
          // change to instance if it doesn't work
          await Stage.destroy({ where: { id } });
          // call endpoint for payment
          const response = {
            message:
              "\nThank you for registering.\nTo complete your registration, kindly make payment of N500 with any of the following options.\n1:Dial *…#\n2: make a transfer to wema bank and upload evidence of payment",
          };
          return res.send(response);
        }

        if (nextStep === "artisan") {
          existedUserStage[nextStep] = message;
          // call artisan  payment endpoints
          const { id, menu } = existedUserStage;
          saveOnlyNeedValues(menu, existedUserStage);
          const newCustomerComplete = { ...existedUserStage, user_id: id };
          // delete newCustomerComplete.id;

          await CustomerComplete.create(newCustomerComplete);
          // register to customer endpoint
          // await registerUser(newCustomerComplete);

          await Stage.destroy({ where: { id } });
          const response = {
            message:
              "For payment, pay into the account number of the selected artisan. “ Please note that we are not liable to any damages if payment is not made into the right account number of the right artisan” Any complaints regarding selected vendor can be made on this chat too.",
          };
          return res.send(response);
        }

        if (nextStep === "state") {
          const stateResponse = await getStates();

          const { data } = stateResponse;

          const state = getIndexedValue(data, message, "name");
          stageResponse[nextStep] = state;
          break;
        }
        if (nextStep === "lga") {
          const { data } = await getLgas(existedUserStage.state);
          const lga = getIndexedValue(data, message, "lga");
          stageResponse[nextStep] = lga;
          break;
        }

        if (nextStep === questionKey) {
          stageResponse[nextStep] = message;
          break;
        }
      }

      // save all initialized
      await stageResponse.save();

      // process questions for next step
      if (nextStepSuccessor) {
        // set for menu 2 in get right questions func

        const response = {
          message: await getRightQuestions(existedUserStage, nextStepSuccessor),
        };

        return res.send(response);
      }
    }
  } catch (err) {
    return res.status(500).json({ err });
  }

  return res.status(400).send("Invalid Request!");
});

const PORT = process.env.PORT || 1718;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
