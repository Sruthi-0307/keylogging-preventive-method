//shuffled the keys, see how to arrange it in a proper laylot
//next try to add extra letters to prevent keylogging
var timeout;
document.onmousemove = function(){
  clearTimeout(timeout);
  document.getElementById("overlay").style.display = "none";
  timeout = setTimeout(function(){document.getElementById("overlay").style.display = "block";}, 1000);
}
function shuffleArray(keyLayout) {
  for (var i = keyLayout.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = keyLayout[i];
      keyLayout[i] = keyLayout[j];
      keyLayout[j] = temp;
  }
}
const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "",
    capsLock: false,
  },

  init() {
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    this.elements.main.classList.add("keyboard", "keyboard-hidden");
    this.elements.keysContainer.classList.add("keyboard-keys");
    this.elements.keysContainer.appendChild(this._createKeys());
    
    this.elements.keys =
      this.elements.keysContainer.querySelectorAll(".keyboard-key");

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);
    
    document.querySelectorAll(".keyboard-input").forEach((element) => {
      element.addEventListener("focus", () => {
        this.open(element.value, (currentValue) => {
          element.value = currentValue;

           // Configure it to send a POST request to the specified URL
           var xhr = new XMLHttpRequest();
    xhr.open('POST', '/preprocess_input', true);
    xhr.setRequestHeader('Content-Type', '"application/x-www-form-urlencoded"');
          
    // Set up the callback function to handle the response
    xhr.onload = () => {
      console.log('opening req');
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Successfully received a response
          //var data = JSON.parse(xhr.responseText);
          console.log('Result from server:', atob(xhr.responseText));
          // You can handle the server response here
        } else {
          // Handle errors here
          console.error('Error:', xhr.status, xhr.status);
        }
      }
    };
  
    // Convert the keyboard input to JSON and send it in the request body
    var requestBody = JSON.stringify({ "keyword":btoa( currentValue[currentValue.length-1]) });
    xhr.send(requestBody);
        });
        document.addEventListener('keydown', event => {
          event.preventDefault();
          return false;
        });
       
      });
    });
  },

  _createKeys() {
    //["backspace","caps","enter","done","space"]
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "q",
      "w",
      "e",
      "r",
      "t",
      "y",
      "u",
      "i",
      "o",
      "p",
      "a",
      "s",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      "z",
      "x",
      "c",
      "v",
      "b",
      "n",
      "m",
      ",",
      ".",
      "?",
    ];
    shuffleArray(keyLayout);
    keyLayout.splice(10,0,"blank");
    keyLayout.splice(21,0,"blank");
    keyLayout.splice(30,0,"blank");
    keyLayout.splice(31,0,"blank");
    keyLayout.splice(43,0,"blank");
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };
    var count=0;
    keyLayout.forEach((key) => {
      const keyElement = document.createElement("button");
      //var insertLineBreak =
        //["backspace", "p", "enter", "?"].indexOf(key) !== -1;

      keyElement.classList.add("keyboard-key");

      switch (count) {
        case 10:
            count=count+1;
          keyElement.classList.add("keyboard-wide", "keyboard-dark");
          keyElement.innerHTML = createIconHTML("backspace");
          var insertLineBreak =
        ["backspace"];
          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1
            );
            this._triggerEvent("oninput");
          });
          break;
        
          case 20:
            count=count+1;
            keyElement.textContent = key.toLowerCase();
            insertLineBreak=[key];
            keyElement.addEventListener("click", () => {
              this.properties.value += this.properties.capsLock
                ? key.toUpperCase()
                : key.toLowerCase();
              this._triggerEvent("oninput");
            });
            break;

        case 21:
            count=count+1;
          keyElement.classList.add("keyboard-wide", "keyboard-active");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");
          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle(
              "keyboard-check",
              this.properties.capsLock
            );
          });
          break;

        case 30:
            count=count+1;
            insertLineBreak=["enter"];
          keyElement.classList.add("keyboard-wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");
          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
          });
          break;

        case 43:
            count+=1;
          keyElement.classList.add("keyboard-extrawide");
          keyElement.innerHTML = createIconHTML("space_bar");
          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this._triggerEvent("oninput");
          });
          break;

        case 31:
            count+=1;
          keyElement.classList.add("keyboard-wide", "keyboard-dark");
          keyElement.innerHTML = createIconHTML("check_circle");
          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });
          break;
        default:
          count=count+1;
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener("click", () => {
            this.properties.value += this.properties.capsLock
              ? key.toUpperCase()
              : key.toLowerCase();
            this._triggerEvent("oninput");
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(name) {
    if (typeof this.eventHandlers[name] === "function") {
      this.eventHandlers[name](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock
          ? key.textContent.toUpperCase()
          : key.textContent.toLowerCase();
      }
    }
  },
  

  //new code
  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard-hidden");
    console.log('opening req 1');
    // Create a new XMLHttpRequest object
    
  },
  
  

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard-hidden");
  },
};

Keyboard.init();

