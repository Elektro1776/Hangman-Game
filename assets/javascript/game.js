(function() {
  /** @var game this will become our entire object we use to control the game.
      @var canvas the canvas element used through out the application.
      @var word this is where we will end up displaying the word as you guess, (if you can muahaha...)
      @var letters We will dump our alphabet of letters into this node.
      @var store our source of truth for our state of the game.
   */


  var game,
      wins,
      losses,
      remainingGuessesEl,
      canvas,
      word,
      holder,
      buttons,
      guessedLetters,
      helpText,
      letters;

  /* THIS STORE WILL BE OUR MASTER STATE HOLDER */
  var store = {
    gameStatus: 'GAME_ENDED',
    currentWord: '',
    wordLength: 0,
    badGuesses: 0,
    correctGuesses: 0,
    wins: 0,
    losses: 0,
    startingGuesses: 8,
    remainingGuesses: 8,
  };
  /* OUR ACTION TYPES*/
  const ACTION = {
    GAME_STARTED: 'GAME_STARTED',
    GAME_ENDED: 'GAME_ENDED',
    WORD_TO_GUESS: 'WORD_TO_GUESS',
    UPDATE_WINS: 'UPDATE_WINS',
    UPDATE_LOSSES: 'UPDATE_LOSSES',
    UPDATE_CORRECT_GUESSES: 'UPDATE_CORRECT_GUESSES',
    UPDATE_REMAINING_GUESSES: 'UPDATE_REMAINING_GUESSES',
    UPDATE_CANVAS: 'UPDATE_CANVAS',
  };
  /* OUR ACTIONS*/
  function startGame() {
      return {
          type: 'GAME_STARTED',
          remainingGuesses: 8,
          startingGuesses: 8,
          badGuesses: 0,
          correctGuesses:0,
      };
  };
  function endGame(currentWins, currentLosses) {
      return {
          type: 'GAME_ENDED',
          remainingGuesses: 8,
          badGuesses: 0,
          correctGuesses: 0,
          wins: currentWins,
          losses: currentLosses,
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
  function updateRemainingGuesses(numberOfBadGuesses,numberOfRemainingGuesses) {
      return {
          type: 'UPDATE_REMAINING_GUESSES',
          payload: {
            numberOfBadGuesses,
            numberOfRemainingGuesses,
          },
      };
  };
  function updateLosses(newLossStreak) {
    console.log(' UPDATE LOSS STREAK');
      return {
          type: 'UPDATE_LOSS_STREAK',
          payload: {
            newLossStreak,
          },
      };
  }
  function updateWins(newWinStreak) {
    console.log(' UPDATE WINS FIRE!');
      return {
          type: 'UPDATE_WINS',
          payload: {
            newWinStreak,
          }
      }
  }
  ////////////////////////////////

  /* OUR REDUCER GENERATOR*/
      function createReducer(initialReducerState, handlers) {
          return function reducer(state = {}, action) {
              if (handlers.hasOwnProperty(action.type)) {
                  return handlers[action.type](state, action);
              }
              return state;
          };
      };

//////////////////////////////

  /* AND OUR ACTUAL REDCUER FOR THE GAME*/
  const GAME_REDUCER = createReducer({}, {
    [ACTION.GAME_STARTED](state, action) {
        return Object.assign({}, state, { gameStatus: 'GAME_STARTED', remainingGuesses: action.remainingGuesses,
          startingGuesses: action.startingGuesses,
          badGuesses: action.badGuesses,
          correctGuesses: action.correctGuesses })
    },
    [ACTION.GAME_ENDED](state, action) {
        return Object.assign({}, state, { gameStatus: 'GAME_ENDED', badGuesses: 0, correctGuesses: 0, wins: action.wins, losses: action.losses });
    },
    [ACTION.WORD_TO_GUESS](state,action) {
      return Object.assign({}, state, { currentWord: action.payload.currentWord})
    },
    [ACTION.UPDATE_CORRECT_GUESSES](state, action) {
        return Object.assign({}, state, { correctGuesses: action.payload.numberOfCorrectGuesses})
    },
    [ACTION.UPDATE_REMAINING_GUESSES](state,action) {
        return Object.assign({}, state, { remainingGuesses: action.payload.numberOfRemainingGuesses, badGuesses: action.payload.numberOfBadGuesses  });
    },
    [ACTION.UPDATE_WINS](state, action) {
        return Object.assign({}, state, { wins: action.payload.newWinStreak });
    },
    [ACTION.UPDATE_LOSSES](state, action) {
        return Object.assign({}, state, { losses: action.payload.newLossStreak });
    },
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
            remainingGuessesEl.innerHTML = store.startingGuesses;
            letters.innerHTML = '';
            let placeholders = [];
            let frag = document.createDocumentFragment();
            badGuesses = 0;
            wordLength = newWord.length;
            for (let i = 0; i < wordLength; i += 1) {
              placeholders.push('_');
            };
            // that.letterChoices.map((letter) => {
            //   let div = document.createElement("div");
            //   div.innerHTML = letter.toUpperCase();
            //   div.style.cursor = 'pointer';
            //   div.onclick = getLetter;
            //   frag.appendChild(div);
            //   letters.appendChild(frag);
            // });
            word.style.fontSize = '40px';
            word.textContent = placeholders.join('');
            document.dispatchEvent(new CustomEvent('action', { detail: registerCurrentWord(newWord) }));
            return WORDS[random];
          };
          // Get selected letter and remove it from the alphabet pad
          function getLetter (letter) {
              that.checkGuess(this.innerHTML.toLowerCase());
              this.innerHTML = '&nbsp;';
              this.style.cursor = 'default';
              this.style.dispaly = 'none';
              this.onclick = null;
          }
          that.newGame = () => {
            document.dispatchEvent(new CustomEvent('action', { detail: startGame() }))
            getWord();
          };

          that.checkGuess = (letter) => {
              correctGuesses = store.correctGuesses;
              badGuesses = store.badGuesses;
              let remainingGuesses = store.remainingGuesses;
              let currentWord = store.currentWord;
              let length = currentWord.length
              let placeholders = word.innerHTML;
              let letterExists = currentWord.search(letter);
              let currentLossStreak = store.losses;
              let currentWinStreak = store.wins;
              wrongGuess = true;
              placeholders = placeholders.split('');
                for (let i = 0; i < length; i +=1) {
                  if (currentWord.charAt(i) == letter.toLowerCase()) {
                    placeholders[i] = letter.toLowerCase();
                    wrongGuess = false;
                    correctGuesses += 1;
                    word.innerHTML = placeholders.join('');

                  }

                  if (placeholders.join('') === currentWord) {
                    currentWinStreak += 1;
                    document.dispatchEvent(new CustomEvent('action', { detail: endGame(currentWinStreak, currentLossStreak)}));
                    return alert('NICE JOB YOU WON! WOULD YOU LIKE TO PLAY AGAIN?')
                  }
                }
                if (wrongGuess) {
                  var newLetter = document.createElement('p');
                  newLetter.innerHTML = letter;
                  guessedLetters.appendChild(newLetter);
                  badGuesses +=1;
                  remainingGuesses -= 1;
                  remainingGuessesEl.innerHTML = remainingGuesses;
                  if (remainingGuesses == 0) {
                    currentLossStreak += 1;
                    document.dispatchEvent(new CustomEvent('action', { detail: endGame(currentWinStreak, currentLossStreak)}));
                    alert('SORRY LOOKS LIKE YOU SHOULD TRY AGIAN! WANT TO PLAY?')
                  } else {
                    console.log(' WE SHOULD BE SENGIND OFF REMAINING GUESSES!!');
                    document.dispatchEvent(new CustomEvent('action', { detail: updateRemainingGuesses(badGuesses, remainingGuesses) }));

                  }
                  that.renderCanvas()
                }
                document.dispatchEvent(new CustomEvent('action', { detail: updateCorrectGuesses(correctGuesses) }));

          };
          //helper function to draw our lines
          function drawLine(context, from, to) {
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
    // wait for out DOM to load cause duhhh.
  document.addEventListener('DOMContentLoaded', function() {

    document.addEventListener('action', function(e) {
        store = GAME_REDUCER(store, e.detail);
        document.dispatchEvent(new CustomEvent('state', { detail: store }));
    }, false);

    document.addEventListener('state', function(e) {
      store = e.detail;
      if (e.detail.gameStatus === 'GAME_ENDED') {
        wins.innerHTML = e.detail.wins;
        losses.innerHTML = e.detail.losses;
        guessedLetters.innerHTML = '';
        game.newGame();
        game.renderCanvas();
      }
      if (e.detail.gameStatus === 'GAME_STARTED') {
        buttons.style.display = 'none';
        helpText.style.display = 'none';

      }
    });
    // Lets initialze some varsss that relate to our playing field.
      canvas = document.getElementById('stage'),
      word = document.getElementById('word'),
      letters = document.getElementById('letters');
      wins = document.getElementById('wins');
      losses = document.getElementById('losses');
      buttons = document.getElementById('play');
      guessedLetters = document.getElementById('guessedLetters');
      remainingGuessesEl = document.getElementById('remainingGuesses');
      helpText = document.getElementById('helptext');
    // some click handlers for the start game and clear score buttons

      let startButton = document.getElementById('play');
      startButton.addEventListener('click', function(e) {
        e.preventDefault();
        game.newGame();
      })
      let clearButton = document.getElementById('clear');
      clearButton.addEventListener('click', function(e) {
        e.preventDefault();
        wins.innerHTML = 0
        losses.innerHTML = 0;
        guessedLetters.innerHTML = '';
      })
      // init is our power constructor that will create all our functions to draw
      // our lil dude and keep track of guesses, wins, losses etc...
      game = init(canvas);
      document.getElementById('warning').style.display = "none";
  });
  window.addEventListener('keydown', function(event) {
    let keyCode = event.keyCode;
    let key = event.key
    if (event.defaultPrevented) {
        return;
    }

    if (keyCode === 32 && store.gameStatus !== 'GAME_STARTED') {
      game.newGame();
    }
    if (keyCode === 32 || keyCode === 91 || keyCode === 93 || keyCode === 190 || keyCode === 191 || keyCode === 16 || keyCode === 17 || keyCode === 18 || keyCode === 186) {
          return;
    } else {
        if( store.gameStatus === 'GAME_STARTED') {
          game.checkGuess(key);
        }
    }


  });

}());
