(function() {
  /** @var game this will become our entire object we use to control the game.
      @var canvas the canvas element used through out the application.
      @var word this is where we will end up displaying the word as you guess, (if you can muahaha...)
      @var letters We will dump our alphabet of letters into this node.
      @var store our source of truth for our state of the game.
      @const ACTION all the actions that update our game state as we play

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
    GAME_IN_PROGRESS: 'GAME_IN_PROGRESS',
    GAME_ENDED: 'GAME_ENDED',
    WORD_TO_GUESS: 'WORD_TO_GUESS',
    UPDATE_CORRECT_GUESSES: 'UPDATE_CORRECT_GUESSES',
    UPDATE_BAD_GUESSES: 'UPDATE_BAD_GUESSES',
    UPDATE_CANVAS: 'UPDATE_CANVAS',
  };
  /* OUR ACTIONS*/
  /** @func startGame
      @returns {Object}
  */

  function startGame() {
      return {
          type: 'GAME_STARTED',
      };
  };
  /** @func endGame
      @returns {Object}
  */
  function endGame() {
      return {
          type: 'GAME_ENDED',
      };
  };
  /** @func registerCurrentWord
      @returns {Object}
  */
  function registerCurrentWord(currentWord) {
      return {
          type: 'WORD_TO_GUESS',
          payload: {
            currentWord,
          },
      };
  };
  /** @func updateCorrectGuesses
      @returns {Object}
  */
  function updateCorrectGuesses(numberOfCorrectGuesses) {
      return {
          type: 'UPDATE_CORRECT_GUESSES',
          payload: {
            numberOfCorrectGuesses
          },
      };
  };
  /** @func updateBadGuesses
      @returns {Object}
  */
  function updateBadGuesses(numberOfBadGuesses) {
      return {
          type: 'UPDATE_BAD_GUESSES',
          payload: {
            numberOfBadGuesses,
          },
      };
  };

  ////////////////////////////////

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

//////////////////////////////

  /* AND OUR ACTUAL REDCUER FOR THE GAME*/
  const GAME_REDUCER = ELEKTRO.createReducer({}, {
    [ACTION.GAME_STARTED](state, action) {
        return Object.assign({}, state, { gameStatus: 'GAME_IN_PROGRESS' });
    },
    [ACTION.GAME_ENDED](state, action) {
        return Object.assign({}, state, { gameStatus: 'GAME_ENDED' });
    },
    [ACTION.WORD_TO_GUESS](state,action) {
      return Object.assign({}, state, { currentWord: action.payload.currentWord });
    },
    [ACTION.UPDATE_CORRECT_GUESSES](state, action) {
        return Object.assign({}, state, { correctGuesses: action.payload.numberOfCorrectGuesses });
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
          function renderLetters() {
            let frag = document.createDocumentFragment();

            that.letterChoices.map((letter) => {
              let div = document.createElement("div");
              div.innerHTML = letter.toUpperCase();
              div.style.cursor = 'pointer';
              div.onclick = getLetter;
              frag.appendChild(div);
              letters.appendChild(frag);
            });
          }
          function renderPlaceholders() {
            let placeholders = '';
            badGuesses = 0;
            wordLength = store.currentWord.length;
            for (let i = 0; i < wordLength; i += 1) {
              placeholders += '_';
              word.innerHTML = placeholders;
              word.style.fontSize = '40px';
            };
          }
          that.newGame = () => {
            // document.dispatchEvent(new CustomEvent('action', { detail: startGame() }))
            getWord();
            renderLetters();
          };
          // Get selected letter and remove it from the alphabet pad
          function getLetter(letter) {
              that.checkGuess(this.innerHTML);
              this.innerHTML = '&nbsp;';
              this.style.cursor = 'default';
              this.style.dispaly = 'none';
              this.onclick = null;
          }

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
                    that.renderCanvas();
                  }
                }
                if (wrongGuess) {
                  badGuesses +=1;
                  document.dispatchEvent(new CustomEvent('action', { detail: updateBadGuesses(badGuesses) }));
                  that.renderCanvas()
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
          that.renderCanvas = () => {
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
              // draw left arm
              drawLine(c, [120, 85], [100, 80])
            }
          }

          return that;
      };

  document.addEventListener('DOMContentLoaded', function() {

    document.addEventListener('action', function(e) {
        store = GAME_REDUCER(store, e.detail);
        document.dispatchEvent(new CustomEvent('state', { detail: store}));
    }, false);
    document.addEventListener('state', function(e) {
      console.log(' WHAT IS OUR EVENT DATA?????', e.detail, 'STORE STATE',store);
      // if (e.detail.gameStatus !== )
      switch (e.detail.gameStatus) {
        case 'GAME_IN_PROGRESS': {
          game.newGame();
        }

          break;
        default:

      }
    });
    // Lets initialze some varsss that relate to our playing field.
      canvas = document.getElementById('stage'),
      word = document.getElementById('word'),
      letters = document.getElementById('letters');
    // some click handlers for the start game and clear score buttons

      let startButton = document.getElementById('play');
      let clearScore = document.getElementById('clear');
      startButton.addEventListener('click', function(e) {
        e.preventDefault();
        game.newGame();
      });
      clearScore.addEventListener('click', function(e) {
        e.preventDefault();

      })

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
      document.dispatchEvent(new CustomEvent('action', { detail: startGame()}))
      // game.newGame();
    } else {
      if (event.keyCode === 32) {
          return;
      }
      game.checkGuess(event.key);

    }

  });

}());
