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
  setChatScreenScroll();
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
  setChatScreenScroll();
}

function computerResponse(isGreeting = false) {
  let randomMessage = "";
  if (!isGreeting) {
    const messageSelector = Math.floor(Math.random() * randomMessages.length);
    randomMessage = randomMessages[messageSelector];
  } else {
    const greetingSelector = Math.floor(
      Math.random() * greetingMessages.length
    );
    randomMessage = greetingMessages[greetingSelector];
  }

  const computerMessage = new ChatMessage("Computer", randomMessage);

  createChatElement(computerMessage);
  removeWritingIndicator();
}

function messageSend(message) {
  // writing indicator should always be last,
  // so we remove it first if there is one.
  removeWritingIndicator();
  // then add the message
  const personChatMessage = new ChatMessage("Person", message);
  createChatElement(personChatMessage);
  // and add the indicator again
  createWritingIndicator();

  // choose greeting message if person greets
  // source for .some(): https://stackoverflow.com/questions/16312528/check-if-an-array-contains-any-element-of-another-array-in-javascript
  let isGreeting = greetingMessages.some((greeting) => {
    return message.includes(greeting);
  });
  // computer will respond after a delay, so it looks more realistic
  // source for setTimeout(): https://www.sitepoint.com/delay-sleep-pause-wait/
  setTimeout(() => {
    computerResponse(isGreeting);
  }, 3000);
}

function sendAndClearMessage($textArea) {
  // .match will check with RegExp if there are any Charackters
  // \w - matches any alphanumeric character from Latin alphabet,
  // including underscore.
  // source: https://www.codecademy.com/resources/docs/javascript/regexp?page_ref=catalog
  if ($textArea.val() && $textArea.val().match(/\w/)) {
    messageSend($textArea.val());
    // clear textarea
    $textArea.val("");
  }
}

// send message when clicked on "Send"
$("#message-button").on("click", () => {
  sendAndClearMessage($("#message"));
});

// send message with enter key (event value 13)
// source for events: https://stackoverflow.com/questions/8934088/how-to-make-enter-key-in-a-textarea-submit-a-form
$("#message").keypress(function (e) {
  if (e.which === 13 && !e.shiftKey) {
    // we prevent the default enter press
    // there would still be a line brake after we send the message
    // which would result in the following message not being "empty"
    // besides no real content
    e.preventDefault();
    sendAndClearMessage($("#message"));
  }
});

// set scroll to the last element on the screen
// source for DOM api: https://stackoverflow.com/questions/40903462/how-to-keep-a-scrollbar-always-bottom
function setChatScreenScroll() {
  const chatScreen = document.getElementById("chat-screen");
  // height will be bigger than scrollTop max value
  // but it is clamped to max value
  chatScreen.scrollTop = chatScreen.scrollHeight;
}
