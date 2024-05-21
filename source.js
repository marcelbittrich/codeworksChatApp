const greetingMessages = ["Hi", "Hello", "Moin", "Hey"];
const randomMessages = [
  "Wow, really?",
  "Thats interesting, tell me more!",
  "Never thought about that. How did you came up with that?",
  "Crazy!",
  "Interesting",
  "Huh?",
  "What?",
  "I dont understand",
  "It is a really lovely day to go outside. But I am trapped in this computer and can't get out, so would you go for me?",
];

class ChatMessage {
  constructor(author, text) {
    this._author = author;
    this._timeStamp = new Date(Date.now());
    this._text = text;
  }

  get author() {
    return this._author;
  }

  get timeStamp() {
    return this._timeStamp;
  }

  get text() {
    return this._text;
  }
}

function getDateAndTimeString(utcDate) {
  const day = utcDate.getDate();
  const month = (utcDate.getMonth() + 1).toString().padStart(2, "0"); // January = 0
  const year = utcDate.getFullYear().toString().slice(-2); // only last to digits
  const hours = utcDate.getHours();
  const minutes = utcDate.getMinutes().toString().padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function createWritingIndicator() {
  // only one indicator
  if ($("#writing-indicator").length > 0) return;

  let $newChatElement = $("<div>")
    .attr("id", "writing-indicator")
    .addClass("chat-message  computer-message");

  let $wrapper = $("<div>").addClass("writing-animation-wrapper");

  let $leftDot = $("<div>")
    .attr("id", "left-dot")
    .addClass("writing-animation-dot")
    .appendTo($wrapper);
  let $middleDot = $("<div>")
    .attr("id", "middle-dot")
    .addClass("writing-animation-dot")
    .appendTo($wrapper);
  let $righttDot = $("<div>")
    .attr("id", "right-dot")
    .addClass("writing-animation-dot")
    .appendTo($wrapper);

  $newChatElement.append($wrapper);
  $("#chat-screen").append($newChatElement);
}

function removeWritingIndicator() {
  $("#writing-indicator").remove();
}

function createChatElement(chatMessage) {
  let $newChatElement = $("<div>").addClass("chat-message");

  if (chatMessage.author == "Person") {
    $newChatElement.addClass("personal-message");
  } else {
    $newChatElement.addClass("computer-message");
  }

  const $timeAndDateElement = $("<div>")
    .addClass("timeAndDate")
    .text(getDateAndTimeString(chatMessage.timeStamp))
    .appendTo($newChatElement);

  const $textElement = $("<div>")
    .addClass("text")
    .text(chatMessage.text)
    .appendTo($newChatElement);

  $("#chat-screen").append($newChatElement);
}

function computerResponse() {
  const randomMessageSelector = Math.floor(
    Math.random() * randomMessages.length
  );
  const randomMessage = randomMessages[randomMessageSelector];
  const computerMessage = new ChatMessage("Computer", randomMessage);

  createChatElement(computerMessage);
  removeWritingIndicator();
}

function messageSend(message) {
  const personChatMessage = new ChatMessage("Person", message);

  // writing indicator should always be last,
  // so we remove it first if there is one.
  removeWritingIndicator();
  // then add the message
  createChatElement(personChatMessage);
  // and add the indicator again
  createWritingIndicator();

  // computer will respond after a delay, so it looks more realistic
  // source for how to work with Timeout: https://www.sitepoint.com/delay-sleep-pause-wait/
  setTimeout(() => {
    computerResponse();
  }, 3000);
}

messageSend("hello");
