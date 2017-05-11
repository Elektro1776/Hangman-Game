(function() {
  console.log(' IFFE FIRED!', WORDS);
  document.addEventListener('DOMContentLoaded', function(){
    // Lets initialze some varsss
      let canvas = document.getElementById('stage'),
      word = document.getElementById('word'),
      letters = document.getElementById('letters'),
      wordToGuess,
      wordLength,
      badGuesses,
      correctGuesses;
      // init is our power constructor that will create all our functions to draw
      // our lil dude and keep track of guesses, wins, losses etc...
      let init = (canvas) => {
          let that = {};
          let stage = canvas;
          const store = {};
          that.state = {
            correctGuesses: 0,
          };
          that.context = stage.getContext("2d");
          that.createLetters = 'abcdefghijklmnopqrstuvwxyz'.split("");
          const getWord = () => {
            let length = WORDS.length;
            let random = Math.floor(Math.random() * length);
            return WORDS[random];
          };
          var wordToGuess = getWord();
          that.newGame = () => {
            let placeholders = '';
            let frag = document.createDocumentFragment();
            badGuesses = 0;
            correctGuesses = 0;
            wordLength = wordToGuess.length;
            console.log(' WHAT IS THE WORD LENGTH???', wordLength);
            for (let i = 0; i < wordLength; i += 1) {
              placeholders += '-';
              word.innerHTML = placeholders;
              word.style.fontSize = '40px';
            };
            game.createLetters.map((letter) => {
              let el = document.createElement("p");
              let text = document.createTextNode(letter.toUpperCase());
              el.appendChild(text);
              letters.appendChild(el);
            });
          };
          that.resetScore = () => {

          };
          that.checkGuess = (letter) => {
            let length = wordToGuess.length
              let placeholders = word.innerHTML;
              let letterExists = wordToGuess.search(letter);
              placeholders = placeholders.split('');
                for (let i = 0; i < length; i +=1) {
                  if (wordToGuess.charAt(i) == letter.toLowerCase()) {
                    placeholders[i] = letter;
                  }
                }
                word.innerHTML = placeholders.join('');

          };
          that.drawCanvas = () => {
              let ctx = that.context;
              ctx.moveTo(100,0);
              ctx.lineTo(100, 50);
              ctx.stroke();
          }
          that.setState = async (currentState) => {


          }
          return that;
      };
      let game = init(canvas);
      function add1(i) {
        let oldValue = i;
        console.log(' out side adddddd', i);
        const add = (y) => {
          console.log(' INSIDE ADDDDDDD', y, );
          let x = oldValue;
          return y += 1;
        }
        return add(0)
      }
      // let guess = game.checkGuess();
      window.addEventListener('keydown', function(event) {
        if (event.defaultPrevented) {
            return;
        }
        if (event.keyCode === 32) {
          game.drawCanvas();
          game.newGame();
        } else {

          game.checkGuess(event.key);
          console.log(' WHAT IS THE GAME STATE BEFORE SET STATE????', game.state);

          let i = add1(game.state.correctGuesses);
          game.setState({ currentGuess: i });
          console.log(' WHAT IS THE GAME STATE????', game.state, i );
        }

      });
      document.getElementById('warning').style.display = "none";
  });
}());
