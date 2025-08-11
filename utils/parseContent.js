const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  "AIzaSyCRFM - CL3j - HrXhDOmWRsoAl7_mCOPJvss"
);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const getSummary = async (text) => {
  const prefix =
    "Summarise this content,just give me the summary nothing else not even ok heres the summary: ";
  const prompt = prefix + text;
  const result = await model.generateContent(prompt);
  const summary = result.response.text();
  return summary;
};

const generateFlashCards = async (text) => {
  const prefix = `I want you to create 5 flash cards from the text after go.Start by generating 5 questions .Prefix every 
  question with q1 for first question q2 for second and so on also end the same question with that prefix as well.Then 
  generate answers and start the section with saying answers lowercassed also Do the  exact same thing with answers but 
  replace the prefix with a1 and so on  and end the same ans with the same prefix. .Also give nothing else not even ok here
   are the flash cards,Go: `;
  const prompt = prefix + text;
  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return response;
};

const getFlashCards = async (text) => {
  let res = await generateFlashCards(text);
  const index = res.indexOf("answers");
  const questions = res.slice(0, index);
  const answers = res.slice(index + 7);
  let qArr = [];
  let ansArr = [];

  for (let i = 1; i <= 5; i++) {
    let q = "q" + i;
    let startIndexQ = questions.indexOf(q);
    let endIndexQ = questions.indexOf(q, startIndexQ + 2);
    const tempQ = questions.slice(startIndexQ + 2, endIndexQ);
    qArr.push(tempQ);
    let a = "a" + i;
    let startIndexA = answers.indexOf(a);
    let endIndexA = answers.indexOf(a, startIndexA + 2);
    const tempA = answers.slice(startIndexA + 2, endIndexA);
    ansArr.push(tempA);
  }
  return {
    flashQ: qArr,
    flashA: ansArr,
  };
};

const generateQuiz = async (text) => {
  const prefix = `I wanst you to generate three quizes of the passage after go,first quiz will be easy difficulty, then medium
  then hard,each quiz will have 5 questions,now you will generate easy question first and before you do that youll say easyQ
  then you will end it with easyQ as well,same for medium youll say mediumQ and same for hard youll say hardQ.For each question 
  generated you will prefix that question with q1 for question 1 and add that prefix at the end of the question as well,same 
  for q2 same for q3 and so on.When you move on to the next difficulty youll repeat the process for each question again.Now
  each question will 4 choice you will generate and one will be correct.For question1 you will prefix choice 1 with q1c1
  next choice choice with q1c2 and so on for second question it will be q2c1 q2c2 and so on end with the same prefix as well .For each question choices in
   each difficulty youll do this .Then you start the answersby saying answers then you start with easy answers youll 
   say easyA before answering same for medium and hard now the ans will be just a capital letter A for choice 1 B for 
   choice 2 C for choice 3 and D for choice 4 each ans in the difficulty section will be prefixed q1a and 
   end with the same prefix as well .Dont give nothing else not even here are your mcqs.Go: `;
  const prompt = prefix + text;
  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return response;
};

const getQuiz = async (text) => {
  let allQuiz = await generateQuiz(text);
  let diffLvls = ["easy", "medium", "hard"];
  let eQ = [],
    hQ = [],
    mQ = [],
    eC = [],
    mC = [],
    hC = [],
    eA = [],
    mA = [],
    hA = [];

  let x = 0;
  let temp2 = [];
  let temp3 = [];

  for (lvl of diffLvls) {
    let startIndex = allQuiz.indexOf(lvl + "A");
    let endIndex = allQuiz.indexOf(lvl + "A", startIndex + lvl.length + 1);
    let temp1 = allQuiz.slice(startIndex, endIndex);
    temp3.push(temp1);
    for (let i = 1; i <= 5; i++) {
      let prefix = "q" + i + "a";
      let startIndex = temp1.indexOf(prefix);
      let endIndex = temp1.indexOf(prefix, startIndex + 3);
      let ans = temp1.slice(startIndex + 3, endIndex);
      if (lvl == "easy") {
        eA.push(ans);
      } else if (lvl == "medium") {
        mA.push(ans);
      } else {
        hA.push(ans);
      }
    }
  }

  for (lvl of diffLvls) {
    let startIndex = allQuiz.indexOf(lvl + "Q");
    let endIndex = allQuiz.indexOf(lvl + "Q", startIndex + lvl.length + 1);
    let temp1 = allQuiz.slice(startIndex, endIndex);
    temp2.push(temp1);
    for (let i = 1; i <= 5; i++) {
      let tempC = [];
      let y = temp2[x];
      let prefix = "q" + i;
      let startIndex = y.indexOf(prefix);
      let endIndex = y.indexOf(prefix, startIndex + 2);
      let tempQ = y.slice(startIndex + 2, endIndex);
      for (let j = 1; j <= 4; j++) {
        let prefix = "q" + i + "c" + j;
        let startIndex = y.indexOf(prefix);
        let endIndex = y.indexOf(prefix, +startIndex + 4);
        let tempCh = y.slice(startIndex + 4, endIndex);
        tempC.push(tempCh);
      }
      if (lvl == "easy") {
        eQ.push(tempQ);
        eC.push(tempC);
      } else if (lvl == "medium") {
        mQ.push(tempQ);
        mC.push(tempC);
      } else {
        hQ.push(tempQ);
        hC.push(tempC);
      }
    }
    x++;
  }
  return {
    easyQuestions: eQ,
    mediumQuestions: mQ,
    hardQuestions: hQ,
    easyQChoices: eC,
    mediumQchoices: mC,
    hardQchoices: hC,
    easyAns: eA,
    mediumAns: mA,
    hardAns: hA,
  };
};

module.exports = {
  getQuiz,
  getFlashCards,
  getSummary,
};
