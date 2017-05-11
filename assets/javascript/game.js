(function() {
  /** @var game this will become our entire object we use to control the game.
      @var canvas the canvas element used through out the application.
      @var word this is where we will end up displaying the word as you guess, (if you can muahaha...)
      @var letters We will dump our alphabet of letters into this node.
   */


  var game,
      canvas,
      word,
      letters;
  /* THIS STORE WILL BE OUR MASTER STATE HOLDER */
  var store = {
    gameStatus: 'GAME_ENDED',
    currentWord: '',
    wordLength: 0,
    badGuesses: 0,
    correctGuesses: 0,
  };
  /* OUR ACTION TYPES*/
  const ACTION = {
    GAME_STARTED: 'GAME_STARTED',
    GAME_ENDED: 'GAME_ENDED',
    WORD_TO_GUESS: 'WORD_TO_GUESS',
    UPDATE_CORRECT_GUESSES: 'UPDATE_CORRECT_GUESSES',
    UPDATE_BAD_GUESSES: 'UPDATE_BAD_GUESSES',
    UPDATE_CANVAS: 'UPDATE_CANVAS',
  };
  /* OUR ACTIONS*/
  function startGame() {
      return {
          type: 'GAME_STARTED',
      };
  };
  function endGame() {
      return {
          type: 'GAME_ENDED',
      };
  };
  function registerCurrentWord(currentWord) {
      return {
          type: 'WORD_TO_GUESS',
          payload: {
            currentWord,
          },
      };
  };
  function updateCorrectGuesses(numberOfCorrectGuesses) {
      return {
          type: 'UPDATE_CORRECT_GUESSES',
          payload: {
            numberOfCorrectGuesses
          },
      };
  };
  function updateBadGuesses(numberOfBadGuesses) {
      return {
          type: 'UPDATE_BAD_GUESSES',
          payload: {
            numberOfBadGuesses,
          },
      };
  };
  /* OUR REDUCER GENERATOR*/
  const ELEKTRO = {
      createReducer(initialReducerState, handlers) {
          return function reducer(state = {}, action) {
              if (handlers.hasOwnProperty(action.type)) {
                  return handlers[action.type](state, action);
              }
              return state;
          };
      },
      updateObjectProperty(obj, deviceId, fn) {
          const updatedObject = fn(deviceId, obj);
          return updatedObject;
      },
      updateObject(oldObject, newValues) {
          return Object.assign({}, oldObject, newValues);
      },
  };
  /* AND OUR ACTUAL REDCUER FOR THE GAME*/
  const GAME_REDUCER = ELEKTRO.createReducer({}, {
    [ACTION.GAME_STARTED](state, action) {
        return Object.assign({}, state, { gameStatus: 'GAME_STARTED'})
    },
    [ACTION.GAME_ENDED](state, action) {
        return Object.assign({}, state, { gameStatus: 'GAME_ENDED' });
    },
    [ACTION.WORD_TO_GUESS](state,action) {
      return Object.assign({}, state, { currentWord: action.payload.currentWord})
    },
    [ACTION.UPDATE_CORRECT_GUESSES](state, action) {
        return Object.assign({}, state, { correctGuesses: action.payload.numberOfCorrectGuesses})
    },
    [ACTION.UPDATE_BAD_GUESSES](state,action) {
        return Object.assign({}, state, { badGuesses: action.payload.numberOfBadGuesses });
    }
  });


      let init = (canvas) => {
          let that = {};
          let stage = canvas;
          that.context = stage.getContext("2d");
          that.letterChoices = 'abcdefghijklmnopqrstuvwxyz'.split("");
          const getWord = () => {
            let length = WORDS.length;
            let random = Math.floor(Math.random() * length);
            let newWord = WORDS[random];
            document.dispatchEvent(new CustomEvent('action', { detail: registerCurrentWord(newWord) }));
            return WORDS[random];
          };
          var wordToGuess = getWord();
          that.newGame = () => {
            document.dispatchEvent(new CustomEvent('action', { detail: startGame() }))
            let placeholders = '';
            let frag = document.createDocumentFragment();
            badGuesses = 0;
            wordLength = store.currentWord.length;
            for (let i = 0; i < wordLength; i += 1) {
              placeholders += '_';
              word.innerHTML = placeholders;
              word.style.fontSize = '40px';
            };
            that.letterChoices.map((letter) => {
              let el = document.createElement("p");
              let text = document.createTextNode(letter.toUpperCase());
              el.appendChild(text);
              letters.appendChild(el);
            });
          };
          // Get selected letter and remove it from the alphabet pad
// function getLetter() {
//     that.checkGuess(this.innerHTML);
//     this.innerHTML = '&nbsp;';
//     this.style.cursor = 'default';
//     this.onclick = null;
// }

// Check whether selected letter is in the word to be guessed
// function checkLetter(letter) {
//
// }
          that.checkGuess = (letter) => {
              correctGuesses = store.correctGuesses;
              badGuesses = store.badGuesses;
              let currentWord = store.currentWord;
              let length = currentWord.length
              let placeholders = word.innerHTML;
              let letterExists = currentWord.search(letter);
              wrongGuess = true;
              placeholders = placeholders.split('');
                for (let i = 0; i < length; i +=1) {
                  if (currentWord.charAt(i) == letter.toLowerCase()) {
                    placeholders[i] = letter;
                    wrongGuess = false;
                    correctGuesses += 1;
                  }
                  if (correctGuesses === length) {
                    document.dispatchEvent(new CustomEvent('action', { detail: endGame()}))
                    that.drawCanvas();
                  }
                }
                if (wrongGuess) {
                  badGuesses +=1;
                  document.dispatchEvent(new CustomEvent('action', { detail: updateBadGuesses(badGuesses) }));
                  that.drawCanvas()
                }
                document.dispatchEvent(new CustomEvent('action', { detail: updateCorrectGuesses(correctGuesses) }));
                word.innerHTML = placeholders.join('');

          };
          //helper function to draw our lines
          function drawLine(context, from, to) {
            console.log(' DRAW LINE FIRE!');
            context.beginPath();
            context.moveTo(from[0], from[1]);
            context.lineTo(to[0], to[1]);
            context.stroke();
          }
          that.drawCanvas = () => {
            let badGuess = store.badGuesses;
            c = that.context;
            canvas.width = canvas.width;
            c.lineWidth = 10;
            c.strokeStyle = '#444';
            c.font = 'bold 24px Optimer, Arial, Helvetica, sans-serif';

            // draw the ground
            drawLine(c, [20,130], [200,130]);

            if (badGuess > 0) {
              // create the upright
                c.strokeStyle = '#A52A2A';
                drawLine(c, [30,125], [30,20]);
            }
            if (badGuess > 1) {
              c.lineTo(130,20);
              c.stroke();
            }
            if (badGuess > 2) {
              c.strokeStyle = 'black';
              c.lineWidth = 3;
              // draw rope
              drawLine(c, [120,25], [120,50]);
              // draw head
              c.beginPath();
              c.arc(120, 60, 10, 0, 2*Math.PI);
              c.stroke();
            }
            if (badGuess > 3) {
            // draw body
            drawLine(c, [120,70], [120,100]);
            }
            if (badGuess > 4) {
              // draw right leg
              drawLine(c, [120, 100], [135, 110]);
            }
            if (badGuess > 5) {
              // draw left leg
              drawLine(c, [120, 100], [105, 110])
            }
            if (badGuess > 6) {
              // draw right arm
              drawLine(c, [120, 85], [140, 80])
            }
            if (badGuess > 7) {
              // draw right arm
              drawLine(c, [120, 85], [100, 80])
            }
          }

          return that;
      };

  document.addEventListener('DOMContentLoaded', function() {

    document.addEventListener('action', function(e) {
        store = GAME_REDUCER(store, e.detail);
        document.dispatchEvent(new CustomEvent('state'));
    }, false);
    document.addEventListener('state', function(e) {
    });
    // Lets initialze some varsss that relate to our playing field.
      canvas = document.getElementById('stage'),
      word = document.getElementById('word'),
      letters = document.getElementById('letters');

      // init is our power constructor that will create all our functions to draw
      // our lil dude and keep track of guesses, wins, losses etc...
      game = init(canvas);
      document.getElementById('warning').style.display = "none";
  });
  window.addEventListener('keydown', function(event) {
    if (event.defaultPrevented) {
        return;
    }

    if (event.keyCode === 32 && store.gameStatus !== 'GAME_STARTED') {
      console.log(' new game is firing!!!!', store.gameStatus);
      game.drawCanvas();
      game.newGame();
    } else {
      if (event.keyCode === 32) {
          return;
      }
      game.checkGuess(event.key);

    }

  });
}());
