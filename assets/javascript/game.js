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
          that.drawBody = () => {
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
        // switch (event.key) {
        //   case expression:
        //
        //     break;
        //   default:
        //
        // }

      });
      document.getElementById('warning').style.display = "none";
  });
}());
