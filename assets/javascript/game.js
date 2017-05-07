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
          that.context = stage.getContext("2d");
          that.createLetters = 'abcdefghijklmnopqrstuvwxyz'.split("");
          const getWord = () => {
            let length = WORDS.length;
            let random = Math.floor(Math.random() * length);
            console.log(' WHAT IS OUR LENGTH', WORDS[random]);
            return WORDS[random];
          };
          that.newGame = () => {
            let placeholders = '';
            let frag = document.createDocumentFragment();
            badGuesses = 0;
            correctGuesses = 0;
            wordToGuess = getWord();
            wordLength = wordToGuess.length;
            for (let i = 0; i< wordLength; i += 1) {
              placeholders += '_ ';
              word.innerHTML = placeholders;
              word.style.fontSize = '40px'
            };
            game.createLetters.map((letter) => {
              let el = document.createElement("p");
              let text = document.createTextNode(letter.toUpperCase());
              el.appendChild(text);
              letters.appendChild(el);
            })
          };
          that.resetScore = () => {

          };
          that.drawCanvas = () => {
              let ctx = that.context;
              ctx.moveTo(100,0);
              ctx.lineTo(100, 50);
              ctx.stroke();
          }
          return that;
      };
      let game = init(canvas);
      window.addEventListener('keydown', function(event) {
        if (event.defaultPrevented) {
            return;
        }
        console.log(' WHAT IS THE KEY PRESSED???', event.key);
        switch (event.key) {

          default: {
            game.drawCanvas();
            game.newGame()
          }
        }

      });
      document.getElementById('warning').style.display = "none";
  });
}());
